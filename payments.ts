// ============================================================
// lib/payments.ts — Single source of truth for all payment config
// ============================================================

export const PLANS = {
  pro: {
    name: "Pro",
    price: 29,
    link: process.env.NEXT_PUBLIC_DODO_PRO_LINK ||
      "https://www.checkout.dodopayments.com/buy/pdt_0NdD9TE9QZIHDVEYUg8Lb",
  },
  agency: {
    name: "Agency",
    price: 99,
    link: process.env.NEXT_PUBLIC_DODO_AGENCY_LINK ||
      "https://www.checkout.dodopayments.com/buy/pdt_0NdD9rAUd0JHiV9MBHMQ3",
  },
  lifetime: {
    name: "Lifetime",
    price: 149,
    link: process.env.NEXT_PUBLIC_DODO_LIFETIME_LINK ||
      "https://www.checkout.dodopayments.com/buy/pdt_0NdDAQRTGLoJ7r9zFKiLB",
  },
};

export const PAYMENT_CONFIG = {
  // Crypto addresses — set via env vars in Vercel
  usdcSol:
    process.env.NEXT_PUBLIC_USDC_SOL_ADDRESS ||
    "59sj62fWNmVWRFhMQER8XEgR8CKNswTrb5kMJEMp8g8Y",

  pi:
    process.env.NEXT_PUBLIC_PI_ADDRESS ||
    "MALYJFJ5SVD45FBWN2GT4IW67SEZ3IBOFSBSPUFCWV427NBNLG3PWAAAAAAAAAMHQDECQ",

  // PayPal.me link — set NEXT_PUBLIC_PAYPAL_ME in Vercel env vars
  paypal:
    process.env.NEXT_PUBLIC_PAYPAL_ME || "https://paypal.me/ElmahrosaTEOS",

  // Dodo checkout links (same as PLANS above, for convenience)
  dodo: {
    pro: PLANS.pro.link,
    agency: PLANS.agency.link,
    lifetime: PLANS.lifetime.link,
  },

  // Pi promo config
  promo: {
    piUsersDiscountPercent: 50,
    firstUsersLimit: 300,
  },

  // Plan amounts
  plans: {
    starter: { usdc: 0, pi: 0, paypal: 0 },
    pro: { usdc: 29, piPromo: 14.5, paypal: 29 },
    agency: { usdc: 99, piPromo: 49.5, paypal: 99 },
  },
} as const;
