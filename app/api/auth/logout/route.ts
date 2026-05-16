import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAuditLog } from "@/lib/session";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    await createAuditLog(session.user.id, "logout", { email: session.user.email });
  }

  const cookieStore = await cookies();
  cookieStore.set("teos_session", "", { path: "/", maxAge: 0 });

  return NextResponse.json({
    success: true,
    message: "Logged out",
  });
}
