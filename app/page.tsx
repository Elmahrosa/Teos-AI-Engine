import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <div className="mb-4 inline-flex rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
          AI social content engine
        </div>

        <h1 className="text-5xl font-bold leading-tight">
          Turn Ideas Into <span className="text-indigo-400">Real Content</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300">
          X-Teos Pro generates ready-to-post content for X, Instagram, and LinkedIn
          in seconds.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-indigo-600 px-8 py-3 font-semibold hover:bg-indigo-500"
          >
            Start Free
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/20 px-8 py-3 hover:bg-white/5"
          >
            View Dashboard
          </Link>
        </div>

        <p className="mt-3 text-xs text-zinc-500">
          No credit card required for starter trial
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">How it works</h2>

        <div className="grid gap-6 text-center md:grid-cols-3">
          <div className="rounded-xl border border-white/10 p-6">
            <h3 className="mb-2 font-semibold">1. Enter idea</h3>
            <p className="text-sm text-zinc-400">Describe what you want to post</p>
          </div>

          <div className="rounded-xl border border-white/10 p-6">
            <h3 className="mb-2 font-semibold">2. Generate</h3>
            <p className="text-sm text-zinc-400">
              AI creates a clean post instantly
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-6">
            <h3 className="mb-2 font-semibold">3. Save & use</h3>
            <p className="text-sm text-zinc-400">
              Everything stays in your dashboard
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Pricing</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold">Starter</h3>
            <p className="mt-4 text-3xl">Free</p>
            <p className="mt-2 text-sm text-zinc-400">3-day trial · 10 posts</p>

            <ul className="mt-6 space-y-2 text-sm">
              <li>✔ X + Instagram</li>
              <li>✔ 10 posts total</li>
              <li>✖ LinkedIn</li>
            </ul>

            <Link
              href="/login"
              className="mt-6 block rounded-xl bg-white/10 py-3 text-center hover:bg-white/20"
            >
              Start Free
            </Link>
          </div>

          <div className="rounded-xl border border-indigo-500 bg-indigo-500/5 p-6">
            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="mt-4 text-3xl">$29/mo</p>
            <p className="mt-2 text-sm text-zinc-400">Unlimited content flow</p>

            <ul className="mt-6 space-y-2 text-sm">
              <li>✔ Unlimited posts</li>
              <li>✔ X + Instagram</li>
              <li>✔ Better output volume</li>
            </ul>

            <Link
              href="/api/subscribe?plan=pro"
              className="mt-6 block rounded-xl bg-indigo-600 py-3 text-center font-semibold hover:bg-indigo-500"
            >
              Upgrade
            </Link>
          </div>

          <div className="rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold">Agency</h3>
            <p className="mt-4 text-3xl">$99/mo</p>
            <p className="mt-2 text-sm text-zinc-400">For teams and LinkedIn access</p>

            <ul className="mt-6 space-y-2 text-sm">
              <li>✔ All platforms</li>
              <li>✔ LinkedIn</li>
              <li>✔ Agency-ready usage</li>
            </ul>

            <Link
              href="/api/subscribe?plan=agency"
              className="mt-6 block rounded-xl bg-white/10 py-3 text-center hover:bg-white/20"
            >
              Go Agency
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-xs text-zinc-500">
        © 2026 X-Teos Pro · Elmahrosa
      </footer>
    </main>
  );
}
