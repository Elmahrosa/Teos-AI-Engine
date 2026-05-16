import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/session";
import { sendWelcomeEmail } from "@/lib/email";
import { hashPassword } from "@/lib/password";

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

    const existing = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Account already exists. Please log in." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data:{
        name,
        email,
        passwordHash,
        plan:"starter",
        status:"active",
      },
    });

    // Optional welcome email only if configured
    if (process.env.RESEND_API_KEY) {
      try {
        await sendWelcomeEmail(
          user.email,
          user.name,
          user.plan
        );
      } catch (emailError) {
        console.error(
          "WELCOME_EMAIL_FAILED",
          emailError
        );
      }
    }

    await setSession(user.email);

    return NextResponse.json({
      success:true,
      user:{
        email:user.email,
        plan:user.plan,
      },
    });

  } catch(error){
    console.error(
      "[/api/auth/signup]",
      error
    );

    return NextResponse.json(
      { error:"Signup failed" },
      { status:500 }
    );
  }
}