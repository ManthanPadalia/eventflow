import { Prisma, Role } from "@prisma/client";

import { db } from "@/lib/db";

const adminUserInclude = {
  _count: {
    select: {
      bookings: true
    }
  }
} satisfies Prisma.UserInclude;

export type AdminUser = Prisma.UserGetPayload<{
  include: typeof adminUserInclude;
}>;

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email
    }
  });
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: {
      id
    }
  });
}

export async function updateUserName(userId: string, name: string) {
  return db.user.update({
    where: {
      id: userId
    },
    data: {
      name
    }
  });
}

export async function updateUserPasswordHash(
  userId: string,
  passwordHash: string
) {
  return db.user.update({
    where: {
      id: userId
    },
    data: {
      passwordHash
    }
  });
}

export async function createUser(input: CreateUserInput) {
  return db.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
      role: Role.USER
    }
  });
}

export async function getUsers() {
  return db.user.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  return db.user.findMany({
    include: adminUserInclude,
    orderBy: {
      createdAt: "desc"
    }
  });
}
