import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionEmail } from "@/lib/session";
import { isAdminEmail } from "@/lib/access";

export async function POST(req: Request) {
  const actorEmail = await getSessionEmail();
  if (!isAdminEmail(actorEmail)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const email = String(body?.email || "").trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  await (prisma as any).user.update({
    where: { email },
    data: {
      plan: "agency",
      status: "active",
      isLifetime: true,
      billingCycle: "lifetime",
    },
  });

  await (prisma as any).billingEvent.create({
    data: {
      email,
      provider: "admin-lifetime",
      plan: "lifetime",
      status: "completed",
    },
  });

  return NextResponse.json({ success: true, message: `Lifetime access granted to ${email}` });
}
