const tiers = [
  {
    name: "Starter",
    price: "Free",
    period: null,
    desc: "Perfect for trying out the engine.",
    features: [
      "5 posts total (one-time test)",
      "X + Instagram only",
      "Basic AI generation",
      "Community support",
    ],
    cta: "Start Free Test",
    href: "/login",
    featured: false,
    color: "border-white/[0.08]",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For individual creators and freelancers.",
    features: [
      "50 posts per day",
      "X, Instagram, LinkedIn, Facebook",
      "Brand voice training",
      "Content scheduling",
      "Email support",
    ],
    cta: "Subscribe $29/mo",
    href: "https://www.checkout.dodopayments.com/buy/pdt_0NdD9TE9QZIHDVEYUg8Lb",
    featured: true,
    featuredLabel: "Most Popular",
    color: "border-gold-500/50",
  },
  {
    name: "Agency",
    price: "$69",
    period: "/month",
    desc: "For teams and agencies managing multiple brands.",
    features: [
      "200 posts per day",
      "All 7 platforms",
      "Team collaboration (3 seats)",
      "Priority AI generation",
      "Priority support",
    ],
    cta: "Subscribe $69/mo",
    href: "https://www.checkout.dodopayments.com/buy/pdt_0NdD9rAUd0JHiV9MBHMQ3",
    featured: false,
    featuredLabel: "Best Value",
    color: "border-teal-500/50",
  },
  {
    name: "Lifetime",
    price: "$149",
    period: " one-time",
    desc: "One payment. Forever access. First 100 only.",
    features: [
      "Unlimited posts per day",
      "All 7 platforms",
      "Team collaboration (10 seats)",
      "Priority AI + early features",
      "Direct founder access",
    ],
    cta: "Get Lifetime $149",
    href: "https://www.checkout.dodopayments.com/buy/pdt_0NdDAQRTGLoJ7r9zFKiLB",
    featured: false,
    featuredLabel: "Best Value",
    color: "border-violet-500/50",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      <div className="hero-glow bg-gold-500/10 -bottom-40 left-1/2 -translate-x-1/2" />

      <div className="section-container relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="section-label">Pricing</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Simple, Transparent
            <br />
            <span className="gradient-gold">Egyptian Pricing</span>
          </h2>
          <p className="text-[#8a88a0] text-lg">
            Pay with card, crypto, or Pi Network. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`card-hover relative flex flex-col rounded-2xl border bg-bg-card p-6 ${tier.color} ${
                tier.featured ? "scale-105 md:scale-105 shadow-2xl shadow-gold-500/10" : ""
              }`}
            >
              {tier.featuredLabel && tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-500 to-gold-700 px-4 py-1 text-xs font-bold text-bg whitespace-nowrap">
                  {tier.featuredLabel}
                </div>
              )}
              {tier.featuredLabel && !tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-500 to-violet-600 px-4 py-1 text-xs font-bold text-white whitespace-nowrap">
                  {tier.featuredLabel}
                </div>
              )}

              <h3 className="text-lg font-bold mb-1 mt-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.period && (
                  <span className="text-sm text-[#8a88a0]">{tier.period}</span>
                )}
              </div>
              <p className="text-sm text-[#8a88a0] mb-6">{tier.desc}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#e8e6f0]">
                    <svg className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={tier.href}
                target={tier.href.startsWith("http") ? "_blank" : undefined}
                rel={tier.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={
                  tier.featured
                    ? "btn-teal text-center text-sm py-3"
                    : "btn-ghost text-center text-sm py-3"
                }
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#8a88a0] mt-8">
          All prices in USD. Pi Network payments accepted. Subscriptions can be cancelled anytime.
        </p>
      </div>
    </section>
  );
}
