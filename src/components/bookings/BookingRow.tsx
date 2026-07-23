import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CancelBookingButton } from "@/components/bookings/CancelBookingButton";
import { StatusBadge } from "@/components/StatusBadge";
import { canCancelBooking } from "@/lib/booking-status";
import { type UserBooking } from "@/lib/data/bookings";

type BookingRowProps = {
  booking: UserBooking;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit"
});

export function BookingRow({ booking }: BookingRowProps) {
  return (
    <li className="grid gap-4 border-b border-border py-5 last:border-b-0 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
      <Link
        href={`/events/${booking.event.id}`}
        className="relative aspect-video overflow-hidden rounded-md border border-border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:aspect-[4/3]"
      >
        {booking.event.imageUrl ? (
          <Image
            src={booking.event.imageUrl}
            alt=""
            fill
            sizes="7rem"
            className="object-cover"
          />
        ) : null}
      </Link>
      <div className="min-w-0 space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {booking.event.category.name}
        </p>
        <h2 className="font-display text-3xl leading-tight text-foreground">
          <Link
            href={`/events/${booking.event.id}`}
            className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {booking.event.title}
          </Link>
        </h2>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:gap-5">
          <span className="flex items-start gap-2">
            <CalendarDays
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            {dateFormatter.format(booking.event.date)}
          </span>
          <span className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {booking.event.location}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
        <StatusBadge status={booking.status} />
        {canCancelBooking(booking.status) ? (
          <CancelBookingButton bookingId={booking.id} />
        ) : null}
      </div>
    </li>
  );
}
