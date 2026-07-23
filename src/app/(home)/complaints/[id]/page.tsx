import { notFound, redirect } from "next/navigation";
import { validateRequest } from "~/server/auth";
import ComplaintDetail from "./_components/ComplaintDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const complaintId = Number(id);

  if (!Number.isInteger(complaintId) || complaintId <= 0) {
    notFound();
  }

  return (
    <ComplaintDetail complaintId={complaintId} isAdmin={user.role === "admin"} />
  );
}
