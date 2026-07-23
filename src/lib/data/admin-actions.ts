"use server";

import { BookingStatus, Prisma, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  type AdminCategoryInput,
  type AdminEventInput,
  type AdminRoleInput,
  adminCategorySchema,
  adminEventSchema,
  adminRoleSchema
} from "@/lib/schemas/admin";

type MutationResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      error: string;
    };

async function getCurrentAdminId() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      id: true,
      role: true
    }
  });

  return user?.role === Role.ADMIN ? user.id : null;
}

function parseEventDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toSlug(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "category"
  );
}

async function getUniqueCategorySlug(name: string, excludedCategoryId?: string) {
  const baseSlug = toSlug(name);
  let slug = baseSlug;
  let suffix = 2;

  let existing = await db.category.findUnique({
    where: {
      slug
    },
    select: {
      id: true
    }
  });

  while (existing && existing.id !== excludedCategoryId) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
    existing = await db.category.findUnique({
      where: {
        slug
      },
      select: {
        id: true
      }
    });
  }

  return slug;
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function createEventAction(
  input: AdminEventInput
): Promise<MutationResult> {
  const adminId = await getCurrentAdminId();

  if (!adminId) {
    return {
      ok: false,
      error: "Admin access is required."
    };
  }

  const parsed = adminEventSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the event fields and try again."
    };
  }

  const date = parseEventDate(parsed.data.date);

  if (!date) {
    return {
      ok: false,
      error: "Choose a valid event date."
    };
  }

  await db.event.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      date,
      location: parsed.data.location,
      capacity: parsed.data.capacity,
      imageUrl: parsed.data.imageUrl || null,
      categoryId: parsed.data.categoryId
    }
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/events");

  return {
    ok: true,
    message: "Event created."
  };
}

export async function updateEventAction(
  eventId: string,
  input: AdminEventInput
): Promise<MutationResult> {
  const adminId = await getCurrentAdminId();

  if (!adminId) {
    return {
      ok: false,
      error: "Admin access is required."
    };
  }

  const parsed = adminEventSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the event fields and try again."
    };
  }

  const date = parseEventDate(parsed.data.date);

  if (!date) {
    return {
      ok: false,
      error: "Choose a valid event date."
    };
  }

  await db.event.update({
    where: {
      id: eventId
    },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      date,
      location: parsed.data.location,
      capacity: parsed.data.capacity,
      imageUrl: parsed.data.imageUrl || null,
      categoryId: parsed.data.categoryId
    }
  });

  revalidatePath("/");
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/events");

  return {
    ok: true,
    message: "Event updated."
  };
}

export async function deleteEventAction(eventId: string): Promise<MutationResult> {
  const adminId = await getCurrentAdminId();

  if (!adminId) {
    return {
      ok: false,
      error: "Admin access is required."
    };
  }

  await db.$transaction([
    db.booking.deleteMany({
      where: {
        eventId
      }
    }),
    db.event.delete({
      where: {
        id: eventId
      }
    })
  ]);

  revalidatePath("/");
  revalidatePath("/my-bookings");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath("/admin/bookings");

  return {
    ok: true,
    message: "Event deleted."
  };
}

export async function createCategoryAction(
  input: AdminCategoryInput
): Promise<MutationResult> {
  const adminId = await getCurrentAdminId();

  if (!adminId) {
    return {
      ok: false,
      error: "Admin access is required."
    };
  }

  const parsed = adminCategorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Enter a category name."
    };
  }

  try {
    await db.category.create({
      data: {
        name: parsed.data.name,
        slug: await getUniqueCategorySlug(parsed.data.name)
      }
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        error: "A category with that name already exists."
      };
    }

    throw error;
  }

  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/events");

  return {
    ok: true,
    message: "Category added."
  };
}

export async function updateCategoryAction(
  categoryId: string,
  input: AdminCategoryInput
): Promise<MutationResult> {
  const adminId = await getCurrentAdminId();

  if (!adminId) {
    return {
      ok: false,
      error: "Admin access is required."
    };
  }

  const parsed = adminCategorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Enter a category name."
    };
  }

  try {
    await db.category.update({
      where: {
        id: categoryId
      },
      data: {
        name: parsed.data.name,
        slug: await getUniqueCategorySlug(parsed.data.name, categoryId)
      }
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        error: "A category with that name already exists."
      };
    }

    throw error;
  }

  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/events");

  return {
    ok: true,
    message: "Category renamed."
  };
}

