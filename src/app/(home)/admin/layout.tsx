import { redirect } from "next/navigation";
import { validateRequest } from "~/server/auth";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = await validateRequest();

	if (!user) {
		redirect("/login");
	}

	if (user.role !== "admin") {
		redirect("/student/dashboard");
	}

	return <>{children}</>;
}
