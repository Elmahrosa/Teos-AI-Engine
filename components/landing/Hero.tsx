"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function Hero() {
  const { t } = useLocale();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="hero-glow bg-gold-500/20 -top-40 -right-40" />
      <div className="hero-glow bg-teal-500/10 -bottom-40 -left-40" />
      <div className="hero-glow bg-violet-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="section-container relative z-10 w-full pt-24 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/5 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-gold-500 animate-pulse-soft" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-500">
              {t("hero.badge")}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.1] mb-6">
            {t("hero.title1")}{" "}
            <span className="gradient-gold">{t("hero.title2")}</span>{" "}
            {t("hero.title3")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-[#8a88a0] leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/login" className="btn-teal text-base px-8 py-4">
              {t("hero.cta")}
            </a>
            <a
              href="https://www.loom.com/share/743e3e9aa180475388c1d1c894089603"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-base px-8 py-4"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {t("hero.watchDemo")}
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-[#8a88a0]">
            <div className="flex items-center gap-2">
              <span className="text-gold-500 font-bold text-lg">1K+</span>
              <span>{t("hero.stat1")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold-500 font-bold text-lg">7</span>
              <span>{t("hero.stat2")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold-500 font-bold text-lg">100%</span>
              <span>{t("hero.stat3")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
