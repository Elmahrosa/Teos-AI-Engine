"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = Math.ceil(end / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(start);
        }, 16);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Seats Bar ───────────────────────────────────────────────────────────────
function SeatsBar({ taken, total }: { taken: number; total: number }) {
  const pct = Math.round((taken / total) * 100);
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs mb-1.5" style={{ color: "#C9A84C" }}>
        <span>{taken} claimed</span><span>{total - taken} seats left</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg,#7B4FBF,#C9A84C)" }} />
      </div>
    </div>
  );
}

// ─── Rotating Ticker ─────────────────────────────────────────────────────────
function Ticker() {
  const msgs = [
    { icon: "🔥", text: "First 50 Lifetime Seats Open — Claim Yours Now" },
    { icon: "π", text: "Pi Users Get 50% Launch Discount — Pioneer Offer Active" },
    { icon: "🦅", text: "Follow @KING_TEOS for Launch Updates & AI Drops" },
    { icon: "💬", text: "Join Telegram #ElmahrosaPi — Exclusive Pioneer Community" },
  ];
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i + 1) % msgs.length); setVis(true); }, 380);
    }, 3600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center gap-2 py-1.5"
      style={{ background: "linear-gradient(90deg,#3D1F80,#7B4FBF,#3D1F80)", fontFamily: "'Syne',sans-serif" }}>
      <div className="flex items-center gap-2 text-xs tracking-wide transition-all duration-300"
        style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(-5px)" }}>
        <span>{msgs[idx].icon}</span>
        <span style={{ color: "rgba(255,255,255,0.92)" }}>{msgs[idx].text}</span>
      </div>
    </div>
  );
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const XI = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const TGI = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 14.198l-2.95-.924c-.641-.204-.654-.641.136-.953l11.527-4.443c.537-.194 1.006.131.679.37z"/>
  </svg>
);
const LII = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const FBI = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const IGI = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);
const TKI = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z"/>
  </svg>
);
const WAI = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);
const THI = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.593 1.566C7.298 1.566 3 5.44 3 10.178c0 3.52 2.222 6.566 5.423 8.057L7.35 22.434l4.328-2.5c.296.04.598.062.905.062 5.295 0 9.593-3.874 9.593-8.612 0-4.738-4.298-8.818-9.583-8.818zm1.02 11.606-2.457-2.615-4.8 2.615 5.28-5.596 2.518 2.617 4.738-2.617-5.278 5.596z"/>
  </svg>
);

// ─── Share Intent Builder ─────────────────────────────────────────────────────
function buildShareUrl(platform: string, text: string): string {
  const encoded = encodeURIComponent(text.slice(0, 280));
  const url = encodeURIComponent("https://teos-ai-engine.vercel.app");
  switch (platform) {
    case "x": return `https://twitter.com/intent/tweet?text=${encoded}&url=${url}`;
    case "linkedin": return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    case "facebook": return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case "telegram": return `https://t.me/share/url?url=${url}&text=${encoded}`;
    case "whatsapp": return `https://api.whatsapp.com/send?text=${encoded}%20${url}`;
    case "threads": return `https://www.threads.net/intent/post?text=${encoded}`;
    default: return "#";
  }
}

// ─── Copy to Clipboard ────────────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState(false);
  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return { copied, copy };
}

// ─── Pricing data ─────────────────────────────────────────────────────────────
const MONTHLY_PLANS = [
  {
    name: "Starter", price: "$0", period: "Free forever", sub: "No credit card required",
    color: "rgba(255,255,255,.35)", accent: "#C9A84C",
    features: ["5 posts per month", "1 platform", "Basic visibility score", "No credit card"],
    cta: "Start Free", href: "/signup", external: false, style: "ghost",
  },
  {
    name: "Pro Monthly", price: "$29", period: "/month", sub: "Cancel anytime",
    badge: "Most Popular", color: "#9B6FDF", accent: "#C9A84C",
    features: ["Unlimited posts", "All 7 platforms", "Full visibility scoring", "CTA suggestions", "Priority generation"],
    cta: "Get Pro Monthly", href: "https://dodo.pe/ljkagv2ixcr", external: true, style: "pop",
  },
  {
    name: "Agency Monthly", price: "$69", period: "/month", sub: "For teams & agencies",
    color: "rgba(255,255,255,.35)", accent: "#9B6FDF",
    features: ["Everything in Pro", "5 team seats", "Multi-brand workspace", "Batch generation", "Analytics dashboard", "Priority support"],
    cta: "Get Agency Monthly", href: "https://dodo.pe/dbvnd9a4pp", external: true, style: "ghost",
  },
];

const YEARLY_PLANS = [
  {
    name: "Pro Yearly", price: "$290", period: "/year", sub: "Save $58 vs monthly",
    color: "#9B6FDF", accent: "#C9A84C",
    features: ["Everything in Pro Monthly", "2 months free", "All 7 platforms", "Full visibility scoring", "CTA suggestions"],
    cta: "Get Pro Yearly", href: "https://dodo.pe/ep9cgmojbua", external: true, style: "ghost",
  },
  {
    name: "Agency Yearly", price: "$690", period: "/year", sub: "Save $138 vs monthly",
    color: "rgba(255,255,255,.35)", accent: "#9B6FDF",
    features: ["Everything in Agency Monthly", "2 months free", "5 team seats", "Multi-brand workspace", "Batch generation"],
    cta: "Get Agency Yearly", href: "https://dodo.pe/79q4irl1347", external: true, style: "ghost",
  },
];

const LIFETIME_PLANS = [
  {
    name: "Pro Lifetime", price: "$149", orig: "$348/yr value", taken: 37, total: 50,
    color: "#C9A84C", badge: "🔥 Most Popular",
    badgeBg: "linear-gradient(90deg,#C9A84C,#A07030)", badgeColor: "#050505",
    features: [
      "Everything in Pro — forever",
      "All future upgrades included",
      "TikTok + AI video scripts — next upgrade",
      "Image generation — next upgrade",
      "Priority support forever",
      "Pi Network payment accepted",
    ],
    cta: "Claim Pro Lifetime — $149", href: "https://dodo.pe/relh2gradr9",
    note: "Prices rise after TikTok + image upgrade ships.",
  },
  {
    name: "Agency Lifetime", price: "$349", orig: "$828/yr value", taken: 37, total: 50,
    color: "#9B6FDF", badge: "🚀 Best For Agencies",
    badgeBg: "linear-gradient(90deg,#7B4FBF,#9B6FDF)", badgeColor: "#fff",
    features: [
      "Everything in Agency — forever",
      "5 team seats forever",
      "TikTok + AI video upgrades included",
      "Image generation included",
      "White-label ready",
      "Multi-brand workspace",
      "Priority support + onboarding",
    ],
    cta: "Claim Agency Lifetime — $349", href: "https://dodo.pe/91zcmc4xi27",
    note: "Includes TikTok + AI video + image generation.",
  },
];

const SOCIAL = [
  { label: "Follow on X", handle: "@KING_TEOS", href: "https://twitter.com/KING_TEOS", Icon: XI, color: "#ffffff" },
  { label: "Join Telegram", handle: "#ElmahrosaPi", href: "https://t.me/elmahrosapi", Icon: TGI, color: "#2AABEE" },
  { label: "Connect on LinkedIn", handle: "Teos Pharaoh Portal", href: "https://www.linkedin.com/company/teos-pharaoh-portal/?viewAsMember=true", Icon: LII, color: "#5BA4CF" },
];

// ─── Image Generator UI ───────────────────────────────────────────────────────
const IMG_PRESETS = [
  { id: "x", label: "X Post Image", icon: "𝕏", desc: "1200×675 · Bold text + score" },
  { id: "li", label: "LinkedIn Cover", icon: "in", desc: "1128×191 · Professional brand" },
  { id: "ig", label: "Instagram Visual", icon: "◎", desc: "1080×1080 · Story/Feed" },
  { id: "ad", label: "Ad Creative", icon: "⚡", desc: "1200×628 · High-CTR format" },
  { id: "quote", label: "Quote Graphic", icon: "❝", desc: "800×800 · Dark luxury style" },
  { id: "eg", label: "Egyptian Brand Style", icon: "𓂀", desc: "Sovereign AI premium preset" },
];

