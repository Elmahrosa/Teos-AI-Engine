"use client";

import { useState, useEffect } from "react";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { useLocale } from "@/components/LocaleProvider";

const navLinks = [
  { key: "nav.features" as const, href: "#features" },
  { key: "nav.pricing" as const, href: "#pricing" },
  { key: "nav.demo" as const, href: "#demo" },
  { key: "nav.faq" as const, href: "#faq" },
];

export default function Navigation() {
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-2xl shadow-black/40" : "bg-transparent"
      }`}
    >
      <div className="section-container flex h-[60px] items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black transition-all duration-300 group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #C9A84C 0%, #A07030 100%)",
              color: "#060608",
              boxShadow: "0 0 20px rgba(201,168,76,0.25)",
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm transition-colors duration-200 relative group"
              style={{ color: "rgba(232,230,240,0.55)", fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = "#e8e6f0"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(232,230,240,0.55)"; }}
            >
              {t(link.key)}
              <span
                className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: "rgba(201,168,76,0.5)" }}
              />
            </a>
          ))}
          <span
            className="h-4 w-px opacity-20"
            style={{ background: "rgba(201,168,76,0.6)" }}
          />
          <LocaleSwitcher />
          <a
            href="/login"
            className="text-sm transition-colors duration-200"
            style={{ color: "rgba(232,230,240,0.35)" }}
            title={t("nav.login")}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = "rgba(232,230,240,0.7)"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(232,230,240,0.35)"; }}
          >
            ◯
          </a>
          <a
            href="/login"
            className="text-xs px-5 py-2.5 rounded-xl font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #C9A84C 0%, #A07030 100%)",
              color: "#060608",
              fontFamily: "'Space Mono', monospace",
              boxShadow: "0 4px 16px rgba(201,168,76,0.2)",
            }}
          >
            {t("nav.getStarted")}
          </a>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-px w-5 transition-all duration-300`}
            style={{
              background: "#C9A84C",
              transform: mobileOpen ? "rotate(45deg) translateY(5px)" : "none",
            }}
          />
          <span
            className={`block h-px w-5 transition-all duration-300`}
            style={{
              background: "rgba(201,168,76,0.5)",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            className={`block h-px w-5 transition-all duration-300`}
            style={{
              background: "#C9A84C",
              transform: mobileOpen ? "rotate(-45deg) translateY(-5px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden animate-fade-in"
          style={{
            background: "rgba(6,6,8,0.97)",
            borderTop: "1px solid rgba(201,168,76,0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="section-container py-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm py-3 px-2 transition-colors border-b"
                style={{
                  color: "rgba(232,230,240,0.55)",
                  borderColor: "rgba(201,168,76,0.05)",
                }}
              >
                {t(link.key)}
              </a>
            ))}
            <div className="pt-3 flex items-center gap-3">
              <LocaleSwitcher />
              <a
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm py-2 px-3 rounded-lg"
                style={{
                  color: "rgba(232,230,240,0.5)",
                  border: "1px solid rgba(201,168,76,0.15)",
                }}
              >
                {t("nav.login")}
              </a>
            </div>
            <a
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-3 text-center text-xs py-3.5 rounded-xl font-bold tracking-wide"
              style={{
                background: "linear-gradient(135deg, #C9A84C 0%, #A07030 100%)",
                color: "#060608",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              {t("nav.getStarted")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
