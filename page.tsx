"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { PLANS, PLATFORM_LABELS, getPlan, trialExpired } from "@/lib/plans";

type Platform = "x" | "facebook" | "instagram" | "linkedin";
type PostStatus = "draft" | "published";

interface Post {
  id: string;
  platform: Platform;
  prompt: string;
  content: string;
  status: PostStatus;
  createdAt: string;
}

const PLATFORM_ICONS: Record<Platform, string> = {
  x: "𝕏",
  facebook: "f",
  instagram: "◈",
  linkedin: "in",
};

const PLATFORM_COLORS: Record<Platform, string> = {
  x: "bg-black border-gray-700 text-white",
  facebook: "bg-[#1877f2]/10 border-[#1877f2]/40 text-[#1877f2]",
  instagram: "bg-pink-500/10 border-pink-500/40 text-pink-400",
  linkedin: "bg-[#0a66c2]/10 border-[#0a66c2]/40 text-[#0a66c2]",
};

const PLATFORM_ACTIVE: Record<Platform, string> = {
  x: "ring-2 ring-white bg-gray-900",
  facebook: "ring-2 ring-[#1877f2] bg-[#1877f2]/20",
  instagram: "ring-2 ring-pink-500 bg-pink-500/20",
  linkedin: "ring-2 ring-[#0a66c2] bg-[#0a66c2]/20",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<"generate" | "saved">("generate");

  const [platform, setPlatform] = useState<Platform>("x");
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<Platform | "all">("all");
  const [filterStatus, setFilterStatus] = useState<PostStatus | "all">("all");

  const plan = getPlan(session?.user?.plan ?? "starter");
  const planConfig = PLANS[plan];
  
  const trialEnd = session?.user?.trialEndsAt
    ? new Date(session.user.trialEndsAt)
    : null;
  const trialIsExpired = trialExpired(trialEnd);
  const trialDaysLeft = trialEnd
    ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 86400000))
    : null;

  const lockedPlatforms: Platform[] = (["x", "facebook", "instagram", "linkedin"] as Platform[]).filter(
    (p) => !planConfig.platforms.includes(p)
  );

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    const params = new URLSearchParams();
    if (filterPlatform !== "all") params.set("platform", filterPlatform);
    if (filterStatus !== "all") params.set("status", filterStatus);
    const res = await fetch(`/api/posts?${params}`);
    const data = await res.json();
    setPosts(data.posts ?? []);
    setPostsLoading(false);
  }, [filterPlatform, filterStatus]);

  useEffect(() => {
    if (tab === "saved") fetchPosts();
  }, [tab, fetchPosts]);

  async function handleGenerate() {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    setGenError("");
    setGenerated("");
    setCopied(false);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, platform }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenError(data.error ?? "Generation failed.");
        if (data.limitReached) setRemaining(0);
      } else {
        setGenerated(data.content);
        setRemaining(data.remaining);
      }
    } catch {
      setGenError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!generated || saving) return;
    setSaving(true);
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, prompt, content: generated, status: "draft" }),
    });
    setSaving(false);
    setSaveSuccess(true);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function toggleStatus(post: Post) {
    const newStatus: PostStatus = post.status === "draft" ? "published" : "draft";
    await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p))
    );
  }

  async function deletePost(postId: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* ── Top nav ─────────────────────────────────────────────── */}
      <header className="border-b border-white/5 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-black text-xl tracking-tight">X‑Teos</span>
          <span className="text-[10px] font-bold bg-violet-600/30 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/30">
            PRO
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Plan badge */}
          <span className="hidden sm:inline text-xs px-3 py-1 rounded-full border border-white/10 text-gray-400 capitalize">
            {planConfig.label} plan
          </span>

          {/* Admin link — hidden for launch */}

          <div className="flex items-center gap-2">
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt=""
                className="w-7 h-7 rounded-full border border-white/10"
              />
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ── Trial / upgrade banners ─────────────────────────────── */}
      {trialIsExpired && plan === "starter" && (
        <div className="bg-red-900/30 border-b border-red-700/40 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-red-300">
            Your trial has expired. Upgrade to keep generating.
          </p>
          <UpgradeButton />
        </div>
      )}
      {!trialIsExpired && trialDaysLeft !== null && trialDaysLeft <= 3 && (
        <div className="bg-amber-900/20 border-b border-amber-700/30 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-amber-300">
            Trial ends in{" "}
            <strong>{trialDaysLeft === 0 ? "less than 24 hours" : `${trialDaysLeft} day${trialDaysLeft !== 1 ? "s" : ""}`}</strong>.
          </p>
          <UpgradeButton />
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        {/* ── Tabs ──────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit mb-8">
          {(["generate", "saved"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? "bg-white/10 text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t === "generate" ? "✦ Generate" : "◫ Saved posts"}
            </button>
          ))}
        </div>

        {/* ══════════════ GENERATE TAB ══════════════════════════ */}
        {tab === "generate" && (
          <div className="space-y-6">
            {/* Platform selector */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest mb-3 block">
                Platform
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["x", "facebook", "instagram", "linkedin"] as Platform[]).map(
                  (p) => {
                    const locked = lockedPlatforms.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => !locked && setPlatform(p)}
                        disabled={locked}
                        title={
                          locked
                            ? `Upgrade to ${plan === "starter" ? "Pro" : "Agency"} to unlock`
                            : undefined
                        }
                        className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all text-sm font-medium
                          ${locked ? "opacity-30 cursor-not-allowed border-gray-800 text-gray-600" : "cursor-pointer hover:border-opacity-70"}
                          ${!locked && platform === p ? PLATFORM_ACTIVE[p] : "border-gray-800 bg-white/2"}
                        `}
                      >
                        <span className="text-lg font-black">{PLATFORM_ICONS[p]}</span>
                        <span className="text-xs">{PLATFORM_LABELS[p].split(" ")[0]}</span>
                        {locked && (
                          <span className="absolute top-1.5 right-1.5 text-[9px] bg-amber-900/50 text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-700/30">
                            Pro
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Prompt box */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest mb-3 block">
                Your prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`e.g. "Announce our new AI tool for ${PLATFORM_LABELS[platform]} users"`}
                rows={4}
                maxLength={500}
                className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-violet-500/60 transition-colors"
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-gray-700">
                  {remaining !== null &&
                    `${remaining} generation${remaining !== 1 ? "s" : ""} left today`}
                </span>
                <span className="text-xs text-gray-700">{prompt.length}/500</span>
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim() || (remaining === 0)}
              className="w-full sm:w-auto px-8 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Spinner />
                  Generating…
                </>
              ) : (
                "✦ Generate post"
              )}
            </button>

            {/* Error */}
            {genError && (
              <div className="bg-red-900/20 border border-red-700/40 rounded-xl px-4 py-3 text-sm text-red-300 flex items-start gap-2">
                <span>⚠</span>
                <span>{genError}</span>
                {genError.includes("Upgrade") && (
                  <UpgradeButton className="ml-auto flex-shrink-0" />
                )}
              </div>
            )}

            {/* Generated output */}
            {generated && (
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PLATFORM_COLORS[platform]}`}
                  >
                    {PLATFORM_ICONS[platform]} {PLATFORM_LABELS[platform].split(" ")[0]}
                  </span>
                  <span className="text-xs text-gray-600 ml-auto">
                    {generated.length} chars
                  </span>
                </div>

                <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {generated}
                </p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/8 transition-colors"
                  >
                    {copied ? "✓ Copied!" : "⎘ Copy"}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || saveSuccess}
                    className="flex items-center gap-1.5 text-xs px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/8 transition-colors disabled:opacity-50"
                  >
                    {saveSuccess ? "✓ Saved" : saving ? "Saving…" : "◫ Save post"}
                  </button>
                  {saveSuccess && (
                    <button
                      onClick={() => setTab("saved")}
                      className="text-xs text-violet-400 hover:text-violet-300 underline"
                    >
                      View saved →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ SAVED POSTS TAB ═══════════════════════ */}
        {tab === "saved" && (
          <div className="space-y-5">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="All platforms"
                value="all"
                current={filterPlatform}
                onSelect={(v) => setFilterPlatform(v as Platform | "all")}
              />
              {(["x", "facebook", "instagram", "linkedin"] as Platform[]).map(
                (p) => (
                  <FilterChip
                    key={p}
                    label={`${PLATFORM_ICONS[p]} ${PLATFORM_LABELS[p].split(" ")[0]}`}
                    value={p}
                    current={filterPlatform}
                    onSelect={(v) => setFilterPlatform(v as Platform | "all")}
                  />
                )
              )}
              <div className="w-px bg-white/10 mx-1" />
              <FilterChip
                label="All"
                value="all"
                current={filterStatus}
                onSelect={(v) => setFilterStatus(v as PostStatus | "all")}
              />
              <FilterChip
                label="Draft"
                value="draft"
                current={filterStatus}
                onSelect={(v) => setFilterStatus(v as PostStatus | "all")}
              />
              <FilterChip
                label="Published"
                value="published"
                current={filterStatus}
                onSelect={(v) => setFilterStatus(v as PostStatus | "all")}
              />
            </div>

            {/* Posts */}
            {postsLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-600 text-sm gap-2">
                <Spinner /> Loading posts…
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-sm">No saved posts yet.</p>
                <button
                  onClick={() => setTab("generate")}
                  className="mt-3 text-xs text-violet-400 hover:text-violet-300 underline"
                >
                  Generate your first post →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onToggleStatus={toggleStatus}
                    onDelete={deletePost}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Plan upgrade section (bottom of page for starter) ── */}
        {plan === "starter" && (
          <div className="mt-12 border border-white/6 rounded-2xl p-6 bg-gradient-to-br from-violet-900/10 to-transparent">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white mb-1">Unlock the full platform</h3>
                <p className="text-sm text-gray-500">
                  Facebook, LinkedIn, 50 posts/day, and agency resale licensing.
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <PlanButton plan="pro" label="Go Pro — $99/mo" />
                <PlanButton plan="agency" label="Agency — $299/mo" variant="ghost" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PostCard({
  post,
  onToggleStatus,
  onDelete,
}: {
  post: Post;
  onToggleStatus: (p: Post) => void;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(post.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white/2 border border-white/6 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {PLATFORM_ICONS[post.platform as Platform]}{" "}
          {PLATFORM_LABELS[post.platform as Platform]?.split(" ")[0]}
        </span>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
            post.status === "published"
              ? "bg-green-900/30 border-green-700/40 text-green-400"
              : "bg-gray-800/60 border-gray-700/40 text-gray-500"
          }`}
        >
          {post.status}
        </span>
        <span className="text-[10px] text-gray-700 ml-auto">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap line-clamp-4">
        {post.content}
      </p>

      <div className="flex gap-2 flex-wrap pt-1">
        <button
          onClick={copy}
          className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/8 transition-colors"
        >
          {copied ? "✓ Copied" : "⎘ Copy"}
        </button>
        <button
          onClick={() => onToggleStatus(post)}
          className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/8 transition-colors"
        >
          {post.status === "draft" ? "Mark published" : "Mark draft"}
        </button>
        <button
          onClick={() => onDelete(post.id)}
          className="text-xs px-3 py-1.5 text-red-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg border border-transparent hover:border-red-900/40 transition-colors ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  value,
  current,
  onSelect,
}: {
  label: string;
  value: string;
  current: string;
  onSelect: (v: string) => void;
}) {
  const active = current === value;
  return (
    <button
      onClick={() => onSelect(value)}
      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
        active
          ? "bg-white/10 border-white/20 text-white"
          : "bg-transparent border-white/6 text-gray-500 hover:text-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

function UpgradeButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="/upgrade"
      className={`text-xs bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${className}`}
    >
      Upgrade →
    </a>
  );
}

function PlanButton({
  plan,
  label,
  variant = "primary",
}: {
  plan: string;
  label: string;
  variant?: "primary" | "ghost";
}) {
  function handleUpgrade() {
    const tapUrl = new URL("https://checkout.tap.company/");
    tapUrl.searchParams.set("plan", plan);
    window.open(tapUrl.toString(), "_blank");
  }

  return (
    <button
      onClick={handleUpgrade}
      className={`text-xs px-4 py-2 rounded-lg font-medium transition-colors ${
        variant === "primary"
          ? "bg-violet-600 hover:bg-violet-500 text-white"
          : "border border-white/10 hover:border-white/20 text-gray-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}