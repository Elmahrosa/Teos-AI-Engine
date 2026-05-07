import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-dodo-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const body = await req.text();
    const payload = JSON.parse(body);

    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
    if (webhookSecret) {
      const crypto = await import("crypto");
      const expected = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");
      if (signature !== `sha256=${expected}` && signature !== expected) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = payload?.type || payload?.event;
    const customerEmail = payload?.customer?.email || payload?.email;
    const planType = payload?.metadata?.plan || "pro";
    const status = payload?.status;

    if (status === "completed" || status === "succeeded" || event === "checkout.completed") {
      if (customerEmail) {
        await prisma.user.updateMany({
          where: { email: customerEmail.toLowerCase() },
          data: {
            plan: planType,
            status: "active",
            billingCycle: planType === "lifetime" ? "lifetime" : "monthly",
          },
        });
      }

      await prisma.billingEvent.create({
        data: {
          email: customerEmail || null,
          provider: "dodo",
          plan: planType,
          amount: payload?.amount ? payload.amount / 100 : null,
          status: "completed",
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[/api/dodo-webhook]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
