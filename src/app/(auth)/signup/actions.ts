"use server";

import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { lucia } from "~/server/auth/lucia";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

interface ActionResult {
	error: string;
}

export async function signup(
	_: ActionResult,
	formData: FormData,
): Promise<ActionResult> {
	const username = formData.get("username");
	// username must be between 3 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return {
			error: "Invalid username (3-31 characters, lowercase letters, numbers, - and _ only)",
		};
	}

	const rollNo = formData.get("rollNo");
	if (
		typeof rollNo !== "string" ||
		rollNo.length < 1 ||
		rollNo.length > 50
	) {
		return {
			error: "Invalid roll number",
		};
	}

	const password = formData.get("password");
	if (
		typeof password !== "string" ||
		password.length < 6 ||
		password.length > 255
	) {
		return {
			error: "Invalid password (must be between 6 and 255 characters)",
		};
	}

	const passwordHash = await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
	const userId = generateIdFromEntropySize(10); // 16 characters long

	try {
		await db.insert(users).values({
			id: userId,
			username: username,
			roll_no: rollNo,
			password_hash: passwordHash,
			role: "student",
		});
	} catch {
		return {
			error: "Username or roll number is already taken",
		};
	}

	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	(await cookies()).set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);
	return redirect("/student/dashboard");
}
