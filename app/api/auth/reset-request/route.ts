import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    await prisma.resetToken.updateMany({
      where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
      data: { expiresAt: new Date(0) },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3_600_000);

    await prisma.resetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    await createAuditLog(user.id, "password-reset-requested", { email }, req.headers.get("x-forwarded-for") ?? undefined);

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
        return NextResponse.json({ ok: true, emailSent: true });
      } catch {
        console.warn("Resend not configured, showing token on screen");
      }
    }

    return NextResponse.json({ ok: true, emailSent: false, token, resetUrl });
  } catch (error) {
    console.error("[/api/auth/reset-request]", error);
    return NextResponse.json({ error: "Reset request failed" }, { status: 500 });
  }
}
