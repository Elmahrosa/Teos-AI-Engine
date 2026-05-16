"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";

export default function FAQ() {
  const { t } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding relative overflow-hidden">
      <div className="section-container relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="section-label">{t("faq.sectionLabel")}</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t("faq.heading1")}{" "}
            <span className="gradient-gold">{t("faq.heading2")}</span>
          </h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.06] bg-bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="text-sm font-medium text-[#e8e6f0] pr-4">{t(`faq.${i}.q`)}</span>
                <svg
                  className={`w-4 h-4 text-[#8a88a0] shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5 pt-0">
                  <p className="text-sm text-[#8a88a0] leading-relaxed">{t(`faq.${i}.a`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
