import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">

      {/* HERO */}
      <section className="text-center px-6 py-24 max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold leading-tight">
          Turn Ideas Into <span className="text-indigo-400">Real Content</span>
        </h1>

        <p className="mt-6 text-lg text-zinc-300 max-w-2xl mx-auto">
          X-Teos Pro is a clean AI system that generates high-quality posts
          for X, Instagram, and LinkedIn — instantly.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link href="/login" className="bg-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-500">
            Start Free
          </Link>

          <Link href="/dashboard" className="border border-white/20 px-8 py-3 rounded-xl hover:bg-white/5">
            View Dashboard
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6 border border-white/10 rounded-xl">
            <h3 className="font-semibold mb-2">1. Enter idea</h3>
            <p className="text-sm text-zinc-400">Describe what you want to post</p>
          </div>

          <div className="p-6 border border-white/10 rounded-xl">
            <h3 className="font-semibold mb-2">2. Generate</h3>
            <p className="text-sm text-zinc-400">AI creates a clean post instantly</p>
          </div>

          <div className="p-6 border border-white/10 rounded-xl">
            <h3 className="font-semibold mb-2">3. Save & use</h3>
            <p className="text-sm text-zinc-400">Stored in your dashboard</p>
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Built for output</h2>

        <p className="text-zinc-300 max-w-2xl mx-auto">
          Most AI tools overwhelm you.
          X-Teos Pro focuses on one thing:
          generating content you can actually use.
        </p>
      </section>

      {/* PRICING */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl text-center font-bold mb-12">Pricing</h2>

        <div className="grid md:grid-cols-3 gap-6">

          {/* STARTER */}
          <div className="border border-white/10 p-6 rounded-xl">
            <h3 className="text-xl font-semibold">Starter</h3>
            <p className="text-3xl mt-4">Free</p>
            <p className="text-sm text-zinc-400 mt-2">3-day trial</p>

            <ul className="mt-6 space-y-2 text-sm">
              <li>✔ 10 posts</li>
              <li>✔ X + Instagram</li>
              <li>✖ LinkedIn</li>
            </ul>

            <Link href="/login" className="block mt-6 bg-white/10 text-center py-3 rounded-xl hover:bg-white/20">
              Start Free
            </Link>
          </div>

          {/* PRO */}
          <div className="border border-indigo-500 p-6 rounded-xl bg-indigo-500/5">
            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="text-3xl mt-4">$29/mo</p>

            <ul className="mt-6 space-y-2 text-sm">
              <li>✔ Unlimited posts</li>
              <li>✔ X + Instagram</li>
              <li>✔ Analytics</li>
            </ul>

            <Link href="/api/subscribe?plan=pro" className="block mt-6 bg-indigo-600 text-center py-3 rounded-xl hover:bg-indigo-500">
              Upgrade
            </Link>
          </div>

          {/* AGENCY */}
          <div className="border border-white/10 p-6 rounded-xl">
            <h3 className="text-xl font-semibold">Agency</h3>
            <p className="text-3xl mt-4">$99/mo</p>

            <ul className="mt-6 space-y-2 text-sm">
              <li>✔ All platforms</li>
              <li>✔ LinkedIn</li>
              <li>✔ Team features</li>
            </ul>

            <Link href="/api/subscribe?plan=agency" className="block mt-6 bg-white/10 text-center py-3 rounded-xl hover:bg-white/20">
              Go Agency
            </Link>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-xs text-zinc-500 py-10">
        © 2026 X-Teos Pro · Elmahrosa  
        <div className="mt-2">
          <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a>
        </div>
      </footer>

    </main>
  );
}
