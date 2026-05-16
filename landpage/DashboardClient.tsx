"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import type { Plan } from "@/lib/plans";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Post {
  id: string;
  content: string;
  platform: string;
  prompt: string;
  createdAt: string;
}
interface UserData {
  id: string;
  name: string;
  email: string;
  plan: string;
  totalPostsUsed: number;
  dailyPostsUsed: number;
  createdAt: string;
  posts: Post[];
}
interface Props {
  user: UserData;
  plan: Plan;
  remaining: number | null;
  pct: number;
  upgrade: Plan | null;
}

// ─── Platform icon map ────────────────────────────────────────────────────────
const PLATFORM_ICON: Record<string, string> = {
  X: "𝕏", LinkedIn: "in", Facebook: "f", Instagram: "◎",
  TikTok: "♪", Threads: "@", Telegram: "✈",
};
const PLATFORM_COLOR: Record<string, string> = {
  X: "#fff", LinkedIn: "#5BA4CF", Facebook: "#4A90D9",
  Instagram: "#E1306C", TikTok: "#69C9D0", Threads: "#bbb", Telegram: "#2AABEE",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  }
  return { copied, copy };
}

// ─── Plan Badge ───────────────────────────────────────────────────────────────
function PlanBadge({ plan }: { plan: Plan }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "3px 10px", borderRadius: "99px",
      background: `${plan.color}18`,
      border: `1px solid ${plan.color}40`,
      fontFamily: "'Space Mono',monospace",
      fontSize: "0.6rem", letterSpacing: "0.1em",
      color: plan.color, textTransform: "uppercase" as const,
    }}>
      {plan.badge}
    </span>
  );
}

