import Link from "next/link";

import { SignOutButton } from "@/components/SignOutButton";
import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/data/users";

export async function SiteHeader() {
  const session = await auth();
  const sessionUser = session?.user;
  const user = sessionUser?.id ? await getUserById(sessionUser.id) : null;
  const displayUser = user ?? sessionUser;

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-10 lg:px-16">
        <Link
          href="/"
          className="font-display text-3xl leading-none text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          EventFlow
        </Link>
        <nav className="flex w-full flex-wrap items-center gap-x-5 gap-y-3 text-sm sm:w-auto sm:justify-end">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Events
          </Link>
          {displayUser ? (
            <Link
              href="/my-bookings"
              className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              My Bookings
            </Link>
          ) : null}
          {displayUser?.role === "ADMIN" ? (
            <Link
              href="/admin"
              className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Admin
            </Link>
          ) : null}
          {displayUser ? (
            <div className="flex w-full items-center gap-4 sm:w-auto sm:border-l sm:border-border sm:pl-5">
              <Link
                href="/profile"
                className="max-w-32 truncate text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:max-w-none"
              >
                {displayUser.name}
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:border-l sm:border-border sm:pl-5"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
