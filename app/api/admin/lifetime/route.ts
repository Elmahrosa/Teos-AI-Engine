import { NextResponse } from "next/server";
import { TransactionGateway, TransactionStatus } from "@prisma/client";
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

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: "agency_lifetime",
      status: "active",
    },
  });

  await prisma.transaction.create({
    data: {
      userId: user.id,
      gateway: TransactionGateway.ADMIN,
      status: TransactionStatus.COMPLETED,
      planId: "agency_lifetime",
      amountUSD: 0,
      paymentRef: `admin-lifetime-${email}-${Date.now()}`,
      creditsAdded: 999999,
      metadata: { email, provider: "admin-lifetime" },
    },
  });

  return NextResponse.json({ success: true, message: `Lifetime access granted to ${email}` });
}
