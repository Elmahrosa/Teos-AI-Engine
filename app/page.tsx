import Link from "next/link";
import { PLANS } from "@/components/plans";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-indigo-950 to-[#0a0a0f]">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <div className="mb-4 inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
            Cleaned MVP
          </div>
          <h1 className="mb-5 text-5xl font-bold">
            AI Social Growth for <span className="text-indigo-400">Founders</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-300">
            Generate and store social posts for X, Instagram, and LinkedIn with a cleaner auth flow and a safer codebase.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login" className="rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-500">
              Start free
            </Link>
            <Link href="/dashboard" className="rounded-xl border border-white/20 px-8 py-3 font-semibold hover:bg-white/5">
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-center text-3xl font-bold">Pricing</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 ${
                plan.popular ? "border-indigo-500 bg-indigo-500/5" : "border-white/10 bg-white/5"
              }`}
            >
              {plan.popular && (
                <div className="mb-4 inline-block rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {plan.monthlyPrice === 0 ? "Free" : `$${plan.monthlyPrice}`}
                </span>
                {plan.monthlyPrice > 0 && <span className="text-zinc-400">/mo</span>}
              </div>
              <p className="mt-2 text-sm text-zinc-500">{plan.trial}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className={`text-sm ${f.ok ? "text-zinc-200" : "text-zinc-500 line-through"}`}>
                    {f.ok ? "✓" : "✕"} {f.text}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className={`mt-6 block w-full rounded-xl py-3 text-center font-semibold ${
                  plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
