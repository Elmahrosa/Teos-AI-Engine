export const PAYMENT_CONFIG = {
  usdcSol: process.env.NEXT_PUBLIC_USDC_SOL_ADDRESS || '59sj62fWNmVWRFhMQER8XEgR8CKNswTrb5kMJEMp8g8Y',
  pi: process.env.NEXT_PUBLIC_PI_ADDRESS || 'MALYJFJ5SVD45FBWN2GT4IW67SEZ3IBOFSBSPUFCWV427NBNLG3PWAAAAAAAAAMHQDECQ',
  // PayPal.me link — replace with your actual PayPal.me username
  paypal: process.env.NEXT_PUBLIC_PAYPAL_ME || 'https://paypal.me/ElmahrosaTEOS',
  promo: {
    piUsersDiscountPercent: 50,
    firstUsersLimit: 300,
  },
  plans: {
    starter: { usdc: 0, pi: 0, paypal: 0 },
    pro:     { usdc: 29, piPromo: 14.5, paypal: 29 },
    agency:  { usdc: 99, piPromo: 49.5, paypal: 99 },
  },
} as const;
