import { AdminBookingsTable } from "@/components/admin/AdminBookingsTable";
import { getAllBookings } from "@/lib/data";

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings();

  return <AdminBookingsTable bookings={bookings} />;
}
