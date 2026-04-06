import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByEmail, updateUserByEmail } from "@/lib/db";
import { TAP_INVOICES } from "@/lib/tap";
import { subscribeSchema } from "@/lib/validation";
import { isAllowedOrigin } from "@/lib/origin";

async function handlePlan(plan: "starter" | "pro" | "agency", email: string) {
  const user = await findUserByEmail(email);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (plan === "starter") {
    await updateUserByEmail(email, {
      plan: "starter",
      status: "trial",
      trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });
    return NextResponse.redirect(
      new URL("/dashboard", process.env.NEXTAUTH_URL || "http://localhost:3000")
    );
  }

  const tapLink = TAP_INVOICES[plan];
  if (!tapLink) return NextResponse.json({ error: "Tap link not configured" }, { status: 500 });
  return NextResponse.redirect(tapLink);
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"));
  }
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get("plan");
  const parsed = subscribeSchema.safeParse({ plan });
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  return handlePlan(parsed.data.plan, session.user.email);
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const body = await request.json();
  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  return handlePlan(parsed.data.plan, session.user.email);
}