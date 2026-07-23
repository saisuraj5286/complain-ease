import { z } from "zod";
import { asc, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { assertComplaintAccess } from "~/server/api/access";
import { notifyByEmail } from "~/server/email";
import {
  complaintComments,
  complaintEvents,
  notifications,
} from "~/server/db/schema";

export const commentRouter = createTRPCRouter({
  // Comments on a complaint, oldest first. Only the owner or an admin may read.
  list: protectedProcedure
    .input(z.object({ complaintId: z.number() }))
    .query(async ({ ctx, input }) => {
      await assertComplaintAccess(ctx.db, input.complaintId, ctx.user);

      return ctx.db.query.complaintComments.findMany({
        where: eq(complaintComments.complaintId, input.complaintId),
        orderBy: [asc(complaintComments.createdAt)],
        with: {
          author: {
            columns: { email: true, role: true },
          },
        },
      });
    }),

  // Post a comment. Records a timeline event and notifies the other party.
  create: protectedProcedure
    .input(
      z.object({
        complaintId: z.number(),
        body: z.string().min(1).max(4000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const complaint = await assertComplaintAccess(
        ctx.db,
        input.complaintId,
        ctx.user,
      );

      // Notify the complaint owner when an admin replies. (Student->admin
      // routing waits on the assignment feature in a later phase.)
      const notifyOwner =
        ctx.user.role === "admin" && complaint.filedBy !== ctx.user.id;

      const comment = await ctx.db.transaction(async (tx) => {
        const [created] = await tx
          .insert(complaintComments)
          .values({
            complaintId: input.complaintId,
            authorId: ctx.user.id,
            body: input.body,
          })
          .returning();

        await tx.insert(complaintEvents).values({
          complaintId: input.complaintId,
          actorId: ctx.user.id,
          type: "commented",
        });

        if (notifyOwner) {
          await tx.insert(notifications).values({
            userId: complaint.filedBy,
            complaintId: input.complaintId,
            type: "new_comment",
            message: `New reply on your complaint "${complaint.title}"`,
          });
        }

        return created;
      });

      if (notifyOwner) {
        await notifyByEmail(
          complaint.filedBy,
          `New reply on your complaint`,
          `There is a new reply on your complaint "${complaint.title}". Log in to ComplainEase to view it.`,
        );
      }

      return comment;
    }),
});
