"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function Testimonials() {
  const { t } = useLocale();
  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      <div className="section-container relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="section-label">{t("testimonials.sectionLabel")}</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t("testimonials.heading1")}{" "}
            <span className="gradient-gold">{t("testimonials.heading2")}</span>
          </h2>
          <p className="text-[#8a88a0] text-lg">
            {t("testimonials.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/[0.06] bg-bg-card p-6 card-hover">
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <svg key={j} className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-[#e8e6f0] leading-relaxed mb-6 italic">
              &ldquo;{t("testimonials.0.quote")}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/20 text-gold-500 text-sm font-bold">
                AS
              </div>
              <div>
                <p className="text-sm font-semibold">{t("testimonials.0.name")}</p>
                <p className="text-xs text-[#8a88a0]">{t("testimonials.0.role")}</p>
                <span className="text-[10px] text-gold-500/60">{t("testimonials.0.founderNote")}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-white/[0.06] bg-bg-card/50 p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
            <div className="text-3xl mb-3 opacity-20">✦</div>
            <p className="text-sm text-[#8a88a0]">{t("testimonials.placeholder")}</p>
            <p className="text-xs text-[#5a5870] mt-1">{t("testimonials.placeholderSub")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
