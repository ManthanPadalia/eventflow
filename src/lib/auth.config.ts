import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

import { AUTH_SECRET } from "@/lib/auth-constants";

function isRole(role: unknown): role is Role {
  return role === "ADMIN" || role === "USER";
}

export const authConfig = {
  secret: AUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      const userId = typeof token.id === "string" ? token.id : token.sub;

      if (session.user && userId && isRole(token.role)) {
        session.user.id = userId;
        session.user.role = token.role;
      }

      return session;
    }
  }
} satisfies NextAuthConfig;
