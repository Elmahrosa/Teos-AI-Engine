import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || "User",
        },
      });
    }

    createSession(user.email);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("[LOGIN ERROR]", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}