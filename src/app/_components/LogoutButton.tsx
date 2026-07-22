"use client";

import { useTransition } from "react";
import { logout } from "~/server/auth/actions";

export default function LogoutButton({
	className,
}: {
	className?: string;
}) {
	const [isPending, startTransition] = useTransition();

	return (
		<button
			onClick={() => startTransition(() => logout())}
			disabled={isPending}
			className={
				className ??
				"ml-4 rounded-lg bg-blue-500 px-4 py-2 text-lg text-white hover:bg-blue-600 disabled:opacity-50"
			}
		>
			{isPending ? "Logging out..." : "Logout"}
		</button>
	);
}
