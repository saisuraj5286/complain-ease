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
	const username = formData.get("username");
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return { error: "Incorrect username or password" };
	}

	const password = formData.get("password");
	if (
		typeof password !== "string" ||
		password.length < 6 ||
		password.length > 255
	) {
		return { error: "Incorrect username or password" };
	}

	const existingUser = await db.query.users.findFirst({
		where: eq(users.username, username),
	});

	// Always run verify (even with a dummy hash) so response timing doesn't
	// reveal whether the username exists.
	const validPassword = existingUser
		? await verify(existingUser.password_hash, password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1,
			})
		: false;

	if (!existingUser || !validPassword) {
		return { error: "Incorrect username or password" };
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
