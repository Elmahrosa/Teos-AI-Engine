"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPlan } from "@/lib/plans";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RecentUser {
  id: string; name: string; email: string;
  plan: string; totalPostsUsed: number; createdAt: string;
}
interface RecentPost {
  id: string; platform: string; prompt: string;
  createdAt: string; userName: string; userEmail: string;
}
interface Stats {
  totalUsers: number;
  totalPostsGenerated: number;
  signupsThisWeek: number;
  usersByPlan: { plan: string; count: number }[];
  recentUsers: RecentUser[];
  recentPosts: RecentPost[];
}

const PLATFORM_ICON: Record<string, string> = {
  X: "𝕏", LinkedIn: "in", Facebook: "f", Instagram: "◎",
  TikTok: "♪", Threads: "@", Telegram: "✈",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function StatCard({ label, value, sub, color = "#C9A84C" }: {
  label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div style={{ padding: "22px 24px", borderRadius: "18px", background: "#0C0C14", border: "1px solid rgba(255,255,255,.07)" }}>
      <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "rgba(255,255,255,.25)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
        {label}
      </p>
      <p style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: "2.2rem", lineHeight: 1, color, marginBottom: "4px" }}>
        {value}
      </p>
      {sub && <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "rgba(255,255,255,.2)" }}>{sub}</p>}
    </div>
  );
}

