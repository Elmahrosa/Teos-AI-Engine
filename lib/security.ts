import type { NextRequest } from "next/server";

export const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export function getCSPHeader(): string {
  const self = "'self'";
  const connectSrc = [
    self,
    "https://*.vercel-analytics.com",
    "https://vitals.vercel-insights.com",
    "https://generativelanguage.googleapis.com",
    "https://api.anthropic.com",
    "https://api.resend.io",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ].join(" ");

  return [
    `default-src ${self}`,
    `script-src ${self} 'unsafe-eval' 'unsafe-inline'`,
    `style-src ${self} 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src ${self} data: blob: https:`,
    `font-src ${self} https://fonts.gstatic.com`,
    `connect-src ${connectSrc}`,
    `frame-ancestors 'none'`,
    `base-uri ${self}`,
    `form-action ${self}`,
  ].join("; ");
}

export function applySecurityHeaders(headers: Headers): void {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  headers.set("Content-Security-Policy", getCSPHeader());
}

export function validateRedirectUrl(url: string | null, baseUrl: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url, baseUrl);
    const allowed = new URL(baseUrl);

    if (parsed.origin !== allowed.origin) return null;
    if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") return null;

    return parsed.pathname + parsed.search;
  } catch {
    return null;
  }
}

export function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const appUrl = process.env.NEXTAUTH_URL || process.env.APP_URL;
    if (!appUrl) return false;

    const allowed = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000").origin;
    return new URL(origin).origin === allowed;
  } catch {
    return false;
  }
}

export function isSensitiveRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/api/generate") ||
    pathname.startsWith("/api/admin") ||
    (pathname.startsWith("/api/auth") && !pathname.includes("callback"))
  );
}
