import { redirect } from "next/navigation";

import { ProfileForms } from "@/components/profile/ProfileForms";
import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/data";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?redirectTo=${encodeURIComponent("/profile")}`);
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="max-w-2xl space-y-4">
          <h1 className="font-display text-6xl leading-none text-foreground sm:text-7xl">
            Profile
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Keep your account details current.
          </p>
        </div>
        <ProfileForms name={user.name} email={user.email} />
      </section>
    </main>
  );
}
