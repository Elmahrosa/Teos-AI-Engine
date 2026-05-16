"use client";

import { useLocale } from "@/components/LocaleProvider";

const platforms = [
  { name: "X (Twitter)", icon: "𝕏" },
  { name: "LinkedIn", icon: "in" },
  { name: "Instagram", icon: "◻" },
  { name: "Facebook", icon: "f" },
  { name: "TikTok", icon: "♪" },
  { name: "Threads", icon: "⊞" },
  { name: "Telegram", icon: "✈" },
];

const badges = ["socialproof.badge0", "socialproof.badge1", "socialproof.badge2", "socialproof.badge3", "socialproof.badge4"] as const;

export default function SocialProof() {
  const { t } = useLocale();
  return (
    <section className="section-padding pt-0">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#8a88a0] mb-4">
            {t("socialproof.title")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {platforms.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 text-[#8a88a0] hover:text-[#e8e6f0] transition-colors"
              >
                <span className="text-xl font-bold">{p.icon}</span>
                <span className="text-sm hidden sm:inline">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {badges.map((key) => (
            <span
              key={key}
              className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-[#8a88a0]"
            >
              {t(key)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
