"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Enter your email and password."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#060608",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "24px",
      fontFamily: "'Crimson Pro','Georgia',serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Crimson+Pro:wght@300;400;600&family=Space+Mono:wght@400;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .fu { animation: fadeUp .6s ease both; }
        .fu1 { animation: fadeUp .6s .1s ease both; }
        .fu2 { animation: fadeUp .6s .2s ease both; }
        .fu3 { animation: fadeUp .6s .3s ease both; }
        .shimmer {
          background: linear-gradient(90deg,#C9A84C,#E8C96B,#C9A84C);
          background-size: 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .field {
          width: 100%; padding: 13px 16px;
          background: #111118; border: 1px solid rgba(255,255,255,.1);
          border-radius: 12px; color: rgba(255,255,255,.85);
          font-family: 'Space Mono',monospace; font-size: 0.82rem;
          outline: none; transition: border-color .2s;
        }
        .field:focus { border-color: rgba(201,168,76,.45); }
        .field::placeholder { color: rgba(255,255,255,.2); }
        .btn-submit {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg,#C9A84C,#A07030);
          color: #040404; border: none; border-radius: 12px; cursor: pointer;
          font-family: 'Space Mono',monospace; font-weight: 700;
          font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase;
          transition: all .2s;
        }
        .btn-submit:hover:not(:disabled) { box-shadow: 0 8px 28px rgba(201,168,76,.35); transform: translateY(-1px); }
        .btn-submit:disabled { opacity: .5; cursor: not-allowed; }
        .spin { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(0,0,0,.3); border-top-color: #040404; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .err { padding: 11px 14px; border-radius: 10px; background: rgba(255,80,80,.08); border: 1px solid rgba(255,80,80,.2); color: #ff9999; font-family: 'Space Mono',monospace; font-size: 0.7rem; }
        .divider { display: flex; align-items: center; gap: 12px; }
        .divider::before, .divider::after { content:''; flex:1; height:1px; background: rgba(255,255,255,.08); }
        .divider span { font-family: 'Space Mono',monospace; font-size: 0.65rem; color: rgba(255,255,255,.2); }
      `}</style>

      {/* Logo */}
      <div className="fu" style={{ marginBottom: "32px", textAlign: "center" }}>
        <Link href="/">
          <Image src="/tailogo.jpeg" alt="TEOS AI" width={72} height={72}
            style={{ borderRadius: "50%", objectFit: "cover", filter: "drop-shadow(0 0 24px rgba(123,79,191,.45))" }} />
        </Link>
        <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: "1.1rem", letterSpacing: "0.2em", marginTop: "14px" }}>
          <span className="shimmer">TEOS AI</span>
          <span style={{ color: "rgba(255,255,255,.5)", fontSize: "0.75rem", display: "block", letterSpacing: "0.12em", marginTop: "2px", fontWeight: 400 }}>
            ENGINE
          </span>
        </div>
      </div>

      {/* Card */}
      <div className="fu1" style={{
        width: "100%", maxWidth: "400px",
        background: "#0C0C14", border: "1px solid rgba(201,168,76,.18)",
        borderRadius: "24px", padding: "36px 32px",
        boxShadow: "0 24px 64px rgba(0,0,0,.6)",
      }}>
        <h1 className="fu2" style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: "1.4rem", marginBottom: "6px", textAlign: "center" }}>
          Welcome back
        </h1>
        <p className="fu2" style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "rgba(255,255,255,.3)", textAlign: "center", letterSpacing: "0.08em", marginBottom: "28px" }}>
          SIGN IN TO YOUR ACCOUNT
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,.35)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "7px" }}>
              Email
            </label>
            <input type="email" className="field" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              autoComplete="email" required />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
              <label style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Password
              </label>
              <Link href="/forgot-password" style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(201,168,76,.6)", textDecoration: "none" }}>
                Forgot?
              </Link>
            </div>
            <input type="password" className="field" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              autoComplete="current-password" required />
          </div>

          {error && <div className="err">{error}</div>}

          <button type="submit" className="btn-submit" disabled={loading} style={{ marginTop: "4px" }}>
            {loading ? <span className="spin" /> : "Sign In"}
          </button>
        </form>

        <div className="divider" style={{ margin: "22px 0" }}>
          <span>or</span>
        </div>

        <p style={{ textAlign: "center", fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "rgba(255,255,255,.3)" }}>
          No account?{" "}
          <Link href="/signup" style={{ color: "#C9A84C", textDecoration: "none" }}>
            Start free →
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="fu3" style={{ marginTop: "28px", fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,.15)", letterSpacing: "0.08em" }}>
        © ELMAHROSA INTERNATIONAL · ALEXANDRIA 🇪🇬
      </p>
    </div>
  );
}
