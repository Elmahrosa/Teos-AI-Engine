"use client";

import { useLocale } from "@/components/LocaleProvider";

const tierMeta = [
  { href: "/login", featured: false, color: "border-white/[0.08]" },
  { href: "https://www.checkout.dodopayments.com/buy/pdt_0NdD9TE9QZIHDVEYUg8Lb", featured: true, color: "border-gold-500/50" },
  { href: "https://www.checkout.dodopayments.com/buy/pdt_0NdD9rAUd0JHiV9MBHMQ3", featured: false, color: "border-teal-500/50" },
  { href: "https://www.checkout.dodopayments.com/buy/pdt_0NdDAQRTGLoJ7r9zFKiLB", featured: false, color: "border-violet-500/50" },
];

export default function Pricing() {
  const { t } = useLocale();
  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      <div className="hero-glow bg-gold-500/10 -bottom-40 left-1/2 -translate-x-1/2" />

      <div className="section-container relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="section-label">{t("pricing.sectionLabel")}</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t("pricing.heading1")}
            <br />
            <span className="gradient-gold">{t("pricing.heading2")}</span>
          </h2>
          <p className="text-[#8a88a0] text-lg">
            {t("pricing.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {tierMeta.map((meta, i) => {
            const labelKey = `pricing.${i}.featuredLabel`;
            const label = t(labelKey);
            return (
              <div
                key={i}
                className={`card-hover relative flex flex-col rounded-2xl border bg-bg-card p-6 ${meta.color} ${
                  meta.featured ? "scale-105 md:scale-105 shadow-2xl shadow-gold-500/10" : ""
                }`}
              >
                {label && meta.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-500 to-gold-700 px-4 py-1 text-xs font-bold text-bg whitespace-nowrap">
                    {label}
                  </div>
                )}
                {label && !meta.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-500 to-violet-600 px-4 py-1 text-xs font-bold text-white whitespace-nowrap">
                    {label}
                  </div>
                )}

                <h3 className="text-lg font-bold mb-1 mt-2">{t(`pricing.${i}.name`)}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">{t(`pricing.${i}.price`)}</span>
                  <span className="text-sm text-[#8a88a0]">{t(`pricing.${i}.period`)}</span>
                </div>
                <p className="text-sm text-[#8a88a0] mb-6">{t(`pricing.${i}.desc`)}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {[0, 1, 2, 3, 4].map((fi) => {
                    const fKey = `pricing.${i}.f${fi}`;
                    const fText = t(fKey);
                    if (fText === fKey) return null;
                    return (
                      <li key={fi} className="flex items-start gap-2 text-sm text-[#e8e6f0]">
                        <svg className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {fText}
                      </li>
                    );
                  })}
                </ul>

                <a
                  href={meta.href}
                  target={meta.href.startsWith("http") ? "_blank" : undefined}
                  rel={meta.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={
                    meta.featured
                      ? "btn-teal text-center text-sm py-3"
                      : "btn-ghost text-center text-sm py-3"
                  }
                >
                  {t(`pricing.${i}.cta`)}
                </a>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-[#8a88a0] mt-8">
          {t("pricing.footer")}
        </p>
      </div>
    </section>
  );
}
