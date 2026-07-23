import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

const eventListInclude = {
  category: true,
  bookings: {
    select: {
      id: true,
      userId: true,
      status: true,
      createdAt: true
    }
  }
} satisfies Prisma.EventInclude;

const eventDetailInclude = {
  category: true,
  bookings: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  }
} satisfies Prisma.EventInclude;

export type EventListItem = Prisma.EventGetPayload<{
  include: typeof eventListInclude;
}>;

export type EventDetail = Prisma.EventGetPayload<{
  include: typeof eventDetailInclude;
}>;

const adminEventInclude = {
  category: true,
  _count: {
    select: {
      bookings: true
    }
  }
} satisfies Prisma.EventInclude;

export type AdminEvent = Prisma.EventGetPayload<{
  include: typeof adminEventInclude;
}>;

export type UpcomingEventFilters = {
  search?: string;
  categoryId?: string;
  categorySlug?: string;
};

export async function getUpcomingEvents(
  filters: UpcomingEventFilters = {}
): Promise<EventListItem[]> {
  const search = filters.search?.trim();
  const where: Prisma.EventWhereInput = {
    date: {
      gte: new Date()
    }
  };

  if (search) {
    where.OR = [
      {
        title: {
          contains: search
        }
      },
      {
        description: {
          contains: search
        }
      },
      {
        location: {
          contains: search
        }
      }
    ];
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.categorySlug) {
    where.category = {
      slug: filters.categorySlug
    };
  }

  return db.event.findMany({
    where,
    include: eventListInclude,
    orderBy: {
      date: "asc"
    }
  });
}

export async function getEventById(id: string): Promise<EventDetail | null> {
  return db.event.findUnique({
    where: {
      id
    },
    include: eventDetailInclude
  });
}

export async function getAdminEvents(): Promise<AdminEvent[]> {
  return db.event.findMany({
    include: adminEventInclude,
    orderBy: {
      date: "asc"
    }
  });
}
