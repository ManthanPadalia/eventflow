"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/components/ToastProvider";
import { cancelBookingAction, registerForEventAction } from "@/lib/data/booking-actions";
import {
  canCancelBooking,
  type BookingStatusName
} from "@/lib/booking-status";

type ExistingBooking = {
  id: string;
  status: BookingStatusName;
};

type EventActionPanelProps = {
  eventId: string;
  loginPath: string;
  isLoggedIn: boolean;
  isFull: boolean;
  existingBooking: ExistingBooking | null;
};

export function EventActionPanel({
  eventId,
  loginPath,
  isLoggedIn,
  isFull,
  existingBooking
}: EventActionPanelProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, setIsPending] = useState(false);

  async function register() {
    setIsPending(true);
    const result = await registerForEventAction(eventId);
    setIsPending(false);

    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }

    showToast(result.message);
    router.refresh();
  }

  async function cancel() {
    if (!existingBooking) {
      return;
    }

    setIsPending(true);
    const result = await cancelBookingAction(existingBooking.id);
    setIsPending(false);

    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }

    showToast(result.message);
    router.refresh();
  }

  if (!isLoggedIn) {
    return (
      <Link
        href={loginPath}
        className="inline-flex h-11 w-full items-center justify-center rounded-md border border-accent bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
      >
        Register
      </Link>
    );
  }

  if (existingBooking) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <StatusBadge status={existingBooking.status} />
        {canCancelBooking(existingBooking.status) ? (
          <button
            type="button"
            onClick={cancel}
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {isPending ? "Cancelling..." : "Cancel booking"}
          </button>
        ) : null}
      </div>
    );
  }

  if (isFull) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-md border border-border bg-muted px-5 text-sm font-medium text-muted-foreground sm:w-auto"
      >
        Event full
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={register}
      disabled={isPending}
      className="inline-flex h-11 w-full items-center justify-center rounded-md border border-accent bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
    >
      {isPending ? "Reserving..." : "Reserve your spot"}
    </button>
  );
}
