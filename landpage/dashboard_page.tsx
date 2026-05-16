import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getPlan, postsRemainingToday, usagePct, upgradeTarget } from "@/landpage/plans";
import DashboardClient from "./DashboardClient";

// ─── Server component — fetches all real data before render ──────────────────
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      totalPostsUsed: true,
      dailyPostsUsed: true,
      createdAt: true,
      posts: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          content: true,
          platform: true,
          prompt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) redirect("/login");

  const plan = getPlan(user.plan);
  const remaining = postsRemainingToday(plan, user.dailyPostsUsed);
  const pct = usagePct(plan, user.dailyPostsUsed);
  const upgrade = upgradeTarget(plan.id);

  // Serialize dates for client component
  const userData = {
    id: user.id,
    name: user.name ?? "Founder",
    email: user.email,
    plan: user.plan ?? "free",
    totalPostsUsed: user.totalPostsUsed ?? 0,
    dailyPostsUsed: user.dailyPostsUsed ?? 0,
    createdAt: user.createdAt.toISOString(),
    posts: user.posts.map(p => ({
      id: p.id,
      content: p.content,
      platform: p.platform,
      prompt: p.prompt,
      createdAt: p.createdAt.toISOString(),
    })),
  };

  return (
    <DashboardClient
      user={userData}
      plan={plan}
      remaining={remaining}
      pct={pct}
      upgrade={upgrade}
    />
  );
}