// ─── Usage Bar ────────────────────────────────────────────────────────────────
function UsageBar({ pct, unlimited }: { pct: number; unlimited: boolean }) {
  const color = unlimited ? "#4ade80" : pct >= 90 ? "#f87171" : pct >= 60 ? "#fbbf24" : "#C9A84C";
  return (
    <div style={{ height: "5px", borderRadius: "99px", background: "rgba(255,255,255,.06)", overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: "99px",
        width: unlimited ? "100%" : `${pct}%`,
        background: unlimited
          ? "linear-gradient(90deg,#4ade80,#22c55e)"
          : `linear-gradient(90deg,#7B4FBF,${color})`,
        transition: "width 1s cubic-bezier(.16,1,.3,1)",
      }} />
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, copied, onCopy }: { post: Post; copied: string | null; onCopy: (t: string, id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const icon = PLATFORM_ICON[post.platform] ?? "✦";
  const color = PLATFORM_COLOR[post.platform] ?? "#C9A84C";
  const preview = post.content.slice(0, 140);
  const isLong = post.content.length > 140;

  return (
    <div style={{
      padding: "18px 20px", borderRadius: "16px",
      background: "#0D0D16", border: "1px solid rgba(255,255,255,.06)",
      transition: "border-color .2s",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontFamily: "monospace", fontSize: "1rem", color }}>{icon}</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
            {post.platform}
          </span>
        </div>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "rgba(255,255,255,.2)" }}>
          {timeAgo(post.createdAt)}
        </span>
      </div>

      {/* Prompt chip */}
      {post.prompt && (
        <div style={{ marginBottom: "8px", padding: "5px 10px", borderRadius: "8px", background: "rgba(123,79,191,.08)", border: "1px solid rgba(123,79,191,.15)", fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "rgba(155,111,223,.7)" }}>
          ✦ {post.prompt.slice(0, 80)}{post.prompt.length > 80 ? "…" : ""}
        </div>
      )}

      {/* Content */}
      <pre style={{
        whiteSpace: "pre-wrap", wordBreak: "break-word",
        fontFamily: "'Crimson Pro',serif", fontSize: "0.92rem",
        lineHeight: 1.65, color: "rgba(255,255,255,.75)", margin: 0,
      }}>
        {expanded ? post.content : preview}{isLong && !expanded ? "…" : ""}
      </pre>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" as const }}>
        {isLong && (
          <button onClick={() => setExpanded(!expanded)} style={{ padding: "5px 12px", borderRadius: "8px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: "rgba(255,255,255,.35)", fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", cursor: "pointer" }}>
            {expanded ? "Collapse" : "Expand"}
          </button>
        )}
        <button
          onClick={() => onCopy(post.content, post.id)}
          style={{ padding: "5px 12px", borderRadius: "8px", background: copied === post.id ? "rgba(201,168,76,.15)" : "rgba(201,168,76,.07)", border: `1px solid ${copied === post.id ? "rgba(201,168,76,.4)" : "rgba(201,168,76,.2)"}`, color: "#C9A84C", fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", cursor: "pointer" }}>
          {copied === post.id ? "✓ Copied" : "⎘ Copy"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardClient({ user, plan, remaining, pct, upgrade }: Props) {
  const [tab, setTab] = useState<"generate" | "history" | "account">("generate");
  const [menuOpen, setMenuOpen] = useState(false);
  const { copied, copy } = useCopy();
  const unlimited = plan.dailyLimit === -1;

  return (
    <div style={{ minHeight: "100vh", background: "#060608", color: "rgba(255,255,255,.88)", fontFamily: "'Crimson Pro','Georgia',serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Crimson+Pro:wght@300;400;600&family=Space+Mono:wght@400;700&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .shimmer {
          background: linear-gradient(90deg,#C9A84C,#E8C96B,#C9A84C);
          background-size: 200%; -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite;
        }
        .tab-btn { transition: all .18s; cursor: pointer; }
        .tab-btn:hover { opacity: .85; }
        .card-hover { transition: border-color .2s, transform .25s; }
        .card-hover:hover { border-color: rgba(201,168,76,.25) !important; transform: translateY(-2px); }
        * { box-sizing: border-box; }
        @media (max-width: 640px) {
          .dash-grid { grid-template-columns: 1fr !important; }
          .nav-name { display: none !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 40,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: "58px",
        background: "rgba(6,6,8,.92)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(201,168,76,.1)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <Image src="/tailogo.jpeg" alt="TEOS" width={32} height={32}
            style={{ borderRadius: "50%", objectFit: "cover" }} />
          <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: "0.85rem", letterSpacing: "0.18em" }}>
            <span className="shimmer">TEOS AI</span>
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <PlanBadge plan={plan} />
          <span className="nav-name" style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "rgba(255,255,255,.4)" }}>
            {user.name}
          </span>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            style={{ padding: "7px 14px", borderRadius: "10px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "rgba(255,255,255,.4)", fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", cursor: "pointer", letterSpacing: "0.08em" }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "32px 20px" }}>

        {/* ── WELCOME + USAGE ROW ── */}
        <div className="dash-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>

          {/* Welcome card */}
          <div style={{ padding: "24px", borderRadius: "20px", background: "#0C0C14", border: "1px solid rgba(255,255,255,.07)" }}>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,.3)", letterSpacing: "0.1em", marginBottom: "6px" }}>
              WELCOME BACK
            </p>
            <h1 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: "1.5rem", lineHeight: 1.2, marginBottom: "10px" }}>
              {user.name.split(" ")[0]}
            </h1>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <PlanBadge plan={plan} />
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,.25)" }}>
                since {formatDate(user.createdAt)}
              </span>
            </div>
          </div>

          {/* Usage card */}
          <div style={{ padding: "24px", borderRadius: "20px", background: "#0C0C14", border: "1px solid rgba(255,255,255,.07)" }}>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,.3)", letterSpacing: "0.1em", marginBottom: "12px" }}>
              TODAY'S USAGE
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "10px" }}>
              {unlimited ? (
                <>
                  <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: "2rem" }} className="shimmer">∞</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "rgba(255,255,255,.3)" }}>unlimited</span>
                </>
              ) : (
                <>
                  <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: "2rem", color: remaining === 0 ? "#f87171" : "#C9A84C" }}>
                    {remaining}
                  </span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "rgba(255,255,255,.3)" }}>
                    / {plan.dailyLimit} posts left today
                  </span>
                </>
              )}
            </div>
            <UsageBar pct={pct} unlimited={unlimited} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "rgba(255,255,255,.2)" }}>
                {user.totalPostsUsed} total posts generated
              </span>
              {!unlimited && remaining === 0 && (
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "#f87171" }}>
                  Limit reached — resets midnight
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── UPGRADE BANNER (only if on free or monthly) ── */}
        {upgrade && !["pro_lifetime", "agency_lifetime"].includes(plan.id) && (
          <div style={{ marginBottom: "24px", padding: "18px 22px", borderRadius: "16px", background: "linear-gradient(135deg,rgba(201,168,76,.08),rgba(123,79,191,.05))", border: "1px solid rgba(201,168,76,.25)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "#C9A84C", letterSpacing: "0.1em", marginBottom: "4px" }}>
                🔥 {upgrade.name.toUpperCase()} — {upgrade.price} ONE-TIME
              </p>
              <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: "0.95rem", color: "rgba(255,255,255,.55)" }}>
                Unlock unlimited posts + all future upgrades forever.
                {" "}<strong style={{ color: "#C9A84C" }}>37/50 lifetime seats taken.</strong>
              </p>
            </div>
            <a href={upgrade.dodLink!} target="_blank" rel="noopener noreferrer"
              style={{ padding: "10px 22px", borderRadius: "12px", background: "linear-gradient(135deg,#C9A84C,#A07030)", color: "#040404", fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", whiteSpace: "nowrap" }}>
              Claim Lifetime →
            </a>
          </div>
        )}

        {/* ── TABS ── */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "24px", padding: "5px", background: "#0C0C14", borderRadius: "14px", border: "1px solid rgba(255,255,255,.06)", width: "fit-content" }}>
          {([
            { id: "generate", label: "✦ Generate" },
            { id: "history", label: `⏱ History (${user.posts.length})` },
            { id: "account", label: "◎ Account" },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="tab-btn"
              style={{ padding: "9px 18px", borderRadius: "10px", border: "1px solid transparent", background: tab === t.id ? "rgba(201,168,76,.12)" : "transparent", borderColor: tab === t.id ? "rgba(201,168,76,.35)" : "transparent", color: tab === t.id ? "#C9A84C" : "rgba(255,255,255,.4)", fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", letterSpacing: "0.08em" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ TAB: GENERATE ══════════════════════════════════════════════════ */}
        {tab === "generate" && (
          <div style={{ borderRadius: "20px", background: "#0C0C14", border: "1px solid rgba(201,168,76,.15)", overflow: "hidden" }}>
            {/* Window bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "13px 20px", background: "#111118", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
              {["#ef4444","#eab308","#22c55e"].map(c => <div key={c} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c, opacity: .65 }} />)}
              <span style={{ marginLeft: "10px", fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,.2)" }}>
                teos-ai-engine.vercel.app/dashboard
              </span>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px", fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "#4ade80" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "livepulse 1.5s ease infinite" }} />
                LIVE
              </div>
              <style>{`@keyframes livepulse{0%,100%{opacity:1}50%{opacity:.2}}`}</style>
            </div>
            <div style={{ padding: "28px" }}>
              {/* Import PostGenerator here — it's already in your components/ */}
              {/* The generator uses /api/generate which handles auth+limits */}
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "rgba(255,255,255,.3)", marginBottom: "20px", letterSpacing: "0.06em" }}>
                Select platform and tone, enter your idea, and generate.
                {!unlimited && remaining !== null && (
                  <span style={{ color: remaining <= 1 ? "#f87171" : "#C9A84C" }}>
                    {" "}{remaining} post{remaining !== 1 ? "s" : ""} remaining today.
                  </span>
                )}
              </p>
              {/* PostGenerator is a client component — import it in the actual file */}
              {/* <PostGenerator /> */}
              <div style={{ padding: "40px", textAlign: "center", borderRadius: "16px", background: "#0D0D16", border: "1px dashed rgba(201,168,76,.2)" }}>
                <p style={{ fontFamily: "'Cinzel',serif", fontSize: "1.1rem", color: "rgba(201,168,76,.6)", marginBottom: "8px" }}>Post Generator</p>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "rgba(255,255,255,.25)" }}>
                  Import your existing PostGenerator component here:
                </p>
                <code style={{ display: "block", marginTop: "12px", fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: "rgba(155,111,223,.7)", background: "rgba(123,79,191,.08)", padding: "10px 16px", borderRadius: "10px" }}>
                  import PostGenerator from &quot;@/components/PostGenerator&quot;;
                </code>
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB: HISTORY ═══════════════════════════════════════════════════ */}
        {tab === "history" && (
          <div>
            {user.posts.length === 0 ? (
              <div style={{ padding: "60px 24px", textAlign: "center", borderRadius: "20px", background: "#0C0C14", border: "1px solid rgba(255,255,255,.06)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>✦</div>
                <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: "1.1rem", color: "rgba(255,255,255,.6)", marginBottom: "8px" }}>
                  No posts yet
                </h3>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "rgba(255,255,255,.25)" }}>
                  Generate your first post — it will appear here.
                </p>
                <button onClick={() => setTab("generate")}
                  style={{ marginTop: "20px", padding: "10px 24px", borderRadius: "12px", background: "linear-gradient(135deg,#C9A84C,#A07030)", color: "#040404", fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
                  Go Generate →
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,.25)", marginBottom: "4px" }}>
                  SHOWING {user.posts.length} MOST RECENT POSTS
                </p>
                {user.posts.map(post => (
                  <PostCard key={post.id} post={post} copied={copied} onCopy={copy} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ TAB: ACCOUNT ═══════════════════════════════════════════════════ */}
        {tab === "account" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px" }}>

            {/* Profile */}
            <div style={{ padding: "24px", borderRadius: "20px", background: "#0C0C14", border: "1px solid rgba(255,255,255,.07)" }}>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,.3)", letterSpacing: "0.1em", marginBottom: "16px" }}>PROFILE</p>
              {[
                { label: "Name", value: user.name },
                { label: "Email", value: user.email },
                { label: "Member Since", value: formatDate(user.createdAt) },
                { label: "Plan", value: plan.name },
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: "14px" }}>
                  <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "rgba(255,255,255,.25)", letterSpacing: "0.08em", marginBottom: "3px" }}>{label}</p>
                  <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: "1rem", color: "rgba(255,255,255,.8)" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Plan details */}
            <div style={{ padding: "24px", borderRadius: "20px", background: "#0C0C14", border: "1px solid rgba(255,255,255,.07)" }}>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,.3)", letterSpacing: "0.1em", marginBottom: "16px" }}>CURRENT PLAN</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "16px" }}>
                <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: "2.2rem" }} className="shimmer">{plan.price}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "rgba(255,255,255,.3)" }}>{plan.period}</span>
              </div>
              <ul style={{ listStyle: "none", marginBottom: "20px" }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", gap: "8px", fontFamily: "'Crimson Pro',serif", fontSize: "0.95rem", color: "rgba(255,255,255,.65)", marginBottom: "8px" }}>
                    <span style={{ color: plan.color }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              {plan.id === "free" && (
                <a href="https://dodo.pe/relh2gradr9" target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: "12px", background: "linear-gradient(135deg,#C9A84C,#A07030)", color: "#040404", fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
                  🔥 Upgrade — $149 Lifetime
                </a>
              )}
            </div>

            {/* Stats */}
            <div style={{ padding: "24px", borderRadius: "20px", background: "#0C0C14", border: "1px solid rgba(255,255,255,.07)" }}>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,.3)", letterSpacing: "0.1em", marginBottom: "16px" }}>YOUR STATS</p>
              {[
                { label: "Total Posts Generated", value: user.totalPostsUsed.toString() },
                { label: "Posts Today", value: user.dailyPostsUsed.toString() },
                { label: "Posts in History", value: user.posts.length.toString() },
                { label: "Platforms Unlocked", value: plan.platforms === 7 ? "All 7" : `${plan.platforms} of 7` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,.35)" }}>{label}</span>
                  <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: "1rem", color: "#C9A84C" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
