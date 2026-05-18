import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isPaidPlan, getPlanPriceUSD } from "@/lib/payments";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET || "";

function verifySignature(body: string, signature: string): boolean {
  if (!WEBHOOK_SECRET || !signature) return false;
  try {
    const [timestamp, sig] = signature.split(",");
    if (!timestamp || !sig) return false;
    const payload = `${timestamp}.${body}`;
    const expected = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(payload)
      .digest("hex");
    return sig === expected;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-dodo-signature") || "";

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.type as string;
  const data = event.data as Record<string, unknown>;

  if (eventType === "checkout.completed" || eventType === "payment.success") {
    const email = data.customer_email as string;
    const planId = data.plan_id as string;

    if (!email || !isPaidPlan(planId)) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { plan: planId },
    });

    await prisma.auditLog.create({
      data: {
        action: "plan-upgraded",
        userId: "",
        metadata: { email, planId, priceUSD: getPlanPriceUSD(planId) } as any,
      },
    });
  }

  return NextResponse.json({ received: true });
}
