import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createAuditLog } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, email, password } = body;

    if (!token || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }

    const resetToken = await prisma.resetToken.findUnique({ where: { token } });
    if (!resetToken || resetToken.userId !== user.id) {
      return NextResponse.json({ error: "Invalid reset token" }, { status: 400 });
    }

    if (resetToken.usedAt) {
      return NextResponse.json({ error: "Reset token has already been used" }, { status: 400 });
    }

    if (new Date() > resetToken.expiresAt) {
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

    await createAuditLog(user.id, "password-reset-completed", {}, req.headers.get("x-forwarded-for") ?? undefined);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[/api/auth/reset-confirm]", error);
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 });
  }
}
