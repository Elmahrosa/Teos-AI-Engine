import Link from "next/link";

const PI_WALLET =
  "MALYJFJ5SVD45FBWN2GT4IW67SEZ3IBOFSBSPUFCWV427NBNLG3PWAAAAAAAAAMHQDECQ";

export default function PiPaymentPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12 text-white">
      <div className="rounded-3xl border border-purple-500/30 bg-purple-500/10 p-8">
        <div className="mb-6 text-5xl">π</div>

        <h1 className="text-3xl font-bold">Pay with Pi</h1>

        <p className="mt-4 text-zinc-300">
          TEOS AI Engine supports Pi Network users during launch. Send payment,
          then request founder activation so your account can be upgraded.
        </p>

        <div className="mt-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
          <h2 className="font-semibold text-yellow-200">
            Pi Payment Address
          </h2>

          <code className="mt-3 block break-all rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-yellow-100">
            {PI_WALLET}
          </code>

          <p className="mt-3 text-sm text-zinc-300">
            After payment, request activation and include your TEOS account
            email, Pi username, selected plan, and transaction proof.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
          <h2 className="text-xl font-semibold">
            Manual Founder Activation
          </h2>

          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-zinc-300">
            <li>
              Choose your plan:
              <br />
              Pro Lifetime — $149 equivalent in Pi
              <br />
              Agency Lifetime — $349 equivalent in Pi
            </li>
            <li>Send Pi to the payment address above.</li>
            <li>
              Email support@teosegypt.com with your TEOS account email, Pi
              username, selected plan, and transaction screenshot or proof.
            </li>
          </ol>

          <p className="mt-4 text-sm text-zinc-300">
            Founder activation is currently manual during launch. Most
            activations are reviewed directly by Ayman / Elmahrosa
            International.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
          <h2 className="text-xl font-semibold">Launch Pi Offer</h2>

          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            <li>✓ Starter includes 5 free posts</li>
            <li>✓ Pro plan available for Pi users</li>
            <li>✓ Agency plan unlocks LinkedIn and advanced features</li>
            <li>✓ First Pi users may receive launch discounts</li>
            <li>
              ✓ Digital access, SaaS credits, launch offers, and lifetime deals
              are non-refundable once access is activated
            </li>
          </ul>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href="mailto:support@teosegypt.com?subject=Pi Payment Activation - TEOS AI Engine&body=Hello TEOS Team,%0D%0A%0D%0AI want to activate my TEOS AI Engine plan using Pi.%0D%0A%0D%0ATEOS account email:%0D%0APlan requested: Pro Lifetime / Agency Lifetime%0D%0APi username:%0D%0APi payment proof / transaction ID:%0D%0A%0D%0AThank you."
            className="rounded-xl bg-purple-600 px-5 py-3 text-center font-bold hover:bg-purple-500"
          >
            Request Pi Activation
          </a>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 px-5 py-3 text-center font-bold text-zinc-200 hover:bg-white/10"
          >
            Back to Dashboard
          </Link>
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          This manual flow will be replaced by full Pi App Studio SDK checkout
          after TEOS AI Engine is approved inside Pi App Studio. Dodo payments
          and email login will remain available.
        </p>
      </div>
    </main>
  );
}