export async function deleteCategoryAction(
  categoryId: string
): Promise<MutationResult> {
  const adminId = await getCurrentAdminId();

  if (!adminId) {
    return {
      ok: false,
      error: "Admin access is required."
    };
  }

  const category = await db.category.findUnique({
    where: {
      id: categoryId
    },
    select: {
      _count: {
        select: {
          events: true
        }
      }
    }
  });

  if (!category) {
    return {
      ok: false,
      error: "That category could not be found."
    };
  }

  if (category._count.events > 0) {
    return {
      ok: false,
      error: "Move or delete this category's events before deleting it."
    };
  }

  await db.category.delete({
    where: {
      id: categoryId
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/events");

  return {
    ok: true,
    message: "Category deleted."
  };
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: "CONFIRMED" | "REJECTED"
): Promise<MutationResult> {
  const adminId = await getCurrentAdminId();

  if (!adminId) {
    return {
      ok: false,
      error: "Admin access is required."
    };
  }

  const booking = await db.booking.findUnique({
    where: {
      id: bookingId
    },
    select: {
      id: true,
      status: true,
      eventId: true
    }
  });

  if (!booking) {
    return {
      ok: false,
      error: "That booking could not be found."
    };
  }

  if (booking.status !== BookingStatus.PENDING) {
    return {
      ok: false,
      error: "Only pending bookings can be approved or rejected."
    };
  }

  await db.booking.update({
    where: {
      id: booking.id
    },
    data: {
      status
    }
  });

  revalidatePath(`/events/${booking.eventId}`);
  revalidatePath("/my-bookings");
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");

  return {
    ok: true,
    message: status === BookingStatus.CONFIRMED ? "Booking approved." : "Booking rejected."
  };
}

export async function updateUserRoleAction(
  userId: string,
  input: AdminRoleInput
): Promise<MutationResult> {
  const adminId = await getCurrentAdminId();

  if (!adminId) {
    return {
      ok: false,
      error: "Admin access is required."
    };
  }

  const parsed = adminRoleSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Choose a valid role."
    };
  }

  if (userId === adminId && parsed.data.role === Role.USER) {
    return {
      ok: false,
      error: "Use another admin account to change your own role."
    };
  }

  const target = await db.user.findUnique({
    where: {
      id: userId
    },
    select: {
      role: true
    }
  });

  if (!target) {
    return {
      ok: false,
      error: "That user could not be found."
    };
  }

  if (target.role === Role.ADMIN && parsed.data.role === Role.USER) {
    const adminCount = await db.user.count({
      where: {
        role: Role.ADMIN
      }
    });

    if (adminCount <= 1) {
      return {
        ok: false,
        error: "At least one admin must remain."
      };
    }
  }

  await db.user.update({
    where: {
      id: userId
    },
    data: {
      role: parsed.data.role
    }
  });

  revalidatePath("/admin/users");

  return {
    ok: true,
    message: "User role updated."
  };
}

export async function deleteUserAction(userId: string): Promise<MutationResult> {
  const adminId = await getCurrentAdminId();

  if (!adminId) {
    return {
      ok: false,
      error: "Admin access is required."
    };
  }

  if (userId === adminId) {
    return {
      ok: false,
      error: "You cannot delete the current admin."
    };
  }

  const target = await db.user.findUnique({
    where: {
      id: userId
    },
    select: {
      role: true
    }
  });

  if (!target) {
    return {
      ok: false,
      error: "That user could not be found."
    };
  }

  if (target.role === Role.ADMIN) {
    const adminCount = await db.user.count({
      where: {
        role: Role.ADMIN
      }
    });

    if (adminCount <= 1) {
      return {
        ok: false,
        error: "You cannot delete the last admin."
      };
    }
  }

  await db.$transaction([
    db.booking.deleteMany({
      where: {
        userId
      }
    }),
    db.user.delete({
      where: {
        id: userId
      }
    })
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/users");

  return {
    ok: true,
    message: "User deleted."
  };
}
