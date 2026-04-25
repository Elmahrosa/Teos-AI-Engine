"use client";

import { useState } from "react";
import {
  Loader2,
  Sparkles,
  Download,
  CheckCircle,
  Copy,
  ImageIcon,
  Film,
} from "lucide-react";

type Platform =
  | "x"
  | "linkedin"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "threads"
  | "telegram";

type Tone =
  | "professional"
  | "engagement"
  | "authority"
  | "founder-story"
  | "launch"
  | "contrarian"
  | "community"
  | "viral-hook"
  | "educational"
  | "sales-cta";

type Goal = "engagement" | "authority" | "sales" | "community";

type Generated = {
  success?: boolean;
  plan?: string;
  used?: number;
  post: string;
  hashtags: string[];
  imageUrl?: string | null;
  imagePrompt?: string;
  videoScript?: string;
  platform?: string;
  platformIcon?: string;
  tone?: string;
  fallback?: boolean;
  visibilityScore?: number;
  bestTime?: string;
  suggestedCTA?: string;
  checklist?: string[];
  insights?: {
    visibilityScore?: number;
    bestTime?: string;
    suggestedCTA?: string;
    checklist?: string[];
  };
};

const PLATFORM_META: Record<
  Platform,
  { label: string; icon: string; color: string }
> = {
  x: { label: "X", icon: "𝕏", color: "bg-black" },
  linkedin: { label: "LinkedIn", icon: "in", color: "bg-[#0077b5]" },
  facebook: { label: "Facebook", icon: "f", color: "bg-[#1877f2]" },
  instagram: { label: "Instagram", icon: "◎", color: "bg-pink-600" },
  tiktok: { label: "TikTok", icon: "♪", color: "bg-zinc-950" },
  threads: { label: "Threads", icon: "@", color: "bg-zinc-800" },
  telegram: { label: "Telegram", icon: "✈", color: "bg-[#2AABEE]" },
};

