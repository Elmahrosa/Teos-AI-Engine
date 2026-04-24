import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const db = prisma as any;
    const passwordHash = await bcrypt.hash(password, 10);

    let user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        passwordHash: true,
      },
    });

    if (user && user.passwordHash) {
      return NextResponse.json(
        { error: "Account already exists. Please log in." },
        { status: 409 }
      );
    }

    if (user && !user.passwordHash) {
      user = await db.user.update({
        where: { email },
        data: {
          name,
          passwordHash,
          plan: user.plan || "starter",
        },
      });
    }

    if (!user) {
      user = await db.user.create({
        data: {
          name,
          email,
          passwordHash,
          plan: "starter",
          status: "active",
        },
      });
    }

    cookies().set("user_email", email, {
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
    console.error("[/api/auth/signup]", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}