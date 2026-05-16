import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import FounderClient from "./FounderClient";

// ─── Founder emails — only these two can access this route ───────────────────
const FOUNDER_EMAILS = ["aams1969@gmail.com", "ayman@teosegypt.com"];

export default async function FounderPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !FOUNDER_EMAILS.includes(session.user.email)) {
    redirect("/dashboard");
  }

  // ── Pull real data from Prisma ─────────────────────────────────────────────
  const [
    totalUsers,
    totalPosts,
    usersByPlan,
    recentUsers,
    recentPosts,
    signupsThisWeek,
  ] = await Promise.all([
    // Total user count
    prisma.user.count(),

    // Total posts generated (sum of totalPostsUsed across all users)
    prisma.user.aggregate({ _sum: { totalPostsUsed: true } }),

    // Users grouped by plan
    prisma.user.groupBy({
      by: ["plan"],
      _count: { plan: true },
    }),

    // Last 20 signups
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true, name: true, email: true, plan: true,
        totalPostsUsed: true, createdAt: true,
      },
    }),

    // Last 20 posts across all users
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true, platform: true, prompt: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    }),

    // Signups in last 7 days
    prisma.user.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  // ── Serialize for client ───────────────────────────────────────────────────
  const stats = {
    totalUsers,
    totalPostsGenerated: totalPosts._sum.totalPostsUsed ?? 0,
    signupsThisWeek,
    usersByPlan: usersByPlan.map(g => ({
      plan: g.plan ?? "free",
      count: g._count.plan,
    })),
    recentUsers: recentUsers.map(u => ({
      id: u.id,
      name: u.name ?? "—",
      email: u.email,
      plan: u.plan ?? "free",
      totalPostsUsed: u.totalPostsUsed ?? 0,
      createdAt: u.createdAt.toISOString(),
    })),
    recentPosts: recentPosts.map(p => ({
      id: p.id,
      platform: p.platform,
      prompt: p.prompt ?? "",
      createdAt: p.createdAt.toISOString(),
      userName: p.user?.name ?? "—",
      userEmail: p.user?.email ?? "—",
    })),
  };

  return <FounderClient stats={stats} founderEmail={session.user.email} />;
}