export default function FounderClient({ stats, founderEmail }: { stats: Stats; founderEmail: string }) {
  const [tab, setTab] = useState<"overview" | "users" | "posts">("overview");

  return (
    <div style={{ minHeight: "100vh", background: "#060608", color: "rgba(255,255,255,.88)", fontFamily: "'Crimson Pro','Georgia',serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Crimson+Pro:wght@300;400;600&family=Space+Mono:wght@400;700&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .shimmer { background:linear-gradient(90deg,#C9A84C,#E8C96B,#C9A84C); background-size:200%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:shimmer 3s linear infinite; }
        * { box-sizing: border-box; }
        .row-hover { transition: background .15s; }
        .row-hover:hover { background: rgba(201,168,76,.04) !important; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: "56px", background: "rgba(6,6,8,.92)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(201,168,76,.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <Image src="/tailogo.jpeg" alt="TEOS" width={28} height={28} style={{ borderRadius: "50%", objectFit: "cover" }} />
            <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.15em" }} className="shimmer">TEOS</span>
          </Link>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", padding: "3px 10px", borderRadius: "99px", background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.25)", color: "#C9A84C", letterSpacing: "0.08em" }}>
            🦅 FOUNDER ADMIN
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,.25)" }}>{founderEmail}</span>
          <Link href="/dashboard" style={{ padding: "6px 14px", borderRadius: "10px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "rgba(255,255,255,.4)", fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", textDecoration: "none" }}>
            ← Dashboard
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "32px 20px" }}>

        <h1 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: "1.6rem", marginBottom: "6px" }}>
          App <span className="shimmer">Intelligence</span>
        </h1>
        <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,.25)", marginBottom: "28px", letterSpacing: "0.06em" }}>
          REAL DATA FROM YOUR NEON DATABASE · LIVE
        </p>

        {/* ── STAT CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "14px", marginBottom: "28px" }}>
          <StatCard label="Total Users" value={stats.totalUsers} sub="all time" />
          <StatCard label="Posts Generated" value={stats.totalPostsGenerated} sub="all users, all time" color="#9B6FDF" />
          <StatCard label="New This Week" value={stats.signupsThisWeek} sub="signups last 7 days" color="#4ade80" />
          <StatCard label="Lifetime Seats" value={`${Math.min(stats.usersByPlan.filter(p => p.plan.includes("lifetime")).reduce((a, b) => a + b.count, 0))}/50`} sub="pro + agency lifetime" color="#C9A84C" />
        </div>

        {/* ── PLAN BREAKDOWN ── */}
        <div style={{ padding: "22px 24px", borderRadius: "18px", background: "#0C0C14", border: "1px solid rgba(255,255,255,.07)", marginBottom: "24px" }}>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,.3)", letterSpacing: "0.1em", marginBottom: "16px" }}>
            USERS BY PLAN
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {stats.usersByPlan.length === 0 ? (
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "rgba(255,255,255,.2)" }}>No plan data yet</span>
            ) : (
              stats.usersByPlan.map(({ plan, count }) => {
                const p = getPlan(plan);
                return (
                  <div key={plan} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "12px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)" }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: p.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.badge}</span>
                    <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: "1.1rem", color: "rgba(255,255,255,.8)" }}>{count}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px", padding: "4px", background: "#0C0C14", borderRadius: "12px", border: "1px solid rgba(255,255,255,.06)", width: "fit-content" }}>
          {(["overview","users","posts"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "8px 16px", borderRadius: "9px", border: "1px solid transparent", background: tab === t ? "rgba(201,168,76,.12)" : "transparent", borderColor: tab === t ? "rgba(201,168,76,.3)" : "transparent", color: tab === t ? "#C9A84C" : "rgba(255,255,255,.35)", fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", letterSpacing: "0.08em", cursor: "pointer", textTransform: "capitalize" as const }}>
              {t}
            </button>
          ))}
        </div>

        {/* ── USERS TABLE ── */}
        {(tab === "overview" || tab === "users") && (
          <div style={{ borderRadius: "18px", background: "#0C0C14", border: "1px solid rgba(255,255,255,.07)", overflow: "hidden", marginBottom: "20px" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,.3)", letterSpacing: "0.1em" }}>
                RECENT SIGNUPS (LAST 20)
              </p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                    {["Name", "Email", "Plan", "Posts", "Joined"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontFamily: "'Space Mono',monospace", fontSize: "0.55rem", color: "rgba(255,255,255,.2)", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: "24px 16px", textAlign: "center", fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "rgba(255,255,255,.2)" }}>No users yet</td></tr>
                  ) : (
                    stats.recentUsers.map((u, i) => {
                      const p = getPlan(u.plan);
                      return (
                        <tr key={u.id} className="row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.01)" }}>
                          <td style={{ padding: "11px 16px", fontFamily: "'Crimson Pro',serif", fontSize: "0.95rem", color: "rgba(255,255,255,.75)", whiteSpace: "nowrap" }}>{u.name}</td>
                          <td style={{ padding: "11px 16px", fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,.4)" }}>{u.email}</td>
                          <td style={{ padding: "11px 16px" }}>
                            <span style={{ padding: "3px 9px", borderRadius: "99px", background: `${p.color}15`, border: `1px solid ${p.color}35`, fontFamily: "'Space Mono',monospace", fontSize: "0.55rem", color: p.color, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                              {p.badge}
                            </span>
                          </td>
                          <td style={{ padding: "11px 16px", fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: "1rem", color: u.totalPostsUsed > 0 ? "#C9A84C" : "rgba(255,255,255,.25)" }}>
                            {u.totalPostsUsed}
                          </td>
                          <td style={{ padding: "11px 16px", fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,.3)", whiteSpace: "nowrap" }}>
                            {timeAgo(u.createdAt)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── POSTS TABLE ── */}
        {(tab === "overview" || tab === "posts") && (
          <div style={{ borderRadius: "18px", background: "#0C0C14", border: "1px solid rgba(255,255,255,.07)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,.3)", letterSpacing: "0.1em" }}>
                RECENT POSTS (LAST 20)
              </p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                    {["Platform", "User", "Prompt", "When"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontFamily: "'Space Mono',monospace", fontSize: "0.55rem", color: "rgba(255,255,255,.2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentPosts.length === 0 ? (
                    <tr><td colSpan={4} style={{ padding: "24px 16px", textAlign: "center", fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "rgba(255,255,255,.2)" }}>No posts generated yet</td></tr>
                  ) : (
                    stats.recentPosts.map((p, i) => (
                      <tr key={p.id} className="row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.01)" }}>
                        <td style={{ padding: "11px 16px" }}>
                          <span style={{ fontFamily: "monospace", fontSize: "1rem" }}>{PLATFORM_ICON[p.platform] ?? p.platform}</span>
                        </td>
                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "0.92rem", color: "rgba(255,255,255,.7)" }}>{p.userName}</div>
                          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.55rem", color: "rgba(255,255,255,.25)" }}>{p.userEmail}</div>
                        </td>
                        <td style={{ padding: "11px 16px", fontFamily: "'Crimson Pro',serif", fontSize: "0.9rem", color: "rgba(255,255,255,.5)", maxWidth: "300px" }}>
                          {p.prompt ? p.prompt.slice(0, 70) + (p.prompt.length > 70 ? "…" : "") : "—"}
                        </td>
                        <td style={{ padding: "11px 16px", fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,.3)", whiteSpace: "nowrap" }}>
                          {timeAgo(p.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
