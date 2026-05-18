"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";

export default function FAQ() {
  const { t } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding relative overflow-hidden">
      <div
        className="hero-glow"
        style={{ background: "rgba(139,92,246,0.06)", bottom: "-100px", left: "-200px" }}
      />

      <div className="section-container relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="section-label">{t("faq.sectionLabel")}</span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl mb-5 leading-tight"
            style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 600 }}
          >
            {t("faq.heading1")}{" "}
            <span className="gradient-gold">{t("faq.heading2")}</span>
          </h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: "#111118",
                border: `1px solid ${openIndex === i ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.04)"}`,
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors"
                style={{ color: openIndex === i ? "#e8e6f0" : "rgba(232,230,240,0.7)" }}
              >
                <span className="text-sm font-medium pr-6 leading-relaxed">
                  {t(`faq.${i}.q`)}
                </span>
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: openIndex === i ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)",
                    color: openIndex === i ? "#C9A84C" : "rgba(255,255,255,0.3)",
                    transform: openIndex === i ? "rotate(45deg)" : "none",
                  }}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </span>
              </button>

              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: openIndex === i ? "300px" : "0", opacity: openIndex === i ? 1 : 0 }}
              >
                <div className="px-6 pb-5 pt-0">
                  <div
                    className="h-px mb-4"
                    style={{ background: "rgba(201,168,76,0.1)" }}
                  />
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#8a88a0" }}
                  >
                    {t(`faq.${i}.a`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
