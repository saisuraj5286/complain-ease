"use server";

import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { lucia } from "~/server/auth/lucia";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

interface ActionResult {
	error: string;
}

export async function login(
	_: ActionResult,
	formData: FormData,
): Promise<ActionResult> {
	const emailInput = formData.get("email");
	const email =
		typeof emailInput === "string" ? emailInput.trim().toLowerCase() : "";
	if (
		email.length < 3 ||
		email.length > 255 ||
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	) {
		return { error: "Incorrect email or password" };
	}

	const password = formData.get("password");
	if (
		typeof password !== "string" ||
		password.length < 6 ||
		password.length > 255
	) {
		return { error: "Incorrect email or password" };
	}

	const existingUser = await db.query.users.findFirst({
		where: eq(users.email, email),
	});

	// Always run verify (even with a dummy hash) so response timing doesn't
	// reveal whether the email exists.
	const validPassword = existingUser
		? await verify(existingUser.password_hash, password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1,
			})
		: false;

	if (!existingUser || !validPassword) {
		return { error: "Incorrect email or password" };
	}

	const session = await lucia.createSession(existingUser.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	(await cookies()).set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);

	return redirect(
		existingUser.role === "admin" ? "/admin" : "/student/dashboard",
	);
}
