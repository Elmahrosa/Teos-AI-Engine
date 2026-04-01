import { NextResponse } from "next/server";
import { getAllUsers, updateUser } from "@/lib/db";

function checkAuth(req: Request): boolean {
  const auth = req.headers.get("authorization") || "";
  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic" || !encoded) return false;
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const [username, password] = decoded.split(":");
  return (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  );
}

export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  const users = getAllUsers();
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
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, plan, status } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const updated = updateUser(email, {
    ...(plan && { plan }),
    ...(status && { status }),
  });

  if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ success: true, user: updated });
}
