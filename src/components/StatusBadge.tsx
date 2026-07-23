import { type BookingStatusName } from "@/lib/booking-status";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: BookingStatusName;
};

const statusLabels: Record<BookingStatusName, string> = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled"
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-medium uppercase tracking-[0.12em]",
        status === "CONFIRMED" &&
          "border-accent bg-accent text-accent-foreground",
        status === "PENDING" &&
          "border-border bg-background text-muted-foreground",
        status === "REJECTED" &&
          "border-border bg-muted text-muted-foreground line-through",
        status === "CANCELLED" &&
          "border-border bg-muted text-muted-foreground opacity-70"
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
