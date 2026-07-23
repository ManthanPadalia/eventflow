"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import {
  getUserById,
  updateUserName,
  updateUserPasswordHash
} from "@/lib/data/users";
import {
  type ChangePasswordInput,
  type ProfileNameInput,
  changePasswordSchema,
  profileNameSchema
} from "@/lib/schemas/profile";

type MutationResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      error: string;
    };

export async function updateProfileNameAction(
  input: ProfileNameInput
): Promise<MutationResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ok: false,
      error: "Sign in to update your profile."
    };
  }

  const parsed = profileNameSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the name and try again."
    };
  }

  await updateUserName(session.user.id, parsed.data.name);

  revalidatePath("/");
  revalidatePath("/profile");

  return {
    ok: true,
    message: "Profile updated."
  };
}

export async function changePasswordAction(
  input: ChangePasswordInput
): Promise<MutationResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ok: false,
      error: "Sign in to change your password."
    };
  }

  const parsed = changePasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the password fields and try again."
    };
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    return {
      ok: false,
      error: "Your account could not be found."
    };
  }

  const passwordMatches = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash
  );

  if (!passwordMatches) {
    return {
      ok: false,
      error: "Current password is incorrect."
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await updateUserPasswordHash(user.id, passwordHash);

  revalidatePath("/profile");

  return {
    ok: true,
    message: "Password changed."
  };
}
