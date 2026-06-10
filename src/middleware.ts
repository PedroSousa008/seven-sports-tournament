import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROLE_HOME, roleFromPath } from "@/lib/roles";
import type { UserRole } from "@prisma/client";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (!token?.role) return NextResponse.next();

    const userRole = token.role as UserRole;
    const pathRole = roleFromPath(pathname);

    if (pathRole && pathRole !== userRole) {
      return NextResponse.redirect(new URL(ROLE_HOME[userRole], req.url));
    }

    if (pathname === "/login") {
      return NextResponse.redirect(new URL(ROLE_HOME[userRole], req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        const publicPaths = ["/", "/login", "/login/redirect"];
        if (
          publicPaths.includes(pathname) ||
          pathname.startsWith("/api/auth")
        ) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
