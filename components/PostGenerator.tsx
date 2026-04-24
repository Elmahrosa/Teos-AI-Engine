"use client";

import { useState } from "react";
import { Loader2, Sparkles, Download, CheckCircle, Copy } from "lucide-react";

type Platform = "x" | "facebook" | "instagram" | "linkedin";
type Tone = "professional" | "bold" | "educational" | "conversational";
type Goal = "engagement" | "authority" | "sales" | "community";

type Generated = {
  success: boolean;
  plan: string;
  used: number;
  post: string;
  hashtags: string[];
  imageUrl: string | null;
  insights: {
    visibilityScore: number;
    bestTime: string;
    suggestedCTA: string;
    checklist: string[];
  };
};

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
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

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
          platform,
          tone,
          goal,
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

      setResult(data as Generated);
    } catch (err) {
      console.error("[PostGenerator]", err);
      setError("Generation request failed.");
    } finally {
      setLoading(false);
    }
  }

  const fullCaption = result
    ? `${result.post}\n\n${result.hashtags.map((h) => `#${h}`).join(" ")}`
    : "";

  async function copyToClipboard() {
    if (!result) return;
    await navigator.clipboard.writeText(fullCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareToX() {
    if (!result) return;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullCaption)}`,
      "_blank"
    );
  }

  function shareToLinkedIn() {
    if (!result) return;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        "https://teos-ai-engine.vercel.app"
      )}`,
      "_blank"
    );
  }

  function shareToFacebook() {
    if (!result) return;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        "https://teos-ai-engine.vercel.app"
      )}&quote=${encodeURIComponent(fullCaption)}`,
      "_blank"
    );
  }

  async function openInstagramHelper() {
    if (!result) return;
    await navigator.clipboard.writeText(fullCaption);
    window.open("https://www.instagram.com/", "_blank");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          placeholder="What's on your mind? (e.g., 'Sovereign tech in Egypt')"
          className="w-full bg-[#111118] border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-indigo-500 h-28 resize-none"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className="bg-zinc-800 border-none rounded-lg text-xs text-white p-2"
          >
            <option value="x">X (Twitter)</option>
            <option value="linkedin">
              LinkedIn {isLinkedInBlocked ? "🔒" : ""}
            </option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
          </select>

          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
            className="bg-zinc-800 border-none rounded-lg text-xs text-white p-2"
          >
            <option value="professional">Professional</option>
            <option value="bold">Bold</option>
            <option value="educational">Educational</option>
            <option value="conversational">Conversational</option>
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
            className="col-span-2 md:col-span-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all px-4"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isAdmin ? "FOUNDER GENERATE" : "GENERATE"}
          </button>
        </div>

        {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative group">
              <div className="flex gap-2 mb-4 flex-wrap">
                <button onClick={shareToX} className="px-3 py-2 bg-black rounded-lg border border-white/10 hover:bg-zinc-800 transition text-sm text-white">
                  X
                </button>
                <button onClick={shareToLinkedIn} className="px-3 py-2 bg-[#0077b5] rounded-lg hover:opacity-80 transition text-sm text-white">
                  LinkedIn
                </button>
                <button onClick={shareToFacebook} className="px-3 py-2 bg-[#1877f2] rounded-lg hover:opacity-80 transition text-sm text-white">
                  Facebook
                </button>
                <button onClick={openInstagramHelper} className="px-3 py-2 bg-pink-600 rounded-lg hover:opacity-80 transition text-sm text-white">
                  Instagram
                </button>
                <button onClick={copyToClipboard} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 ml-auto transition">
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
                {result.hashtags.map((h) => (
                  <span key={h} className="text-indigo-400 text-xs font-mono">
                    #{h}
                  </span>
                ))}
              </div>
            </div>

            {result.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group bg-zinc-900">
                <img src={result.imageUrl} className="w-full object-contain max-h-[400px]" alt="AI Visual" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  <a href={result.imageUrl} download target="_blank" className="bg-white text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition">
                    <Download className="w-5 h-5" /> Download Image
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">
                Visibility Score
              </h4>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black">
                  {result.insights.visibilityScore}
                </span>
                <span className="text-xl opacity-60">/100</span>
              </div>
              <p className="text-xs mt-4 opacity-90 leading-tight">
                Optimized for reach on {platform.toUpperCase()}. Best time:{" "}
                <strong>{result.insights.bestTime}</strong>.
              </p>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">
                Compliance Checklist
              </h4>
              <ul className="space-y-3">
                {result.insights.checklist.map((item) => (
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
              <p className="text-sm text-white">
                {result.insights.suggestedCTA}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}