import { redirect } from "next/navigation";
import { validateRequest } from "~/server/auth";
import DashboardClient from "./_components/DashboardClient";

export default async function Page() {
  const { user } = await validateRequest();

  // The (home)/student layout already guards this, but narrow the type here too.
  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardClient
      email={user.email}
      rollNo={user.roll_no}
    />
  );
}
