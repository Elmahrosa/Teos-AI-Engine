"use client";

import { useState } from "react";

const platforms = ["X (Twitter)", "LinkedIn", "Instagram", "Facebook", "TikTok"];

const sampleOutputs: Record<string, string[]> = {
  "X (Twitter)": [
    "Egypt's AI future isn't imported — it's built. 🇪🇬\n\nTeos AI Engine is the first sovereign content engine running on Egyptian infrastructure.\n\nNo data leaves Egypt. Your content, your rules.\n\nJoin the waitlist → teos-ai-engine.vercel.app",
    "7 platforms. 1 prompt. Infinite possibilities.\n\nTeos AI generates platform-optimized content across X, LinkedIn, Instagram, Facebook, TikTok, Threads, and Telegram.\n\nSave 10+ hours/week. Launching now.",
  ],
  LinkedIn: [
    "The era of sovereign AI has arrived in Egypt.\n\nFor too long, African and Middle Eastern creators have relied on foreign AI platforms with unclear data policies.\n\nTeos AI Engine changes this:\n• All processing on Egyptian infrastructure\n• Zero data leakage to third parties\n• Built in Alexandria, by Egyptians, for the world\n\nWe're not just building a tool — we're building digital sovereignty.\n\n#SovereignAI #Egypt #ContentCreation",
    "Content creation at scale is broken.\n\nEither you spend hours writing posts, or you use generic AI that doesn't understand your brand voice.\n\nTeos AI Engine solves both:\n1. Train AI on your existing content\n2. Generate platform-optimized posts in seconds\n3. Schedule across 7 platforms\n\nYour brand voice, amplified.\n\n#AI #ContentMarketing #Productivity",
  ],
  Instagram: [
    "Your content strategy deserves better than copy-paste. ✨\n\nTeos AI Engine generates scroll-stopping content for every platform — optimized for each audience.\n\nFrom X threads to Instagram captions, we've got you covered.\n\nBuilt in Alexandria. Sovereign by design.\n\n#TeosAI #ContentCreation #Egypt #SovereignAI",
    "Stop posting the same content everywhere. 🔄\n\nEach platform has its own language, format, and audience.\n\nTeos AI Engine creates platform-specific content from one prompt:\n• Short & punchy for X\n• Professional for LinkedIn\n• Visual for Instagram\n\nYour brand voice stays consistent. Your content gets optimized.\n\n#SocialMediaStrategy #AIContent #Egypt",
  ],
  Facebook: [
    "Big news for Egyptian creators! 🇪🇬\n\nTeos AI Engine is here — Egypt's first sovereign AI content engine.\n\n✅ AI-powered post generation\n✅ 7 platform support\n✅ Egyptian infrastructure\n✅ Your data stays in Egypt\n\nStart free at teos-ai-engine.vercel.app",
  ],
  TikTok: [
    "POV: You just found the AI tool that writes your content for every platform 🤯\n\nX ✓ LinkedIn ✓ Instagram ✓ Facebook ✓ TikTok ✓ Threads ✓ Telegram ✓\n\nTeos AI Engine = sovereign. Egyptian. Powerful.\n\n#AI #ContentCreator #Egypt #SovereignTech",
  ],
};

export default function Demo() {
  const [platform, setPlatform] = useState("X (Twitter)");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput("");
    await new Promise((r) => setTimeout(r, 1500));
    const outputs = sampleOutputs[platform] || sampleOutputs["X (Twitter)"];
    const idx = Math.floor(Math.random() * outputs.length);
    setOutput(outputs[idx]);
    setLoading(false);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="demo" className="section-padding relative overflow-hidden">
      <div className="hero-glow bg-teal-500/10 bottom-0 right-0" />

      <div className="section-container relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="section-label">Demo</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            See It in{" "}
            <span className="gradient-teal">Action</span>
          </h2>
          <p className="text-[#8a88a0] text-lg">
            Select a platform, enter your topic, and watch AI generate platform-optimized content instantly.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-white/[0.08] bg-bg-card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/[0.08] px-5 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/50" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <span className="h-3 w-3 rounded-full bg-green-500/50" />
              </div>
              <span className="ml-3 text-xs text-[#8a88a0] font-mono">teos-ai-terminal</span>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#8a88a0] mb-2">
                  Select Platform
                </label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPlatform(p);
                        setOutput("");
                      }}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        platform === p
                          ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                          : "bg-white/[0.04] text-[#8a88a0] border border-white/[0.06] hover:border-white/[0.15]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8a88a0] mb-2">
                  What do you want to post about?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && generate()}
                    placeholder="e.g., Launching a new AI feature..."
                    className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-[#e8e6f0] placeholder-[#5a5870] outline-none focus:border-teal-500/40 transition-colors"
                  />
                  <button
                    onClick={generate}
                    disabled={loading || !prompt.trim()}
                    className="btn-teal text-sm px-6 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      "Generate"
                    )}
                  </button>
                </div>
              </div>

              {output && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[#8a88a0]">Generated Content</label>
                    <button
                      onClick={copyOutput}
                      className="flex items-center gap-1.5 text-xs text-[#8a88a0] hover:text-teal-400 transition-colors"
                    >
                      {copied ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
                    <pre className="text-sm text-[#e8e6f0] whitespace-pre-wrap font-sans leading-relaxed">
                      {output}
                    </pre>
                  </div>
                </div>
              )}

              {!output && !loading && (
                <div className="rounded-xl border border-dashed border-white/[0.06] p-8 text-center">
                  <p className="text-sm text-[#5a5870]">
                    Enter a topic and click Generate to see Teos AI in action
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
