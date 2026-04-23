import React, { useState } from "react";
import Link from "next/link";

export const metadata = {
  title: "Teos AI Engine — AI Content Intelligence for Founders",
  description:
    "Generate high-impact social media posts for X, LinkedIn, Instagram, and Facebook. Limited lifetime access for early users.",
  openGraph: {
    title: "Teos AI Engine — AI Content Intelligence",
    description:
      "Turn any idea into high-impact posts. Built for founders, creators, and agencies.",
    url: "https://teos-ai-engine.vercel.app",
    siteName: "Teos AI Engine",
    type: "website",
  },
};

const MONTHLY_PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    posts: "5 free posts",
    features: ["5 AI posts", "X / FB / IG", "Visibility scoring"],
    cta: "Create free account",
    href: "/signup",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    highlight: true,
    posts: "100 posts / month",
    features: ["100 posts", "All platforms", "LinkedIn", "Priority"],
    cta: "Upgrade to Pro",
    link: "https://dodo.pe/ljkagv2ixcr",
  },
  {
    name: "Agency",
    price: "$69",
    period: "/month",
    posts: "Unlimited",
    features: ["Unlimited", "All platforms", "Multi-brand"],
    cta: "Upgrade to Agency",
    link: "https://dodo.pe/ep9cgmojbua",
  },
];

const YEARLY_PLANS = [
  {
    name: "Pro Yearly",
    price: "$290",
    period: "/year",
    posts: "100 posts / month",
    features: ["Save $58", "All platforms", "LinkedIn"],
    cta: "Upgrade to Pro Yearly",
    link: "https://dodo.pe/dbvnd9a4pp",
  },
  {
    name: "Agency Yearly",
    price: "$690",
    period: "/year",
    posts: "Unlimited",
    features: ["Save $138", "All platforms"],
    cta: "Upgrade to Agency Yearly",
    link: "https://dodo.pe/relh2gradr9",
  },
];

const LIFETIME_PLANS = [
  {
    name: "Pro Lifetime",
    price: "$149",
    posts: "100/month forever",
    cta: "Claim Pro Lifetime",
    link: "https://dodo.pe/79q4irl1347",
    scarcity: "Only 32 / 50 spots left",
  },
  {
    name: "Agency Lifetime",
    price: "$349",
    posts: "Unlimited forever",
    cta: "Claim Agency Lifetime",
    link: "https://dodo.pe/91zcmc4xi27",
    scarcity: "Only 14 / 50 spots left",
  },
];

export default function Page() {
  const [yearly, setYearly] = useState(false);

  const plans = yearly ? YEARLY_PLANS : MONTHLY_PLANS;

  return (
    <main style={{ background: "#0b0b14", color: "#fff", minHeight: "100vh" }}>
      
      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", padding: 20 }}>
        <b>Teos AI Engine</b>
        <div>
          <Link href="/login">Login</Link>{" "}
          <Link href="/signup">Create free account</Link>
        </div>
      </nav>

      {/* BANNER */}
      <div style={{ textAlign: "center", padding: 10, color: "#a5b4fc" }}>
        🔥 Launch offer: First 50 users get lifetime access — Pro $149 · Agency $349
      </div>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "80px 20px" }}>
        <h1 style={{ fontSize: 48 }}>
          Turn any idea into posts that get seen
        </h1>
        <p style={{ color: "#aaa", marginTop: 10 }}>
          AI content engine for founders, creators, and agencies.
        </p>

        <div style={{ marginTop: 20 }}>
          <Link href="/signup">Start free — 5 posts</Link>{" "}
          <a href="#pricing">View pricing</a>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: 40, textAlign: "center" }}>
        <h2>Pricing</h2>

        <button onClick={() => setYearly(!yearly)}>
          Toggle {yearly ? "Monthly" : "Yearly"}
        </button>

        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 20 }}>
          {plans.map((p) => (
            <div key={p.name} style={{ border: "1px solid #333", padding: 20 }}>
              <h3>{p.name}</h3>
              <h2>{p.price}</h2>
              <p>{p.posts}</p>

              {p.link ? (
                <a href={p.link} target="_blank">
                  {p.cta}
                </a>
              ) : (
                <Link href={p.href}>{p.cta}</Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* LIFETIME */}
      <section style={{ padding: 40, textAlign: "center" }}>
        <h2>Own it forever. Pay once.</h2>
        <p>Limited to first 50 users</p>

        <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
          {LIFETIME_PLANS.map((p) => (
            <div key={p.name} style={{ border: "1px solid orange", padding: 20 }}>
              <h3>{p.name}</h3>
              <h2>{p.price}</h2>
              <p>{p.posts}</p>
              <p>{p.scarcity}</p>
              <a href={p.link} target="_blank">
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}