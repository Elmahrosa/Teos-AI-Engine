"use client";

import { useLocale } from "@/components/LocaleProvider";

const FEATURE_ICONS = [
  // Multi-platform
  <svg key={0} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>,
  // Sovereign / shield
  <svg key={1} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>,
  // AI / sparkle
  <svg key={2} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
  </svg>,
  // Scheduling / clock
  <svg key={3} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  // Brand voice / microphone
  <svg key={4} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
  </svg>,
  // Analytics / chart
  <svg key={5} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>,
  // Team / collaboration
  <svg key={6} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>,
  // Payments / card
  <svg key={7} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>,
];

const ACCENT_COLORS = [
  { icon: "#C9A84C", bg: "rgba(201,168,76,0.08)", border: "rgba(201,168,76,0.15)", hover: "rgba(201,168,76,0.15)" },
  { icon: "#00bfa5", bg: "rgba(0,191,165,0.08)", border: "rgba(0,191,165,0.15)", hover: "rgba(0,191,165,0.15)" },
  { icon: "#8b5cf6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.15)", hover: "rgba(139,92,246,0.15)" },
  { icon: "#C9A84C", bg: "rgba(201,168,76,0.08)", border: "rgba(201,168,76,0.15)", hover: "rgba(201,168,76,0.15)" },
  { icon: "#00bfa5", bg: "rgba(0,191,165,0.08)", border: "rgba(0,191,165,0.15)", hover: "rgba(0,191,165,0.15)" },
  { icon: "#8b5cf6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.15)", hover: "rgba(139,92,246,0.15)" },
  { icon: "#C9A84C", bg: "rgba(201,168,76,0.08)", border: "rgba(201,168,76,0.15)", hover: "rgba(201,168,76,0.15)" },
  { icon: "#00bfa5", bg: "rgba(0,191,165,0.08)", border: "rgba(0,191,165,0.15)", hover: "rgba(0,191,165,0.15)" },
];

export default function Features() {
  const { t } = useLocale();
  return (
    <section id="features" className="section-padding relative overflow-hidden">
      <div className="hero-glow bg-violet-500/10 top-0 right-0" />
      <div className="hero-glow" style={{ background: "rgba(201,168,76,0.06)", bottom: "-200px", left: "-200px" }} />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="section-label">{t("features.sectionLabel")}</span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl mb-5 leading-tight"
            style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 600 }}
          >
            {t("features.heading1")}
            <br />
            <span className="gradient-gold">{t("features.heading2")}</span>
          </h2>
          <p className="text-[#8a88a0] text-lg leading-relaxed">
            {t("features.subtitle")}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => {
            const accent = ACCENT_COLORS[i];
            return (
              <div
                key={i}
                className="group relative rounded-2xl p-6 transition-all duration-400 cursor-default"
                style={{
                  background: "#111118",
                  border: `1px solid rgba(255,255,255,0.05)`,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(-4px)";
                  el.style.borderColor = accent.border;
                  el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4)`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "rgba(255,255,255,0.05)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Icon */}
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300"
                  style={{ background: accent.bg, color: accent.icon }}
                >
                  {FEATURE_ICONS[i]}
                </div>

                {/* Number */}
                <div
                  className="absolute top-5 right-5 text-xs font-bold"
                  style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.08)" }}
                >
                  0{i + 1}
                </div>

                <h3
                  className="text-base font-semibold mb-2"
                  style={{ color: "#e8e6f0", fontFamily: "'Inter', sans-serif" }}
                >
                  {t(`features.${i}.title`)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8a88a0" }}>
                  {t(`features.${i}.desc`)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom rule */}
        <div className="mt-20 gold-rule" />
      </div>
    </section>
  );
}
