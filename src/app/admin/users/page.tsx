import { redirect } from "next/navigation";

import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { auth } from "@/lib/auth";
import { getAdminUsers } from "@/lib/data";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const users = await getAdminUsers();

  return <AdminUsersTable users={users} currentAdminId={session.user.id} />;
}
