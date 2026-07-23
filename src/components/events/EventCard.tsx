import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  getSpotsLeft,
  isLowSpots
} from "@/lib/booking-status";
import { type EventListItem } from "@/lib/data/events";

type EventCardProps = {
  event: EventListItem;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit"
});

export function EventCard({ event }: EventCardProps) {
  const spotsLeft = getSpotsLeft(event.capacity, event.bookings);

  return (
    <Link
      href={`/events/${event.id}`}
      className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <article className="h-full space-y-4 rounded-md border border-border bg-card p-3 transition-transform group-hover:-translate-y-0.5 group-hover:border-foreground">
        <div className="relative aspect-video overflow-hidden rounded-md border border-border bg-muted">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="space-y-3 px-1 pb-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {event.category.name}
          </p>
          <h2 className="font-display text-3xl leading-tight text-foreground">
            {event.title}
          </h2>
          <div className="space-y-2 text-sm leading-6 text-muted-foreground">
            <p className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{dateFormatter.format(event.date)}</span>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{event.location}</span>
            </p>
          </div>
          {isLowSpots(event.capacity, spotsLeft) ? (
            <p className="inline-flex rounded-md border border-accent px-2.5 py-1 text-xs font-medium text-accent">
              {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
