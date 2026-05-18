"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PLANS, isFounder, PlanId } from "@/lib/plans";
import Link from "next/link";

interface UserSummary {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  totalPostsUsed: number;
  dailyPostsUsed: number;
  createdAt: string;
}

export default function FounderPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, paid: 0, posts: 0, daily: 0 });

  useEffect(() => {
    if (!session?.user?.email) return;
    if (!isFounder(session.user.email)) return;

    fetch("/api/admin/users")
      .then(r => r.json())
      .then(data => {
        setUsers(data.users ?? []);
        setStats({
          total: data.users?.length ?? 0,
          paid: data.users?.filter((u: UserSummary) => u.plan !== "free").length ?? 0,
          posts: data.users?.reduce((s: number, u: UserSummary) => s + u.totalPostsUsed, 0) ?? 0,
          daily: data.users?.reduce((s: number, u: UserSummary) => s + u.dailyPostsUsed, 0) ?? 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Sign in to access founder dashboard</h1>
          <Link href="/login" className="btn-teal text-sm px-6 py-3">Sign in</Link>
        </div>
      </div>
    );
  }

  if (!isFounder(session.user?.email ?? null)) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-400">Access denied</h1>
          <p className="text-sm text-[#8a88a0] mt-2">Founder access only</p>
          <Link href="/dashboard" className="btn-teal text-sm px-5 py-2 mt-4">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="glass">
        <div className="section-container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 text-bg text-xs font-black">T</div>
            <span className="text-lg font-bold">Teos <span className="text-gold-500">AI</span></span>
          </Link>
          <span className="text-xs text-gold-500 font-semibold uppercase tracking-wider">Founder Panel</span>
        </div>
      </header>

      <div className="section-container py-8">
        <h1 className="text-2xl font-bold mb-8">Founder Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: stats.total, color: "text-gold-500" },
            { label: "Paid Users", value: stats.paid, color: "text-teal-400" },
            { label: "Total Posts", value: stats.posts, color: "text-violet-400" },
            { label: "Today's Posts", value: stats.daily, color: "text-gold-500" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-white/[0.06] bg-bg-card p-4">
              <div className="text-xs text-[#8a88a0] mb-1">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{loading ? "..." : s.value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-bg-card overflow-hidden">
          <div className="p-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold">All Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-[#8a88a0] border-b border-white/[0.06]">
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Plan</th>
                  <th className="text-right p-3">Posts</th>
                  <th className="text-right p-3">Daily</th>
                  <th className="text-right p-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center p-8 text-[#5a5870]">Loading...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center p-8 text-[#5a5870]">No users yet</td></tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="p-3 text-[#e8e6f0]">{u.email}</td>
                      <td className="p-3 text-[#8a88a0]">{u.name ?? "—"}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.plan !== "free" ? "bg-gold-500/10 text-gold-500" : "bg-white/[0.04] text-[#5a5870]"}`}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="p-3 text-right text-[#e8e6f0]">{u.totalPostsUsed}</td>
                      <td className="p-3 text-right text-[#e8e6f0]">{u.dailyPostsUsed}</td>
                      <td className="p-3 text-right text-[#5a5870]">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-white/[0.06] bg-bg-card p-4">
          <h2 className="text-sm font-semibold mb-4">Plan Reference</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.values(PLANS).filter(p => p.id !== "free").map(plan => (
              <div key={plan.id} className="rounded-lg border border-white/[0.06] p-3">
                <div className="text-xs font-semibold text-gold-500">{plan.name}</div>
                <div className="text-lg font-bold mt-1">{plan.price}<span className="text-xs text-[#5a5870] font-normal">/{plan.period}</span></div>
                <div className="text-xs text-[#8a88a0] mt-2">{plan.dailyLimit === -1 ? "Unlimited" : `${plan.dailyLimit}`} posts/day</div>
                {plan.dodLink && (
                  <a href={plan.dodLink} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-400 hover:underline mt-2 block">Checkout →</a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
