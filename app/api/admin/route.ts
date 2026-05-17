import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/access";
import { listUsers, updateUserByEmail } from "@/lib/db";
import { withRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  return withRateLimit(req, "strict", async () => {
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
      active: users.filter((u) => u.plan !== "starter").length,
      trial: users.filter((u) => u.plan === "starter").length,
      blocked: 0,
    };

    return NextResponse.json({ stats, users });
  });
}

export async function PATCH(req: NextRequest) {
  return withRateLimit(req, "strict", async () => {
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
  });
}
