"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useToast } from "@/components/ToastProvider";
import { cancelBookingAction } from "@/lib/data/booking-actions";

type CancelBookingButtonProps = {
  bookingId: string;
};

export function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, setIsPending] = useState(false);

  async function cancel() {
    setIsPending(true);
    const result = await cancelBookingAction(bookingId);
    setIsPending(false);

    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }

    showToast(result.message);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={cancel}
      disabled={isPending}
      className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {isPending ? "Cancelling..." : "Cancel"}
    </button>
  );
}
