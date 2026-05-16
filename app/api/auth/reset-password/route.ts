import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

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

    const db = prisma as any;
    const user = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }

    if (user.resetToken !== token) {
      return NextResponse.json({ error: "Invalid reset token" }, { status: 400 });
    }

    if (new Date() > user.resetTokenExpiry) {
      return NextResponse.json({ error: "Reset link has expired" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await db.user.update({
      where: { email: user.email },
      data: { passwordHash, resetToken: null, resetTokenExpiry: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[/api/auth/reset-password]", error);
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 });
  }
}
