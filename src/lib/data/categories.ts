import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

const categoryInclude = {
  _count: {
    select: {
      events: true
    }
  }
} satisfies Prisma.CategoryInclude;

export type CategoryWithEventCount = Prisma.CategoryGetPayload<{
  include: typeof categoryInclude;
}>;

export async function getCategories(): Promise<CategoryWithEventCount[]> {
  return db.category.findMany({
    include: categoryInclude,
    orderBy: {
      name: "asc"
    }
  });
}
