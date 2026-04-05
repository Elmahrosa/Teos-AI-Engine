import Link from 'next/link';
import PaymentBlock from '@/components/PaymentBlock';
import PricingCards from '@/components/PricingCards';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#07070f] text-white">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-xs font-black">T</div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-white">TEOS</span>
            <span className="text-indigo-400 text-sm font-medium ml-1">AI ENGINE</span>
          </span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/5 transition-colors">
            Login
          </Link>
          <Link href="/dashboard" className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 py-24 text-center overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />

        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs text-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Built with Love from Egypt 🇪🇬 · Now Live
          </div>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            AI is the new
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              search engine
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 leading-relaxed">
            Mentions influence AI answers. Context decides visibility. Teos AI Engine turns your ideas
            into discoverable, high-impact content across X, Facebook, Instagram, and LinkedIn.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/dashboard" className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 font-bold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/30">
              🚀 Get Started Free
            </Link>
            <Link href="/#pricing" className="rounded-xl border border-white/20 px-8 py-3.5 hover:bg-white/5 transition-colors font-medium">
              View Launch Deals →
            </Link>
          </div>
          <p className="mt-5 text-sm text-zinc-500">
            Pi users get 50% off · First 300 users only · No credit card for Starter
          </p>
        </div>
      </section>

      {/* Launch Sale Banner */}
      <section className="mx-auto max-w-6xl px-6 pb-4">
        <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 p-6 text-center">
          <p className="text-xl font-bold text-white">🚀 Teos AI Engine Launch Sale</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
            <div className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/5 p-3 text-left">
              <span className="text-xl">🚀</span>
              <div>
                <p className="font-semibold text-amber-300">Pi Pioneers Special</p>
                <p className="text-zinc-400 text-xs mt-0.5">First 300 Pi users get <strong className="text-white">50% OFF</strong> all plans</p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/5 p-3 text-left">
              <span className="text-xl">💰</span>
              <div>
                <p className="font-semibold text-green-300">Big Sale #1 · Starter</p>
                <p className="text-zinc-400 text-xs mt-0.5">First 50 buyers pay <strong className="text-white">$29</strong> for 3 Months</p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/5 p-3 text-left">
              <span className="text-xl">🔥</span>
              <div>
                <p className="font-semibold text-red-300">Big Sale #2 · Agency</p>
                <p className="text-zinc-400 text-xs mt-0.5">First 25 buyers get <strong className="text-white">1 Month + 5 FREE</strong></p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-red-400 font-semibold">🔥 Limited slots available — Act Fast Before They&apos;re Gone!</p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: '✍️', title: 'AI post generation', desc: 'Platform-optimised content for X, Facebook, Instagram, and LinkedIn. Choose tone, goal, and let the AI do the work.' },
            { icon: '🖼️', title: 'Branded visuals', desc: 'Every post includes a branded image sized correctly for each platform. No design tools needed.' },
            { icon: '📊', title: 'Visibility insights', desc: 'Every post comes with a visibility score, best posting time, CTA tips, and a pre-publish checklist.' },
          ].map(f => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-white/20 hover:bg-white/[0.06]">
              <div className="mb-3 text-2xl">{f.icon}</div>
              <h2 className="text-lg font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <PricingCards />

      {/* Payment */}
      <section id="pay" className="mx-auto max-w-6xl px-6 pb-20">
        <PaymentBlock />
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-zinc-500">
        Built with Love from Egypt 🇪🇬 · © 2026 Elmahrosa International ·{' '}
        <Link href="/login" className="text-indigo-400 hover:underline">Get started</Link>
        {' · '}
        <Link href="/admin" className="text-zinc-600 hover:text-zinc-400">Admin</Link>
      </footer>
    </main>
  );
}
