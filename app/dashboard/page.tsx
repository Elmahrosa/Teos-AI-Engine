// Add this state + form inside DashboardPage component
"use client";
import { useState } from "react";

export default function DashboardPage() {
  // ... existing code ...
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState<"x" | "instagram" | "linkedin">("x");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, platform }),
      });
      const data = await res.json();
      if (data.post) setResult(data.post);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add this section above the "Saved posts" section:
  <section className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
    <h2 className="mb-3 text-xl font-semibold">Generate New Post</h2>
    <form onSubmit={handleGenerate} className="space-y-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="What do you want to post about?"
        className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm min-h-[100px]"
        required
      />
      <div className="flex gap-2">
        {(["x", "instagram", "linkedin"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            className={`px-4 py-2 rounded-lg text-sm capitalize ${
              platform === p ? "bg-indigo-600" : "bg-white/5 hover:bg-white/10"
            } ${p === "linkedin" && user.plan !== "agency" ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={p === "linkedin" && user.plan !== "agency"}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Post"}
      </button>
    </form>
    {result && (
      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
        <p className="text-sm whitespace-pre-wrap">{result}</p>
      </div>
    )}
  </section>
