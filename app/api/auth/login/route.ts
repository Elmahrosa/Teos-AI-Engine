import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          plan: "starter",
        },
      });
    }

    cookies().set("user_email", normalizedEmail, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("[/api/auth/login]", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}