function ImageGeneratorTab({ postText }: { postText: string }) {
  const [selectedPreset, setSelectedPreset] = useState("x");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  function generate() {
    setGenerating(true);
    setDone(false);
    setTimeout(() => { setGenerating(false); setDone(true); }, 2400);
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs syne tracking-widest uppercase mb-3 block" style={{ color: "#C9A84C" }}>
          01 — Choose Image Format
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {IMG_PRESETS.map(p => (
            <button key={p.id} onClick={() => setSelectedPreset(p.id)}
              className="text-left px-4 py-3 rounded-xl transition-all"
              style={{
                background: selectedPreset === p.id ? "rgba(201,168,76,.12)" : "#111",
                border: `1px solid ${selectedPreset === p.id ? "rgba(201,168,76,.4)" : "rgba(255,255,255,.06)"}`,
              }}>
              <div className="text-lg mb-1" style={{ fontFamily: "monospace" }}>{p.icon}</div>
              <div className="text-xs syne font-700 mb-0.5" style={{ color: selectedPreset === p.id ? "#C9A84C" : "rgba(255,255,255,.7)" }}>{p.label}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,.3)" }}>{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs syne tracking-widest uppercase mb-3 block" style={{ color: "#9B6FDF" }}>
          02 — AI Prompt Enhancer (optional)
        </label>
        <input
          className="w-full rounded-xl px-4 py-3 text-sm mono outline-none"
          style={{ background: "#151515", border: "1px solid rgba(123,79,191,.2)", color: "rgba(255,255,255,.8)" }}
          placeholder="Add style notes: 'dark luxury', 'Egyptian gold', 'bold founder tone'…"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
      </div>

      <button onClick={generate}
        className="w-full py-3.5 rounded-xl syne text-sm font-700 tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
        style={{ background: "linear-gradient(135deg,#C9A84C,#A07030)", color: "#050505" }}>
        {generating
          ? (<><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Generating Image…</>)
          : (<><span>🎨</span> Generate Post + Matching Image</>)
        }
      </button>

      {done && (
        <div className="fadeUp rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(201,168,76,.2)" }}>
          {/* Simulated image preview */}
          <div className="relative flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#0D0D0D,#1A0D30)", minHeight: "220px" }}>
            <div className="text-center px-8">
              <div className="text-5xl mb-3">𓂀</div>
              <div className="syne font-700 text-lg mb-2 shimmer-text">Image Preview</div>
              <div className="text-xs syne" style={{ color: "rgba(255,255,255,.4)" }}>
                {IMG_PRESETS.find(p => p.id === selectedPreset)?.label} · Egyptian Brand Style
              </div>
              <div className="mt-4 text-xs mono px-3 py-1.5 rounded-lg inline-block" style={{ background: "rgba(201,168,76,.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,.2)" }}>
                ✓ Generated · Ready to download
              </div>
            </div>
            {/* Decorative hieroglyph border */}
            <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(201,168,76,.4),transparent)" }} />
            <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(201,168,76,.4),transparent)" }} />
          </div>
          <div className="p-4 flex gap-3" style={{ background: "#111" }}>
            <Link href="/signup" className="flex-1 text-center py-2.5 rounded-xl syne text-xs tracking-widest uppercase btn-primary">
              Sign Up to Download
            </Link>
            <Link href="/signup" className="px-4 py-2.5 rounded-xl syne text-xs" style={{ background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.4)", border: "1px solid rgba(255,255,255,.08)" }}>
              Save Draft
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-xl p-4 text-center" style={{ background: "rgba(123,79,191,.06)", border: "1px solid rgba(123,79,191,.2)" }}>
        <p className="text-xs syne" style={{ color: "rgba(255,255,255,.4)" }}>
          Image generation ships in the next upgrade · Lifetime users get it free
        </p>
        <Link href="/signup" className="mt-2 inline-flex items-center gap-1.5 text-xs syne" style={{ color: "#9B6FDF" }}>
          Claim lifetime access now →
        </Link>
      </div>
    </div>
  );
}

