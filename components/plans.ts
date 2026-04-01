export type PlanId = "starter" | "pro" | "agency";

export type Feature = { text: string; ok: boolean };

export type Plan = {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  trial: string;
  popular?: boolean;
  tapLink?: string;
  cta: string;
  features: Feature[];
};

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Try the app free.",
    trial: "3-day starter access",
    cta: "Start free",
    features: [
      { text: "10 AI posts total", ok: true },
      { text: "X + Instagram", ok: true },
      { text: "Basic scheduling UI", ok: true },
      { text: "5 auto-replies total", ok: true },
      { text: "Analytics dashboard", ok: false },
      { text: "LinkedIn posting", ok: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 20,
    description: "For solo founders who need consistent output.",
    trial: "3-day paid-plan trial",
    popular: true,
    tapLink: "https://invoice.tap.company/invoice/grpInv_DmdT1311012JMuP527489",
    cta: "Get Pro",
    features: [
      { text: "Unlimited AI posts", ok: true },
      { text: "X + Instagram", ok: true },
      { text: "Advanced scheduling UI", ok: true },
      { text: "Unlimited auto-replies", ok: true },
      { text: "Analytics dashboard", ok: true },
      { text: "LinkedIn posting", ok: false },
    ],
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: 99,
    yearlyPrice: 69,
    description: "For teams and agencies.",
    trial: "3-day paid-plan trial",
    tapLink: "https://invoice.tap.company/invoice/grpInv_Bkis1311012CP65527177",
    cta: "Get Agency",
    features: [
      { text: "Everything in Pro", ok: true },
      { text: "X + Instagram + LinkedIn", ok: true },
      { text: "5 team seats", ok: true },
      { text: "Arabic content AI", ok: true },
      { text: "White-label option", ok: true },
      { text: "Priority support", ok: true },
    ],
  },
];

export function getPlan(id: string) {
  return PLANS.find((plan) => plan.id === id);
}
