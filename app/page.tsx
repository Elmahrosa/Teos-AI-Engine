"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Navigation from "@/components/landing/Navigation";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import StickyCTA from "@/components/StickyCTA";
import ExitPopup from "@/components/ExitPopup";
import { useSeats } from "@/components/useSeats";

// ─── Types ────────────────────────────────────────────────────────────────────
type Platform = "X" | "LinkedIn" | "Facebook" | "Instagram" | "TikTok" | "Threads" | "Telegram";
type Tone =
  | "Professional" | "Engagement" | "Authority" | "Founder Story"
  | "Launch" | "Contrarian" | "Community" | "Viral Hook" | "Educational" | "Sales CTA";

interface GenerateResult {
  post: string;
  hashtags: string[];
  visibilityScore: number;
  bestTime: string;
  checklist: string[];
  suggestedCTA: string;
  platform: Platform;
  platformIcon: string;
  tone: Tone;
  fallback: boolean;
  imagePrompt?: string;
  videoScript?: string;
}

// ─── Ticker ───────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "47+ posts generated this week",
  "84/100 avg visibility score",
  "18+ early users testing",
  "Next upgrade: TikTok + AI video scripts",
  "First 500 users get 1 free month when TikTok ships",
];

// ─── Platform Config ──────────────────────────────────────────────────────────
const PLATFORM_CONFIG: Record<Platform, { icon: string; color: string; bg: string; border: string }> = {
  X:         { icon: "𝕏", color: "#fff",     bg: "rgba(255,255,255,.07)",  border: "rgba(255,255,255,.15)" },
  LinkedIn:  { icon: "in", color: "#5BA4CF",  bg: "rgba(10,102,194,.12)",   border: "rgba(10,102,194,.3)"   },
  Facebook:  { icon: "f",  color: "#1877F2",  bg: "rgba(24,119,242,.1)",    border: "rgba(24,119,242,.3)"   },
  Instagram: { icon: "◎", color: "#E1306C",  bg: "rgba(225,48,108,.1)",    border: "rgba(225,48,108,.3)"   },
  TikTok:    { icon: "♪",  color: "#69C9D0",  bg: "rgba(105,201,208,.1)",   border: "rgba(105,201,208,.3)"  },
  Threads:   { icon: "@",  color: "#aaa",     bg: "rgba(255,255,255,.05)",  border: "rgba(255,255,255,.12)" },
  Telegram:  { icon: "✈",  color: "#2AABEE",  bg: "rgba(42,171,238,.1)",    border: "rgba(42,171,238,.3)"   },
};

const TONES: Tone[] = [
  "Professional", "Engagement", "Authority", "Founder Story",
  "Launch", "Contrarian", "Community", "Viral Hook", "Educational", "Sales CTA",
];

const PLATFORMS: Platform[] = ["X", "LinkedIn", "Facebook", "Instagram", "TikTok", "Threads", "Telegram"];

const LOADING_STEPS = [
  "Generating hook…",
  "Scoring visibility…",
  "Optimizing hashtags…",
  "Finalizing post…",
];

// ─── Pricing ──────────────────────────────────────────────────────────────────
const PRICING_TIERS = [
  {
    name: "Starter",
    price: "Free",
    period: null,
    desc: "Perfect for trying out the engine.",
    features: [
      "5 posts total (one-time test)",
      "X + Instagram only",
      "Basic AI generation",
      "Community support",
    ],
    cta: "Start Free Test",
    href: "/login",
    featured: false,
    color: "border-white/[0.08]",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For individual creators and freelancers.",
    features: [
      "50 posts per day",
      "X, Instagram, LinkedIn, Facebook",
      "Brand voice training",
      "Content scheduling",
      "Email support",
    ],
    cta: "Subscribe $29/mo",
    href: "https://dodo.pe/ljkagv2ixcr",
    featured: true,
    featuredLabel: "Most Popular",
    color: "border-gold-500/50",
  },
  {
    name: "Agency",
    price: "$69",
    period: "/month",
    desc: "For teams and agencies managing multiple brands.",
    features: [
      "200 posts per day",
      "All 7 platforms",
      "Team collaboration (3 seats)",
      "Priority AI generation",
      "Priority support",
    ],
    cta: "Subscribe $69/mo",
    href: "https://dodo.pe/dbvnd9a4pp",
    featured: false,
    color: "border-teal-500/50",
  },
  {
    name: "Lifetime",
    price: "$149",
    period: " one-time",
    desc: "One payment. Forever access. First 100 only.",
    features: [
      "Unlimited posts per day",
      "All 7 platforms",
      "Team collaboration (10 seats)",
      "Priority AI + early features",
      "TikTok + AI video scripts — in next upgrade",
    ],
    cta: "Get Lifetime $149",
    href: "https://dodo.pe/relh2gradr9",
    featured: false,
    color: "border-violet-500/50",
  },
];

