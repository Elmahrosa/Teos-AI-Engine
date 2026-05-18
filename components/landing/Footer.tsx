"use client";

import { useLocale } from "@/components/LocaleProvider";

const footerSections: [string, { labelKey: string; href: string }[]][] = [
  ["footer.product", [
    { labelKey: "nav.features", href: "#features" },
    { labelKey: "nav.pricing", href: "#pricing" },
    { labelKey: "nav.demo", href: "#demo" },
    { labelKey: "nav.faq", href: "#faq" },
  ]],
  ["footer.company", [
    { labelKey: "footer.about", href: "#" },
    { labelKey: "footer.blog", href: "#" },
    { labelKey: "footer.careers", href: "#" },
    { labelKey: "footer.contact", href: "mailto:support@teosegypt.com" },
  ]],
  ["footer.legal", [
    { labelKey: "footer.privacy", href: "/privacy" },
    { labelKey: "footer.terms", href: "/terms" },
    { labelKey: "footer.cookie", href: "/privacy" },
  ]],
  ["footer.resources", [
    { labelKey: "footer.docs", href: "#" },
    { labelKey: "footer.api", href: "#" },
    { labelKey: "footer.status", href: "#" },
    { labelKey: "footer.community", href: "https://x.com/king_teos" },
  ]],
];

const SOCIALS = [
  {
    href: "https://x.com/king_teos",
    label: "X / Twitter",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://github.com/Elmahrosa",
    label: "GitHub",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    href: "https://linkedin.com/in/aymanseif",
    label: "LinkedIn",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: "https://t.me/elmahrosapi",
    label: "Telegram",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    href: "mailto:support@teosegypt.com",
    label: "Email",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { t } = useLocale();
  return (
    <footer style={{ borderTop: "1px solid rgba(201,168,76,0.1)", background: "#060608" }}>
      <div className="section-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2.5 mb-5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black"
                style={{
                  background: "linear-gradient(135deg, #C9A84C 0%, #A07030 100%)",
                  color: "#060608",
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                T
              </div>
              <span
                className="text-base font-bold tracking-tight"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                TEOS <span style={{ color: "#C9A84C" }}>AI</span>
              </span>
            </a>

            <p className="text-xs leading-relaxed mb-5" style={{ color: "#5a5870" }}>
              {t("footer.tagline")}
            </p>

            <div className="flex items-center gap-3">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={s.label}
                  className="transition-all duration-200"
                  style={{ color: "rgba(201,168,76,0.3)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#C9A84C"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(201,168,76,0.3)"; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link sections */}
          {footerSections.map(([titleKey, links]) => (
            <div key={titleKey}>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)" }}
              >
                {t(titleKey)}
              </h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.labelKey}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") || link.href.startsWith("mailto") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "#5a5870" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#e8e6f0"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#5a5870"; }}
                    >
                      {t(link.labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Gold rule */}
        <div className="gold-rule mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-xs"
            style={{ color: "#3a3850", fontFamily: "'Space Mono', monospace" }}
          >
            &copy; {new Date().getFullYear()} TEOS Network · {t("footer.license")}
          </p>
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "#3a3850", fontFamily: "'Space Mono', monospace" }}
          >
            <span style={{ color: "#C9A84C" }}>✦</span>
            <span>Built in Alexandria, Egypt</span>
            <span style={{ color: "#C9A84C" }}>✦</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
