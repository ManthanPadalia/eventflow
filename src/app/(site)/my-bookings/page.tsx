import Link from "next/link";
import { redirect } from "next/navigation";

import { BookingRow } from "@/components/bookings/BookingRow";
import { auth } from "@/lib/auth";
import { getBookingsByUserId } from "@/lib/data";

export default async function MyBookingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?redirectTo=${encodeURIComponent("/my-bookings")}`);
  }

  const bookings = await getBookingsByUserId(session.user.id);

  return (
    <main className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="max-w-2xl space-y-4">
          <h1 className="font-display text-6xl leading-none text-foreground sm:text-7xl">
            My Bookings
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Review your reservations, pending requests, and booking history.
          </p>
        </div>

        {bookings.length > 0 ? (
          <ul className="border-y border-border">
            {bookings.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </ul>
        ) : (
          <div className="border-y border-border py-16">
            <h2 className="font-display text-4xl leading-tight text-foreground">
              You haven&apos;t booked anything yet.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Start with the upcoming calendar and reserve a spot when something
              fits.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-md border border-accent bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Browse events
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
