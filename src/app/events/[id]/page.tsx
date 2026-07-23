import { CalendarDays, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { EventActionPanel } from "@/components/events/EventActionPanel";
import { auth } from "@/lib/auth";
import { getSpotsLeft } from "@/lib/booking-status";
import { getEventById } from "@/lib/data";

type EventDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit"
});

export default async function EventDetailPage({
  params
}: EventDetailPageProps) {
  const { id } = await params;
  const [event, session] = await Promise.all([getEventById(id), auth()]);

  if (!event) {
    notFound();
  }

  const spotsLeft = getSpotsLeft(event.capacity, event.bookings);
  const existingBooking =
    event.bookings.find((booking) => booking.userId === session?.user?.id) ?? null;

  return (
    <main className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
      <article className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-muted lg:sticky lg:top-8">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="space-y-8">
          <div className="space-y-4 border-b border-border pb-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {event.category.name}
            </p>
            <h1 className="font-display text-6xl leading-none text-foreground sm:text-7xl">
              {event.title}
            </h1>
          </div>

          <div className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{dateFormatter.format(event.date)}</span>
            </p>
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{event.location}</span>
            </p>
            <p className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>
                {spotsLeft} of {event.capacity}{" "}
                {event.capacity === 1 ? "spot" : "spots"} left
              </span>
            </p>
          </div>

          <p className="text-base leading-8 text-foreground">{event.description}</p>

          <div className="rounded-md border border-border bg-card p-5">
            <div className="mb-4 space-y-1">
              <h2 className="font-display text-4xl leading-none">Registration</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Capacity counts confirmed and pending bookings.
              </p>
            </div>
            <EventActionPanel
              eventId={event.id}
              loginPath={`/login?redirectTo=${encodeURIComponent(
                `/events/${event.id}`
              )}`}
              isLoggedIn={Boolean(session?.user)}
              isFull={spotsLeft <= 0}
              existingBooking={
                existingBooking
                  ? {
                      id: existingBooking.id,
                      status: existingBooking.status
                    }
                  : null
              }
            />
          </div>
        </div>
      </article>
    </main>
  );
}
