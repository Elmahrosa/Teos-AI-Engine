import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const db = prisma as any;
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600_000);

    await db.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const resetUrl = `${process.env.NEXTAUTH_URL || "https://teos-ai-engine.vercel.app"}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "Teos AI Engine <support@teosegypt.com>",
          to: email,
          subject: "Reset your Teos AI Engine password",
          html: `
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:white;text-decoration:none;border-radius:8px;">Reset Password</a>
            <p>If you didn't request this, ignore this email.</p>
          `,
        });
      } catch (emailError) {
        console.error("RESET_EMAIL_FAILED", emailError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/auth/reset-request]", error);
    return NextResponse.json({ error: "Reset request failed" }, { status: 500 });
  }
}
