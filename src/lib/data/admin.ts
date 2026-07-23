import { BookingStatus } from "@prisma/client";

import { db } from "@/lib/db";

export type DashboardBookingPoint = {
  date: string;
  bookings: number;
};

export type DashboardCategoryPoint = {
  category: string;
  bookings: number;
};

export type AdminDashboardSummary = {
  totalEvents: number;
  totalUsers: number;
  totalBookings: number;
  bookingsOverTime: DashboardBookingPoint[];
  bookingsPerCategory: DashboardCategoryPoint[];
};

function formatChartDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric"
  }).format(date);
}

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const [totalEvents, totalUsers, totalBookings, recentBookings, categories] =
    await Promise.all([
      db.event.count(),
      db.user.count(),
      db.booking.count(),
      db.booking.findMany({
        select: {
          createdAt: true
        },
        orderBy: {
          createdAt: "asc"
        }
      }),
      db.category.findMany({
        select: {
          name: true,
          events: {
            select: {
              bookings: {
                where: {
                  status: {
                    not: BookingStatus.CANCELLED
                  }
                },
                select: {
                  id: true
                }
              }
            }
          }
        },
        orderBy: {
          name: "asc"
        }
      })
    ]);

  const bookingsByDate = recentBookings.reduce<Map<string, number>>((map, booking) => {
    const label = formatChartDate(booking.createdAt);
    map.set(label, (map.get(label) ?? 0) + 1);
    return map;
  }, new Map<string, number>());

  return {
    totalEvents,
    totalUsers,
    totalBookings,
    bookingsOverTime: Array.from(bookingsByDate, ([date, bookings]) => ({
      date,
      bookings
    })),
    bookingsPerCategory: categories.map((category) => ({
      category: category.name,
      bookings: category.events.reduce(
        (sum, event) => sum + event.bookings.length,
        0
      )
    }))
  };
}
