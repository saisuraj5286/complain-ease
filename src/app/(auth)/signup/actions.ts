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
	const emailInput = formData.get("email");
	const email =
		typeof emailInput === "string" ? emailInput.trim().toLowerCase() : "";
	if (
		email.length < 3 ||
		email.length > 255 ||
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	) {
		return {
			error: "Please enter a valid email address",
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
			email: email,
			roll_no: rollNo,
			password_hash: passwordHash,
			role: "student",
		});
	} catch {
		return {
			error: "Email or roll number is already taken",
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
