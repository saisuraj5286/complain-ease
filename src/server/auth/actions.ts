"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia } from "./lucia";
import { validateRequest } from "./index";

export async function logout(): Promise<void> {
	const { session } = await validateRequest();
	if (session) {
		await lucia.invalidateSession(session.id);
	}

	const sessionCookie = lucia.createBlankSessionCookie();
	(await cookies()).set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);

	redirect("/login");
}
