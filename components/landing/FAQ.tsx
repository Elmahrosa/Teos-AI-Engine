"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What makes Teos AI Engine 'sovereign'?",
    a: "Teos AI Engine runs on Egyptian infrastructure. All data processing, storage, and AI inference happens within Egypt's borders. Your content never leaves Egyptian jurisdiction — unlike foreign AI platforms that may share data across borders. We believe digital sovereignty is a fundamental right.",
  },
  {
    q: "How does pricing work?",
    a: "We offer four tiers: Starter (Free, 5 test posts), Pro ($29/month, 50 posts/day), Agency ($69/month, 200 posts/day), and Lifetime ($149 one-time, unlimited posts). All tiers include platform-specific AI generation. You can pay via card, crypto, or Pi Network through Dodo Payments.",
  },
  {
    q: "Which platforms are supported?",
    a: "Teos AI Engine supports 7 platforms: X (Twitter), LinkedIn, Instagram, Facebook, TikTok, Threads, and Telegram. Each platform gets content optimized for its specific format, audience, and best practices.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes, you can cancel anytime from your dashboard. Your subscription remains active until the end of the billing period. No hidden fees, no cancellation charges. For Lifetime plan, it's a one-time payment with no recurring charges.",
  },
  {
    q: "How does the AI learn my brand voice?",
    a: "You can train the AI by providing samples of your existing content. The engine analyzes your tone, vocabulary, sentence structure, and platform-specific style. It then generates new content that matches your voice across all supported platforms.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We process everything on Egyptian infrastructure. We never share, sell, or use your content for training external models. See our Privacy Policy for details.",
  },
  {
    q: "Can I use Teos for my team/agency?",
    a: "Yes! The Agency plan ($69/month) includes 3 team seats with collaborative workflows, shared content calendar, and role-based permissions. The Lifetime plan ($149) includes 10 seats. Perfect for agencies managing multiple brands.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept credit/debit cards (Visa, Mastercard), cryptocurrencies (USDC on Solana), and Pi Network through Dodo Payments. All transactions are processed securely. Egyptian pricing, global access.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding relative overflow-hidden">
      <div className="section-container relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="section-label">FAQ</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked{" "}
            <span className="gradient-gold">Questions</span>
          </h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.06] bg-bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="text-sm font-medium text-[#e8e6f0] pr-4">{faq.q}</span>
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
                  <p className="text-sm text-[#8a88a0] leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