// ─── Social Share Row ─────────────────────────────────────────────────────────
function ShareRow({ postText }: { postText: string }) {
  const { copied, copy } = useCopy();

  const platforms = [
    { id: "x", label: "X", Icon: XI, color: "#fff", bg: "rgba(255,255,255,.07)", border: "rgba(255,255,255,.12)" },
    { id: "linkedin", label: "LinkedIn", Icon: LII, color: "#5BA4CF", bg: "rgba(10,102,194,.1)", border: "rgba(10,102,194,.25)" },
    { id: "facebook", label: "Facebook", Icon: FBI, color: "#1877F2", bg: "rgba(24,119,242,.1)", border: "rgba(24,119,242,.25)" },
    { id: "telegram", label: "Telegram", Icon: TGI, color: "#2AABEE", bg: "rgba(42,171,238,.1)", border: "rgba(42,171,238,.25)" },
    { id: "whatsapp", label: "WhatsApp", Icon: WAI, color: "#25D366", bg: "rgba(37,211,102,.1)", border: "rgba(37,211,102,.25)" },
    { id: "threads", label: "Threads", Icon: THI, color: "#aaa", bg: "rgba(255,255,255,.05)", border: "rgba(255,255,255,.1)" },
  ];

  return (
    <div>
      <div className="text-xs syne tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,.3)" }}>
        Share instantly:
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {platforms.map(({ id, label, Icon, color, bg, border }) => (
          <a key={id}
            href={buildShareUrl(id, postText)}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs syne transition-all hover:opacity-80"
            style={{ background: bg, border: `1px solid ${border}`, color }}>
            <Icon s={12} /> {label}
          </a>
        ))}
        {/* Instagram — no web intent, show copy */}
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs syne transition-all hover:opacity-80"
          style={{ background: "rgba(225,48,108,.1)", border: "1px solid rgba(225,48,108,.25)", color: "#E1306C" }}>
          <IGI s={12} /> Instagram
        </a>
        <a href="#" onClick={e => { e.preventDefault(); copy(postText + "\n\n🎬 Generated by TEOS AI — https://teos-ai-engine.vercel.app"); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs syne transition-all hover:opacity-80"
          style={{ background: "rgba(0,0,0,.5)", border: "1px solid rgba(255,255,255,.15)", color: "#aaa" }}>
          <TKI s={12} /> TikTok
        </a>
        <button onClick={() => copy(postText)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs syne transition-all"
          style={{ background: copied ? "rgba(201,168,76,.15)" : "rgba(201,168,76,.08)", border: `1px solid ${copied ? "rgba(201,168,76,.4)" : "rgba(201,168,76,.2)"}`, color: "#C9A84C" }}>
          {copied ? "✓ Copied!" : "⎘ Copy Post"}
        </button>
      </div>
    </div>
  );
}

// ─── Generator Action Bar ─────────────────────────────────────────────────────
function ActionBar({ onRegenerate, onImproveHook, onImageTab }: {
  onRegenerate: () => void;
  onImproveHook: () => void;
  onImageTab: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {[
        { label: "↺ Regenerate", action: onRegenerate, style: "ghost" },
        { label: "⚡ Improve Hook", action: onImproveHook, style: "ghost" },
        { label: "🎨 Generate Image", action: onImageTab, style: "gold" },
        { label: "🎬 Video Script", action: () => {}, style: "ghost" },
        { label: "📅 Schedule", action: () => {}, style: "ghost" },
      ].map(({ label, action, style }) => (
        <button key={label} onClick={action}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs syne transition-all hover:opacity-80"
          style={{
            background: style === "gold" ? "rgba(201,168,76,.12)" : "rgba(255,255,255,.05)",
            border: `1px solid ${style === "gold" ? "rgba(201,168,76,.3)" : "rgba(255,255,255,.08)"}`,
            color: style === "gold" ? "#C9A84C" : "rgba(255,255,255,.5)",
          }}>
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [demoStep, setDemoStep] = useState(0);
  const [demoInput, setDemoInput] = useState("");
  const [isGen, setIsGen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pricingTab, setPricingTab] = useState<"monthly" | "yearly" | "lifetime">("lifetime");
  const [generatorTab, setGeneratorTab] = useState<"post" | "image">("post");
  const [selectedPlatform, setSelectedPlatform] = useState("LinkedIn");
  const [hookImproved, setHookImproved] = useState(false);

  const demoIdea = "Why most founders fail at content marketing — and how I fixed it in 7 days.";
  const demoPost = `🧠 Most founders treat content like an afterthought.\n\nThey post when they "have time."\nThey write what sounds smart.\nThey wonder why nobody engages.\n\nHere's what I learned after 7 days of obsessive testing:\n\n→ Specificity wins over expertise\n→ Stories outperform advice\n→ The first line IS the ad\n\nYour audience doesn't want your knowledge.\nThey want to see themselves in your story.\n\nStart there. 🔥`;
  const improvedHook = `🔥 I lost 6 months posting content nobody saw.\n\nThen I changed one thing — and engagement tripled in 7 days.\n\nHere's exactly what I did:\n\n→ Specificity wins over expertise\n→ Stories outperform advice\n→ The first line IS the ad\n\nYour audience doesn't want your knowledge.\nThey want to see themselves in your story.\n\nStart there. 🔥`;
  const demoCta = "Save this if you're building an audience. Drop a 🙋 if you've made this mistake.";

  function runDemo() {
    if (demoStep === 0) { setDemoInput(demoIdea); setDemoStep(1); setHookImproved(false); }
    else if (demoStep === 1) { setIsGen(true); setTimeout(() => { setIsGen(false); setDemoStep(2); }, 2200); }
    else { setDemoStep(0); setDemoInput(""); setHookImproved(false); }
  }

  const platforms = ["X", "LinkedIn", "Facebook", "Instagram", "TikTok", "Threads", "Telegram"];
  const activePost = hookImproved ? improvedHook : demoPost;

  return (
    <div className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#050505", fontFamily: "'Cormorant Garamond','Georgia',serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        :root{--gold:#C9A84C;--gl:#E8C96B;--pu:#7B4FBF;--pl:#9B6FDF;--pd:#3D1F80;--bg:#050505;--sur:#0D0D0D;--brd:rgba(201,168,76,0.15);}
        *{box-sizing:border-box;} html{scroll-behavior:smooth;}
        .syne{font-family:'Syne',sans-serif;} .mono{font-family:'JetBrains Mono',monospace;}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes pulse-ring{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.6)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes live-pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
        @keyframes glow-pulse{0%,100%{opacity:.15}50%{opacity:.3}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .float{animation:float 5s ease-in-out infinite;}
        .fadeUp{animation:fadeUp .7s ease both;}
        .fu1{animation:fadeUp .7s .1s ease both;} .fu2{animation:fadeUp .7s .25s ease both;}
        .fu3{animation:fadeUp .7s .4s ease both;} .fu4{animation:fadeUp .7s .55s ease both;}
        .fu5{animation:fadeUp .7s .7s ease both;}
        .shimmer-text{background:linear-gradient(90deg,var(--gold),var(--gl),var(--gold),var(--gl));background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite;}
        .card-hover{transition:transform .3s ease,box-shadow .3s ease;}
        .card-hover:hover{transform:translateY(-5px);box-shadow:0 16px 48px rgba(123,79,191,.2);}
        .btn-primary{background:linear-gradient(135deg,var(--gold),#A07030);color:#050505;font-weight:700;transition:all .2s;}
        .btn-primary:hover{background:linear-gradient(135deg,var(--gl),var(--gold));transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,168,76,.4);}
        .btn-ghost{border:1px solid var(--brd);color:var(--gold);transition:all .2s;background:transparent;}
        .btn-ghost:hover{background:rgba(201,168,76,.08);border-color:var(--gold);transform:translateY(-1px);}
        .live-dot{animation:live-pulse 1.5s ease-in-out infinite;}
        .orb{border-radius:50%;filter:blur(80px);opacity:.12;position:absolute;pointer-events:none;}
        .grid-bg{background-image:linear-gradient(rgba(201,168,76,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.04) 1px,transparent 1px);background-size:60px 60px;}
        .divider{height:1px;background:linear-gradient(90deg,transparent,var(--brd),transparent);}
        .pricing-pop{background:linear-gradient(160deg,rgba(123,79,191,.18),rgba(201,168,76,.06));border:1px solid rgba(123,79,191,.4);}
        .pricing-life-pro{background:linear-gradient(160deg,rgba(201,168,76,.1),rgba(123,79,191,.06));border:2px solid rgba(201,168,76,.45);}
        .pricing-life-agency{background:linear-gradient(160deg,rgba(123,79,191,.12),rgba(61,31,128,.08));border:1px solid rgba(123,79,191,.3);}
        .pricing-ghost{background:#0D0D0D;border:1px solid rgba(255,255,255,.06);}
        .social-hover{transition:all .2s;} .social-hover:hover{transform:translateY(-2px);opacity:.85;}
        .noise::before{content:'';position:absolute;inset:0;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");pointer-events:none;}
        .scan-line{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.4),transparent);animation:scan 3s ease-in-out infinite;pointer-events:none;}
        .tab-active{background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(123,79,191,.1));border-color:rgba(201,168,76,.4)!important;color:#C9A84C!important;}
        .gen-tab-active{background:rgba(201,168,76,.12);border-color:rgba(201,168,76,.4)!important;color:#C9A84C!important;}
        .horus-glow{filter:drop-shadow(0 0 40px rgba(123,79,191,.5)) drop-shadow(0 0 80px rgba(201,168,76,.2));}
        .animate-spin{animation:spin 1s linear infinite;}
      `}</style>

      <Ticker />

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className="fixed z-40 left-0 right-0 flex items-center justify-between px-6 py-3"
        style={{ top: "26px", background: "rgba(5,5,5,.9)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(201,168,76,.1)" }}>
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/tailogo.jpeg" alt="TEOS AI Engine" className="h-9 w-9 object-contain rounded-full"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span className="syne font-800 text-sm tracking-widest uppercase" style={{ color: "#C9A84C" }}>TEOS AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-xs syne tracking-widest uppercase" style={{ color: "rgba(255,255,255,.5)" }}>
          {[["Features", "#features"], ["Pricing", "#pricing"], ["Demo", "#demo"], ["Pi Launch", "#pi-launch"]].map(([l, h]) => (
            <a key={l} href={h} className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-xs syne tracking-widest uppercase px-4 py-2 rounded-full transition-colors"
            style={{ color: "rgba(255,255,255,.45)", border: "1px solid rgba(255,255,255,.08)" }}>Login</Link>
          <Link href="/signup" className="btn-primary syne text-xs tracking-widest uppercase px-5 py-2 rounded-full">Get Started</Link>
        </div>
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1">{[0, 1, 2].map(i => <div key={i} className="w-5 h-0.5 rounded" style={{ background: "#C9A84C" }} />)}</div>
        </button>
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 py-5 px-6 flex flex-col gap-4"
            style={{ background: "rgba(5,5,5,.98)", borderBottom: "1px solid rgba(201,168,76,.1)" }}>
            {[["Features", "#features"], ["Pricing", "#pricing"], ["Demo", "#demo"], ["Pi Launch", "#pi-launch"], ["Login", "/login"]].map(([l, h]) => (
              <a key={l} href={h} className="syne text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,.7)" }} onClick={() => setMenuOpen(false)}>{l}</a>
            ))}
            <Link href="/signup" className="btn-primary syne text-xs tracking-widest uppercase px-5 py-3 rounded-full text-center mt-1" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
          </div>
        )}
      </nav>
      <div style={{ height: "78px" }} />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-24 noise overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="orb w-[500px] h-[500px] top-10 -left-40" style={{ background: "#7B4FBF" }} />
        <div className="orb w-[400px] h-[400px] bottom-10 -right-20" style={{ background: "#C9A84C" }} />

        {/* Launch ribbon */}
        <div className="fu1 mb-6 px-5 py-2 rounded-full border text-xs syne tracking-widest flex items-center gap-2"
          style={{ borderColor: "rgba(201,168,76,.4)", background: "rgba(201,168,76,.06)", color: "#C9A84C" }}>
          <span>🔥</span><span>First 50 Users Lifetime Offer Open</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot" />
        </div>

        {/* Logo */}
        <div className="float relative mb-10 fadeUp">
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle,rgba(123,79,191,.25) 0%,transparent 70%)", transform: "scale(1.8)", filter: "blur(20px)" }} />
          <img
            src="/tailogo.jpeg"
            alt="TEOS AI Engine — Sovereign Egyptian AI"
            className="relative w-40 h-40 md:w-56 md:h-56 object-contain rounded-full"
            style={{ filter: "drop-shadow(0 0 40px rgba(123,79,191,.5)) drop-shadow(0 0 80px rgba(201,168,76,.2))" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>

        {/* Pi badge */}
        <div className="fu1 mb-6 px-4 py-2 rounded-full border text-xs syne tracking-widest flex items-center gap-2"
          style={{ borderColor: "rgba(201,168,76,.25)", background: "rgba(201,168,76,.04)", color: "rgba(255,255,255,.6)" }}>
          <span style={{ color: "#C9A84C", fontWeight: 700 }}>π</span>
          <span>Pi Users Get <strong style={{ color: "#C9A84C" }}>50% Launch Discount</strong></span>
        </div>

        <h1 className="fu2 text-center max-w-4xl leading-none mb-4"
          style={{ fontSize: "clamp(2.8rem,7vw,5.8rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
          <span className="shimmer-text">AI That Sees</span>{" "}
          <span style={{ color: "rgba(255,255,255,.9)" }}>What Others Miss.</span>
        </h1>
        <h2 className="fu2 text-center max-w-3xl leading-tight mb-8"
          style={{ fontSize: "clamp(1.6rem,4vw,2.8rem)", fontWeight: 300, color: "rgba(255,255,255,.55)", letterSpacing: "-0.01em" }}>
          Generate Posts That Get Seen.
        </h2>
        <p className="fu3 text-center max-w-xl mb-10 leading-relaxed syne"
          style={{ color: "rgba(255,255,255,.45)", fontSize: "1rem" }}>
          Generate stronger content across X, Facebook, Instagram, LinkedIn, TikTok and Threads with built-in{" "}
          <span style={{ color: "#C9A84C" }}>visibility scoring</span>.
        </p>

        <div className="fu4 flex flex-col sm:flex-row gap-4 items-center mb-4">
          <Link href="/signup" className="btn-primary syne tracking-widest uppercase text-sm px-9 py-4 rounded-full flex items-center gap-2">
            <span>✦</span> Start Free — 5 Posts
          </Link>
          <a href="#demo" className="btn-ghost syne tracking-widest uppercase text-sm px-9 py-4 rounded-full flex items-center gap-2">
            <span>▶</span> Watch 90-sec Demo
          </a>
          <a href="/pay/pi" className="syne tracking-widest uppercase text-sm px-9 py-4 rounded-full flex items-center gap-2 transition-all"
            style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.25)", color: "#C9A84C" }}>
            π Pay with Pi
          </a>
        </div>
        <p className="fu5 text-xs syne tracking-widest" style={{ color: "rgba(255,255,255,.2)" }}>No credit card · Instant access · 5 free posts</p>

        {/* Urgency seats bar */}
        <div className="fu5 mt-10 w-full max-w-sm">
          <div className="px-5 py-4 rounded-2xl" style={{ background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.15)" }}>
            <p className="text-xs syne tracking-widest uppercase text-center mb-3" style={{ color: "#C9A84C" }}>🔥 Lifetime Seats Filling Fast</p>
            <SeatsBar taken={37} total={50} />
            <p className="text-xs syne text-center mt-3" style={{ color: "rgba(255,255,255,.3)" }}>Prices rise after TikTok + AI video upgrades.</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOT OFFERS — Lifetime (above fold urgency)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-4 px-6" style={{ background: "#070707" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-4"
              style={{ border: "1px solid var(--brd)", color: "#C9A84C" }}>🔥 Hot Launch Offers</div>
            <h2 className="text-4xl md:text-5xl font-700 mb-3" style={{ letterSpacing: "-0.02em" }}>Own It <span className="shimmer-text">Forever.</span></h2>
            <p className="text-sm syne" style={{ color: "rgba(255,255,255,.4)" }}>37 / 50 lifetime seats remaining · Closes when full</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {LIFETIME_PLANS.map(plan => (
              <div key={plan.name}
                className={`card-hover rounded-3xl p-8 relative overflow-hidden ${plan.name.includes("Pro") ? "pricing-life-pro" : "pricing-life-agency"}`}>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"
                  style={{ background: plan.color, filter: "blur(50px)", opacity: .1 }} />
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs syne tracking-widest font-700 mb-5"
                  style={{ background: plan.badgeBg, color: plan.badgeColor }}>{plan.badge}</div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="syne font-700 text-xl mb-1" style={{ color: plan.color === "#C9A84C" ? "#C9A84C" : "#9B6FDF" }}>{plan.name}</div>
                    <div className="text-xs syne line-through" style={{ color: "rgba(255,255,255,.25)" }}>{plan.orig}</div>
                  </div>
                  <div className="text-right">
                    <div className="shimmer-text font-700 syne" style={{ fontSize: "3rem", lineHeight: 1 }}>{plan.price}</div>
                    <div className="text-xs syne mt-1" style={{ color: "rgba(255,255,255,.35)" }}>one-time</div>
                  </div>
                </div>
                <SeatsBar taken={plan.taken} total={plan.total} />
                <ul className="space-y-2.5 mt-6 mb-7">
                  {plan.features.map(f => (
                    <li key={f} className="text-sm flex gap-2.5 items-start" style={{ color: "rgba(255,255,255,.7)" }}>
                      <span style={{ color: plan.color === "#C9A84C" ? "#C9A84C" : "#9B6FDF", flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href={plan.href} target="_blank" rel="noopener noreferrer"
                  className="btn-primary block text-center py-4 rounded-2xl syne text-sm tracking-widest uppercase">
                  {plan.cta}
                </a>
                <p className="text-center text-xs syne mt-3" style={{ color: "rgba(255,255,255,.25)" }}>⚡ {plan.note}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-xs syne" style={{ color: "rgba(255,255,255,.2)" }}>Accepts Pi Network · USDC · Card via Dodo Payments</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          INTERACTIVE DEMO — Post Generator + Image Generator
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="demo" className="py-28 px-6" style={{ background: "#050505" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-4"
              style={{ border: "1px solid var(--brd)", color: "#C9A84C" }}>Content Operating System</div>
            <h2 className="text-4xl md:text-5xl font-700 mb-4" style={{ letterSpacing: "-0.02em" }}>
              Post Generator <span style={{ color: "rgba(255,255,255,.25)" }}>+</span> <span className="shimmer-text">Image Generator</span>
            </h2>
            <p className="text-sm syne" style={{ color: "rgba(255,255,255,.4)" }}>
              Idea → post → score → image → share. All in one place.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(201,168,76,.2)", background: "#0A0A0A" }}>
            {/* Window bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 relative overflow-hidden"
              style={{ background: "#111", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-4 text-xs mono" style={{ color: "rgba(255,255,255,.25)" }}>teos-ai-engine.vercel.app/dashboard</span>
              <div className="scan-line" />
            </div>

            {/* Generator Tabs */}
            <div className="flex items-center gap-2 px-5 py-3" style={{ background: "#0D0D0D", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
              {(["post", "image"] as const).map(tab => (
                <button key={tab} onClick={() => setGeneratorTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs syne tracking-widest uppercase transition-all border border-transparent ${generatorTab === tab ? "gen-tab-active" : ""}`}
                  style={{ color: generatorTab === tab ? "#C9A84C" : "rgba(255,255,255,.35)" }}>
                  {tab === "post" ? "📝 Post Generator" : "🎨 Image Generator"}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-1.5 text-xs syne px-2 py-1 rounded-full"
                style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.15)", color: "#C9A84C" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot" />Live Preview
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* ── POST GENERATOR TAB ── */}
              {generatorTab === "post" && (
                <div className="space-y-6">
                  {/* Input */}
                  <div>
                    <label className="text-xs syne tracking-widest uppercase mb-3 block" style={{ color: "#C9A84C" }}>
                      01 — Your Content Idea
                    </label>
                    <textarea
                      className="w-full rounded-xl px-4 py-3.5 text-sm resize-none mono outline-none"
                      style={{ background: "#151515", border: "1px solid rgba(201,168,76,.15)", color: "rgba(255,255,255,.8)", minHeight: "80px" }}
                      placeholder="E.g. Why most founders fail at content marketing…"
                      value={demoInput}
                      onChange={e => setDemoInput(e.target.value)}
                      readOnly={demoStep > 0}
                    />
                    {/* 7 platforms */}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {platforms.map(p => (
                        <button key={p} onClick={() => setSelectedPlatform(p)}
                          className="text-xs px-3 py-1 rounded-full syne transition-all"
                          style={{
                            background: selectedPlatform === p ? "rgba(123,79,191,.25)" : "rgba(255,255,255,.05)",
                            color: selectedPlatform === p ? "#9B6FDF" : "rgba(255,255,255,.35)",
                            border: `1px solid ${selectedPlatform === p ? "rgba(123,79,191,.4)" : "rgba(255,255,255,.08)"}`,
                          }}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate button */}
                  <button onClick={runDemo}
                    className="w-full py-3.5 rounded-xl syne text-sm font-700 tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300"
                    style={{
                      background: demoStep === 2 ? "rgba(255,255,255,.05)" : "linear-gradient(135deg,#C9A84C,#A07030)",
                      color: demoStep === 2 ? "rgba(255,255,255,.4)" : "#050505",
                    }}>
                    {isGen
                      ? (<><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Generating with TEOS AI…</>)
                      : demoStep === 0 ? (<><span>✦</span> Load Demo Idea</>)
                        : demoStep === 1 ? (<><span>⚡</span> Generate Post + Score</>)
                          : (<><span>↺</span> Try Another Idea</>)}
                  </button>

                  {/* Output */}
                  {demoStep === 2 && (
                    <div className="space-y-5 fadeUp">
                      {/* Before/After */}
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="rounded-xl p-4" style={{ background: "#111", border: "1px solid rgba(255,255,255,.06)" }}>
                          <div className="text-xs syne uppercase mb-2" style={{ color: "rgba(255,255,255,.2)" }}>❌ Before TEOS</div>
                          <p className="text-xs mono leading-relaxed" style={{ color: "rgba(255,255,255,.3)" }}>
                            "Here are 5 tips for content marketing every founder should know…"
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <div className="h-1 flex-1 rounded-full" style={{ background: "rgba(255,255,255,.06)" }}>
                              <div className="h-full rounded-full w-1/4" style={{ background: "rgba(255,100,100,.4)" }} />
                            </div>
                            <span className="text-xs mono" style={{ color: "rgba(255,100,100,.6)" }}>22/100</span>
                          </div>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: "#111", border: "1px solid rgba(201,168,76,.15)" }}>
                          <div className="text-xs syne uppercase mb-2" style={{ color: "#C9A84C" }}>✅ After TEOS</div>
                          <p className="text-xs mono leading-relaxed" style={{ color: "rgba(255,255,255,.5)" }}>
                            "Most founders treat content like an afterthought…"
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <div className="h-1 flex-1 rounded-full" style={{ background: "rgba(255,255,255,.06)" }}>
                              <div className="h-full rounded-full" style={{ width: "92%", background: "linear-gradient(90deg,#7B4FBF,#C9A84C)" }} />
                            </div>
                            <span className="text-xs mono" style={{ color: "#C9A84C" }}>92/100</span>
                          </div>
                        </div>
                      </div>

                      {/* Generated post */}
                      <div>
                        <label className="text-xs syne tracking-widest uppercase mb-3 block" style={{ color: "#9B6FDF" }}>
                          02 — Generated Post ({selectedPlatform})
                          {hookImproved && <span className="ml-2 text-xs px-2 py-0.5 rounded" style={{ background: "rgba(201,168,76,.1)", color: "#C9A84C" }}>Hook Improved ✓</span>}
                        </label>
                        <div className="rounded-xl p-5 text-sm leading-relaxed mono"
                          style={{ background: "#0F0F0F", border: "1px solid rgba(123,79,191,.2)", color: "rgba(255,255,255,.8)", whiteSpace: "pre-line" }}>
                          {activePost}
                        </div>
                      </div>

                      {/* Score + CTA */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded-xl p-5" style={{ background: "#0F0F0F", border: "1px solid rgba(201,168,76,.15)" }}>
                          <div className="text-xs syne tracking-widest uppercase mb-3" style={{ color: "#C9A84C" }}>03 — Visibility Score</div>
                          <div className="flex items-end gap-3">
                            <span className="shimmer-text font-700 syne" style={{ fontSize: "3.5rem", lineHeight: 1 }}>92</span>
                            <span style={{ color: "rgba(255,255,255,.3)", fontSize: "1.2rem" }}>/100</span>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: "92%", background: "linear-gradient(90deg,#7B4FBF,#C9A84C)" }} />
                          </div>
                          <div className="mt-2 text-xs syne" style={{ color: "rgba(255,255,255,.35)" }}>Exceptional · Top 8% predicted reach</div>
                        </div>
                        <div className="rounded-xl p-5" style={{ background: "#0F0F0F", border: "1px solid rgba(123,79,191,.2)" }}>
                          <div className="text-xs syne tracking-widest uppercase mb-3" style={{ color: "#9B6FDF" }}>04 — Suggested CTA</div>
                          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,.7)" }}>"{demoCta}"</p>
                          <div className="mt-3 flex gap-2">
                            <button className="text-xs syne px-3 py-1.5 rounded-lg"
                              style={{ background: "rgba(201,168,76,.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,.2)" }}>
                              Use This CTA
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Share Row */}
                      <div className="rounded-xl p-5" style={{ background: "#0F0F0F", border: "1px solid rgba(255,255,255,.06)" }}>
                        <ShareRow postText={activePost} />
                      </div>

                      {/* Action Bar */}
                      <div className="rounded-xl p-5" style={{ background: "#0F0F0F", border: "1px solid rgba(255,255,255,.06)" }}>
                        <div className="text-xs syne tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,.3)" }}>Actions:</div>
                        <ActionBar
                          onRegenerate={() => { setDemoStep(0); setDemoInput(""); setHookImproved(false); }}
                          onImproveHook={() => setHookImproved(true)}
                          onImageTab={() => setGeneratorTab("image")}
                        />
                      </div>

                      <div className="text-center pt-2">
                        <Link href="/signup" className="btn-primary syne text-sm tracking-widest uppercase px-8 py-3.5 rounded-full inline-flex items-center gap-2">
                          ✦ Get Your First 5 Posts Free
                        </Link>
                        <p className="text-xs mt-2 syne" style={{ color: "rgba(255,255,255,.2)" }}>No card required</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── IMAGE GENERATOR TAB ── */}
              {generatorTab === "image" && (
                <ImageGeneratorTab postText={activePost} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          VIDEO DEMO
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="watch-demo" className="py-24 px-6" style={{ background: "#070707" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-6"
            style={{ border: "1px solid var(--brd)", color: "#C9A84C" }}>Video Demo</div>
          <h2 className="text-4xl md:text-5xl font-700 mb-4" style={{ letterSpacing: "-0.02em" }}>
            Watch the 90-Second<br /><span className="shimmer-text">Product Walkthrough</span>
          </h2>
          <p className="text-sm syne mb-10" style={{ color: "rgba(255,255,255,.4)" }}>From signup to first post in under 2 minutes</p>

          {/* SWAP inner div for <iframe src="YOUR_LOOM_URL" className="absolute inset-0 w-full h-full" frameBorder="0" allowFullScreen /> */}
          <div className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(201,168,76,.25)", background: "#0A0A0A", minHeight: "360px" }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: "rgba(201,168,76,.35)", animation: "pulse-ring 2s ease-out infinite" }} />
                <div className="relative flex items-center justify-center rounded-full"
                  style={{ width: "80px", height: "80px", background: "linear-gradient(135deg,#C9A84C,#7B4FBF)" }}>
                  <span style={{ fontSize: "1.6rem", marginLeft: "5px" }}>▶</span>
                </div>
              </div>
              <div className="text-center max-w-sm">
                <p className="syne font-700 text-base mb-2" style={{ color: "rgba(255,255,255,.8)" }}>Founder Preview — Recording This Week</p>
                <p className="text-xs syne leading-relaxed" style={{ color: "rgba(255,255,255,.35)" }}>
                  See: idea → post → visibility score → publish in under 90 seconds.
                </p>
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                <a href="https://twitter.com/KING_TEOS" target="_blank" rel="noopener noreferrer"
                  className="syne text-xs tracking-widest uppercase px-5 py-2 rounded-full"
                  style={{ background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.2)", color: "#C9A84C" }}>
                  Follow @KING_TEOS for Drop
                </a>
                <Link href="/signup" className="syne text-xs tracking-widest uppercase px-5 py-2 rounded-full btn-primary">
                  Try It Live Instead →
                </Link>
              </div>
            </div>
            {[["top-4 left-4", "border-t-2 border-l-2 rounded-tl"], ["top-4 right-4", "border-t-2 border-r-2 rounded-tr"], ["bottom-4 left-4", "border-b-2 border-l-2 rounded-bl"], ["bottom-4 right-4", "border-b-2 border-r-2 rounded-br"]].map(([p, b]) => (
              <div key={p} className={`absolute ${p} w-8 h-8 ${b}`} style={{ borderColor: "rgba(201,168,76,.2)" }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHY TEOS IS DIFFERENT
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-4"
              style={{ border: "1px solid var(--brd)", color: "#C9A84C" }}>Why TEOS</div>
            <h2 className="text-4xl md:text-5xl font-700 mb-4" style={{ letterSpacing: "-0.02em" }}>
              AI That Goes <span className="shimmer-text">Beyond Generation</span>
            </h2>
            <p className="max-w-lg mx-auto text-sm syne leading-relaxed" style={{ color: "rgba(255,255,255,.4)" }}>
              Every other tool generates text. TEOS tells you if it will actually perform — then helps you distribute it everywhere.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "👁", title: "Visibility Scoring", desc: "Every post gets scored 0–100 for predicted reach and engagement before you publish.", accent: "#C9A84C" },
              { icon: "🎯", title: "7 Platform Optimization", desc: "X, LinkedIn, Instagram, Facebook, TikTok, Threads, Telegram — each post tuned for its platform.", accent: "#9B6FDF" },
              { icon: "💬", title: "CTA Suggestions", desc: "Get the exact closing line that converts readers to followers, clicks, or replies.", accent: "#C9A84C" },
              { icon: "🎨", title: "Image Generation", desc: "Generate matching post images, carousel covers, quote graphics and ad creatives instantly.", accent: "#9B6FDF" },
              { icon: "⚡", title: "One-Click Distribution", desc: "Share to X, LinkedIn, Telegram, WhatsApp, Threads, Facebook instantly from the generator.", accent: "#C9A84C" },
              { icon: "π", title: "Pi + Dodo Payments", desc: "One of the only SaaS tools globally accepting Pi Network. Also supports USDC and Dodo.", accent: "#9B6FDF" },
            ].map(({ icon, title, desc, accent }) => (
              <div key={title} className="card-hover rounded-2xl p-6" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,.05)" }}>
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="syne font-700 text-base mb-2" style={{ color: accent }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,.5)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TRUST
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: "#070707" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-4"
              style={{ border: "1px solid var(--brd)", color: "#C9A84C" }}>Trust & Origin</div>
            <h2 className="text-4xl md:text-5xl font-700 mb-4" style={{ letterSpacing: "-0.02em" }}>
              Built in Alexandria. <span className="shimmer-text">Sovereign by Design.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-2xl p-8" style={{ background: "#0D0D0D", border: "1px solid rgba(201,168,76,.12)" }}>
              <div className="text-4xl mb-4">🇪🇬</div>
              <h3 className="syne font-700 text-lg mb-2" style={{ color: "#C9A84C" }}>Built in Alexandria</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,.5)" }}>
                Founded and operated by Ayman Seif at Elmahrosa International — established 2007, software division since 2021. Independently funded. Founder-controlled.
              </p>
            </div>
            <div className="rounded-2xl p-8" style={{ background: "#0D0D0D", border: "1px solid rgba(123,79,191,.15)" }}>
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="syne font-700 text-lg mb-2" style={{ color: "#9B6FDF" }}>Founder-Led by Elmahrosa International</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,.5)" }}>
                No VC. No committee. Every product decision comes directly from the founder. Your feedback reaches the builder.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { stat: 47, suffix: "+", label: "Posts Generated This Week" },
              { stat: 37, suffix: "/50", label: "Lifetime Seats Claimed" },
              { stat: 18, suffix: "+", label: "Early Users Testing" },
              { stat: 84, suffix: "/100", label: "Avg Visibility Score" },
            ].map(({ stat, suffix, label }) => (
              <div key={label} className="text-center rounded-2xl py-8 px-4" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,.05)" }}>
                <div className="shimmer-text font-700 syne mb-1" style={{ fontSize: "2.5rem", lineHeight: 1 }}>
                  <Counter end={stat} suffix={suffix} />
                </div>
                <div className="text-xs syne" style={{ color: "rgba(255,255,255,.35)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SOCIAL PROOF
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-4"
              style={{ border: "1px solid var(--brd)", color: "#C9A84C" }}>Early Users</div>
            <h2 className="text-4xl md:text-5xl font-700 mb-4" style={{ letterSpacing: "-0.02em" }}>
              Founders <span className="shimmer-text">Getting Seen</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {[
              { name: "Khalid A.", role: "SaaS Founder · UAE", score: "94/100", text: "The visibility score is the feature I didn't know I needed. I now only post things that score above 80. Engagement tripled." },
              { name: "Priya M.", role: "Content Strategist · Kenya", score: "89/100", text: "Finally — a tool that works for MENA markets. The Pi payment option was the thing that got me in early. No regrets." },
              { name: "James O.", role: "Agency Owner · Nigeria", score: "91/100", text: "We manage 12 brand accounts. TEOS cut our content production time in half. Agency Lifetime was a no-brainer at $349." },
            ].map(({ name, role, score, text }) => (
              <div key={name} className="card-hover rounded-2xl p-6" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,.06)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: "#C9A84C" }}>★</span>)}</div>
                  <span className="text-xs mono px-2 py-0.5 rounded" style={{ background: "rgba(201,168,76,.1)", color: "#C9A84C" }}>Score: {score}</span>
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,.6)" }}>&ldquo;{text}&rdquo;</p>
                <div>
                  <div className="text-sm font-600 syne">{name}</div>
                  <div className="text-xs syne" style={{ color: "rgba(255,255,255,.3)" }}>{role}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs syne tracking-widest uppercase text-center mb-5" style={{ color: "rgba(255,255,255,.2)" }}>Trusted by founders across</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["🇪🇬 Egypt", "🇳🇬 Nigeria", "🇦🇪 UAE", "🇬🇭 Ghana", "🇰🇪 Kenya", "🇺🇸 USA", "🇬🇧 UK", "🇸🇦 KSA"].map(c => (
              <span key={c} className="text-xs syne tracking-wider px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,.03)", color: "rgba(255,255,255,.3)", border: "1px solid rgba(255,255,255,.06)" }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PRICING — Tabbed
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-28 px-6" style={{ background: "#070707" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-4"
              style={{ border: "1px solid var(--brd)", color: "#C9A84C" }}>Pricing</div>
            <h2 className="text-4xl md:text-5xl font-700 mb-3" style={{ letterSpacing: "-0.02em" }}>
              Start Free. <span className="shimmer-text">Scale When Ready.</span>
            </h2>
            <p className="text-sm syne mb-10" style={{ color: "rgba(255,255,255,.4)" }}>Lifetime offers close when 50 seats fill — no exceptions.</p>
            <div className="inline-flex rounded-full p-1 gap-1" style={{ background: "#111", border: "1px solid rgba(255,255,255,.06)" }}>
              {(["monthly", "yearly", "lifetime"] as const).map(tab => (
                <button key={tab} onClick={() => setPricingTab(tab)}
                  className={`px-5 py-2 rounded-full text-xs syne tracking-widest uppercase transition-all border border-transparent ${pricingTab === tab ? "tab-active" : ""}`}
                  style={{ color: pricingTab === tab ? "#C9A84C" : "rgba(255,255,255,.4)" }}>
                  {tab === "lifetime" ? "🔥 Lifetime" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly */}
          {pricingTab === "monthly" && (
            <div className="grid md:grid-cols-3 gap-5">
              {MONTHLY_PLANS.map(plan => (
                <div key={plan.name}
                  className={`card-hover rounded-2xl p-7 relative ${plan.style === "pop" ? "pricing-pop" : "pricing-ghost"}`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs syne tracking-widest uppercase"
                      style={{ background: "linear-gradient(90deg,#7B4FBF,#9B6FDF)", color: "white" }}>{plan.badge}</div>
                  )}
                  <div className="text-xs syne tracking-widest uppercase mb-4" style={{ color: plan.color }}>{plan.name}</div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className={`text-5xl font-700 syne ${plan.style === "pop" ? "shimmer-text" : ""}`}
                      style={plan.style !== "pop" ? { color: "rgba(255,255,255,.9)" } : {}}>{plan.price}</span>
                    {plan.period !== "Free forever" && (
                      <span className="text-sm mb-2" style={{ color: "rgba(255,255,255,.3)" }}>{plan.period}</span>
                    )}
                  </div>
                  <p className="text-xs syne mb-6" style={{ color: "rgba(255,255,255,.3)" }}>{plan.sub}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="text-sm flex gap-2" style={{ color: "rgba(255,255,255,.65)" }}>
                        <span style={{ color: plan.accent }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  {/* Upgrade teaser on paid plans */}
                  {plan.style === "pop" && (
                    <div className="mb-6 px-4 py-3 rounded-xl text-xs syne" style={{ background: "rgba(123,79,191,.08)", border: "1px solid rgba(123,79,191,.2)" }}>
                      <div className="text-xs tracking-widest uppercase mb-1.5" style={{ color: "#9B6FDF" }}>Included in next upgrade:</div>
                      {["TikTok content generator", "AI short-form video hooks", "Image generation"].map(u => (
                        <div key={u} className="flex items-center gap-1.5 mb-1" style={{ color: "rgba(255,255,255,.4)" }}>
                          <span style={{ color: "#9B6FDF" }}>✓</span> {u}
                        </div>
                      ))}
                      <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.25)" }}>
                        Prices increase after upgrade ships.
                      </div>
                    </div>
                  )}
                  {plan.external ? (
                    <a href={plan.href} target="_blank" rel="noopener noreferrer"
                      className={`block text-center py-3.5 rounded-xl syne text-sm tracking-widest uppercase ${plan.style === "pop" ? "btn-primary" : ""}`}
                      style={plan.style !== "pop" ? { border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.5)" } : {}}>
                      {plan.cta}
                    </a>
                  ) : (
                    <Link href={plan.href}
                      className="block text-center py-3.5 rounded-xl syne text-sm tracking-widest uppercase"
                      style={{ border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.5)" }}>
                      {plan.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Yearly */}
          {pricingTab === "yearly" && (
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {YEARLY_PLANS.map(plan => (
                <div key={plan.name} className="card-hover pricing-ghost rounded-2xl p-7">
                  <div className="text-xs syne tracking-widest uppercase mb-4" style={{ color: plan.accent }}>{plan.name}</div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-5xl font-700 syne" style={{ color: "rgba(255,255,255,.9)" }}>{plan.price}</span>
                    <span className="text-sm mb-2" style={{ color: "rgba(255,255,255,.3)" }}>{plan.period}</span>
                  </div>
                  <p className="text-xs syne mb-6" style={{ color: "rgba(255,255,255,.3)" }}>{plan.sub}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="text-sm flex gap-2" style={{ color: "rgba(255,255,255,.65)" }}>
                        <span style={{ color: plan.accent }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <a href={plan.href} target="_blank" rel="noopener noreferrer"
                    className="btn-primary block text-center py-3.5 rounded-xl syne text-sm tracking-widest uppercase">
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Lifetime */}
          {pricingTab === "lifetime" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2 max-w-sm mx-auto w-full">
                <div className="card-hover pricing-ghost rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs syne uppercase mb-1" style={{ color: "rgba(255,255,255,.35)" }}>Starter Free</div>
                    <div className="text-3xl font-700 syne" style={{ color: "rgba(255,255,255,.8)" }}>$0</div>
                    <p className="text-xs syne mt-1" style={{ color: "rgba(255,255,255,.3)" }}>5 posts · No card required</p>
                  </div>
                  <Link href="/signup"
                    className="syne text-xs tracking-widest uppercase px-6 py-2.5 rounded-full whitespace-nowrap"
                    style={{ border: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.5)" }}>
                    Start Free
                  </Link>
                </div>
              </div>
              {LIFETIME_PLANS.map(plan => (
                <div key={plan.name}
                  className={`card-hover rounded-3xl p-8 relative overflow-hidden ${plan.name.includes("Pro") ? "pricing-life-pro" : "pricing-life-agency"}`}>
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"
                    style={{ background: plan.color, filter: "blur(50px)", opacity: .1 }} />
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs syne tracking-widest font-700 mb-5"
                    style={{ background: plan.badgeBg, color: plan.badgeColor }}>{plan.badge}</div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="syne font-700 text-xl mb-1" style={{ color: plan.color === "#C9A84C" ? "#C9A84C" : "#9B6FDF" }}>{plan.name}</div>
                      <div className="text-xs syne line-through" style={{ color: "rgba(255,255,255,.25)" }}>{plan.orig}</div>
                    </div>
                    <div className="text-right">
                      <div className="shimmer-text font-700 syne" style={{ fontSize: "3rem", lineHeight: 1 }}>{plan.price}</div>
                      <div className="text-xs syne mt-1" style={{ color: "rgba(255,255,255,.35)" }}>one-time</div>
                    </div>
                  </div>
                  <SeatsBar taken={plan.taken} total={plan.total} />
                  <ul className="space-y-2.5 mt-6 mb-5">
                    {plan.features.map(f => (
                      <li key={f} className="text-sm flex gap-2.5 items-start" style={{ color: "rgba(255,255,255,.7)" }}>
                        <span style={{ color: plan.color === "#C9A84C" ? "#C9A84C" : "#9B6FDF", flexShrink: 0 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  {/* Upgrade teaser */}
                  <div className="mb-6 px-4 py-3 rounded-xl" style={{ background: "rgba(123,79,191,.08)", border: "1px solid rgba(123,79,191,.2)" }}>
                    <div className="text-xs syne tracking-widest uppercase mb-1.5" style={{ color: "#9B6FDF" }}>Next upgrade includes:</div>
                    {["TikTok content generator", "Short-form video hooks", "AI reel / video scripts", "Image generation", "Social auto-publishing"].map(u => (
                      <div key={u} className="flex items-center gap-1.5 mb-0.5 text-xs syne" style={{ color: "rgba(255,255,255,.4)" }}>
                        <span style={{ color: "#9B6FDF" }}>✓</span> {u}
                      </div>
                    ))}
                    <div className="mt-2 pt-2 text-xs syne" style={{ borderTop: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.25)" }}>
                      First 500 users get 1 month of upgrade free.
                    </div>
                  </div>
                  <a href={plan.href} target="_blank" rel="noopener noreferrer"
                    className="btn-primary block text-center py-4 rounded-2xl syne text-sm tracking-widest uppercase">
                    {plan.cta}
                  </a>
                  <p className="text-center text-xs syne mt-3" style={{ color: "rgba(255,255,255,.25)" }}>⚡ {plan.note}</p>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <p className="text-xs syne" style={{ color: "rgba(255,255,255,.2)" }}>All plans: Pi Network · USDC · Card via Dodo Payments</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PI LAUNCH
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="pi-launch" className="py-28 px-6 relative overflow-hidden">
        <div className="orb w-80 h-80 top-0 left-1/2 -translate-x-1/2" style={{ background: "#C9A84C" }} />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="text-7xl mb-6 font-700" style={{ color: "#C9A84C" }}>π</div>
          <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-6"
            style={{ border: "1px solid rgba(201,168,76,.3)", color: "#C9A84C", background: "rgba(201,168,76,.05)" }}>
            Pi Network Integration
          </div>
          <h2 className="text-4xl md:text-5xl font-700 mb-6" style={{ letterSpacing: "-0.02em" }}>
            First Major SaaS to Accept <span className="shimmer-text">Pi Network</span>
          </h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed mb-12 syne" style={{ color: "rgba(255,255,255,.5)" }}>
            TEOS AI Engine was built by a Pi pioneer. We&apos;re among the first SaaS platforms globally to accept Pi as real payment for an AI subscription product.
          </p>
          <div className="grid md:grid-cols-3 gap-5 text-left mb-12">
            {[
              { icon: "💜", title: "Pi Activation", desc: "Pay with Pi to unlock Pro or Agency tier instantly. Wallet-to-wallet. No friction." },
              { icon: "🏷", title: "50% Pioneer Discount", desc: "First 300 Pi users get 50% off any plan. Built-in loyalty for early believers." },
              { icon: "💳", title: "Multiple Rails", desc: "Pi Network, USDC/Solana, Dodo Payments, and card all accepted." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-6" style={{ background: "#0D0D0D", border: "1px solid rgba(201,168,76,.1)" }}>
                <div className="text-2xl mb-3">{icon}</div>
                <div className="syne font-700 text-sm mb-2" style={{ color: "#C9A84C" }}>{title}</div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,.45)" }}>{desc}</p>
              </div>
            ))}
          </div>
          <a href="/pay/pi" className="btn-primary syne text-sm tracking-widest uppercase px-10 py-4 rounded-full inline-flex items-center gap-2">
            π Activate With Pi — 50% Off
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          ROADMAP — What You're Buying Into
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: "#050505" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-5"
                style={{ border: "1px solid rgba(123,79,191,.35)", color: "#9B6FDF", background: "rgba(123,79,191,.06)" }}>
                Included In Next Upgrade
              </div>
              <h2 className="text-4xl md:text-5xl font-700 mb-5" style={{ letterSpacing: "-0.02em" }}>
                You&apos;re buying into<br /><span className="shimmer-text">the roadmap.</span>
              </h2>
              <p className="text-sm syne leading-relaxed mb-8" style={{ color: "rgba(255,255,255,.45)" }}>
                Every lifetime seat includes all future upgrades — no extra charge. First 500 users get one free month unlocked when TikTok generation ships.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs syne"
                style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.2)", color: "#C9A84C" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot" />
                First 500 users get 1 free month when TikTok ships
              </div>
            </div>
            <div className="space-y-3">
              {[
                { icon: "🎬", label: "TikTok content generator", status: "In development" },
                { icon: "🎥", label: "AI short-form video scripts", status: "In development" },
                { icon: "🎨", label: "Image generation", status: "In development" },
                { icon: "📡", label: "Social auto-publishing", status: "Planned" },
                { icon: "📅", label: "Post scheduling", status: "Planned" },
                { icon: "👥", label: "Team & agency workspaces", status: "Planned" },
              ].map(({ icon, label, status }) => (
                <div key={label} className="flex items-center justify-between px-5 py-4 rounded-xl"
                  style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,.05)" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm syne" style={{ color: "rgba(255,255,255,.75)" }}>{label}</span>
                  </div>
                  <span className="text-xs syne px-2.5 py-1 rounded-full"
                    style={{
                      background: status === "In development" ? "rgba(201,168,76,.1)" : "rgba(123,79,191,.1)",
                      color: status === "In development" ? "#C9A84C" : "#9B6FDF",
                      border: `1px solid ${status === "In development" ? "rgba(201,168,76,.2)" : "rgba(123,79,194,.2)"}`,
                    }}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────────────────────────── */}
      <section className="py-10 px-6" style={{ background: "#070707", borderTop: "1px solid rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 items-center">
            {[
              { icon: "🇪🇬", label: "Built in Alexandria" },
              { icon: "🦅", label: "Founder-led SaaS" },
              { icon: "π", label: "Pi-enabled launch" },
              { icon: "🟢", label: "Early users live now" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-base">{icon}</span>
                <span className="text-xs syne tracking-widest uppercase" style={{ color: "rgba(255,255,255,.35)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-36 px-6 relative overflow-hidden" style={{ background: "#070707" }}>
        <div className="orb w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: "#7B4FBF" }} />
        <div className="absolute inset-0 grid-bg" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="float mb-10">
            <img src="/tailogo.jpeg" alt="TEOS AI" className="w-28 h-28 object-contain mx-auto rounded-full"
              style={{ filter: "drop-shadow(0 0 30px rgba(123,79,191,.4))" }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
          <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-6"
            style={{ border: "1px solid rgba(201,168,76,.3)", color: "#C9A84C", background: "rgba(201,168,76,.05)" }}>
            🔥 First 50 Users Lifetime Offer Open
          </div>
          <h2 className="text-5xl md:text-7xl font-700 mb-5" style={{ letterSpacing: "-0.03em", lineHeight: 1.02 }}>
            Your first 5 posts<br /><span className="shimmer-text">are on us.</span>
          </h2>
          <p className="text-base syne mb-12" style={{ color: "rgba(255,255,255,.4)" }}>
            No credit card. No catch. Just stronger content — starting right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href="/signup" className="btn-primary syne text-sm tracking-widest uppercase px-10 py-5 rounded-full flex items-center justify-center gap-2">
              <span>✦</span> Start Free With 5 Posts
            </Link>
            <a href="#pricing" className="btn-ghost syne text-sm tracking-widest uppercase px-10 py-5 rounded-full flex items-center justify-center gap-2">
              View Lifetime Deals
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {SOCIAL.map(({ label, href, Icon, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="social-hover flex items-center gap-2 px-4 py-2 rounded-full text-xs syne"
                style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color }}>
                <Icon s={12} /> {label}
              </a>
            ))}
          </div>
          <p className="text-xs syne tracking-widest" style={{ color: "rgba(255,255,255,.2)" }}>
            37 / 50 lifetime seats claimed · Prices rise after TikTok + AI video + image upgrades ship
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer className="py-14 px-6" style={{ borderTop: "1px solid rgba(201,168,76,.08)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img src="/tailogo.jpeg" alt="TEOS" className="h-10 w-10 object-contain rounded-full"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div>
                  <div className="syne text-sm tracking-widest uppercase font-700" style={{ color: "#C9A84C" }}>TEOS AI Engine</div>
                  <div className="text-xs syne" style={{ color: "rgba(255,255,255,.25)" }}>Powered by Elmahrosa International</div>
                </div>
              </div>
              <p className="text-xs syne mb-1" style={{ color: "rgba(255,255,255,.25)" }}>Alexandria, Egypt 🇪🇬</p>
              <p className="text-xs syne mb-4" style={{ color: "rgba(255,255,255,.2)" }}>Est. 2007 · Software Division 2021</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot" />
                <span className="text-xs syne" style={{ color: "rgba(255,255,255,.3)" }}>Pi Launch Support Active</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs syne tracking-widest uppercase" style={{ color: "rgba(255,255,255,.2)" }}>Community</span>
              <div className="flex gap-3">
                <a href="https://twitter.com/KING_TEOS" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center social-hover"
                  style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", color: "white" }}>
                  <XI s={14} />
                </a>
                <a href="https://t.me/elmahrosapi" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center social-hover"
                  style={{ background: "rgba(42,171,238,.12)", border: "1px solid rgba(42,171,238,.2)", color: "#2AABEE" }}>
                  <TGI s={14} />
                </a>
                <a href="https://www.linkedin.com/company/teos-pharaoh-portal/?viewAsMember=true" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center social-hover"
                  style={{ background: "rgba(10,102,194,.12)", border: "1px solid rgba(10,102,194,.2)", color: "#5BA4CF" }}>
                  <LII s={14} />
                </a>
              </div>
              <div className="flex flex-col gap-1.5">
                <a href="https://twitter.com/KING_TEOS" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs syne hover:text-white transition-colors" style={{ color: "rgba(255,255,255,.3)" }}>
                  <XI s={10} /> @KING_TEOS
                </a>
                <a href="https://t.me/elmahrosapi" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs syne hover:text-white transition-colors" style={{ color: "rgba(255,255,255,.3)" }}>
                  <TGI s={10} /> #ElmahrosaPi
                </a>
                <a href="https://www.linkedin.com/company/teos-pharaoh-portal/?viewAsMember=true" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs syne hover:text-white transition-colors" style={{ color: "rgba(255,255,255,.3)" }}>
                  <LII s={10} /> Teos Pharaoh Portal
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-xs syne tracking-widest uppercase" style={{ color: "rgba(255,255,255,.2)" }}>Navigate</span>
              {[["Features", "#features"], ["Pricing", "#pricing"], ["Pi Launch", "#pi-launch"], ["Demo", "#demo"], ["Login", "/login"], ["Get Started", "/signup"]].map(([l, h]) => (
                <a key={l} href={h} className="text-xs syne hover:text-white transition-colors"
                  style={{ color: l === "Get Started" ? "#C9A84C" : "rgba(255,255,255,.35)" }}>
                  {l}
                </a>
              ))}
            </div>
          </div>
          <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(201,168,76,.15),transparent)", marginBottom: "20px" }} />
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs syne" style={{ color: "rgba(255,255,255,.2)" }}>
            <span>© 2025 Elmahrosa International · Alexandria, Egypt</span>
            <span style={{ color: "rgba(201,168,76,.4)" }}>AI That Sees What Others Miss. ✦</span>
          </div>
        </div>
      </footer>
    </div>
  );
}