'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const STARTER_SLOTS = 50;
const AGENCY_SLOTS = 25;
const PI_SLOTS = 300;

function SlotBar({ used, total, color }: { used: number; total: number; color: string }) {
  const pct = Math.min((used / total) * 100, 100);
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function AnimatedNumber({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{val}</>;
}

export default function PricingCards() {
  const starterUsed = 17;
  const agencyUsed = 8;
  const piUsed = 143;

  return (
    <section id="pricing" className="relative mx-auto max-w-6xl scroll-mt-16 px-6 py-20 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-indigo-600/20 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-0 left-20 w-[300px] h-[200px] rounded-full bg-purple-700/15 blur-[60px]" />
      <div className="pointer-events-none absolute bottom-0 right-20 w-[300px] h-[200px] rounded-full bg-pink-700/10 blur-[60px]" />

      <div className="relative text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-1.5 text-sm font-medium text-orange-300 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400" />
          </span>
          🚀 Launch Sale — Limited Slots Remaining
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Launch Sale{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Pricing
          </span>
        </h2>
        <p className="mt-4 text-lg">
          <span className="text-amber-300">🚀 Pi Pioneers Special</span>
          <span className="text-zinc-300"> — First </span>
          <span className="text-white font-bold">{PI_SLOTS} Pi users</span>
          <span className="text-zinc-300"> get </span>
          <span className="text-green-400 font-bold">50% OFF</span>
          <span className="text-zinc-300"> all plans</span>
        </p>
        <div className="mx-auto mt-3 flex max-w-sm items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-sm">
          <div className="text-left flex-1">
            <p className="text-zinc-400 text-xs">Pi Pioneer slots taken</p>
            <SlotBar used={piUsed} total={PI_SLOTS} color="bg-gradient-to-r from-indigo-500 to-purple-500" />
          </div>
          <div className="text-right shrink-0">
            <span className="text-2xl font-bold text-white"><AnimatedNumber target={PI_SLOTS - piUsed} /></span>
            <p className="text-xs text-indigo-300">left of {PI_SLOTS}</p>
          </div>
        </div>
      </div>

      <div className="relative mt-12 grid gap-6 md:grid-cols-3">

        {/* Starter */}
        <div className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all hover:border-purple-500/40 hover:bg-white/[0.06]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Starter</h3>
            <span className="rounded-full border border-green-400/30 bg-green-400/10 px-2.5 py-0.5 text-xs font-semibold text-green-300">Big Sale #1</span>
          </div>
          <div className="mb-1">
            <span className="text-zinc-500 line-through text-lg mr-2">$59</span>
            <span className="text-5xl font-extrabold text-white">$29</span>
          </div>
          <p className="text-sm font-semibold text-green-400 mb-1">3 Months for the Price of 1!</p>
          <p className="text-xs text-zinc-500 mb-2">1 month + 2 months FREE</p>
          <div className="mb-5 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs">
            <div className="flex justify-between mb-1">
              <span className="text-zinc-400">Slots remaining</span>
              <span className="font-bold text-white">{STARTER_SLOTS - starterUsed} / {STARTER_SLOTS}</span>
            </div>
            <SlotBar used={starterUsed} total={STARTER_SLOTS} color="bg-purple-500" />
          </div>
          <ul className="flex-1 space-y-2.5 text-sm text-zinc-300">
            {['10 posts included', 'X, Facebook, Instagram', 'Branded image per post', 'Hashtag generator', 'Visibility insights'].map(f => (
              <li key={f} className="flex items-center gap-2"><span className="text-purple-400">✓</span> {f}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-1.5 text-xs">
            <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-2 py-0.5 text-blue-300">💳 PayPal</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-zinc-400">◎ USDC</span>
            <span className="rounded-full border border-indigo-400/20 bg-indigo-500/5 px-2 py-0.5 text-indigo-300">π Pi</span>
          </div>
          <Link href="/login?plan=starter" className="mt-5 block rounded-xl border border-purple-500/50 bg-purple-500/10 py-3 text-center text-sm font-bold text-purple-200 transition-all hover:bg-purple-500/20 hover:border-purple-400">
            Subscribe Now →
          </Link>
          <p className="mt-2 text-center text-xs text-zinc-600">First {STARTER_SLOTS} users only</p>
        </div>

        {/* Pro */}
        <div className="group relative flex flex-col rounded-2xl border-2 border-indigo-500 bg-indigo-950/40 p-7 shadow-xl shadow-indigo-500/20 ring-1 ring-indigo-500/30 transition-all hover:shadow-indigo-500/30 hover:shadow-2xl">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-1.5 text-xs font-bold text-white shadow-lg">
            ⭐ Most Popular
          </div>
          <div className="mb-4 flex items-center justify-between mt-2">
            <h3 className="text-xl font-bold text-white">Pro</h3>
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">Pi Pioneers</span>
          </div>
          <div className="mb-1">
            <span className="text-zinc-500 line-through text-lg mr-2">$59</span>
            <span className="text-5xl font-extrabold text-white">$29</span>
          </div>
          <p className="text-sm font-semibold text-amber-300 mb-1">50% OFF for Pi Users → <span className="text-white">$14.50</span></p>
          <p className="text-xs text-zinc-500 mb-2">First 300 Pi users only</p>
          <div className="mb-5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-xs">
            <div className="flex justify-between mb-1">
              <span className="text-indigo-300">Pi slots remaining</span>
              <span className="font-bold text-white"><AnimatedNumber target={PI_SLOTS - piUsed} /> / {PI_SLOTS}</span>
            </div>
            <SlotBar used={piUsed} total={PI_SLOTS} color="bg-gradient-to-r from-indigo-500 to-purple-500" />
          </div>
          <ul className="flex-1 space-y-2.5 text-sm text-zinc-200">
            {['Unlimited posts', 'X, Facebook, Instagram', 'Branded images', 'Hashtag generator', 'Save post history', 'Visibility insights'].map(f => (
              <li key={f} className="flex items-center gap-2"><span className="text-indigo-400">✓</span> {f}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-1.5 text-xs">
            <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-2 py-0.5 text-blue-300">💳 PayPal</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-zinc-400">◎ USDC</span>
            <span className="rounded-full border border-indigo-400/20 bg-indigo-500/5 px-2 py-0.5 text-indigo-300">π Pi</span>
          </div>
          <Link href="/login?plan=pro" className="mt-5 block rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-center text-sm font-bold text-white transition-all hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30">
            Subscribe Now →
          </Link>
        </div>

        {/* Agency */}
        <div className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all hover:border-pink-500/40 hover:bg-white/[0.06]">
          <div className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-bold text-black">
            Best Value!
          </div>
          <div className="mb-4 flex items-center justify-between mt-2">
            <h3 className="text-xl font-bold text-white">Agency</h3>
            <span className="rounded-full border border-red-400/30 bg-red-400/10 px-2.5 py-0.5 text-xs font-semibold text-red-300">Big Sale #2</span>
          </div>
          <div className="mb-1">
            <span className="text-zinc-500 line-through text-lg mr-2">$414</span>
            <span className="text-5xl font-extrabold text-white">$69</span>
          </div>
          <p className="text-sm font-semibold text-green-400 mb-1">6 Months for the Price of 1!</p>
          <p className="text-xs text-zinc-500 mb-2">1 month + 5 months FREE</p>
          <div className="mb-5 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs">
            <div className="flex justify-between mb-1">
              <span className="text-zinc-400">Elite slots remaining</span>
              <span className="font-bold text-white">{AGENCY_SLOTS - agencyUsed} / {AGENCY_SLOTS}</span>
            </div>
            <SlotBar used={agencyUsed} total={AGENCY_SLOTS} color="bg-gradient-to-r from-pink-500 to-orange-500" />
          </div>
          <ul className="flex-1 space-y-2.5 text-sm text-zinc-300">
            {['Everything in Pro', 'LinkedIn posts', 'Priority support', 'Early access to new features', 'Agency branding'].map(f => (
              <li key={f} className="flex items-center gap-2"><span className="text-pink-400">✓</span> {f}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-1.5 text-xs">
            <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-2 py-0.5 text-blue-300">💳 PayPal</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-zinc-400">◎ USDC</span>
            <span className="rounded-full border border-indigo-400/20 bg-indigo-500/5 px-2 py-0.5 text-indigo-300">π Pi</span>
          </div>
          <Link href="/login?plan=agency" className="mt-5 block rounded-xl border border-pink-500/50 bg-pink-500/10 py-3 text-center text-sm font-bold text-pink-200 transition-all hover:bg-pink-500/20 hover:border-pink-400">
            Subscribe Now →
          </Link>
          <p className="mt-2 text-center text-xs text-zinc-600">First {AGENCY_SLOTS} users only</p>
        </div>

      </div>

      <div className="relative mt-10 flex flex-col items-center gap-3 rounded-2xl border border-orange-400/20 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-orange-500/5 px-6 py-5 text-center">
        <p className="text-base font-bold text-orange-300">
          🔥 Limited Launch Offer — Act Fast Before They&apos;re Gone!
        </p>
        <p className="text-sm text-zinc-400">
          Pay with <span className="font-semibold text-blue-300">PayPal</span>,{' '}
          <span className="font-semibold text-zinc-200">USDC on Solana</span>, or{' '}
          <span className="font-semibold text-indigo-300">Pi Network</span>.{' '}
          All plans are one-time payments — no recurring charges during launch.
        </p>
        <a href="#pay" className="text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-2">View payment options →</a>
      </div>
    </section>
  );
}
