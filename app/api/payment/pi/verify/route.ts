import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchPiPrice, verifyPiTransaction } from "@/lib/pi";
import { PAYMENT_PLANS, PI_DISCOUNT_PCT, getPlanPricePi } from "@/lib/payments";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, txid, amount } = await req.json();

    if (!planId || !txid || !amount) {
      return NextResponse.json(
        { error: "Missing planId, txid, or amount" },
        { status: 400 },
      );
    }

    const plan = PAYMENT_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const piPrice = await fetchPiPrice();
    const expectedAmount = getPlanPricePi(planId, piPrice);

    if (Math.abs(amount - expectedAmount) > 0.01) {
      return NextResponse.json(
        {
          error: "Amount mismatch",
          expected: expectedAmount,
          received: amount,
        },
        { status: 400 },
      );
    }

    const { valid, tx } = await verifyPiTransaction(txid);
    if (!valid) {
      return NextResponse.json(
        { error: "Transaction not confirmed" },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { email: session.user.email.toLowerCase() },
      data: { plan: planId },
    });

    await prisma.auditLog.create({
      data: {
        action: "plan-upgraded-pi",
        userId: "",
        metadata: {
          email: session.user.email,
          planId,
          piAmount: amount,
          piPrice,
          discountPct: PI_DISCOUNT_PCT,
          txid,
        } as any,
      },
    });

    return NextResponse.json({
      success: true,
      plan: planId,
      discountApplied: `${PI_DISCOUNT_PCT}%`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
