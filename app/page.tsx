import Link from "next/link";

export const metadata = {
  title: "Teos AI Engine — AI Content Intelligence for Founders",
  description:
    "Generate high-impact social media posts for X, LinkedIn, Instagram, and Facebook. Pay with USDC, Pi Network, or Dodo. First 100 users get lifetime access.",
  openGraph: {
    title: "Teos AI Engine — AI Content Intelligence",
    description:
      "Turn any idea into platform-optimized posts. Built for pioneers. First 100 get lifetime access.",
    url: "https://teos-ai-engine.vercel.app",
    siteName: "Teos AI Engine",
    type: "website",
  },
};

const PLATFORMS = [
  { icon: "𝕏", label: "X / Twitter" },
  { icon: "in", label: "LinkedIn" },
  { icon: "f", label: "Facebook" },
  { icon: "◎", label: "Instagram" },
];

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    highlight: false,
    badge: null,
    posts: "5 free posts",
    features: [
      "5 AI-generated posts",
      "X, Facebook, Instagram",
      "Visibility scoring",
      "Email support",
    ],
    cta: "Get started free",
    href: "/signup",
    dodoLink: null,
    payNote: null,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    highlight: true,
    badge: "Most popular",
    posts: "100 posts / month",
    features: [
      "100 posts per month",
      "All 4 platforms",
      "LinkedIn unlocked",
      "Priority generation",
      "Post history dashboard",
    ],
    cta: "Start Pro — $29/mo",
    href: "https://dodo.pe/ca34csksg9",
    dodoLink: "https://dodo.pe/ca34csksg9",
    payNote: "USDC · Pi Network · Dodo",
  },
  {
    name: "Agency",
    price: "$69",
    period: "/month",
    highlight: false,
    badge: null,
    posts: "Unlimited posts",
    features: [
      "Unlimited posts",
      "All 4 platforms",
      "LinkedIn + multi-brand",
      "Advanced support",
      "Best for teams and power users",
    ],
    cta: "Start Agency — $69/mo",
    href: "https://dodo.pe/3inq9s4o2i",
    dodoLink: "https://dodo.pe/3inq9s4o2i",
    payNote: "USDC · Pi Network · Dodo",
  },
];

const LIFETIME_PLANS = [
  {
    name: "Pro Lifetime",
    price: "$97",
    period: "one-time",
    posts: "100 posts/month — forever",
    cta: "Claim Pro Lifetime",
    href: "https://dodo.pe/ep9cgmojbua",
  },
  {
    name: "Agency Lifetime",
    price: "$197",
    period: "one-time",
    posts: "Unlimited — forever",
    cta: "Claim Agency Lifetime",
    href: "https://dodo.pe/b62i4f5c5u",
  },
];

