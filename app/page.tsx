import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 py-6 sticky top-0 bg-black z-50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image src="/x-teoslogo.png" alt="X-Teos Pro" width={72} height={72} className="rounded-2xl" />
            <h1 className="text-4xl font-bold tracking-tighter">X-TEOS PRO</h1>
          </div>
          <div className="text-yellow-400 font-bold">FIRST 100 LIFETIME ONLY</div>
        </div>
      </header>

      <main className="pt-20 pb-24 text-center px-6">
        <h2 className="text-6xl font-bold tracking-tighter mb-6">Turn Ideas Into Real Content</h2>
        <p className="text-2xl text-gray-400 max-w-2xl mx-auto mb-12">X • Instagram • Facebook • LinkedIn — Unlimited</p>

        <div className="max-w-md mx-auto bg-zinc-900 border border-yellow-500 rounded-3xl p-12">
          <div className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-bold mb-6">
            🔥 ONLY FIRST 100 USERS
          </div>
          
          <div className="text-7xl font-bold mb-3">$99.99</div>
          <p className="text-emerald-400 text-2xl mb-10">Lifetime Access — Pay Once</p>

          <ul className="text-left space-y-4 mb-12 text-lg">
            <li>✔ Unlimited AI posts</li>
            <li>✔ All 4 platforms</li>
            <li>✔ Save templates & library</li>
            <li>✔ Future updates free</li>
            <li>✔ Founder priority support</li>
          </ul>

          <a href="https://www.checkout.dodopayments.com/buy/pdt_0NdBI7mHk3Rayq9O6ixh7" 
             target="_blank"
             className="block w-full bg-white text-black py-6 rounded-2xl text-xl font-bold mb-4 hover:bg-gray-200">
            Pay $99.99 with Dodo
          </a>

          <a href="https://www.paypal.com/paypalme/elma7rosa/99.99" 
             target="_blank"
             className="block w-full border border-white/40 py-6 rounded-2xl text-xl font-bold hover:bg-white/10">
            Or Pay with PayPal
          </a>

          <p className="text-sm text-gray-500 mt-8">
            After payment → DM <strong>@KING_TEOS</strong> your email<br/>
            I upgrade you to Lifetime manually
          </p>
        </div>

        <p className="mt-12 text-gray-500">After 100 users — Lifetime closed. Monthly tiers begin.</p>
      </main>
    </div>
  );
}
