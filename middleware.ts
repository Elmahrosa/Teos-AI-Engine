export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/generate/:path*", "/api/subscribe/:path*"],
};
