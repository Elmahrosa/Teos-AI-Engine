import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createAuditLog } from "@/lib/session";
import { isAllowedOrigin } from "@/lib/origin";
import { resetConfirmSchema } from "@/lib/validation";
import { rateLimitMiddleware } from "@/lib/rateLimit";
import { log, logError, getRequestId } from "@/lib/logger";
import { AUTH_RATE_LIMIT, AUTH_RATE_WINDOW_MS } from "@/lib/constants";

export async function POST(req: Request) {
  const reqId = getRequestId(req);
  log(req, "reset-confirm.start", { reqId });

  try {
    if (!isAllowedOrigin(req)) {
      log(req, "reset-confirm.origin_blocked", { reqId });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rl = await rateLimitMiddleware(req, "reset-confirm", AUTH_RATE_LIMIT, AUTH_RATE_WINDOW_MS);
    if (!rl.allowed) {
      log(req, "reset-confirm.rate_limited", { reqId });
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await req.json();
    const parsed = resetConfirmSchema.safeParse(body);
    if (!parsed.success) {
      log(req, "reset-confirm.validation_failed", { reqId });
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const { token, email, password } = parsed.data;
    const ip = req.headers.get("x-forwarded-for") ?? undefined;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      log(req, "reset-confirm.user_not_found", { reqId, email });
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }

    const resetToken = await prisma.resetToken.findUnique({ where: { token } });
    if (!resetToken || resetToken.userId !== user.id) {
      log(req, "reset-confirm.token_invalid", { reqId, userId: user.id });
      return NextResponse.json({ error: "Invalid reset token" }, { status: 400 });
    }

    if (resetToken.usedAt) {
      log(req, "reset-confirm.token_used", { reqId, userId: user.id });
      return NextResponse.json({ error: "Reset token has already been used" }, { status: 400 });
    }

    if (new Date() > resetToken.expiresAt) {
      log(req, "reset-confirm.token_expired", { reqId, userId: user.id });
      return NextResponse.json({ error: "Reset link has expired" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.resetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    await createAuditLog(user.id, "password-reset-completed", {}, ip);
    log(req, "reset-confirm.completed", { reqId, userId: user.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    logError(req, "reset-confirm.failed", error, { reqId });
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 });
  }
}
