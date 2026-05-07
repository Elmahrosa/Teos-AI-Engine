'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessForm() {
  const searchParams = useSearchParams();
  const plan = (searchParams.get('plan') || 'pro') as 'pro' | 'agency' | 'starter';
  const [txHash, setTxHash] = useState('');
  const [network, setNetwork] = useState<'solana' | 'pi'>('solana');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitProof() {
    setError(null);
    setMessage(null);
    if (!txHash.trim()) { setError('Please enter your transaction hash or proof reference.'); return; }
    setLoading(true);
    try {
      const response = await fetch('/api/activate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, txHash: txHash.trim(), network }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.error || 'Failed to submit proof'); return; }
      setMessage('Payment proof submitted. Your upgrade is pending manual confirmation. You will be notified.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const planLabel = plan === 'agency' ? 'Agency — $69 USDC' : plan === 'pro' ? 'Pro — $29 USDC' : 'Starter (Free)';

  return (
    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-2 inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-300">Upgrade</div>
      <h1 className="mt-2 text-3xl font-bold">Submit payment proof</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Plan selected: <span className="font-medium text-white">{planLabel}</span>
      </p>
      <p className="mt-1 text-sm text-zinc-400">
        Paste your transaction hash below. The admin will confirm and activate your plan within 24 hours.
      </p>
      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-white">Payment network</label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value as 'solana' | 'pi')}
            className="w-full rounded-lg border border-white/20 bg-[#111118] p-3 text-white"
          >
            <option value="solana">USDC on Solana</option>
            <option value="pi">Pi Network</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-white">Transaction hash / proof reference</label>
          <input
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="e.g. 5VfY3...Kd9x or Pi payment reference"
            className="w-full rounded-lg border border-white/20 bg-[#111118] p-3 text-white placeholder-zinc-500"
          />
        </div>
        <button
          onClick={submitProof}
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 p-3 font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Submit payment proof'}
        </button>
        {message && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
            {message}
          </div>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
      <div className="mt-6 border-t border-white/10 pt-4">
        <a href="/dashboard" className="text-sm text-indigo-400 hover:underline">← Back to dashboard</a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-6 text-white">
      <Suspense fallback={<div className="text-zinc-400">Loading...</div>}>
        <SuccessForm />
      </Suspense>
    </main>
  );
}
