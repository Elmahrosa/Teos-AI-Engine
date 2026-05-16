import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const adminRoutes = ["/admin", "/api/admin"];
const authRoutes = ["/login", "/signup"];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (!token) {
      if (authRoutes.some((r) => pathname.startsWith(r))) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = (token as any).role ?? "user";

    if (adminRoutes.some((r) => pathname.startsWith(r))) {
      if (role !== "admin" && role !== "founder") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (authRoutes.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const response = NextResponse.next();

    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const pathname = req.nextUrl.pathname;

        if (
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/health") ||
          pathname.startsWith("/_next") ||
          pathname === "/"
        ) {
          return true;
        }

        return !!token;
      },
    },
  },
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
