'use client';

import { useState } from 'react';
import { PAYMENT_CONFIG } from '@/lib/payments';

const USDC_ADDR = PAYMENT_CONFIG.usdcSol;
const PI_ADDR   = PAYMENT_CONFIG.pi;
const PAYPAL_ME = PAYMENT_CONFIG.paypal;

type Plan = 'pro' | 'agency';

const PLAN_AMOUNTS: Record<Plan, { usdc: number; pi: number; paypal: number }> = {
  pro:    { usdc: 29,  pi: 14.5, paypal: 29  },
  agency: { usdc: 99,  pi: 49.5, paypal: 99  },
};

interface PaymentBlockProps {
  plan?: Plan;
}

export default function PaymentBlock({ plan = 'pro' }: PaymentBlockProps) {
  const [copied, setCopied]   = useState<string | null>(null);
  const [method, setMethod]   = useState<'usdc' | 'pi' | 'paypal'>('paypal');
  const amounts               = PLAN_AMOUNTS[plan];

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  function paypalLink() {
    // PayPal.me with amount pre-filled: https://paypal.me/Username/29USD
    return `${PAYPAL_ME}/${amounts.paypal}USD`;
  }

  return (
    <section id="pay" className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-semibold">Complete your payment</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Choose your payment method. Pi users get <span className="text-indigo-300 font-medium">50% off</span> — first 300 users only.
      </p>

      {/* Method selector */}
      <div className="mt-6 flex gap-2 flex-wrap">
        {[
          { key: 'paypal', label: '💳 PayPal', sub: `$${amounts.paypal} USD` },
          { key: 'usdc',   label: '◎ USDC',   sub: `$${amounts.usdc} on Solana` },
          { key: 'pi',     label: 'π Pi',     sub: `${amounts.pi} Pi (50% off)` },
        ].map(({ key, label, sub }) => (
          <button
            key={key}
            onClick={() => setMethod(key as typeof method)}
            className={`flex-1 min-w-[140px] rounded-xl border p-3 text-left transition-all ${
              method === key
                ? 'border-indigo-500 bg-indigo-500/10 text-white'
                : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
            }`}
          >
            <div className="font-medium text-sm">{label}</div>
            <div className="text-xs mt-0.5 text-zinc-500">{sub}</div>
          </button>
        ))}
      </div>

      {/* PayPal */}
      {method === 'paypal' && (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-300 font-semibold text-sm">PayPal — Instant · Secure</span>
            </div>
            <p className="text-sm text-zinc-400 mb-4">
              Click below to pay <span className="text-white font-medium">${amounts.paypal} USD</span> via PayPal.
              After payment, copy your PayPal Transaction ID and submit it from your dashboard.
            </p>
            <a
              href={paypalLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-xl bg-[#0070ba] hover:bg-[#003087] py-3 text-center text-sm font-semibold text-white transition-colors"
            >
              Pay ${amounts.paypal} with PayPal →
            </a>
            <p className="mt-3 text-xs text-zinc-500 text-center">
              You will be redirected to paypal.me — a secure PayPal payment page.
            </p>
          </div>
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
            ⚠ After paying on PayPal, copy your <strong>Transaction ID</strong> from the PayPal receipt email,
            then submit it from your dashboard. Activation is manual during launch — usually within a few hours.
          </div>
        </div>
      )}

      {/* USDC on Solana */}
      {method === 'usdc' && (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-white/10 bg-[#111118] p-4">
            <div className="mb-2 text-sm font-medium text-white">
              Send <span className="text-indigo-300">${amounts.usdc} USDC</span> on Solana to:
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 break-all text-xs text-zinc-400 font-mono">{USDC_ADDR}</code>
              <button
                onClick={() => copy(USDC_ADDR, 'usdc')}
                className="shrink-0 rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/10 transition-colors"
              >
                {copied === 'usdc' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
            ⚠ Send only <strong>USDC on Solana</strong> to this address. After sending, submit your
            TX hash from your dashboard.
          </div>
        </div>
      )}

      {/* Pi Network */}
      {method === 'pi' && (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-white/10 bg-[#111118] p-4">
            <div className="mb-2 text-sm font-medium text-white">
              Send <span className="text-indigo-300">{amounts.pi} Pi</span> to:
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 break-all text-xs text-zinc-400 font-mono">{PI_ADDR}</code>
              <button
                onClick={() => copy(PI_ADDR, 'pi')}
                className="shrink-0 rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/10 transition-colors"
              >
                {copied === 'pi' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/10 p-4 text-sm text-indigo-200">
            π Pi users get 50% off — first 300 users only. After sending, submit your TX hash from your dashboard.
          </div>
        </div>
      )}
    </section>
  );
}
