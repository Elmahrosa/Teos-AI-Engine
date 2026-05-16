"use client";

import { signIn, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

type Providers = Record<string, { id: string; name: string }>;

const providerIcons: Record<string, JSX.Element> = {
  google: (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

export default function LoginPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState<Providers>({});

  useEffect(() => {
    getProviders().then((p) => {
      if (p) setProviders(p as Providers);
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError(t("login.emailRequired")); return; }
    if (!password.trim()) { setError(t("login.passwordRequired")); return; }
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password: password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          setError(t("login.invalidCredentials"));
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

  const oauthProviders = Object.values(providers).filter(
    (p) => p.id !== "credentials"
  );

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold">
            Teos <span className="text-gold-500">AI</span>
          </Link>
          <h1 className="text-xl font-bold mt-6">{t("login.title")}</h1>
          <p className="text-sm text-[#8a88a0] mt-1">{t("login.subtitle")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            autoFocus
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-[#e8e6f0] placeholder-[#5a5870] outline-none focus:border-gold-500/40"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t("login.passwordPlaceholder")}
            required
            minLength={6}
            autoComplete="current-password"
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-[#e8e6f0] placeholder-[#5a5870] outline-none focus:border-gold-500/40"
          />

          {error && <p className="text-xs text-red-400 px-1">{error}</p>}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="btn-teal w-full text-sm py-3 disabled:opacity-40"
          >
            {loading ? t("signin.signing") : t("login.signin")}
          </button>
        </form>

        {oauthProviders.length > 0 && (
          <>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-[#5a5870]">or</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <div className="mt-4 space-y-3">
              {oauthProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })}
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-[#e8e6f0] hover:bg-white/[0.06] transition-colors"
                >
                  {providerIcons[provider.id]}
                  {t("login.continueWith").replace("{provider}", provider.name)}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 text-center text-xs text-[#5a5870]">
          <p>
            {t("login.noAccount")}{" "}
            <Link href="/signup" className="text-gold-500 hover:underline">{t("login.signup")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
