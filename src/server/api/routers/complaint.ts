import { z } from "zod";
import { eq, asc, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { assertComplaintAccess } from "~/server/api/access";
import { notifyByEmail } from "~/server/email";
import {
  complaints,
  complaintEvents,
  notifications,
} from "~/server/db/schema";

export const complaintRouter = createTRPCRouter({
  // Students file complaints on their own behalf; filedBy is taken from the
  // authenticated session, never from client input.
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(256),
        description: z.string().min(1),
        category: z.enum([
          "on_campus",
          "hostel",
          "transport",
          "ragging",
          "other",
        ]),
        priority: z
          .enum(["low", "medium", "high", "urgent"])
          .optional()
          .default("medium"),
        mediaUrl: z
          .string()
          .url()
          .max(1024)
          .refine((u) => /^https?:\/\//i.test(u), {
            message: "mediaUrl must be an http(s) URL",
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const [complaint] = await tx
          .insert(complaints)
          .values({
            title: input.title,
            description: input.description,
            category: input.category,
            priority: input.priority,
            mediaUrl: input.mediaUrl ?? null,
            filedBy: ctx.user.id,
          })
          .returning();

        if (complaint) {
          await tx.insert(complaintEvents).values({
            complaintId: complaint.id,
            actorId: ctx.user.id,
            type: "created",
            toStatus: complaint.status,
          });
        }

        return complaint;
      });
    }),

  // A student's own complaints.
  getMine: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.complaints.findMany({
      where: eq(complaints.filedBy, ctx.user.id),
      orderBy: [desc(complaints.filedAt)],
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const complaint = await ctx.db.query.complaints.findFirst({
        where: eq(complaints.id, input.id),
        with: {
          filer: {
            columns: { email: true, roll_no: true },
          },
        },
      });

      if (!complaint) return null;

      // Students may only read their own complaints; admins may read any.
      if (ctx.user.role !== "admin" && complaint.filedBy !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return complaint;
    }),

  // Timeline of everything that has happened to a complaint (created, status
  // changes, comments). Same access rule as getById.
  getEvents: protectedProcedure
    .input(z.object({ complaintId: z.number() }))
    .query(async ({ ctx, input }) => {
      await assertComplaintAccess(ctx.db, input.complaintId, ctx.user);

      return ctx.db.query.complaintEvents.findMany({
        where: eq(complaintEvents.complaintId, input.complaintId),
        orderBy: [asc(complaintEvents.createdAt)],
        with: {
          actor: {
            columns: { email: true, role: true },
          },
        },
      });
    }),

  // Admin-only: full list of every complaint for the resolution dashboard.
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.complaints.findMany({
      orderBy: [desc(complaints.filedAt)],
    });
  }),

  // Admin-only: resolve / progress / reject complaints, with an optional note
  // recorded on the timeline and surfaced to the student.
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "in_progress", "resolved", "rejected"]),
        note: z.string().max(4000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.complaints.findFirst({
        where: eq(complaints.id, input.id),
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Only record history / notify when the status actually changed.
      const statusChanged = existing.status !== input.status;
      const readableStatus = input.status.replace("_", " ");

      const updated = await ctx.db.transaction(async (tx) => {
        const [row] = await tx
          .update(complaints)
          .set({
            status: input.status,
            resolvedAt: input.status === "resolved" ? new Date() : null,
          })
          .where(eq(complaints.id, input.id))
          .returning();

        if (statusChanged) {
          await tx.insert(complaintEvents).values({
            complaintId: input.id,
            actorId: ctx.user.id,
            type: "status_changed",
            fromStatus: existing.status,
            toStatus: input.status,
            note: input.note?.trim() ? input.note.trim() : null,
          });

          await tx.insert(notifications).values({
            userId: existing.filedBy,
            complaintId: input.id,
            type: "status_changed",
            message: `Your complaint "${existing.title}" is now ${readableStatus}`,
          });
        }

        return row;
      });

      if (statusChanged) {
        const noteLine = input.note?.trim()
          ? `\n\nNote from the admin: ${input.note.trim()}`
          : "";
        await notifyByEmail(
          existing.filedBy,
          `Complaint update: ${readableStatus}`,
          `Your complaint "${existing.title}" is now ${readableStatus}.${noteLine}\n\nLog in to ComplainEase to view details.`,
        );
      }

      return updated;
    }),

  // Admin-only: remove a complaint.
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(complaints).where(eq(complaints.id, input.id));
    }),
});
