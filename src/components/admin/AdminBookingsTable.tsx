"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/components/ToastProvider";
import type { AdminBooking } from "@/lib/data";
import { updateBookingStatusAction } from "@/lib/data/admin-actions";

type AdminBookingsTableProps = {
  bookings: AdminBooking[];
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit"
});

export function AdminBookingsTable({ bookings }: AdminBookingsTableProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);

  async function updateStatus(
    bookingId: string,
    status: "CONFIRMED" | "REJECTED"
  ) {
    setPendingBookingId(bookingId);
    const result = await updateBookingStatusAction(bookingId, status);
    setPendingBookingId(null);

    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }

    showToast(result.message);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="max-w-2xl space-y-3 border-b border-border pb-5">
        <h1 className="font-display text-6xl leading-none text-foreground sm:text-7xl">
          Bookings
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Review every registration. Approval only changes booking status.
        </p>
      </div>

      {bookings.length > 0 ? (
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Date booked</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const isPending = booking.status === "PENDING";
                const isUpdating = pendingBookingId === booking.id;

                return (
                  <tr
                    key={booking.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">{booking.user.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {booking.user.email}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">
                        {booking.event.title}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        {booking.event.category.name}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {dateFormatter.format(booking.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={!isPending || isUpdating}
                          onClick={() => updateStatus(booking.id, "CONFIRMED")}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          <Check className="h-4 w-4" aria-hidden="true" />
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={!isPending || isUpdating}
                          onClick={() => updateStatus(booking.id, "REJECTED")}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border-y border-border py-16">
          <h2 className="font-display text-4xl leading-tight text-foreground">
            No bookings yet.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Registrations will appear here as users reserve spots.
          </p>
        </div>
      )}
    </div>
  );
}
