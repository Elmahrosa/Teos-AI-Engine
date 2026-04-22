export const PLANS = {
  pro: {
    name: "Pro",
    price: 19,
    link: "https://www.checkout.dodopayments.com/buy/pdt_0NdD9TE9QZIHDVEYUg8Lb",
  },
  agency: {
    name: "Agency",
    price: 49,
    link: "https://www.checkout.dodopayments.com/buy/pdt_0NdD9rAUd0JHiV9MBHMQ3",
  },
  lifetime: {
    name: "Lifetime",
    price: 149,
    link: "https://www.checkout.dodopayments.com/buy/pdt_0NdDAQRTGLoJ7r9zFKiLB",
  },
};

export const PAYMENT_CONFIG = {
  usdcSol: "",
  pi: "MALYJFJ5SVD45FBWN2GT4IW67SEZ3IBOFSBSPUFCWV427NBNLG3PWAAAAAAAAAMHQDECQ",
  paypal: "",
  dodo: {
    pro: PLANS.pro.link,
    agency: PLANS.agency.link,
    lifetime: PLANS.lifetime.link,
  },
};
