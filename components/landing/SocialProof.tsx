const platforms = [
  { name: "X (Twitter)", icon: "𝕏" },
  { name: "LinkedIn", icon: "in" },
  { name: "Instagram", icon: "◻" },
  { name: "Facebook", icon: "f" },
  { name: "TikTok", icon: "♪" },
  { name: "Threads", icon: "⊞" },
  { name: "Telegram", icon: "✈" },
];

const badges = [
  "Egyptian Sovereign",
  "GDPR Compliant",
  "Dodo Payments",
  "SSL Encrypted",
  "24/7 Support",
];

export default function SocialProof() {
  return (
    <section className="section-padding pt-0">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#8a88a0] mb-4">
            Supported Platforms
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
          {badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-[#8a88a0]"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
