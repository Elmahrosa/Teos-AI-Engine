import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body?.customer?.email?.toLowerCase?.();
    const productName = body?.product?.name?.toLowerCase?.() || "";

    if (!email) {
      return NextResponse.json({ error: "No email in webhook" }, { status: 400 });
    }

    let plan = "starter";

    if (productName.includes("agency")) {
      plan = "agency";
    } else if (productName.includes("pro")) {
      plan = "pro";
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email,
          plan,
          status: "active",
        },
      });
    } else {
      await prisma.user.update({
        where: { email },
        data: {
          plan,
          status: "active",
        },
      });
    }

    await prisma.billingEvent.create({
      data: {
        email,
        provider: "dodo",
        plan,
        status: "completed",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[/api/dodo-webhook]", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}