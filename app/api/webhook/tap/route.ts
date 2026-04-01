import { NextResponse } from "next/server";
import { logBillingEvent, findUserByEmail, updateUserByEmail } from "@/lib/db";
import { verifyTapWebhook, normalizeTapEmail, normalizeTapEventId, normalizeTapInvoiceId, normalizeTapPaid, normalizeTapPlan } from "@/lib/tap";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("tap-signature");
    const rawBody = await request.text();
    const secret = process.env.TAP_WEBHOOK_SECRET;

    if (!secret || !verifyTapWebhook(signature, rawBody, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const email = normalizeTapEmail(payload);
    const eventId = normalizeTapEventId(payload);
    const invoiceId = normalizeTapInvoiceId(payload);
    const plan = normalizeTapPlan(payload);
    const paid = normalizeTapPaid(payload);

    await logBillingEvent({
      externalEventId: eventId,
      invoiceId,
      status: paid ? "paid" : "ignored",
      plan,
      payload,
      userEmail: email,
    });

    if (!email) {
      return NextResponse.json({ received: true, ignored: "No customer email" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ received: true, ignored: "Unknown user" });
    }

    if (paid) {
      await updateUserByEmail(email, {
        plan,
        status: "active",
        trialStart: null,
      });
      await sendWelcomeEmail(email, user.name, plan);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[tap-webhook] error", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
