import Link from "next/link";

export const metadata = {
  title: "Teos AI Engine — AI Content Intelligence for Founders",
  description:
    "Generate high-impact social media content for X, LinkedIn, Instagram, and Facebook. Built for founders, agencies, and creators. Pay with PayPal, USDC, or Pi.",
  openGraph: {
    title: "Teos AI Engine — AI Content Intelligence",
    description:
      "Turn any idea into platform-optimized social posts built for builders and growth teams.",
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
    cta: "Start Pro",
    href: "/signup?plan=pro",
    payNote: "Pay with PayPal, USDC, or Pi Network",
  },
  {
    name: "Agency",
    price: "$69",
    period: "/month",
    highlight: false,
    badge: null,
    posts: "Unlimited",
    features: [
      "Unlimited posts",
      "All 4 platforms",
      "LinkedIn + agency workflow",
      "Advanced support",
      "Best for teams and power users",
    ],
    cta: "Contact us",
    href: "mailto:ayman@teosegypt.com?subject=Agency Plan",
    payNote: "Invoice, PayPal, USDC, or Pi",
  },
];

const SOCIAL_PROOF = [
  { icon: "🌍", text: "Built for founders, creators, and agencies" },
  { icon: "💳", text: "Pay with PayPal, USDC, or Pi" },
  { icon: "⚡", text: "Fast AI content generation" },
  { icon: "🔐", text: "Session-based authentication" },
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
      "Use AI visibility scoring and strong CTA suggestions to improve reach instead of guessing what may perform.",
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
          <span>AI-powered social content for builders</span>
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
          Facebook — with visibility scoring so you can focus on growth, not blank screens.
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
          {SOCIAL_PROOF.map((item) => (
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

      <section style={{ maxWidth: 960, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              margin: "0 0 0.75rem",
            }}
          >
            Built for the way you actually work
          </h2>
          <p style={{ color: "#7070a0", fontSize: "1rem" }}>
            Not a generic toy. Designed for founders and operators who ship fast.
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
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  margin: "0 0 0.6rem",
                  color: "#e0e0f0",
                }}
              >
                {uc.title}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#7070a0", lineHeight: 1.65, margin: 0 }}>
                {uc.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          background: "rgba(99,102,241,0.04)",
          borderTop: "1px solid rgba(99,102,241,0.1)",
          borderBottom: "1px solid rgba(99,102,241,0.1)",
          padding: "5rem 2rem",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              margin: "0 0 3rem",
            }}
          >
            Three steps to ready-to-post content
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                step: "01",
                title: "Describe your idea",
                desc: "Type a topic, product update, or insight. No templates. No blank-page struggle.",
              },
              {
                step: "02",
                title: "Pick your platform",
                desc: "Choose X, LinkedIn, Instagram, or Facebook. Each post is adapted for that format.",
              },
              {
                step: "03",
                title: "Review and publish",
                desc: "Get your visibility score, CTA suggestion, and final copy in seconds.",
              },
            ].map((s) => (
              <div key={s.step} style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#6366f1",
                    letterSpacing: "0.1em",
                    marginBottom: "0.75rem",
                  }}
                >
                  {s.step}
                </div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    margin: "0 0 0.5rem",
                    color: "#e0e0f0",
                  }}
                >
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

      <section id="pricing" style={{ maxWidth: 1000, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              margin: "0 0 0.75rem",
            }}
          >
            Simple, honest pricing
          </h2>
          <p style={{ color: "#7070a0", fontSize: "1rem" }}>
            Pay with PayPal, USDC, or Pi Network.
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
              {plan.badge ? (
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
              ) : null}

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
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      fontSize: "0.875rem",
                      color: "#9191a8",
                    }}
                  >
                    <span style={{ color: "#6366f1", fontSize: "1rem" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
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
              </Link>

              {plan.payNote && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#555570",
                    textAlign: "center",
                    margin: "0.75rem 0 0",
                  }}
                >
                  {plan.payNote}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "0 2rem 5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            padding: "2rem",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "#555570", margin: "0 0 1rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Payment options
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "PayPal", desc: "Instant checkout" },
              { label: "USDC", desc: "Solana on-chain" },
              { label: "Pi Network", desc: "Pi ecosystem" },
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

      <section
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "0 2rem 7rem",
          textAlign: "center",
        }}
      >
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
          Free starter plan. 5 posts included.
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

      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "0.8rem", color: "#404060", margin: 0 }}>
          © {new Date().getFullYear()} Elmahrosa International · Alexandria, Egypt ·{" "}
          <a
            href="mailto:ayman@teosegypt.com"
            style={{ color: "#555570", textDecoration: "none" }}
          >
            ayman@teosegypt.com
          </a>
        </p>
      </footer>
    </main>
  );
}