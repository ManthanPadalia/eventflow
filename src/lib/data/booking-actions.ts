"use server";

import { BookingStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type MutationResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      error: string;
    };

function isDuplicateBookingError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function registerForEventAction(
  eventId: string
): Promise<MutationResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ok: false,
      error: "Sign in to register for this event."
    };
  }

  try {
    await db.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: {
          id: eventId
        },
        select: {
          id: true,
          capacity: true
        }
      });

      if (!event) {
        throw new Error("EVENT_NOT_FOUND");
      }

      const activeBookingCount = await tx.booking.count({
        where: {
          eventId,
          status: {
            in: [BookingStatus.CONFIRMED, BookingStatus.PENDING]
          }
        }
      });

      if (activeBookingCount >= event.capacity) {
        throw new Error("EVENT_FULL");
      }

      await tx.booking.create({
        data: {
          userId: session.user.id,
          eventId,
          status: BookingStatus.CONFIRMED
        }
      });
    });
  } catch (error) {
    if (isDuplicateBookingError(error)) {
      return {
        ok: false,
        error: "You already have a booking for this event."
      };
    }

    if (error instanceof Error && error.message === "EVENT_FULL") {
      return {
        ok: false,
        error: "This event is full."
      };
    }

    if (error instanceof Error && error.message === "EVENT_NOT_FOUND") {
      return {
        ok: false,
        error: "That event could not be found."
      };
    }

    throw error;
  }

  revalidatePath("/");
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/my-bookings");

  return {
    ok: true,
    message: "Your spot is reserved."
  };
}

export async function cancelBookingAction(
  bookingId: string
): Promise<MutationResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ok: false,
      error: "Sign in to cancel a booking."
    };
  }

  const booking = await db.booking.findUnique({
    where: {
      id: bookingId
    },
    select: {
      id: true,
      userId: true,
      eventId: true,
      status: true
    }
  });

  if (!booking || booking.userId !== session.user.id) {
    return {
      ok: false,
      error: "That booking could not be found."
    };
  }

  if (
    booking.status === BookingStatus.CANCELLED ||
    booking.status === BookingStatus.REJECTED
  ) {
    return {
      ok: false,
      error: "This booking cannot be cancelled."
    };
  }

  await db.booking.update({
    where: {
      id: booking.id
    },
    data: {
      status: BookingStatus.CANCELLED
    }
  });

  revalidatePath("/");
  revalidatePath(`/events/${booking.eventId}`);
  revalidatePath("/my-bookings");

  return {
    ok: true,
    message: "Booking cancelled."
  };
}
