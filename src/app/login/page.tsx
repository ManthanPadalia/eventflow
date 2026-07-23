import { LoginForm } from "@/components/auth/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    redirectTo?: string;
  }>;
};

function safeRedirectPath(path: string | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = safeRedirectPath(params.redirectTo ?? params.callbackUrl);

  return (
    <main className="flex min-h-[calc(100vh-13rem)] items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-md border border-border bg-card p-8">
        <div className="mb-8 space-y-3">
          <h1 className="font-display text-5xl leading-none text-foreground">
            Welcome back.
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Sign in to manage your bookings and event registrations.
          </p>
        </div>
        <LoginForm redirectTo={redirectTo} />
      </section>
    </main>
  );
}
