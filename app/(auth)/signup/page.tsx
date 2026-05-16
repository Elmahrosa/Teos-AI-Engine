"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

export default function SignupPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError(t("login.emailRequired")); return; }
    if (!name.trim()) { setError(t("login.nameRequired")); return; }
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          setError(t("login.dbError"));
        } else {
          setError(res.error);
        }
      } else if (res?.ok) {
        window.location.href = "/dashboard";
      }
    } catch {
      setError(t("login.genericError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold">
            Teos <span className="text-gold-500">AI</span>
          </Link>
          <h1 className="text-xl font-bold mt-6">{t("signup.freeTitle")}</h1>
          <p className="text-sm text-[#8a88a0] mt-1">{t("signup.freeSubtitle")}</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t("signup.namePlaceholder")}
            required
            autoComplete="name"
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-[#e8e6f0] placeholder-[#5a5870] outline-none focus:border-gold-500/40"
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-[#e8e6f0] placeholder-[#5a5870] outline-none focus:border-gold-500/40"
          />

          {error && <p className="text-xs text-red-400 px-1">{error}</p>}

          <button
            type="submit"
            disabled={loading || !email || !name}
            className="btn-teal w-full text-sm py-3 disabled:opacity-40"
          >
            {loading ? t("signup.creating") : t("signup.freeButton")}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-[#5a5870] space-y-2">
          <p>
            {t("signup.hasAccount")}{" "}
            <Link href="/login" className="text-gold-500 hover:underline">{t("signup.signin")}</Link>
          </p>
          <p className="text-[10px]">{t("signup.freePlan")}</p>
        </div>
      </div>
    </div>
  );
}