// ─── Roadmap ──────────────────────────────────────────────────────────────────
const ROADMAP_ITEMS = [
  { feature: "TikTok post generation", status: "In development", color: "#f59e0b" },
  { feature: "AI video scripts", status: "In development", color: "#f59e0b" },
  { feature: "Content scheduling", status: "Planned", color: "#8a88a0" },
  { feature: "Team workspaces", status: "Planned", color: "#8a88a0" },
];

// ─── Share URL ────────────────────────────────────────────────────────────────
function buildShareUrl(platform: string, text: string): string {
  const url = "https://teos-ai-engine.vercel.app";
  const encoded = encodeURIComponent(text.slice(0, 280));
  const encodedUrl = encodeURIComponent(url);
  switch (platform) {
    case "X": return `https://twitter.com/intent/tweet?text=${encoded}&url=${encodedUrl}`;
    case "LinkedIn": return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "Facebook": return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "Telegram": return `https://t.me/share/url?url=${encodedUrl}&text=${encoded}`;
    case "WhatsApp": return `https://api.whatsapp.com/send?text=${encoded}%20${encodedUrl}`;
    case "Threads": return `https://www.threads.net/intent/post?text=${encoded}`;
    default: return "#";
  }
}

function scoreColor(n: number): string {
  if (n >= 85) return "#C9A84C";
  if (n >= 70) return "#9B6FDF";
  return "#888";
}

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);
  return { copied, copy };
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ end, suffix = "", label, sub, color = "#C9A84C" }: { end: number; suffix?: string; label: string; sub?: string; color?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const duration = 1500;
          const step = 16;
          const totalSteps = duration / step;
          const increment = end / totalSteps;
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold" style={{ color, fontFamily: "'Syne',sans-serif" }}>
        {count}{suffix}
      </div>
      <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,.55)" }}>
        {label}
      </div>
      {sub && <div className="text-xs" style={{ color: "rgba(255,255,255,.25)" }}>{sub}</div>}
    </div>
  );
}

// ─── SeatsBar (Urgency Meter) ─────────────────────────────────────────────────
function SeatsBar({ used, total, label }: { used: number; total: number; label: string }) {
  const pct = Math.round((used / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1" style={{ color: "rgba(255,255,255,.4)" }}>
        <span>{label}</span>
        <span>{used}/{total} claimed</span>
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: "6px", background: "rgba(255,255,255,.06)" }}>
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg,#7B4FBF,#C9A84C)" }} />
      </div>
    </div>
  );
}

