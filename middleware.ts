import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const adminRoutes = ["/admin", "/api/admin"];
const authRoutes = ["/login", "/signup"];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const url = req.nextUrl.clone();

    if (!token) {
      if (authRoutes.some((r) => pathname.startsWith(r))) {
        return addSecurityHeaders(NextResponse.next());
      }
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return addSecurityHeaders(NextResponse.redirect(url));
    }

    const role = (token as any).role ?? "user";

    if (adminRoutes.some((r) => pathname.startsWith(r))) {
      if (role !== "admin" && role !== "founder") {
        return addSecurityHeaders(NextResponse.redirect(new URL("/dashboard", req.url)));
      }
    }

    if (authRoutes.some((r) => pathname.startsWith(r))) {
      return addSecurityHeaders(NextResponse.redirect(new URL("/dashboard", req.url)));
    }

    return addSecurityHeaders(NextResponse.next());
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

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