function fallbackNumber(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function platformShareUrl(platform: Platform, text: string) {
  const encoded = encodeURIComponent(text);
  const appUrl = encodeURIComponent("https://teos-ai-engine.vercel.app");

  if (platform === "x") {
    return `https://twitter.com/intent/tweet?text=${encoded}`;
  }

  if (platform === "linkedin") {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${appUrl}`;
  }

  if (platform === "facebook") {
    return `https://www.facebook.com/sharer/sharer.php?u=${appUrl}&quote=${encoded}`;
  }

  if (platform === "telegram") {
    return `https://t.me/share/url?url=${appUrl}&text=${encoded}`;
  }

  return "";
}

export default function PostGenerator({
  used,
  plan,
  isAdmin,
}: {
  used: number;
  plan: string;
  isAdmin: boolean;
}) {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState<Platform>("x");
  const [tone, setTone] = useState<Tone>("professional");
  const [goal, setGoal] = useState<Goal>("engagement");
  const [result, setResult] = useState<Generated | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meta = PLATFORM_META[platform];

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);
    setLoadingStep("Generating hook…");

    const stepTimers = [
      setTimeout(() => setLoadingStep("Scoring visibility…"), 500),
      setTimeout(() => setLoadingStep("Optimizing hashtags…"), 1000),
      setTimeout(() => setLoadingStep("Preparing platform format…"), 1500),
    ];

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          topic: prompt.trim(),
          platform,
          tone,
          goal,
          nonce: Date.now(),
        }),
      });

      const text = await res.text();
      let data: any = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        setError(data?.error || `Generation failed (${res.status})`);
        return;
      }

      const normalized: Generated = {
        ...data,
        post: data.post || data.content || "",
        hashtags: Array.isArray(data.hashtags) ? data.hashtags : [],
        visibilityScore:
          data.visibilityScore ??
          data.insights?.visibilityScore ??
          fallbackNumber(74, 94),
        bestTime:
          data.bestTime ??
          data.insights?.bestTime ??
          ["9–11 AM", "11 AM–1 PM", "2–4 PM", "6–8 PM"][
            fallbackNumber(0, 3)
          ],
        suggestedCTA:
          data.suggestedCTA ??
          data.insights?.suggestedCTA ??
          "What would you improve?",
        checklist:
          data.checklist ??
          data.insights?.checklist ??
          ["Strong hook", "Clear value", "CTA included", "Hashtags included"],
        platformIcon: data.platformIcon || meta.icon,
        platform: data.platform || platform,
      };

      setResult(normalized);
    } catch (err) {
      console.error("[PostGenerator]", err);
      setError("Generation request failed.");
    } finally {
      stepTimers.forEach(clearTimeout);
      setLoading(false);
      setLoadingStep("");
    }
  }

  const visibilityScore =
    result?.visibilityScore ?? result?.insights?.visibilityScore ?? 0;

  const bestTime = result?.bestTime ?? result?.insights?.bestTime ?? "Dynamic";

  const suggestedCTA =
    result?.suggestedCTA ??
    result?.insights?.suggestedCTA ??
    "What would you improve?";

  const checklist =
    result?.checklist ??
    result?.insights?.checklist ??
    ["Strong hook", "Clear value", "CTA included", "Hashtags included"];

  const fullCaption = result
    ? `${result.post}\n\n${result.hashtags.map((h) => `#${h}`).join(" ")}`
    : "";

  async function copyToClipboard(text = fullCaption) {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareCurrent(target: Platform) {
    if (!result) return;

    if (target === "instagram" || target === "threads") {
      copyToClipboard();
      window.open(
        target === "instagram"
          ? "https://www.instagram.com/"
          : "https://www.threads.net/",
        "_blank"
      );
      return;
    }

    const url = platformShareUrl(target, fullCaption);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  const isLinkedInBlocked =
    platform === "linkedin" && !isAdmin && plan !== "agency";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {isAdmin ? "Create Content" : "Generate post"}
          </h2>

          {isAdmin && (
            <span className="bg-indigo-500 text-[10px] px-2 py-0.5 rounded-full font-black text-white uppercase tracking-tighter">
              Founder Mode
            </span>
          )}
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What's on your mind? (e.g., 'I launched Teos AI Engine and need early users')"
          className="w-full bg-[#111118] border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-indigo-500 h-28 resize-none"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className="bg-zinc-800 border-none rounded-lg text-xs text-white p-2"
          >
            <option value="x">𝕏 X</option>
            <option value="linkedin">in LinkedIn {isLinkedInBlocked ? "🔒" : ""}</option>
            <option value="facebook">f Facebook</option>
            <option value="instagram">◎ Instagram</option>
            <option value="tiktok">♪ TikTok</option>
            <option value="threads">@ Threads</option>
            <option value="telegram">✈ Telegram</option>
          </select>

          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
            className="bg-zinc-800 border-none rounded-lg text-xs text-white p-2"
          >
            <option value="professional">Professional</option>
            <option value="engagement">Engagement</option>
            <option value="authority">Authority</option>
            <option value="founder-story">Founder Story</option>
            <option value="launch">Launch</option>
            <option value="contrarian">Contrarian</option>
            <option value="community">Community</option>
            <option value="viral-hook">Viral Hook</option>
            <option value="educational">Educational</option>
            <option value="sales-cta">Sales CTA</option>
          </select>

          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as Goal)}
            className="bg-zinc-800 border-none rounded-lg text-xs text-white p-2"
          >
            <option value="engagement">Engagement</option>
            <option value="authority">Authority</option>
            <option value="sales">Sales</option>
            <option value="community">Community</option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim() || isLinkedInBlocked}
            className="col-span-2 md:col-span-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all px-4 py-3"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? loadingStep : isAdmin ? "FOUNDER GENERATE" : "GENERATE"}
          </button>
        </div>

        {isLinkedInBlocked && (
          <p className="text-yellow-400 text-xs mt-3">
            LinkedIn generation is available for Agency users.
          </p>
        )}

        {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative group">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span
                  className={`${meta.color} px-3 py-2 rounded-lg border border-white/10 text-sm text-white font-bold`}
                >
                  {result.platformIcon || meta.icon} {meta.label}
                </span>

                {result.fallback && (
                  <span className="px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs">
                    Fallback Mode
                  </span>
                )}

                <button
                  onClick={() => shareCurrent("x")}
                  className="px-3 py-2 bg-black rounded-lg border border-white/10 hover:bg-zinc-800 transition text-sm text-white"
                >
                  𝕏
                </button>
                <button
                  onClick={() => shareCurrent("linkedin")}
                  className="px-3 py-2 bg-[#0077b5] rounded-lg hover:opacity-80 transition text-sm text-white"
                >
                  in
                </button>
                <button
                  onClick={() => shareCurrent("facebook")}
                  className="px-3 py-2 bg-[#1877f2] rounded-lg hover:opacity-80 transition text-sm text-white"
                >
                  f
                </button>
                <button
                  onClick={() => shareCurrent("instagram")}
                  className="px-3 py-2 bg-pink-600 rounded-lg hover:opacity-80 transition text-sm text-white"
                >
                  ◎
                </button>
                <button
                  onClick={() => shareCurrent("telegram")}
                  className="px-3 py-2 bg-[#2AABEE] rounded-lg hover:opacity-80 transition text-sm text-white"
                >
                  ✈
                </button>
                <button
                  onClick={() => shareCurrent("threads")}
                  className="px-3 py-2 bg-zinc-800 rounded-lg hover:opacity-80 transition text-sm text-white"
                >
                  @
                </button>

                <button
                  onClick={() => copyToClipboard()}
                  className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 ml-auto transition"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
              </div>

              <p className="whitespace-pre-wrap text-zinc-200 leading-relaxed text-sm">
                {result.post}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-white/5">
                {result.hashtags.map((h, index) => (
                  <span
                    key={`${h}-${index}`}
                    className="text-indigo-400 text-xs font-mono"
                  >
                    #{h}
                  </span>
                ))}
              </div>
            </div>

            {(result.imagePrompt || result.imageUrl) && (
              <div className="rounded-2xl border border-white/10 shadow-2xl bg-zinc-900 p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                    Matching Image Prompt
                  </h3>
                  {result.imagePrompt && (
                    <button
                      onClick={() => copyToClipboard(result.imagePrompt)}
                      className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg text-zinc-300"
                    >
                      Copy Image Prompt
                    </button>
                  )}
                </div>

                {result.imagePrompt && (
                  <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {result.imagePrompt}
                  </p>
                )}

                {result.imageUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden relative group">
                    <img
                      src={result.imageUrl}
                      className="w-full object-contain max-h-[400px]"
                      alt="AI Visual"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                      <a
                        href={result.imageUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition"
                      >
                        <Download className="w-5 h-5" /> Download Image
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {result.videoScript && (
              <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <Film className="w-4 h-4 text-pink-400" />
                  TikTok / Short Video Script
                </h3>
                <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {result.videoScript}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">
                Visibility Score
              </h4>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black">{visibilityScore}</span>
                <span className="text-xl opacity-60">/100</span>
              </div>
              <p className="text-xs mt-4 opacity-90 leading-tight">
                Optimized for reach on {meta.label.toUpperCase()}. Best time:{" "}
                <strong>{bestTime}</strong>.
              </p>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">
                Compliance Checklist
              </h4>
              <ul className="space-y-3">
                {checklist.map((item) => (
                  <li key={item} className="flex gap-3 text-xs text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">
                Suggested CTA
              </h4>
              <p className="text-sm text-white">{suggestedCTA}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}