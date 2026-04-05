import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="text-sm text-indigo-400 mb-4">
          Built by Elmahrosa International 🇪🇬
        </p>

        <h1 className="text-5xl font-bold leading-tight">
          AI is the new <span className="text-indigo-400">search engine</span>
        </h1>

        <p className="mt-6 text-lg text-zinc-300 max-w-2xl mx-auto">
          Teos AI Engine helps you generate discoverable social content and visuals
          across X, Instagram, Facebook, and LinkedIn using AI-powered strategies.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/login" className="bg-indigo-600 px-6 py-3 rounded-xl font-semibold">
            Start Free
          </Link>
          <a href="#pricing" className="border px-6 py-3 rounded-xl">
            View Pricing
          </a>
        </div>

        <p className="mt-4 text-sm text-red-400">
          🔥 50% OFF for Pi users (first 300)
        </p>
      </section>

      {/* PROBLEM */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold">Why your content is invisible</h2>
        <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
          AI decides what gets seen. Without optimized content, your posts don't reach anyone.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="p-6 bg-white/5 rounded-xl">❌ Weak hooks</div>
          <div className="p-6 bg-white/5 rounded-xl">❌ No visibility strategy</div>
          <div className="p-6 bg-white/5 rounded-xl">❌ Poor engagement</div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-20 bg-black/30 text-center">
        <h2 className="text-3xl font-bold">Turn ideas into visibility</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="p-6 bg-white/5 rounded-xl">✍️ AI Posts</div>
          <div className="p-6 bg-white/5 rounded-xl">🎨 AI Images</div>
          <div className="p-6 bg-white/5 rounded-xl">📈 Visibility Score</div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 text-center">
        <h2 className="text-3xl font-bold">Pricing</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {/* Starter */}
          <div className="p-6 bg-white/5 rounded-xl">
            <h3 className="text-xl font-semibold">Starter</h3>
            <p className="text-3xl mt-2">Free</p>
            <p className="text-sm text-zinc-400">10 posts</p>
          </div>

          {/* Pro */}
          <div className="p-6 bg-indigo-600 rounded-xl">
            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="text-3xl mt-2">$29</p>

            <a
              href="https://www.paypal.com/paypalme/elma7rosagmx/29"
              target="_blank"
              className="block mt-4 bg-black px-4 py-2 rounded"
            >
              Subscribe
            </a>
          </div>

          {/* Agency */}
          <div className="p-6 bg-white/5 rounded-xl">
            <h3 className="text-xl font-semibold">Agency</h3>
            <p className="text-3xl mt-2">$99</p>

            <a
              href="https://www.paypal.com/paypalme/elma7rosagmx/99"
              target="_blank"
              className="block mt-4 bg-indigo-600 px-4 py-2 rounded"
            >
              Subscribe
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-bold">
          Start generating smarter content today
        </h2>

        <Link href="/login" className="mt-6 inline-block bg-indigo-600 px-8 py-4 rounded-xl">
          Get Started
        </Link>
      </section>
    </main>
  );
}
