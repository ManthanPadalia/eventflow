export type BookingStatusName =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED";

type BookingStatusLike = {
  status: BookingStatusName;
};

const activeStatuses: BookingStatusName[] = ["CONFIRMED", "PENDING"];

export function isActiveBookingStatus(status: BookingStatusName) {
  return activeStatuses.includes(status);
}

export function canCancelBooking(status: BookingStatusName) {
  return status === "CONFIRMED" || status === "PENDING";
}

export function getActiveBookingCount(bookings: BookingStatusLike[]) {
  return bookings.filter((booking) => isActiveBookingStatus(booking.status)).length;
}

export function getSpotsLeft(
  capacity: number,
  bookings: BookingStatusLike[]
) {
  return Math.max(capacity - getActiveBookingCount(bookings), 0);
}

export function isLowSpots(capacity: number, spotsLeft: number) {
  if (spotsLeft <= 0) {
    return false;
  }

  return spotsLeft <= Math.max(3, Math.ceil(capacity * 0.15));
}