// ─── Ticker Bar ───────────────────────────────────────────────────────────────
function TickerBar() {
  return (
    <div className="relative overflow-hidden border-b" style={{ background: "#050505", borderColor: "rgba(201,168,76,.08)", height: "36px" }}>
      <div className="absolute inset-0 flex items-center">
        <div className="flex gap-12 whitespace-nowrap animate-ticker" style={{ willChange: "transform" }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-xs" style={{ color: "rgba(255,255,255,.3)", letterSpacing: "0.06em" }}>
              <span style={{ color: "#C9A84C" }}>✦</span> {item}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .animate-ticker{animation:ticker 40s linear infinite}
      `}</style>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  // Post Generator state
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("LinkedIn");
  const [tone, setTone] = useState<Tone>("Engagement");
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"post" | "image" | "video">("post");
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const { copied, copy } = useCopy();

  // Pricing tab state
  const [pricingTab, setPricingTab] = useState<"monthly" | "lifetime">("monthly");
  const seats = useSeats();

  async function generate() {
    if (!topic.trim() || topic.length < 5) {
      setError("Enter a topic of at least 5 characters.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);
    setLoadStep(0);
    setShowImagePrompt(false);
    setActiveTab("post");

    const stepInterval = setInterval(() => {
      setLoadStep(s => (s < LOADING_STEPS.length - 1 ? s + 1 : s));
    }, 500);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  }

  const cfg = PLATFORM_CONFIG[platform];
  const resultCfg = result ? PLATFORM_CONFIG[result.platform] : cfg;

  return (
    <main className="min-h-screen bg-bg text-[#e8e6f0]">
      <Navigation />
      <TickerBar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="hero-glow bg-gold-500/20 -top-40 -right-40" />
        <div className="hero-glow bg-violet-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 grid-bg opacity-40" />

        <div className="section-container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/5 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-gold-500 animate-pulse-soft" />
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-500">
                Built in Alexandria, Egypt
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.1] mb-6">
              Egypt&apos;s{" "}
              <span className="gradient-gold">Sovereign AI</span>{" "}
              Content Engine
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-[#8a88a0] leading-relaxed">
              Generate on-brand social content across X, LinkedIn, Instagram &amp; more.
              Powered by Egyptian sovereign infrastructure. No data leaves Egypt.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/login" className="btn-teal text-base px-8 py-4">
                Get Started Free
              </a>
              <a href="#demo" className="btn-ghost text-base px-8 py-4">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Try Live Demo
              </a>
            </div>

            {/* Animated Counters */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
              <AnimatedCounter end={47} suffix="+" label="Posts Generated" sub="This week" />
              <AnimatedCounter end={84} suffix="/100" label="Avg Visibility Score" sub="Across all posts" color="#9B6FDF" />
              <AnimatedCounter end={18} suffix="+" label="Early Users" sub="Testing now" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof ─────────────────────────────────────────────────── */}
      <section className="section-padding pt-0">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#8a88a0] mb-4">
              Supported Platforms
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {(["X", "LinkedIn", "Instagram", "Facebook", "TikTok", "Threads", "Telegram"] as const).map(p => {
                const c = PLATFORM_CONFIG[p];
                return (
                  <div key={p} className="flex items-center gap-2 text-[#8a88a0] hover:text-[#e8e6f0] transition-colors">
                    <span className="text-xl font-bold" style={{ color: c.color }}>{c.icon}</span>
                    <span className="text-sm hidden sm:inline">{p}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {["Egyptian Sovereign", "GDPR Compliant", "Dodo Payments", "SSL Encrypted", "24/7 Support"].map(badge => (
              <span key={badge}
                className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-[#8a88a0]">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Post Generator ───────────────────────────────────────────────── */}
      <section id="demo" className="section-padding relative overflow-hidden">
        <div className="hero-glow bg-teal-500/10 bottom-0 right-0" />
        <div className="section-container relative z-10">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <span className="section-label">Live Demo</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Generate a Post{" "}
              <span className="gradient-teal">Right Now</span>
            </h2>
            <p className="text-[#8a88a0] text-lg">
              Select platform + tone, enter your topic, and watch AI generate optimized content instantly.
            </p>
          </div>

          <div className="w-full max-w-3xl mx-auto" style={{ fontFamily: "'Inter','Syne',sans-serif" }}>
            {/* Platform Selector */}
            <div className="mb-4">
              <div className="text-xs mb-2.5" style={{ color: "rgba(255,255,255,.35)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Platform
              </div>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => {
                  const c = PLATFORM_CONFIG[p];
                  const active = platform === p;
                  return (
                    <button key={p} onClick={() => setPlatform(p)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                      style={{
                        background: active ? c.bg : "rgba(255,255,255,.04)",
                        border: `1px solid ${active ? c.border : "rgba(255,255,255,.07)"}`,
                        color: active ? c.color : "rgba(255,255,255,.4)",
                        transform: active ? "translateY(-1px)" : "none",
                        boxShadow: active ? `0 4px 16px ${c.bg}` : "none",
                      }}>
                      <span style={{ fontFamily: "monospace", fontSize: "1rem" }}>{c.icon}</span>
                      <span>{p}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone Selector */}
            <div className="mb-5">
              <div className="text-xs mb-2.5" style={{ color: "rgba(255,255,255,.35)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Tone
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map(t => (
                  <button key={t} onClick={() => setTone(t)}
                    className="px-3 py-1.5 rounded-lg text-xs transition-all duration-150"
                    style={{
                      background: tone === t ? "rgba(123,79,191,.2)" : "rgba(255,255,255,.04)",
                      border: `1px solid ${tone === t ? "rgba(123,79,191,.4)" : "rgba(255,255,255,.07)"}`,
                      color: tone === t ? "#9B6FDF" : "rgba(255,255,255,.4)",
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div className="mb-4">
              <div className="text-xs mb-2.5" style={{ color: "rgba(255,255,255,.35)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Your Content Idea
              </div>
              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate(); }}
                placeholder={`e.g. "Why most founders fail at content marketing — and what I did instead"`}
                rows={3}
                style={{
                  width: "100%",
                  background: "#111",
                  border: "1px solid rgba(201,168,76,.15)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  color: "rgba(255,255,255,.85)",
                  fontSize: "0.875rem",
                  fontFamily: "'JetBrains Mono',monospace",
                  resize: "none",
                  lineHeight: 1.6,
                }}
              />
              <div className="flex justify-between items-center mt-1.5">
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,.2)" }}>
                  Cmd+Enter to generate
                </span>
                <span style={{ fontSize: "0.7rem", color: topic.length > 5 ? "rgba(201,168,76,.5)" : "rgba(255,255,255,.15)" }}>
                  {topic.length} chars
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(255,80,80,.08)", border: "1px solid rgba(255,80,80,.2)", color: "#ff9999" }}>
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generate}
              disabled={loading || topic.length < 5}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "14px",
                border: "none",
                background: loading || topic.length < 5
                  ? "rgba(255,255,255,.06)"
                  : "linear-gradient(135deg,#C9A84C,#A07030)",
                color: loading || topic.length < 5 ? "rgba(255,255,255,.3)" : "#050505",
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                cursor: loading || topic.length < 5 ? "not-allowed" : "pointer",
                transition: "all .2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "24px",
              }}>
              {loading ? (
                <>
                  <span className="animate-spin" style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#C9A84C", display: "inline-block" }} />
                  {LOADING_STEPS[loadStep]}
                </>
              ) : result ? (
                <><span>↺</span> Regenerate</>
              ) : (
                <><span>{cfg.icon}</span> Generate {platform} Post</>
              )}
            </button>

            {/* ── Result ──────────────────────────────────────────────── */}
            {result && !loading && (
              <div className="space-y-4" style={{ animation: "fadeUp .5s ease both" }}>
                <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

                {result.fallback && (
                  <div className="px-3 py-2 rounded-lg text-xs flex items-center gap-2"
                    style={{ background: "rgba(255,165,0,.08)", border: "1px solid rgba(255,165,0,.2)", color: "#ffaa44" }}>
                    <span>⚠</span> Template mode — AI API unavailable. Content generated from optimized templates.
                  </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-2">
                  {(["post", ...(result.platform === "TikTok" ? ["video"] : []), "image"] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab as "post" | "image" | "video")}
                      className="px-4 py-2 rounded-lg text-xs"
                      style={{
                        background: activeTab === tab ? "rgba(201,168,76,.12)" : "rgba(255,255,255,.04)",
                        border: `1px solid ${activeTab === tab ? "rgba(201,168,76,.35)" : "rgba(255,255,255,.07)"}`,
                        color: activeTab === tab ? "#C9A84C" : "rgba(255,255,255,.4)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase" as const,
                      }}>
                      {tab === "post" ? `${resultCfg.icon} Post` : tab === "video" ? "🎬 Video Script" : "🎨 Image Prompt"}
                    </button>
                  ))}
                </div>

                {/* Post Tab */}
                {activeTab === "post" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl"
                      style={{ background: resultCfg.bg, border: `1px solid ${resultCfg.border}` }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: "monospace", fontSize: "1.1rem", color: resultCfg.color }}>{resultCfg.icon}</span>
                        <span className="text-xs" style={{ color: resultCfg.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          {result.platform} · {result.tone}
                        </span>
                      </div>
                      {result.fallback && (
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(255,165,0,.1)", color: "#ffaa44" }}>Template</span>
                      )}
                    </div>

                    <div className="relative rounded-2xl p-5" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,.07)" }}>
                      <pre style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: "0.85rem",
                        lineHeight: 1.75,
                        color: "rgba(255,255,255,.82)",
                        margin: 0,
                      }}>
                        {result.post}
                      </pre>
                    </div>

                    <div>
                      <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Hashtags
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.hashtags.map(h => (
                          <span key={h} className="text-xs px-2.5 py-1 rounded-full"
                            style={{ background: "rgba(123,79,191,.12)", border: "1px solid rgba(123,79,191,.25)", color: "#9B6FDF" }}>
                            #{h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Score Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl p-4" style={{ background: "#0D0D0D", border: "1px solid rgba(201,168,76,.12)" }}>
                        <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          Visibility Score
                        </div>
                        <div className="flex items-end gap-1.5 mb-2">
                          <span className="gradient-gold" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "2.4rem", lineHeight: 1 }}>
                            {result.visibilityScore}
                          </span>
                          <span style={{ color: "rgba(255,255,255,.25)", marginBottom: "4px" }}>/100</span>
                        </div>
                        <div className="rounded-full overflow-hidden" style={{ height: "5px", background: "rgba(255,255,255,.06)" }}>
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${result.visibilityScore}%`,
                              background: `linear-gradient(90deg,#7B4FBF,${scoreColor(result.visibilityScore)})`,
                            }} />
                        </div>
                        <div className="text-xs mt-2" style={{ color: "rgba(255,255,255,.3)" }}>
                          {result.visibilityScore >= 85 ? "Exceptional · Top 15% reach" :
                            result.visibilityScore >= 70 ? "Strong · Above average" : "Moderate · Improve hook"}
                        </div>
                      </div>

                      <div className="rounded-xl p-4" style={{ background: "#0D0D0D", border: "1px solid rgba(123,79,191,.12)" }}>
                        <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          Best Time to Post
                        </div>
                        <div className="text-base font-bold" style={{ color: "#9B6FDF", fontFamily: "'Syne',sans-serif" }}>
                          {result.bestTime}
                        </div>
                        <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,.3)" }}>
                          {result.platform} peak window
                        </div>
                      </div>
                    </div>

                    {/* CTA Suggestion */}
                    <div className="rounded-xl p-4" style={{ background: "#0D0D0D", border: "1px solid rgba(201,168,76,.1)" }}>
                      <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Suggested CTA
                      </div>
                      <p className="text-sm" style={{ color: "rgba(255,255,255,.7)" }}>
                        &ldquo;{result.suggestedCTA}&rdquo;
                      </p>
                      <button onClick={() => copy(result.suggestedCTA)}
                        className="mt-2 text-xs px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.2)", color: "#C9A84C" }}>
                        {copied ? "✓ Copied" : "Copy CTA"}
                      </button>
                    </div>

                    {/* Checklist */}
                    <div className="rounded-xl p-4" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,.05)" }}>
                      <div className="text-xs mb-3" style={{ color: "rgba(255,255,255,.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Post Checklist
                      </div>
                      <div className="space-y-1.5">
                        {result.checklist.map((item, i) => (
                          <div key={i} className="text-xs flex items-center gap-2"
                            style={{ color: item.startsWith("✓") ? "rgba(255,255,255,.65)" : "rgba(255,200,50,.7)" }}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Share Row */}
                    <div className="rounded-xl p-4" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,.05)" }}>
                      <div className="text-xs mb-3" style={{ color: "rgba(255,255,255,.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Share Instantly
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(["X", "LinkedIn", "Facebook", "Telegram", "WhatsApp", "Threads"] as const).map(p => {
                          const c = PLATFORM_CONFIG[p as Platform] || { icon: "↗", color: "#aaa", bg: "rgba(255,255,255,.05)", border: "rgba(255,255,255,.1)" };
                          const shareUrl = buildShareUrl(p, result.post + "\n\n" + result.hashtags.map(h => `#${h}`).join(" "));
                          return (
                            <a key={p} href={shareUrl} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all hover:opacity-80"
                              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
                              <span style={{ fontFamily: "monospace" }}>{c.icon}</span> {p}
                            </a>
                          );
                        })}
                        <button onClick={() => copy(result.post + "\n\n" + result.hashtags.map(h => `#${h}`).join(" "))}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all hover:opacity-80"
                          style={{ background: "rgba(225,48,108,.1)", border: "1px solid rgba(225,48,108,.25)", color: "#E1306C" }}>
                          ◎ Instagram
                        </button>
                        <button onClick={() => copy(result.post.slice(0, 150) + " " + result.hashtags.map(h => `#${h}`).join(" "))}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all hover:opacity-80"
                          style={{ background: "rgba(105,201,208,.1)", border: "1px solid rgba(105,201,208,.25)", color: "#69C9D0" }}>
                          ♪ TikTok
                        </button>
                        <button onClick={() => copy(result.post + "\n\n" + result.hashtags.map(h => `#${h}`).join(" ") + "\n\n" + result.suggestedCTA)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all"
                          style={{
                            background: copied ? "rgba(201,168,76,.15)" : "rgba(201,168,76,.07)",
                            border: `1px solid ${copied ? "rgba(201,168,76,.4)" : "rgba(201,168,76,.2)"}`,
                            color: "#C9A84C",
                          }}>
                          {copied ? "✓ Copied!" : "⎘ Copy All"}
                        </button>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "↺ Regenerate", action: generate },
                        { label: "⚡ Improve Hook", action: () => { setTone("Viral Hook"); generate(); } },
                        { label: "🎨 Image Prompt", action: () => setActiveTab("image") },
                        ...(result.platform === "TikTok" ? [{ label: "🎬 Video Script", action: () => setActiveTab("video") }] : []),
                      ].map(({ label, action }) => (
                        <button key={label} onClick={action}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs transition-all hover:opacity-80"
                          style={{
                            background: label.includes("Image") ? "rgba(201,168,76,.1)" : "rgba(255,255,255,.04)",
                            border: `1px solid ${label.includes("Image") ? "rgba(201,168,76,.25)" : "rgba(255,255,255,.08)"}`,
                            color: label.includes("Image") ? "#C9A84C" : "rgba(255,255,255,.45)",
                          }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Prompt Tab */}
                {activeTab === "image" && result.imagePrompt && (
                  <div className="space-y-4" style={{ animation: "fadeUp .5s ease both" }}>
                    <div className="rounded-2xl p-5" style={{ background: "#0D0D0D", border: "1px solid rgba(201,168,76,.15)" }}>
                      <div className="text-xs mb-3" style={{ color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        🎨 AI Image Prompt — {result.platform}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,.75)", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.8rem" }}>
                        {result.imagePrompt}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => copy(result.imagePrompt || "")}
                          className="text-xs px-4 py-2 rounded-lg"
                          style={{ background: "rgba(201,168,76,.12)", border: "1px solid rgba(201,168,76,.3)", color: "#C9A84C" }}>
                          {copied ? "✓ Copied" : "⎘ Copy Prompt"}
                        </button>
                        <a href="https://www.midjourney.com" target="_blank" rel="noopener noreferrer"
                          className="text-xs px-4 py-2 rounded-lg"
                          style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: "rgba(255,255,255,.45)" }}>
                          Use in Midjourney ↗
                        </a>
                        <a href="https://labs.openai.com" target="_blank" rel="noopener noreferrer"
                          className="text-xs px-4 py-2 rounded-lg"
                          style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: "rgba(255,255,255,.45)" }}>
                          Use in DALL-E ↗
                        </a>
                      </div>
                    </div>
                    <div className="rounded-xl p-4 text-center text-xs"
                      style={{ background: "rgba(123,79,191,.06)", border: "1px solid rgba(123,79,191,.2)", color: "rgba(255,255,255,.35)" }}>
                      Native image generation ships in the next TEOS upgrade — lifetime users get it free.{" "}
                      <Link href="#pricing" style={{ color: "#9B6FDF" }}>Claim lifetime →</Link>
                    </div>
                  </div>
                )}

                {/* Video Script Tab */}
                {activeTab === "video" && result.videoScript && (
                  <div className="space-y-4" style={{ animation: "fadeUp .5s ease both" }}>
                    <div className="rounded-2xl p-5" style={{ background: "#0D0D0D", border: "1px solid rgba(105,201,208,.2)" }}>
                      <div className="text-xs mb-3" style={{ color: "#69C9D0", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        🎬 TikTok Video Script
                      </div>
                      <pre style={{
                        whiteSpace: "pre-wrap",
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: "0.8rem",
                        lineHeight: 1.8,
                        color: "rgba(255,255,255,.75)",
                        margin: 0,
                      }}>
                        {result.videoScript}
                      </pre>
                      <button onClick={() => copy(result.videoScript || "")}
                        className="mt-4 text-xs px-4 py-2 rounded-lg"
                        style={{ background: "rgba(105,201,208,.1)", border: "1px solid rgba(105,201,208,.25)", color: "#69C9D0" }}>
                        {copied ? "✓ Copied" : "⎘ Copy Script"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom CTA */}
            <div className="text-center pt-6">
              <Link href="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-widest"
                style={{
                  background: "linear-gradient(135deg,#C9A84C,#A07030)",
                  color: "#050505",
                  textDecoration: "none",
                }}>
                ✦ Get Unlimited Posts Free
              </Link>
              <p className="mt-2 text-xs" style={{ color: "rgba(255,255,255,.2)" }}>No card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <Features />

      {/* ── Video Demo Section (Fix 1 & 3) ───────────────────────────────── */}
      <section id="video-demo" className="section-padding relative overflow-hidden">
        <div className="hero-glow bg-gold-500/10 top-0 right-0" />
        <div className="section-container relative z-10">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <span className="section-label">Watch</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                See Teos AI in{" "}
                <span className="gradient-gold">Action</span>
              </h2>
              <p className="text-[#8a88a0] text-lg">
                Founder preview — watch how Teos generates platform-optimized content in seconds.
              </p>
            </div>

            {/* Founder Preview Panel */}
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(201,168,76,.2)", background: "linear-gradient(135deg,#0D0D0D,#111)" }}>
              <div className="p-8 md:p-12 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6"
                  style={{ background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.2)", color: "#C9A84C" }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse-soft" />
                  Founder Preview
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>
                  Full Demo Recording Coming Soon
                </h3>
                <p className="text-[#8a88a0] mb-8 max-w-lg mx-auto">
                  I&apos;m recording a full walkthrough of the Teos AI Engine. Follow for the drop, or try the live generator above.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="https://x.com/king_teos" target="_blank" rel="noopener noreferrer"
                    className="btn-primary text-sm px-6 py-3">
                    Follow @KING_TEOS for Drop
                  </a>
                  <a href="#demo"
                    className="btn-ghost text-sm px-6 py-3">
                    Try It Live Instead →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing (with SeatsBar urgency) ───────────────────────────────── */}
      <section id="pricing" className="section-padding relative overflow-hidden">
        <div className="hero-glow bg-gold-500/10 -bottom-40 left-1/2 -translate-x-1/2" />

        {/* Trust Strip (Fix 4) */}
        <div className="section-container relative z-10 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs"
            style={{ color: "rgba(255,255,255,.4)" }}>
            <span>🇪🇬 Built in Alexandria</span>
            <span className="hidden sm:inline" style={{ color: "rgba(255,255,255,.15)" }}>·</span>
            <span>🦅 Founder-led SaaS</span>
            <span className="hidden sm:inline" style={{ color: "rgba(255,255,255,.15)" }}>·</span>
            <span>π Pi-enabled launch</span>
            <span className="hidden sm:inline" style={{ color: "rgba(255,255,255,.15)" }}>·</span>
            <span>🟢 Early users live now</span>
          </div>
        </div>

        <div className="section-container relative z-10">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <span className="section-label">Pricing</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Simple, Transparent
              <br />
              <span className="gradient-gold">Egyptian Pricing</span>
            </h2>
            <p className="text-[#8a88a0] text-lg">
              Pay with card, crypto, or Pi Network. No hidden fees. Cancel anytime.
            </p>

            {/* Pricing Tabs */}
            <div className="inline-flex items-center gap-2 mt-6 p-1 rounded-xl"
              style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)" }}>
              <button onClick={() => setPricingTab("monthly")}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: pricingTab === "monthly" ? "rgba(201,168,76,.15)" : "transparent",
                  color: pricingTab === "monthly" ? "#C9A84C" : "rgba(255,255,255,.4)",
                }}>
                Monthly
              </button>
              <button onClick={() => setPricingTab("lifetime")}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: pricingTab === "lifetime" ? "rgba(123,79,191,.2)" : "transparent",
                  color: pricingTab === "lifetime" ? "#9B6FDF" : "rgba(255,255,255,.4)",
                }}>
                Lifetime
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {PRICING_TIERS.filter(t => pricingTab === "lifetime" ? t.name === "Lifetime" : t.name !== "Lifetime").map(tier => (
              <div key={tier.name}
                className={`card-hover relative flex flex-col rounded-2xl border bg-bg-card p-6 ${tier.color} ${
                  tier.featured ? "scale-105 md:scale-105 shadow-2xl shadow-gold-500/10" : ""
                }`}>
                {tier.featuredLabel && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-500 to-gold-700 px-4 py-1 text-xs font-bold text-bg whitespace-nowrap">
                    {tier.featuredLabel}
                  </div>
                )}

                <h3 className="text-lg font-bold mb-1 mt-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-sm text-[#8a88a0]">{tier.period}</span>
                  )}
                </div>
                <p className="text-sm text-[#8a88a0] mb-6">{tier.desc}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#e8e6f0]">
                      <svg className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* SeatsBar urgency */}
                {tier.name === "Lifetime" && (
                  <div className="mb-6">
                    <SeatsBar used={seats.taken} total={seats.total} label="Lifetime seats" />
                  </div>
                )}

                <a href={tier.href}
                  target={tier.href.startsWith("http") ? "_blank" : undefined}
                  rel={tier.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={tier.featured ? "btn-teal text-center text-sm py-3" : "btn-ghost text-center text-sm py-3"}>
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-[#8a88a0] mt-8">
            All prices in USD. Pi Network payments accepted. Subscriptions can be cancelled anytime.
          </p>
        </div>
      </section>

      {/* ── Pi Launch Section ────────────────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden">
        <div className="hero-glow bg-violet-500/15 top-0 left-0" />
        <div className="section-container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="section-label">Pi Network</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Pay with{" "}
              <span className="gradient-violet">Pi</span>
            </h2>
            <p className="text-[#8a88a0] text-lg mb-8 max-w-2xl mx-auto">
              Teos AI Engine is the first AI content platform on Pi Network.
              Subscribe with Pi at launch — no fiat required.
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl"
              style={{ background: "rgba(123,79,191,.08)", border: "1px solid rgba(123,79,191,.2)" }}>
              <span className="text-3xl" style={{ fontFamily: "monospace" }}>π</span>
              <div className="text-left">
                <div className="text-sm font-semibold" style={{ color: "#9B6FDF" }}>Pi payments coming at launch</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,.35)" }}>Get lifetime at the Pi Pioneer rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Roadmap Block (Fix 3) ────────────────────────────────────────── */}
      <section id="roadmap" className="section-padding relative overflow-hidden">
        <div className="hero-glow bg-teal-500/10 bottom-0 right-0" />
        <div className="section-container relative z-10">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <span className="section-label">Roadmap</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                What&apos;s{" "}
                <span className="gradient-gold">Next</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Left: Pitch */}
              <div className="rounded-2xl p-8" style={{ background: "linear-gradient(135deg,rgba(201,168,76,.05),transparent)", border: "1px solid rgba(201,168,76,.15)" }}>
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Syne',sans-serif" }}>
                  You&apos;re Buying Into the Roadmap
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,.6)" }}>
                  Teos AI Engine is evolving fast. Every week brings new capabilities.
                  When you subscribe today, you lock in the current price and get every
                  future upgrade — including TikTok generation, AI video scripts,
                  scheduling, and team workspaces — at no extra cost.
                </p>
                <div className="mt-6 p-4 rounded-xl text-sm" style={{ background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.15)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse-soft" />
                    <span className="font-semibold text-gold-500 text-xs uppercase tracking-wider">Live now</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,.65)" }}>
                    First 500 users get <strong style={{ color: "#C9A84C" }}>1 free month</strong> when TikTok ships.
                  </p>
                </div>
                <a href="#pricing" className="btn-primary text-sm px-6 py-3 mt-6 inline-flex">
                  Lock In Current Pricing →
                </a>
              </div>

              {/* Right: Status Board */}
              <div className="space-y-3">
                {ROADMAP_ITEMS.map(item => (
                  <div key={item.feature}
                    className="flex items-center justify-between rounded-xl p-4"
                    style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,.06)" }}>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,.7)" }}>{item.feature}</span>
                    <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
                      style={{
                        background: `${item.color}15`,
                        border: `1px solid ${item.color}30`,
                        color: item.color,
                      }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: item.color }} />
                      {item.status}
                    </span>
                  </div>
                ))}
                <div className="rounded-xl p-4 text-center text-xs"
                  style={{ background: "rgba(255,255,255,.02)", border: "1px dashed rgba(255,255,255,.08)", color: "rgba(255,255,255,.25)" }}>
                  More features announced monthly
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <Testimonials />

      {/* ── Trust Strip ──────────────────────────────────────────────────── */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,transparent,rgba(201,168,76,.03),transparent)" }} />
        <div className="section-container relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-xs"
            style={{ color: "rgba(255,255,255,.3)" }}>
            <span className="flex items-center gap-2">
              <span className="text-gold-500">🇪🇬</span> Built in Alexandria
            </span>
            <span className="flex items-center gap-2">
              <span className="text-gold-500">🦅</span> Founder-led SaaS
            </span>
            <span className="flex items-center gap-2">
              <span className="text-gold-500">π</span> Pi-enabled launch
            </span>
            <span className="flex items-center gap-2">
              <span className="text-gold-500">🟢</span> Early users live now
            </span>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
        <div className="hero-glow bg-gold-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="section-container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="section-label">Get Started</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Ready to Transform Your{" "}
              <span className="gradient-gold">Content Strategy?</span>
            </h2>
            <p className="text-[#8a88a0] text-lg mb-10 max-w-2xl mx-auto">
              Join Egypt&apos;s AI content revolution. Start free, no credit card required.
              Upgrade when you&apos;re ready to scale.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/login" className="btn-teal text-base px-10 py-4">
                Get Started Free
              </a>
              <a href="https://x.com/king_teos" target="_blank" rel="noopener noreferrer"
                className="btn-ghost text-base px-10 py-4">
                Follow @KING_TEOS
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#5a5870]">
              <span>✦ No credit card required</span>
              <span>✦ Cancel anytime</span>
              <span>✦ Egyptian sovereign infrastructure</span>
              <span>✦ 24/7 support</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ + Footer ─────────────────────────────────────────────────── */}
      <FAQ />
      <Footer />
      <StickyCTA seatsTaken={seats.taken} seatsTotal={seats.total} />
      <ExitPopup seatsTaken={seats.taken} seatsTotal={seats.total} />
    </main>
  );
}
