"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { auth, signIn, signOut } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/data/users";
import {
  type LoginInput,
  type RegisterInput,
  loginSchema,
  registerSchema
} from "@/lib/schemas/auth";

export type AuthActionResult =
  | {
      ok: true;
      redirectTo: string;
    }
  | {
      ok: false;
      error: string;
    };

function safeRedirectPath(path: string | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

function hasAuthError(response: unknown) {
  if (typeof response !== "string") {
    return false;
  }

  const url = new URL(response, "http://localhost");
  return url.searchParams.has("error") || url.searchParams.has("code");
}

export async function loginAction(
  input: LoginInput,
  redirectTo?: string
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the fields and try again."
    };
  }

  try {
    const response = await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirect: false
    });

    if (hasAuthError(response)) {
      return {
        ok: false,
        error: "Invalid email or password."
      };
    }

    return {
      ok: true,
      redirectTo: safeRedirectPath(redirectTo)
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        error: "Invalid email or password."
      };
    }

    throw error;
  }
}

export async function registerAction(
  input: RegisterInput,
  redirectTo?: string
): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the fields and try again."
    };
  }

  const session = await auth();

  if (session?.user) {
    return {
      ok: false,
      error: "You are already signed in."
    };
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      ok: false,
      error: "An account with that email already exists."
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await createUser({
    name: parsed.data.name,
    email,
    passwordHash
  });

  try {
    const response = await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirect: false
    });

    if (hasAuthError(response)) {
      return {
        ok: false,
        error: "Your account was created, but sign-in failed. Try logging in."
      };
    }

    return {
      ok: true,
      redirectTo: safeRedirectPath(redirectTo)
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        error: "Your account was created, but sign-in failed. Try logging in."
      };
    }

    throw error;
  }
}

export async function signOutAction() {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  await signOut({
    redirectTo: "/"
  });
}
