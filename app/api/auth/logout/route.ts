import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set("teos_session", "", { path: "/", maxAge: 0 });

  return NextResponse.json({
    success: true,
    message: "Logged out",
  });
}
