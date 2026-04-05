"use client";

import { useState } from 'react';

type Platform = 'x' | 'facebook' | 'instagram' | 'linkedin';
type Tone = 'professional' | 'bold' | 'educational' | 'conversational';
type Goal = 'engagement' | 'authority' | 'sales' | 'community';

type Generated = {
  post: string;
  hashtags: string[];
  imageUrl: string;
  insights?: {
    visibilityScore: number;
    bestTime: string;
    suggestedCTA: string;
    checklist: string[];
  };
};

export default function PostGenerator({ used, plan }: { used: number; plan: string }) {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState<Platform>('x');
  const [tone, setTone] = useState<Tone>('professional');
  const [goal, setGoal] = useState<Goal>('engagement');
  const [generatedPost, setGeneratedPost] = useState<Generated | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) { setError('Please enter a topic or idea.'); return; }
    setIsGenerating(true);
    setError(null);
    setMessage(null);
    setNeedsUpgrade(false);
    setSaved(false);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform, tone, goal }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.upgrade) setNeedsUpgrade(true);
        throw new Error(data.error || 'Failed to generate post');
      }
      setGeneratedPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave() {
    if (!generatedPost) return;
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          platform,
          content: generatedPost.post,
          hashtags: generatedPost.hashtags,
          imageUrl: generatedPost.imageUrl,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save post');
      setMessage('Post saved. Refresh the page to see it in Saved posts.');
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCopy() {
    if (!generatedPost) return;
    await navigator.clipboard.writeText(
      generatedPost.post + '\n\n' + generatedPost.hashtags.join(' ')
    );
    setMessage('Post + hashtags copied to clipboard.');
  }

  const isLinkedInBlocked = platform === 'linkedin' && plan !== 'agency';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="mb-1 text-xl font-semibold">Generate post</h2>
          <p className="mb-5 text-sm text-zinc-400">
            Plan: <span className="font-medium text-white">{plan}</span>
            {plan === 'starter' && <span className="ml-2 text-zinc-500">· {used}/10 posts used</span>}
          </p>
        </div>
        <div className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300 whitespace-nowrap">
          AI visibility mode
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-white">Topic or idea</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g. Why AI is changing how brands get discovered online"
          className="w-full rounded-lg border border-white/20 bg-[#111118] p-3 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          rows={4}
        />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-white">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className="w-full rounded-lg border border-white/20 bg-[#111118] p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
          >
            <option value="x">X (Twitter)</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn (Agency only)</option>
          </select>
          {isLinkedInBlocked && (
            <p className="mt-1 text-xs text-amber-400">LinkedIn requires Agency plan</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
            className="w-full rounded-lg border border-white/20 bg-[#111118] p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
          >
            <option value="professional">Professional</option>
            <option value="bold">Bold</option>
            <option value="educational">Educational</option>
            <option value="conversational">Conversational</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white">Goal</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as Goal)}
            className="w-full rounded-lg border border-white/20 bg-[#111118] p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
          >
            <option value="engagement">Engagement</option>
            <option value="authority">Authority</option>
            <option value="sales">Sales</option>
            <option value="community">Community</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || isLinkedInBlocked}
        className="w-full rounded-lg bg-indigo-600 p-3 font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating ? 'Generating…' : 'Generate post'}
      </button>

      {isGenerating && (
        <p className="mt-3 text-sm text-indigo-300 text-center">
          Creating post, hashtags, visual, and visibility insights…
        </p>
      )}

      {needsUpgrade && (
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
          <p className="text-sm text-amber-200 font-medium">You've reached the 10-post Starter limit.</p>
          <a
            href="/#pricing"
            className="mt-2 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Upgrade to Pro — $29 USDC →
          </a>
        </div>
      )}

      {error && !needsUpgrade && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}

      {generatedPost && (
        <div className="mt-6 space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-white">Generated post</h3>
            {generatedPost.insights && (
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 whitespace-nowrap">
                Visibility: {generatedPost.insights.visibilityScore}/100
              </div>
            )}
          </div>

          <div className="rounded-lg bg-[#111118] p-4">
            <p className="whitespace-pre-wrap text-sm text-white leading-relaxed">{generatedPost.post}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-medium text-white">Hashtags</h4>
              <div className="flex flex-wrap gap-1.5">
                {generatedPost.hashtags.map((tag, i) => (
                  <span key={i} className="rounded-full bg-indigo-500/20 px-2.5 py-1 text-xs text-indigo-300">
                    {tag}
                  </span>
                ))}
              </div>
              {generatedPost.insights && (
                <div className="mt-4 rounded-lg border border-white/10 bg-[#111118] p-3 text-sm">
                  <p className="text-zinc-300">
                    <span className="font-medium text-white">Best time: </span>
                    {generatedPost.insights.bestTime}
                  </p>
                  <p className="mt-1.5 text-zinc-300">
                    <span className="font-medium text-white">CTA tip: </span>
                    {generatedPost.insights.suggestedCTA}
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-zinc-400">
                    {generatedPost.insights.checklist.map((item) => (
                      <li key={item} className="flex items-start gap-1.5">
                        <span className="text-indigo-400 mt-0.5">·</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-white">Preview image</h4>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedPost.imageUrl}
                alt="Generated post image"
                className="w-full rounded-lg object-cover"
                style={{ maxHeight: '200px' }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 rounded-lg bg-indigo-600 p-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              Copy post + hashtags
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || saved}
              className="flex-1 rounded-lg border border-white/20 bg-white/5 p-2.5 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-60 transition-colors"
            >
              {saved ? '✓ Saved' : isSaving ? 'Saving…' : 'Save post'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
