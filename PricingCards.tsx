"use client";

export default function PricingCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3 mt-6">

      {/* Starter */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-xl font-semibold text-white">Starter</h3>
        <p className="mt-2 text-sm text-zinc-400">
          Free launch plan
        </p>

        <div className="mt-4 text-3xl font-bold text-white">
          $0
        </div>

        <ul className="mt-4 space-y-2 text-sm text-zinc-300">
          <li>• 10 posts maximum</li>
          <li>• X (Twitter) generation</li>
          <li>• Basic AI mode</li>
        </ul>

        <button
          disabled
          className="mt-6 w-full rounded-lg bg-zinc-700 py-2 text-sm text-white opacity-60 cursor-not-allowed"
        >
          Current Plan
        </button>
      </div>

      {/* Pro */}
      <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-6">
        <h3 className="text-xl font-semibold text-white">Pro</h3>
        <p className="mt-2 text-sm text-zinc-400">
          For creators & marketers
        </p>

        <div className="mt-4 text-3xl font-bold text-white">
          $19<span className="text-sm text-zinc-400">/month</span>
        </div>

        <ul className="mt-4 space-y-2 text-sm text-zinc-300">
          <li>• 50 posts/day</li>
          <li>• X, Facebook, Instagram</li>
          <li>• Advanced AI generation</li>
        </ul>

        <div className="mt-4 text-xs text-zinc-400">
          Payment handled via Dodo during launch.
        </div>

        <button className="mt-6 w-full rounded-lg bg-purple-600 py-2 text-sm text-white hover:bg-purple-700">
          Upgrade to Pro
        </button>
      </div>

      {/* Agency */}
      <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">
        <h3 className="text-xl font-semibold text-white">Agency</h3>
        <p className="mt-2 text-sm text-zinc-400">
          For teams & power users
        </p>

        <div className="mt-4 text-3xl font-bold text-white">
          $49<span className="text-sm text-zinc-400">/month</span>
        </div>

        <ul className="mt-4 space-y-2 text-sm text-zinc-300">
          <li>• Unlimited posts</li>
          <li>• All platforms + LinkedIn</li>
          <li>• Priority generation</li>
        </ul>

        <div className="mt-4 text-xs text-zinc-400">
          Payment handled via Dodo during launch.
        </div>

        <button className="mt-6 w-full rounded-lg bg-yellow-500 py-2 text-sm text-black hover:bg-yellow-400">
          Go Agency
        </button>
      </div>

    </div>
  );
}