import Link from "next/link";

import { SignOutButton } from "@/components/SignOutButton";
import { auth } from "@/lib/auth";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-16">
        <Link
          href="/"
          className="font-display text-3xl leading-none text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          EventFlow
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Events
          </Link>
          {user?.role === "ADMIN" ? (
            <Link
              href="/admin"
              className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Admin
            </Link>
          ) : null}
          {user ? (
            <div className="flex items-center gap-4 border-l border-border pl-5">
              <span className="max-w-32 truncate text-foreground sm:max-w-none">
                {user.name}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="border-l border-border pl-5 text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
