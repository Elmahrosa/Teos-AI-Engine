import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByEmail, updateUserByEmail } from "@/lib/db";
import { TAP_INVOICES } from "@/lib/tap";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();
  const plan = body?.plan;

  if (!["starter", "pro", "agency"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const user = await findUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (plan === "starter") {
    await updateUserByEmail(session.user.email, {
      plan: "starter",
      status: "trial",
      trialStart: new Date(),
    });
    return NextResponse.json({ success: true, message: "Starter trial activated" });
  }

  const tapLink = TAP_INVOICES[plan as "pro" | "agency"];
  if (!tapLink) {
    return NextResponse.json({ error: "Tap link not configured" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    tapLink,
    message: "Redirect to Tap checkout",
    plan,
  });
}
