import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  if (request.auth?.user.role === "ADMIN") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
});

export const config = {
  matcher: ["/admin", "/admin/:path*"]
};
