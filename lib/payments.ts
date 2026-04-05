export const PAYMENT_CONFIG = {
  usdcSol: '59sj62fWNmVWRFhMQER8XEgR8CKNswTrb5kMJEMp8g8Y',
  pi: 'MALYJFJ5SVD45FBWN2GT4IW67SEZ3IBOFSBSPUFCWV427NBNLG3PWAAAAAAAAAMHQDECQ',
  promo: {
    piUsersDiscountPercent: 50,
    firstUsersLimit: 300,
  },
  plans: {
    starter: { usdc: 0, pi: 0 },
    pro: { usdc: 29, piPromo: 14.5 },
    agency: { usdc: 99, piPromo: 49.5 },
  },
} as const;
