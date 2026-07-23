import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import type { db as database } from "~/server/db";
import { complaints } from "~/server/db/schema";

type Db = typeof database;
type Actor = { id: string; role: "student" | "admin" };

/**
 * Loads a complaint and enforces the same access rule used across the API:
 * students may only touch their own complaints, admins may touch any. Throws
 * NOT_FOUND when it doesn't exist and FORBIDDEN when the caller isn't allowed.
 */
export async function assertComplaintAccess(
  db: Db,
  complaintId: number,
  actor: Actor,
) {
  const complaint = await db.query.complaints.findFirst({
    where: eq(complaints.id, complaintId),
  });

  if (!complaint) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  if (actor.role !== "admin" && complaint.filedBy !== actor.id) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return complaint;
}
