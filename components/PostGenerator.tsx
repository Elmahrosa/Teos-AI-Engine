"use client";

import { useState } from 'react';
import { Loader2, Sparkles, Image as ImageIcon, Download, CheckCircle, Copy } from 'lucide-react';

type Platform = 'x' | 'facebook' | 'instagram' | 'linkedin';
type Tone = 'professional' | 'bold' | 'educational' | 'conversational';
type Goal = 'engagement' | 'authority' | 'sales' | 'community';

type Generated = {
  post: string;
  hashtags: string[];
  imageUrl: string;
  insights: {
    visibilityScore: number;
    bestTime: string;
    suggestedCTA: string;
    checklist: string[];
  };
};

export default function PostGenerator({ used, plan, isAdmin }: { used: number; plan: string; isAdmin: boolean }) {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState<Platform>('x');
  const [tone, setTone] = useState<Tone>('professional');
  const [goal, setGoal] = useState<Goal>('engagement');
  const [result, setResult] = useState<Generated | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, platform, tone, goal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${result.post}\n\n${result.hashtags.join(' ')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Logic: LinkedIn is only blocked if user is NOT admin AND NOT on agency plan
  const isLinkedInBlocked = platform === 'linkedin' && !isAdmin && plan !== 'agency';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── INPUT CARD ── */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold text-white">Create Content</h2>
           {isAdmin && <span className="bg-indigo-500 text-[10px] px-2 py-0.5 rounded-full font-black text-white">FOUNDER MODE</span>}
        </div>
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What's on your mind? (e.g., 'Sovereign tech in Egypt')"
          className="w-full bg-[#111118] border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-indigo-500 h-28 resize-none"
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)} className="bg-zinc-800 border-none rounded-lg text-xs text-white p-2">
            <option value="x">X (Twitter)</option>
            <option value="linkedin">LinkedIn {isLinkedInBlocked ? '🔒' : ''}</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
          </select>

          <select value={tone} onChange={(e) => setTone(e.target.value as Tone)} className="bg-zinc-800 border-none rounded-lg text-xs text-white p-2">
            <option value="professional">Professional</option>
            <option value="bold">Bold</option>
            <option value="educational">Educational</option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt || isLinkedInBlocked}
            className="col-span-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {isAdmin ? "FOUNDER GENERATE" : "GENERATE"}
          </button>
        </div>
        {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
      </div>

      {/* ── RESULTS ── */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative group">
              <button onClick={copyToClipboard} className="absolute top-4 right-4 p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              </button>
              <p className="whitespace-pre-wrap text-zinc-200 leading-relaxed">{result.post}</p>
              <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-white/5">
                {result.hashtags.map((h) => (
                  <span key={h} className="text-indigo-400 text-xs font-mono">#{h}</span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
              <img src={result.imageUrl} className="w-full object-cover max-h-[400px]" alt="AI Visual" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <a href={result.imageUrl} target="_blank" className="bg-white text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                   <Download className="w-4 h-4" /> Download Image
                 </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Visibility Score</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black">{result.insights.visibilityScore}</span>
                <span className="text-xl opacity-60">/100</span>
              </div>
              <p className="text-xs mt-4 opacity-90 leading-tight">
                Optimized for high reach on {platform.toUpperCase()}. Best time to post: <strong>{result.insights.bestTime}</strong>.
              </p>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Post Checklist</h4>
              <ul className="space-y-3">
                {result.insights.checklist.map((item) => (
                  <li key={item} className="flex gap-3 text-xs text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}