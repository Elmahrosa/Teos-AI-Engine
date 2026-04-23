import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body?.name;
    const email = body?.email;
    const password = body?.password;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Account already exists" },
        { status: 400 }
      );
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: passwordHash,
        plan: "starter",
      },
    });

    // set cookie
    cookies().set("user_email", normalizedEmail, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("[SIGNUP ERROR]", error);
    return NextResponse.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
}