export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] p-6 text-white max-w-3xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
      <p className="text-zinc-300">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="mt-6 space-y-4 text-sm text-zinc-400">
        <p>
          We collect account information such as name, email, subscription plan,
          and generated posts to provide X-Teos Pro services.
        </p>
        <p>
          Payment processing is handled through third-party payment providers.
          We do not store full card details on this site.
        </p>
        <p>
          We use your data to provide account access, billing, support, and
          service improvements.
        </p>
        <p>
          We do not sell your personal data. We may share limited data with
          trusted infrastructure providers required to operate the service.
        </p>
        <p>
          To request deletion or support, contact: ayman@teosegypt.com
        </p>
      </div>
    </main>
  );
}
