import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalPostsThisWeek, totalPosts, totalUsers] = await Promise.all([
      prisma.post.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.post.count(),
      prisma.user.count(),
    ]);

    return NextResponse.json({ totalPostsThisWeek, totalPosts, totalUsers });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
