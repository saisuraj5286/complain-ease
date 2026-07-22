import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { complaints } from "~/server/db/schema";

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
        mediaUrl: z.string().url().max(1024).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [complaint] = await ctx.db
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

      return complaint;
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
      });

      if (!complaint) return null;

      // Students may only read their own complaints; admins may read any.
      if (ctx.user.role !== "admin" && complaint.filedBy !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return complaint;
    }),

  // Admin-only: full list of every complaint for the resolution dashboard.
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.complaints.findMany({
      orderBy: [desc(complaints.filedAt)],
    });
  }),

  // Admin-only: resolve / progress / reject complaints.
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "in_progress", "resolved", "rejected"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(complaints)
        .set({
          status: input.status,
          resolvedAt: input.status === "resolved" ? new Date() : null,
        })
        .where(eq(complaints.id, input.id))
        .returning();

      return updated;
    }),

  // Admin-only: remove a complaint.
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(complaints).where(eq(complaints.id, input.id));
    }),
});
