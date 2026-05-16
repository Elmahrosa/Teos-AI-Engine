"use client";

import { useState, useEffect } from "react";
import LocaleSwitcher from "@/components/LocaleSwitcher";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Demo", href: "#demo" },
  { label: "FAQ", href: "#faq" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-xl shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="section-container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 text-bg text-xs font-black">
            T
          </div>
          <span className="text-lg font-bold tracking-tight">
            Teos <span className="text-gold-500">AI</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[#8a88a0] hover:text-[#e8e6f0] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <LocaleSwitcher />
          <a href="/admin" className="text-xs text-[#5a5870] hover:text-[#8a88a0] transition-colors duration-200" title="Admin">
            ⚙
          </a>
          <a href="/login" className="btn-teal text-xs px-5 py-2.5">
            Get Started Free
          </a>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-[#e8e6f0] transition-all duration-300 ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-[#e8e6f0] transition-all duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-[#e8e6f0] transition-all duration-300 ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/5 animate-fade-in">
          <div className="section-container py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-[#8a88a0] hover:text-[#e8e6f0] transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <LocaleSwitcher />
            <a
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="text-xs text-[#5a5870] hover:text-[#8a88a0] transition-colors py-1"
            >
              Admin
            </a>
            <a
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="btn-teal text-center text-xs py-3"
            >
              Get Started Free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
