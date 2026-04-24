import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6 py-12 text-white">
      <div className="w-full rounded-3xl border border-purple-500/30 bg-white/5 p-8">
        <h1 className="text-3xl font-bold">Recover Account</h1>

        <p className="mt-4 text-zinc-300">
          Password reset automation is being activated. For launch, request secure manual recovery below.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-zinc-300">
          <p>Include:</p>
          <ul className="mt-2 space-y-1">
            <li>✓ Your Teos account email</li>
            <li>✓ Your requested plan</li>
            <li>✓ Payment proof if you are a paid user</li>
          </ul>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href="mailto:support@teosegypt.com?subject=Teos AI Engine Account Recovery&body=Hello Teos Team,%0D%0A%0D%0AI need help recovering my Teos AI Engine account.%0D%0A%0D%0AAccount email:%0D%0APlan:%0D%0APayment proof if paid:%0D%0A%0D%0AThank you."
            className="rounded-xl bg-purple-600 px-5 py-3 text-center font-bold hover:bg-purple-500"
          >
            Request Recovery
          </a>

          <Link
            href="/login"
            className="rounded-xl border border-white/10 px-5 py-3 text-center font-bold hover:bg-white/10"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}