const USE_CASES = [
  {
    title: "Founder building in public",
    description:
      "Turn product updates, insights, and milestones into strong X and LinkedIn posts without starting from a blank page.",
    icon: "🚀",
  },
  {
    title: "Agency managing multiple clients",
    description:
      "Generate platform-optimized content faster with Agency-level unlimited usage and a cleaner publishing workflow.",
    icon: "🏢",
  },
  {
    title: "Creator growing an audience",
    description:
      "Use AI visibility scoring and strong CTA suggestions to improve reach instead of guessing what will perform.",
    icon: "📈",
  },
];

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 50%, #070710 100%)",
        color: "#e8e8f0",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
          background: "rgba(10,10,15,0.85)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            T
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.05rem", letterSpacing: "-0.02em" }}>
            Teos AI Engine
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link
            href="/login"
            style={{
              padding: "0.45rem 1.1rem",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#c4c4d4",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Login
          </Link>
          <Link
            href="/signup"
            style={{
              padding: "0.45rem 1.25rem",
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              boxShadow: "0 0 20px rgba(99,102,241,0.35)",
            }}
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* FIRST-100 LIFETIME BANNER */}
      <div
        style={{
          background: "linear-gradient(90deg, rgba(99,102,241,0.15) 0%, rgba(124,58,237,0.2) 50%, rgba(99,102,241,0.15) 100%)",
          borderBottom: "1px solid rgba(99,102,241,0.25)",
          padding: "0.8rem 2rem",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#c4b5fd" }}>
          <span style={{ fontWeight: 700, color: "#a5b4fc" }}>🔥 Launch offer:</span>
          {" "}First 100 users get lifetime access — Pro at $97 · Agency at $197 · one-time payment, never expires.{" "}
          <a
            href="#lifetime"
            style={{ color: "#818cf8", textDecoration: "underline", fontWeight: 600 }}
          >
            Claim yours →
          </a>
        </p>
      </div>

      {/* HERO */}
      <section
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "6rem 2rem 5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 1rem",
            borderRadius: 100,
            border: "1px solid rgba(99,102,241,0.35)",
            background: "rgba(99,102,241,0.08)",
            fontSize: "0.8rem",
            color: "#a5b4fc",
            marginBottom: "2rem",
            letterSpacing: "0.03em",
          }}
        >
          <span>✦</span>
          <span>Built for pioneers. Pay with Pi, USDC, or Dodo.</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            margin: "0 0 1.5rem",
            background: "linear-gradient(160deg, #ffffff 40%, #a5b4fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Turn any idea into posts
          <br />
          that actually get seen
        </h1>

        <p
          style={{
            fontSize: "1.15rem",
            color: "#9191a8",
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto 2.5rem",
          }}
        >
          Teos AI Engine generates platform-optimized content for X, LinkedIn, Instagram, and
          Facebook — with AI visibility scoring built for founders, agencies, and creators
          across 75+ countries.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/signup"
            style={{
              padding: "0.85rem 2rem",
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              color: "#fff",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 700,
              boxShadow: "0 4px 30px rgba(99,102,241,0.45)",
              letterSpacing: "-0.01em",
            }}
          >
            Start free — 5 posts included
          </Link>
          <Link
            href="#pricing"
            style={{
              padding: "0.85rem 2rem",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#c4c4d4",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            View pricing
          </Link>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            marginTop: "3rem",
            flexWrap: "wrap",
          }}
        >
          {PLATFORMS.map((p) => (
            <div
              key={p.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 1rem",
                borderRadius: 100,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                fontSize: "0.8rem",
                color: "#9191a8",
              }}
            >
              <span style={{ fontSize: "0.9rem" }}>{p.icon}</span>
              {p.label}
            </div>
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.02)",
          padding: "1.25rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: "🌍", text: "75+ countries" },
            { icon: "π", text: "Built for Pi pioneers" },
            { icon: "⚡", text: "USDC on Solana" },
            { icon: "🔐", text: "Session-based auth" },
          ].map((item) => (
            <div
              key={item.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.85rem",
                color: "#7070a0",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* USE CASES */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 0.75rem" }}>
            Built for the way you actually work
          </h2>
          <p style={{ color: "#7070a0", fontSize: "1rem" }}>
            Not a generic toy. Designed for operators who ship fast.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {USE_CASES.map((uc) => (
            <div
              key={uc.title}
              style={{
                padding: "1.75rem",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>{uc.icon}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 0.6rem", color: "#e0e0f0" }}>
                {uc.title}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#7070a0", lineHeight: 1.65, margin: 0 }}>
                {uc.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          background: "rgba(99,102,241,0.04)",
          borderTop: "1px solid rgba(99,102,241,0.1)",
          borderBottom: "1px solid rgba(99,102,241,0.1)",
          padding: "5rem 2rem",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 3rem" }}>
            Three steps to ready-to-post content
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
            {[
              { step: "01", title: "Describe your idea", desc: "Type a topic, update, or insight. No templates. No blank-page struggle." },
              { step: "02", title: "Pick your platform", desc: "Choose X, LinkedIn, Instagram, or Facebook. Each post adapts to that platform's format." },
              { step: "03", title: "Review and publish", desc: "Get your visibility score and CTA suggestion, then copy and post in seconds." },
            ].map((s) => (
              <div key={s.step} style={{ textAlign: "left" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6366f1", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 0.5rem", color: "#e0e0f0" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#7070a0", lineHeight: 1.65, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MONTHLY PRICING */}
      <section id="pricing" style={{ maxWidth: 1000, margin: "0 auto", padding: "5rem 2rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 0.75rem" }}>
            Simple, honest pricing
          </h2>
          <p style={{ color: "#7070a0", fontSize: "1rem" }}>
            Checkout with Dodo · USDC on Solana · Pi Network
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
            alignItems: "start",
          }}
        >
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              style={{
                padding: "2rem",
                borderRadius: 16,
                border: plan.highlight
                  ? "1.5px solid rgba(99,102,241,0.6)"
                  : "1px solid rgba(255,255,255,0.07)",
                background: plan.highlight
                  ? "rgba(99,102,241,0.07)"
                  : "rgba(255,255,255,0.025)",
                position: "relative",
              }}
            >
              {plan.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "0.25rem 0.85rem",
                    borderRadius: 100,
                    background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#fff",
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 12px rgba(99,102,241,0.5)",
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.8rem", color: "#7070a0", margin: "0 0 0.4rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {plan.name}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                  <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "#e8e8f0", letterSpacing: "-0.03em" }}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span style={{ fontSize: "0.875rem", color: "#7070a0" }}>{plan.period}</span>
                  )}
                </div>
                <p style={{ fontSize: "0.8rem", color: "#6366f1", margin: "0.25rem 0 0" }}>
                  {plan.posts}
                </p>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.875rem", color: "#9191a8" }}>
                    <span style={{ color: "#6366f1", fontSize: "1rem" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.dodoLink ? (
                <a
                  href={plan.dodoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "0.75rem 1.25rem",
                    borderRadius: 9,
                    background: plan.highlight
                      ? "linear-gradient(135deg, #6366f1, #7c3aed)"
                      : "rgba(255,255,255,0.06)",
                    border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    boxShadow: plan.highlight ? "0 4px 20px rgba(99,102,241,0.4)" : "none",
                  }}
                >
                  {plan.cta}
                </a>
              ) : (
                <Link
                  href={plan.href}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "0.75rem 1.25rem",
                    borderRadius: 9,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {plan.cta}
                </Link>
              )}

              {plan.payNote && (
                <p style={{ fontSize: "0.75rem", color: "#555570", textAlign: "center", margin: "0.75rem 0 0" }}>
                  {plan.payNote}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* LIFETIME OFFER */}
      <section
        id="lifetime"
        style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem 5rem" }}
      >
        <div
          style={{
            padding: "2.5rem",
            borderRadius: 20,
            border: "1.5px solid rgba(245,158,11,0.35)",
            background: "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(217,119,6,0.04) 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -1,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "0.3rem 1.25rem",
              borderRadius: "0 0 12px 12px",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            🔥 First 100 users only — Lifetime access
          </div>

          <div style={{ textAlign: "center", marginBottom: "2rem", marginTop: "1rem" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.5rem", color: "#fde68a", letterSpacing: "-0.02em" }}>
              Own it forever. Pay once.
            </h2>
            <p style={{ color: "#92400e", color: "#b45309", fontSize: "0.95rem", margin: 0 }}>
              Monthly subscriptions never expire on you — this does. Limited to the first 100 users.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {LIFETIME_PLANS.map((lp) => (
              <div
                key={lp.name}
                style={{
                  padding: "1.75rem",
                  borderRadius: 14,
                  border: "1px solid rgba(245,158,11,0.25)",
                  background: "rgba(0,0,0,0.25)",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "0.8rem", color: "#92400e", color: "#d97706", margin: "0 0 0.5rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                  {lp.name}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", justifyContent: "center", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fde68a", letterSpacing: "-0.03em" }}>
                    {lp.price}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#92400e", color: "#d97706" }}>{lp.period}</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "#b45309", margin: "0 0 1.5rem" }}>
                  {lp.posts}
                </p>
                <a
                  href={lp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    padding: "0.75rem 1.25rem",
                    borderRadius: 9,
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
                  }}
                >
                  {lp.cta}
                </a>
                <p style={{ fontSize: "0.75rem", color: "#92400e", color: "#b45309", margin: "0.75rem 0 0" }}>
                  Dodo · USDC · Pi Network
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PI PIONEER CALLOUT */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "0 2rem 4rem" }}>
        <div
          style={{
            padding: "2rem",
            borderRadius: 16,
            border: "1px solid rgba(99,102,241,0.2)",
            background: "rgba(99,102,241,0.05)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>π</div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.5rem", color: "#a5b4fc" }}>
            Built for Pi pioneers
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#7070a0", lineHeight: 1.7, margin: "0 0 1.5rem" }}>
            Teos AI Engine accepts Pi Network payments — making it one of the first SaaS tools
            to bring real utility to the Pi ecosystem. If you have Pi, you can build your
            audience with it.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Pi Network", desc: "Pay with Pi" },
              { label: "USDC", desc: "Solana on-chain" },
              { label: "Dodo", desc: "Fast checkout" },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  padding: "0.65rem 1.25rem",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#c4c4d4" }}>
                  {m.label}
                </p>
                <p style={{ margin: "0.1rem 0 0", fontSize: "0.75rem", color: "#555570" }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "0 2rem 7rem", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "2.25rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            margin: "0 0 1rem",
            background: "linear-gradient(160deg, #ffffff 40%, #a5b4fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Start building your audience today
        </h2>
        <p style={{ color: "#7070a0", fontSize: "1rem", marginBottom: "2rem" }}>
          Free starter plan. No credit card. 5 posts included.
        </p>
        <Link
          href="/signup"
          style={{
            display: "inline-block",
            padding: "0.95rem 2.5rem",
            borderRadius: 12,
            background: "linear-gradient(135deg, #6366f1, #7c3aed)",
            color: "#fff",
            textDecoration: "none",
            fontSize: "1.05rem",
            fontWeight: 700,
            boxShadow: "0 6px 40px rgba(99,102,241,0.5)",
            letterSpacing: "-0.01em",
          }}
        >
          Get 5 free posts now →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.8rem", color: "#404060", margin: 0 }}>
          © {new Date().getFullYear()} Elmahrosa International · Alexandria, Egypt ·{" "}
          <a href="mailto:ayman@teosegypt.com" style={{ color: "#555570", textDecoration: "none" }}>
            ayman@teosegypt.com
          </a>
          {" "}·{" "}
          <Link href="/admin" style={{ color: "#555570", textDecoration: "none" }}>
            Admin
          </Link>
        </p>
      </footer>
    </main>
  );
}
