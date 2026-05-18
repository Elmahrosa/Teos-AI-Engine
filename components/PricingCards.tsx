"use client";

import { useState } from "react";
import Link from "next/link";
import PaymentBlock from "./PaymentBlock";
import { PAYMENT_PLANS } from "@/lib/payments";

interface PricingCardsProps {
  userEmail?: string;
  currentPlan?: string;
}

export default function PricingCards({
  userEmail,
  currentPlan = "free",
}: PricingCardsProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {PAYMENT_PLANS.map((plan) => (
        <div
          key={plan.id}
          className={`rounded-xl border p-6 transition-all cursor-pointer ${
            selectedPlan === plan.id
              ? "border-gold-500/40 bg-gold-500/5 ring-2 ring-gold-500/20"
              : currentPlan === plan.id
                ? "border-teal-500/40 bg-teal-500/5"
                : "border-white/[0.08] bg-bg-card hover:border-white/[0.15]"
          }`}
          onClick={() => setSelectedPlan(plan.id)}
        >
          {plan.badge && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                plan.badge === "Founder"
                  ? "bg-gold-500/20 text-gold-500"
                  : plan.badge === "Best Value"
                    ? "bg-gold-500/20 text-gold-500"
                    : "bg-teal-500/10 text-teal-400"
              }`}
            >
              {plan.badge}
            </span>
          )}

          <h3 className="text-lg font-bold mt-3">{plan.name}</h3>
          <div className="mt-2">
            <span className="text-2xl font-black">${plan.priceUSD}</span>
            <span className="text-xs text-[#8a88a0] ml-1">
              {plan.id.includes("monthly")
                ? "/month"
                : plan.id.includes("yearly")
                  ? "/year"
                  : "one-time"}
            </span>
          </div>

          <ul className="mt-4 space-y-2">
            {plan.features.map((feature, i) => (
              <li key={i} className="text-sm text-[#c0bec8] flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">✓</span>
                {feature}
              </li>
            ))}
          </ul>

          {currentPlan === plan.id && (
            <span className="mt-4 block text-center text-xs text-teal-400 font-semibold">
              Current Plan
            </span>
          )}
        </div>
      ))}

      {selectedPlan && userEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative max-w-lg w-full">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10 text-[#e8e6f0] flex items-center justify-center text-sm hover:bg-white/20"
            >
              ×
            </button>
            <PaymentBlock
              planId={selectedPlan}
              planName={PAYMENT_PLANS.find((p) => p.id === selectedPlan)?.name ?? ""}
              priceUSD={
                PAYMENT_PLANS.find((p) => p.id === selectedPlan)?.priceUSD ?? 0
              }
              userEmail={userEmail}
            />
          </div>
        </div>
      )}
    </div>
  );
}
