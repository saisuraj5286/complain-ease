import "server-only";

import { Resend } from "resend";
import { eq } from "drizzle-orm";

import { env } from "~/env";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

/**
 * Best-effort email delivery of an in-app notification. Silently no-ops when
 * email isn't configured or the recipient has no address, and never throws —
 * the in-app notification is the source of truth, email is a nicety.
 */
export async function notifyByEmail(
  userId: string,
  subject: string,
  text: string,
) {
  if (!resend || !env.EMAIL_FROM) return;

  try {
    const recipient = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { email: true },
    });

    if (!recipient?.email) return;

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: recipient.email,
      subject,
      text,
    });
  } catch (err) {
    console.error("[email] failed to send notification", err);
  }
}
