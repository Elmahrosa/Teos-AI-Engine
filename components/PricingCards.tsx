"use client";

import React from "react";

export const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    features: ["Standard AI Engine", "X & Instagram Only", "5 Posts total / month"],
    buttonText: "Start Free",
  },
  {
    id: "pro",
    name: "Pro Monthly",
    price: "$29",
    features: [
      "Advanced AI Copywriter",
      "All Social Media Platforms",
      "Unlimited Posts & Scheduling",
    ],
    buttonText: "Get Pro",
  },
  {
    id: "lifetime",
    name: "Limited Lifetime",
    price: "$149",
    subText: "Only 50 seats for Fiat / 50 seats for Pi Pioneers (50% Off)",
    features: [
      "Advanced AI Copywriter",
      "X, Facebook & Instagram Only",
      "Pay Once, Use Forever",
      "50% Claimable with Pi Coin",
    ],
    buttonText: "Claim Seat",
  },
  {
    id: "agency",
    name: "Agency Monthly",
    price: "$99",
    features: [
      "Elite Creative Engine",
      "All Social Media Platforms",
      "5 Team Seats Included",
      "Priority AI Processing",
    ],
    buttonText: "Get Agency",
  },
];

export default function PricingCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      {PRICING_PLANS.map((plan) => (
        <div
          key={plan.id}
          className="border p-6 rounded-xl bg-neutral-900 text-white flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <div className="text-3xl font-black text-amber-500 mb-1">
              {plan.price}
            </div>
            {plan.subText && (
              <p className="text-xs text-neutral-400 mb-4">{plan.subText}</p>
            )}
            <ul className="space-y-2 my-4 text-sm text-neutral-300">
              {plan.features.map((f, i) => (
                <li key={i}>✓ {f}</li>
              ))}
            </ul>
          </div>
          <button className="w-full bg-amber-500 text-black py-2 rounded-lg font-bold hover:bg-amber-400 transition">
            {plan.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
}
