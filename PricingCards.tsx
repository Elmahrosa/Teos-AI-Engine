'use client';

import Link from 'next/link';

export default function PricingCards() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-16 px-6 py-16">
      <h2 className="mb-4 text-center text-3xl font-bold">Simple pricing</h2>
      <p className="mb-10 text-center text-zinc-400">Start free. Upgrade when you need more.</p>
      <div className="grid gap-6 md:grid-cols-3">

        {/* Starter */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-zinc-300">Starter</h3>
          <p className="mt-4 text-4xl font-bold">Free</p>
          <p className="mt-1 text-sm text-zinc-400">Forever · no card required</p>
          <ul className="mt-6 space-y-2 text-sm text-zinc-300 flex-1">
            <li>✓ 10 posts</li>
            <li>✓ X, Facebook, Instagram</li>
            <li>✓ Branded image per post</li>
            <li>✓ Hashtag generator</li>
            <li>✓ Visibility insights</li>
          </ul>
          <Link
            href="/login"
            className="mt-8 block rounded-xl border border-white/20 py-2.5 text-center text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Get started free
          </Link>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border border-indigo-500 bg-indigo-500/5 p-6 shadow-lg shadow-indigo-500/10 flex flex-col">
          <div className="mb-3 inline-block rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">
            Most popular
          </div>
          <h3 className="text-lg font-semibold">Pro</h3>
          <p className="mt-4 text-4xl font-bold">
            $29 <span className="text-lg font-normal text-zinc-400">/ mo</span>
          </p>
          <p className="mt-1 text-sm text-indigo-300">$14.50 Pi · first 300 users</p>
          <ul className="mt-6 space-y-2 text-sm text-zinc-300 flex-1">
            <li>✓ Unlimited posts</li>
            <li>✓ X, Facebook, Instagram</li>
            <li>✓ Branded images</li>
            <li>✓ Hashtag generator</li>
            <li>✓ Save post history</li>
            <li>✓ Visibility insights</li>
          </ul>
          {/* Payment badges */}
          <div className="mt-4 flex flex-wrap gap-1.5 text-xs text-zinc-500">
            <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-2 py-0.5 text-blue-300">💳 PayPal</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">◎ USDC</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">π Pi</span>
          </div>
          <Link
            href="/login?plan=pro"
            className="mt-4 block rounded-xl bg-indigo-600 py-2.5 text-center text-sm font-semibold hover:bg-indigo-500 transition-colors"
          >
            Upgrade to Pro →
          </Link>
        </div>

        {/* Agency */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-zinc-300">Agency</h3>
          <p className="mt-4 text-4xl font-bold">
            $99 <span className="text-lg font-normal text-zinc-400">/ mo</span>
          </p>
          <p className="mt-1 text-sm text-zinc-400">$49.50 Pi · first 300 users</p>
          <ul className="mt-6 space-y-2 text-sm text-zinc-300 flex-1">
            <li>✓ Everything in Pro</li>
            <li>✓ LinkedIn posts</li>
            <li>✓ Priority support</li>
            <li>✓ Early access to new features</li>
          </ul>
          {/* Payment badges */}
          <div className="mt-4 flex flex-wrap gap-1.5 text-xs text-zinc-500">
            <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-2 py-0.5 text-blue-300">💳 PayPal</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">◎ USDC</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">π Pi</span>
          </div>
          <Link
            href="/login?plan=agency"
            className="mt-4 block rounded-xl border border-white/20 py-2.5 text-center text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Upgrade to Agency →
          </Link>
        </div>

      </div>

      {/* Payment methods notice */}
      <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-center text-sm text-zinc-400">
        Pay with{' '}
        <span className="font-medium text-blue-300">PayPal</span>,{' '}
        <span className="font-medium text-zinc-200">USDC on Solana</span>, or{' '}
        <span className="font-medium text-indigo-300">Pi Network</span>.{' '}
        Pi users get <span className="font-medium text-indigo-300">50% off</span> — first 300 users only.{' '}
        <a href="#pay" className="text-indigo-400 hover:underline">See payment details →</a>
      </div>
    </section>
  );
}
