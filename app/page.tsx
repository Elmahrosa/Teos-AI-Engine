import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 py-6 sticky top-0 bg-black z-50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image src="/x-teoslogo.png" alt="X-Teos Pro" width={72} height={72} className="rounded-2xl" />
            <div>
              <h1 className="text-4xl font-bold tracking-tighter">X-TEOS PRO</h1>
              <p className="text-xs text-emerald-400">by $TEOS NETWORK</p>
            </div>
          </div>
          <div className="text-yellow-400 font-bold">🔥 FIRST 100 LIFETIME ONLY</div>
        </div>
      </header>

      <main className="pt-20 pb-24 text-center px-6">
        <h2 className="text-6xl font-bold tracking-tighter mb-6">AI That Posts For You</h2>
        <p className="text-2xl text-gray-400 max-w-2xl mx-auto mb-12">X • Instagram • Facebook • LinkedIn</p>

        {/* Lifetime Hot Offer */}
        <div className="max-w-md mx-auto mb-16 bg-gradient-to-b from-zinc-900 to-black border-2 border-yellow-500 rounded-3xl p-12 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-8 py-1 rounded-full text-sm font-bold">HOT OFFER — FIRST 100 ONLY</div>
          <div className="text-7xl font-bold mb-3">$99.99</div>
          <p className="text-emerald-400 text-3xl mb-8">Lifetime Access</p>
          <p className="text-yellow-400 mb-6">100 posts per day</p>
          <a href="https://www.checkout.dodopayments.com/buy/pdt_0NdBI7mHk3Rayq9O6ixh7" target="_blank" className="block w-full bg-white text-black py-6 rounded-2xl text-xl font-bold mb-4">Pay $99.99 Lifetime (Dodo)</a>
          <a href="https://www.paypal.com/paypalme/elma7rosa/99.99" target="_blank" className="block w-full border border-white/40 py-6 rounded-2xl text-xl font-bold">Or PayPal</a>
        </div>

        {/* Tiers */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-zinc-900 border border-gray-700 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <div className="text-5xl font-bold mb-6">Free</div>
            <ul className="text-left space-y-3 mb-8">
              <li>✔ 5 posts total (one-time test)</li>
              <li>✔ X + Instagram only</li>
            </ul>
            <p className="text-red-400 text-sm mb-6">After 5 posts → upgrade required</p>
            <button className="w-full border border-gray-600 py-4 rounded-2xl">Start Free Test</button>
          </div>

          <div className="bg-zinc-900 border border-emerald-500 rounded-3xl p-8 relative scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-6 py-1 rounded-full text-sm font-bold">BEST VALUE</div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="text-5xl font-bold mb-1">$29</div>
            <p className="text-gray-400 mb-8">/month</p>
            <ul className="text-left space-y-3 mb-8">
              <li>✔ 50 posts per day</li>
              <li>✔ X, Instagram, Facebook</li>
            </ul>
            <a href="https://www.checkout.dodopayments.com/buy/pdt_0NdBY7xlUYvmw5OwNMVxy" target="_blank" className="block w-full bg-emerald-600 py-4 rounded-2xl font-bold">Subscribe $29/mo</a>
          </div>

          <div className="bg-zinc-900 border border-gray-700 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-2">Agency</h3>
            <div className="text-5xl font-bold mb-1">$69</div>
            <p className="text-gray-400 mb-8">/month</p>
            <ul className="text-left space-y-3 mb-8">
              <li>✔ 200 posts per day</li>
              <li>✔ All platforms + LinkedIn (1 account)</li>
            </ul>
            <a href="https://checkout.dodopayments.com/buy/pdt_0NdBYlTpXmWH4HTCyxDyA" target="_blank" className="block w-full border border-gray-600 py-4 rounded-2xl font-bold">Subscribe $69/mo</a>
          </div>
        </div>

        <p className="mt-16 text-gray-500">Every user gets personal dashboard. Founder has full admin control. Clear limits for best performance.</p>
      </main>
    </div>
  );
}
