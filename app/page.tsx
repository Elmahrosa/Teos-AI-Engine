import Link from "next/link";
import PaymentBlock from "@/components/PaymentBlock";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#07070b] text-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-zinc-300">
            Built with Love from Egypt 🇪🇬 · Now Live
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight md:text-6xl">
            Teos AI Engine
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-300 md:text-xl">
            AI-powered content generation for X, Facebook, Instagram, and LinkedIn.
            Turn ideas into high-impact, platform-optimized posts in seconds.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:opacity-90"
            >
              Get Started Free
            </Link>

            <a
              href="#pricing"
              className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
            >
              View Pricing
            </a>
          </div>

          <p className="mt-4 text-sm text-zinc-400">
            Starter includes 5 free posts. Pi users can request manual approval pricing separately.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-2 text-lg font-semibold">AI post generation</h2>
            <p className="text-sm text-zinc-400">
              Generate platform-optimized content for X, Facebook, Instagram, and LinkedIn.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-2 text-lg font-semibold">Branded visuals</h2>
            <p className="text-sm text-zinc-400">
              Create strong visual content and launch-ready assets without extra tools.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-2 text-lg font-semibold">Visibility insights</h2>
            <p className="text-sm text-zinc-400">
              Improve reach with better timing, stronger hooks, and clearer calls to action.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-5xl px-6 pb-20">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Pricing</h2>
          <p className="mt-2 text-zinc-400">
            Clean launch pricing with Dodo checkout. No PayPal on public checkout flow.
          </p>
        </div>

        <PaymentBlock />
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-zinc-500">
        Built with Love from Egypt 🇪🇬 · © 2026 Elmahrosa International
      </footer>
    </main>
  );
}
