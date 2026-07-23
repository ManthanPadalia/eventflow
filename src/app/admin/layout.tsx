import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/data";

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user?.id ? await getUserById(session.user.id) : null;

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background lg:flex">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
        {children}
      </main>
    </div>
  );
}
