import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

const userBookingInclude = {
  event: {
    include: {
      category: true
    }
  }
} satisfies Prisma.BookingInclude;

const adminBookingInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  },
  event: {
    include: {
      category: true
    }
  }
} satisfies Prisma.BookingInclude;

export type UserBooking = Prisma.BookingGetPayload<{
  include: typeof userBookingInclude;
}>;

export type AdminBooking = Prisma.BookingGetPayload<{
  include: typeof adminBookingInclude;
}>;

export async function getBookingsByUserId(
  userId: string
): Promise<UserBooking[]> {
  return db.booking.findMany({
    where: {
      userId
    },
    include: userBookingInclude,
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getAllBookings(): Promise<AdminBooking[]> {
  return db.booking.findMany({
    include: adminBookingInclude,
    orderBy: {
      createdAt: "desc"
    }
  });
}
