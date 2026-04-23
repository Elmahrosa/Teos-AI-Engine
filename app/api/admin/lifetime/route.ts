import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/auth";
import { getSessionEmail } from "@/lib/session";

export async function POST(req: Request) {
  const actorEmail = await getSessionEmail();

  if (!isAdminEmail(actorEmail)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.redirect(new URL("/admin", req.url));
}