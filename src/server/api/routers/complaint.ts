import { z } from "zod";
import { eq, desc } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { complaints } from "~/server/db/schema";

export const complaintRouter = createTRPCRouter({
  create: publicProcedure
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
        filedBy: z.string().min(1).max(256),
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
          filedBy: input.filedBy,
        })
        .returning();

      return complaint;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.complaints.findMany({
      orderBy: [desc(complaints.filedAt)],
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const complaint = await ctx.db.query.complaints.findFirst({
        where: eq(complaints.id, input.id),
      });

      return complaint ?? null;
    }),

  getByUser: publicProcedure
    .input(z.object({ filedBy: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.complaints.findMany({
        where: eq(complaints.filedBy, input.filedBy),
        orderBy: [desc(complaints.filedAt)],
      });
    }),

  updateStatus: publicProcedure
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
          resolvedAt:
            input.status === "resolved" ? new Date() : undefined,
        })
        .where(eq(complaints.id, input.id))
        .returning();

      return updated;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(complaints).where(eq(complaints.id, input.id));
    }),
});
