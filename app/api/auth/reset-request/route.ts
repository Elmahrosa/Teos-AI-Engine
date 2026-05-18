import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/session";
import { isAllowedOrigin } from "@/lib/origin";
import { resetRequestSchema } from "@/lib/validation";
import { rateLimitMiddleware } from "@/lib/rateLimit";
import { log, logError, getRequestId } from "@/lib/logger";
import { AUTH_RATE_LIMIT, AUTH_RATE_WINDOW_MS } from "@/lib/constants";

export async function POST(req: Request) {
  const reqId = getRequestId(req);
  log(req, "reset-request.start", { reqId });

  try {
    if (!isAllowedOrigin(req)) {
      log(req, "reset-request.origin_blocked", { reqId });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rl = await rateLimitMiddleware(req, "reset-request", AUTH_RATE_LIMIT, AUTH_RATE_WINDOW_MS);
    if (!rl.allowed) {
      log(req, "reset-request.rate_limited", { reqId });
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await req.json();
    const parsed = resetRequestSchema.safeParse(body);
    if (!parsed.success) {
      log(req, "reset-request.validation_failed", { reqId });
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { email } = parsed.data;
    const ip = req.headers.get("x-forwarded-for") ?? undefined;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      log(req, "reset-request.user_not_found", { reqId, email });
      return NextResponse.json({ ok: true });
    }

    log(req, "reset-request.token_generating", { reqId, userId: user.id });

    await prisma.resetToken.updateMany({
      where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
      data: { expiresAt: new Date(0) },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3_600_000);

    await prisma.resetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    await createAuditLog(user.id, "password-reset-requested", { email }, ip);

    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_YOUR_RESEND_KEY") {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "noreply@teosegypt.com",
          to: email,
          subject: "Reset your password",
          html: `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:white;text-decoration:none;border-radius:8px;">Reset Password</a>
            <p>If you didn't request this, ignore this email.</p>
          `,
        });
        log(req, "reset-request.email_sent", { reqId, userId: user.id });
        return NextResponse.json({ ok: true, emailSent: true });
      } catch {
        log(req, "reset-request.email_fallback", { reqId, userId: user.id });
      }
    }

    if (process.env.NODE_ENV === "production") {
      console.log(`[reset-request] Fallback token generated for ${email}`);
      return NextResponse.json({ ok: true, emailSent: false });
    }
    return NextResponse.json({ ok: true, emailSent: false, token, resetUrl });
  } catch (error) {
    logError(req, "reset-request.failed", error, { reqId });
    return NextResponse.json({ error: "Reset request failed" }, { status: 500 });
  }
}
