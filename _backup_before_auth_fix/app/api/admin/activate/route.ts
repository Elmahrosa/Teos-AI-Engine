import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/auth";
import { getSessionEmail } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const actorEmail = await getSessionEmail();

  if (!isAdminEmail(actorEmail)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await req.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const plan = String(formData.get("plan") || "").trim().toLowerCase();

  if (!email || !["starter", "pro", "agency"].includes(plan)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email },
    data: { plan, status: "active" },
  });

  await prisma.billingEvent.create({
    data: {
      email,
      provider: "admin",
      plan,
      status: "completed",
    },
  });

  return NextResponse.redirect(new URL("/admin", req.url));
}