'use client';

import { useState } from 'react';

const USDC_ADDR = process.env.NEXT_PUBLIC_USDC_SOL_ADDRESS || '59sj62fWNmVWRFhMQER8XEgR8CKNswTrb5kMJEMp8g8Y';
const PI_ADDR = process.env.NEXT_PUBLIC_PI_ADDRESS || 'MALYJFJ5SVD45FBWN2GT4IW67SEZ3IBOFSBSPUFCWV427NBNLG3PWAAAAAAAAAMHQDECQ';

export default function PaymentBlock() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <section id="pay" className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-semibold">How to pay</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Send your payment to the address below, then go to your dashboard and submit the transaction hash.
        Pi users get 50% off — first 300 users only.
      </p>
      <div className="mt-6 space-y-4">
        {[
          { label: 'USDC on Solana', addr: USDC_ADDR, key: 'usdc' },
          { label: 'Pi Network', addr: PI_ADDR, key: 'pi' },
        ].map(({ label, addr, key }) => (
          <div key={key} className="rounded-xl border border-white/10 bg-[#111118] p-4">
            <div className="mb-2 text-sm font-medium text-white">{label}</div>
            <div className="flex items-center gap-3">
              <code className="flex-1 break-all text-xs text-zinc-400 font-mono">{addr}</code>
              <button
                onClick={() => copy(addr, key)}
                className="shrink-0 rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/10 transition-colors"
              >
                {copied === key ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
          ⚠ Send only USDC on Solana to the Solana address, and only Pi to the Pi address.
          After sending, submit your TX hash from your dashboard. Confirmations are manual during launch.
        </div>
      </div>
    </section>
  );
}
