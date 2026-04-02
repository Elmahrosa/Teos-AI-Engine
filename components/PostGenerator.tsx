"use client";

import { useState } from "react";

type Platform = "x" | "instagram" | "linkedin";

export default function PostGenerator() {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState<Platform>("x");
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setPost("");
    setHashtags([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, platform }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to generate post");
        return;
      }

      setPost(data.post || "");
      setHashtags(Array.isArray(data.hashtags) ? data.hashtags : []);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-3 text-xl font-semibold">Generate post</h2>
      <p className="mb-4 text-sm text-zinc-400">
        Enter one idea and generate a ready-to-post draft.
      </p>

      <textarea
        className="min-h-[140px] w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
        placeholder="Example: announce our AI social tool launch for founders"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {(["x", "instagram", "linkedin"] as Platform[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPlatform(item)}
            className={`rounded-xl px-4 py-2 text-sm capitalize ${
              platform === item
                ? "bg-indigo-600 text-white"
                : "border border-white/10 bg-white/5 text-zinc-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="mt-4 rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

      {post ? (
        <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="mb-2 text-xs uppercase tracking-[0.12em] text-zinc-500">
            Result
          </div>
          <p className="whitespace-pre-wrap text-sm text-zinc-100">{post}</p>
          {hashtags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
