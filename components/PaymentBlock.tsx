"use client";

import { PLANS } from "@/lib/payments";

export default function PaymentBlock() {
  return (
    <div className="space-y-6">

      <div className="border p-4 rounded-lg">
        <h3 className="text-xl font-bold">Pro – $19/month</h3>
        <p>50 posts/day • X, Facebook, Instagram</p>
        <a href={PLANS.pro.link}>
          <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">
            Upgrade to Pro
          </button>
        </a>
      </div>

      <div className="border p-4 rounded-lg">
        <h3 className="text-xl font-bold">Agency – $49/month</h3>
        <p>200 posts/day • All platforms + LinkedIn</p>
        <a href={PLANS.agency.link}>
          <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded">
            Go Agency
          </button>
        </a>
      </div>

      <div className="border p-4 rounded-lg border-yellow-500">
        <h3 className="text-xl font-bold">🔥 Lifetime – $149</h3>
        <p>100 posts/day forever • Limited offer</p>
        <a href={PLANS.lifetime.link}>
          <button className="mt-3 bg-yellow-600 text-black px-4 py-2 rounded">
            Get Lifetime Access
          </button>
        </a>
      </div>

      <p className="text-sm text-gray-500">
        After payment, your account will be activated within minutes.
      </p>

    </div>
  );
}
