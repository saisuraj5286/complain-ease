import { redirect } from "next/navigation";
import { validateRequest } from "~/server/auth";

export default async function StudentLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = await validateRequest();

	if (!user) {
		redirect("/login");
	}

	// Admins have their own area; keep them out of the student view.
	if (user.role === "admin") {
		redirect("/admin");
	}

	return <>{children}</>;
}
