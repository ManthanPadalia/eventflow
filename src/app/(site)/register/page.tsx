import { RegisterForm } from "@/components/auth/RegisterForm";

type RegisterPageProps = {
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

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const redirectTo = safeRedirectPath(params.redirectTo ?? params.callbackUrl);

  return (
    <main className="flex min-h-[calc(100vh-13rem)] items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-md border border-border bg-card p-8">
        <div className="mb-8 space-y-3">
          <h1 className="font-display text-5xl leading-none text-foreground">
            Create your account.
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Register for local events with a simple EventFlow account.
          </p>
        </div>
        <RegisterForm redirectTo={redirectTo} />
      </section>
    </main>
  );
}
