import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/access";
import { listUsers, updateUserByEmail } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await listUsers();

  const stats = {
    total: users.length,
    starter: users.filter((u) => u.plan === "starter").length,
    pro: users.filter((u) => u.plan === "pro").length,
    agency: users.filter((u) => u.plan === "agency").length,
    active: users.filter((u) => u.status === "active").length,
    trial: users.filter((u) => u.status === "trial").length,
    blocked: users.filter((u) => u.status === "blocked").length,
  };

  return NextResponse.json({ stats, users });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, plan, status } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const updated = await updateUserByEmail(email, {
    ...(plan ? { plan } : {}),
    ...(status ? { status } : {}),
  });

  return NextResponse.json({ success: true, user: updated });
}
