import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setSession } from "@/lib/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  if (!process.env.FOUNDER_SECRET || key !== process.env.FOUNDER_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email =
    process.env.ADMIN_EMAIL ||
    process.env.ADMIN_EMAILS?.split(",")[0]?.trim() ||
    "aams1969@gmail.com";

  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Ayman Seif",
      plan: "agency",
      status: "active",
    },
    create: {
      email,
      name: "Ayman Seif",
      plan: "agency",
      status: "active",
    },
  });

  await setSession(email);

  return NextResponse.redirect(new URL("/admin", req.url));
}