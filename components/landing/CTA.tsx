export default function CTA() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
      <div className="hero-glow bg-gold-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="section-container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="section-label">Get Started</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Ready to Transform Your{" "}
            <span className="gradient-gold">Content Strategy?</span>
          </h2>
          <p className="text-[#8a88a0] text-lg mb-10 max-w-2xl mx-auto">
            Join Egypt&apos;s AI content revolution. Start free, no credit card required.
            Upgrade when you&apos;re ready to scale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/login" className="btn-teal text-base px-10 py-4">
              Get Started Free
            </a>
            <a
              href="https://www.loom.com/share/743e3e9aa180475388c1d1c894089603"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-base px-10 py-4"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Full Demo
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#5a5870]">
            <span>✦ No credit card required</span>
            <span>✦ Cancel anytime</span>
            <span>✦ Egyptian sovereign infrastructure</span>
            <span>✦ 24/7 support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
