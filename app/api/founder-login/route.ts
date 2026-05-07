import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setSession } from "@/lib/session";
import crypto from "crypto";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const founderSecret = process.env.FOUNDER_SECRET;

  if (!founderSecret || !key) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const a = Buffer.from(key, "utf8");
  const b = Buffer.from(founderSecret, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEmail =
    process.env.ADMIN_EMAIL ||
    process.env.ADMIN_EMAILS?.split(",")[0]?.trim();

  if (!adminEmail) {
    return NextResponse.json({ error: "Admin email not configured" }, { status: 500 });
  }

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Ayman Seif",
      plan: "agency",
      status: "active",
    },
    create: {
      email: adminEmail,
      name: "Ayman Seif",
      plan: "agency",
      status: "active",
    },
  });

  await setSession(adminEmail);

  return NextResponse.redirect(new URL("/admin", req.url));
}
