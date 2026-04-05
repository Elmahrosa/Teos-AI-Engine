'use client';

import { useState } from 'react';

interface PaypalSubmitProps {
  plan: 'pro' | 'agency';
  onSuccess?: () => void;
}

const AMOUNTS = { pro: 29, agency: 99 };

export default function PaypalSubmit({ plan, onSuccess }: PaypalSubmitProps) {
  const [txId,    setTxId]    = useState('');
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState<{ ok: boolean; text: string } | null>(null);

  async function submit() {
    if (!txId.trim()) { setMsg({ ok: false, text: 'Please enter your PayPal Transaction ID.' }); return; }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/paypal-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, paypalTxId: txId.trim(), amount: AMOUNTS[plan] }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ ok: true, text: data.message });
        setTxId('');
        onSuccess?.();
      } else {
        setMsg({ ok: false, text: data.error || 'Submission failed.' });
      }
    } catch {
      setMsg({ ok: false, text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-5 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-blue-200">Submit PayPal Transaction ID</h3>
        <p className="mt-1 text-xs text-zinc-400">
          After paying on PayPal, find your Transaction ID in your PayPal receipt email
          (format: <code className="text-zinc-300">5ML12345XX1234567</code>).
          Paste it below to complete your upgrade.
        </p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={txId}
          onChange={e => setTxId(e.target.value)}
          placeholder="PayPal Transaction ID (e.g. 5ML12345XX1234567)"
          className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-400 focus:outline-none"
        />
        <button
          onClick={submit}
          disabled={loading}
          className="rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white transition-colors"
        >
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </div>
      {msg && (
        <p className={`text-xs rounded-lg px-3 py-2 ${msg.ok ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
          {msg.ok ? '✓ ' : '✗ '}{msg.text}
        </p>
      )}
    </div>
  );
}
