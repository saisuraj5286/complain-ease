import { z } from "zod";
import { and, count, desc, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { notifications } from "~/server/db/schema";

export const notificationRouter = createTRPCRouter({
  // The caller's notifications, newest first.
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.notifications.findMany({
      where: eq(notifications.userId, ctx.user.id),
      orderBy: [desc(notifications.createdAt)],
      limit: 50,
    });
  }),

  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const [row] = await ctx.db
      .select({ value: count() })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, ctx.user.id),
          eq(notifications.read, false),
        ),
      );

    return row?.value ?? 0;
  }),

  markRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(notifications)
        .set({ read: true })
        .where(
          and(
            eq(notifications.id, input.id),
            eq(notifications.userId, ctx.user.id),
          ),
        );
    }),

  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .update(notifications)
      .set({ read: true })
      .where(
        and(
          eq(notifications.userId, ctx.user.id),
          eq(notifications.read, false),
        ),
      );
  }),
});
