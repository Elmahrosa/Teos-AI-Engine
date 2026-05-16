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

  if (!email) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.post.deleteMany({
    where: { userId: user.id },
  });

  return NextResponse.redirect(new URL("/admin", req.url));
}