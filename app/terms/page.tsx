export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-zinc-300">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="mt-6 space-y-4 text-sm text-zinc-400">
        <h2 className="text-lg font-semibold text-white mt-6">1. Acceptance of Terms</h2>
        <p>By accessing or using Teos AI Engine (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>

        <h2 className="text-lg font-semibold text-white mt-6">2. Description of Service</h2>
        <p>Teos AI Engine is an AI-powered social media content generation platform. It allows users to generate, schedule, and manage posts across multiple platforms using artificial intelligence models running on Egyptian sovereign infrastructure.</p>

        <h2 className="text-lg font-semibold text-white mt-6">3. User Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration. You may not use the Service for any unlawful purpose.</p>

        <h2 className="text-lg font-semibold text-white mt-6">4. Payments &amp; Subscriptions</h2>
        <p>Paid plans are billed through Dodo Payments. Lifetime plans are a one-time payment. Monthly subscriptions automatically renew unless cancelled. Pi Network payments are processed at the equivalent USD value at the time of transaction. All prices are in USD. Refunds are handled per Dodo Payments&apos; refund policy.</p>

        <h2 className="text-lg font-semibold text-white mt-6">5. AI-Generated Content</h2>
        <p>You retain full ownership of all content generated using the Service. You are solely responsible for reviewing and publishing AI-generated content. The Service is a tool, not a publisher. We do not warrant that AI-generated content complies with third-party platform policies.</p>

        <h2 className="text-lg font-semibold text-white mt-6">6. Data Sovereignty</h2>
        <p>All data processed by the Service is stored on Egyptian infrastructure (Neon PostgreSQL). No user content or personal data is transferred to servers outside Egypt. This is a core design principle of the platform.</p>

        <h2 className="text-lg font-semibold text-white mt-6">7. Acceptable Use</h2>
        <p>You agree not to use the Service to generate spam, misleading content, hate speech, harassment, or any content that violates Egyptian law or the terms of third-party platforms. We reserve the right to suspend accounts that violate these terms.</p>

        <h2 className="text-lg font-semibold text-white mt-6">8. Limitation of Liability</h2>
        <p>The Service is provided &ldquo;as is&rdquo; without warranties of any kind. Teos Network shall not be liable for any damages arising from the use or inability to use the Service, including but not limited to lost profits, data loss, or service interruption.</p>

        <h2 className="text-lg font-semibold text-white mt-6">9. Governing Law</h2>
        <p>These terms are governed by the laws of the Arab Republic of Egypt. Any disputes shall be resolved in the courts of Alexandria, Egypt.</p>

        <h2 className="text-lg font-semibold text-white mt-6">10. Changes to Terms</h2>
        <p>We may update these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms. We will notify users of material changes via email.</p>

        <h2 className="text-lg font-semibold text-white mt-6">11. Contact</h2>
        <p>For questions about these terms, contact us at <a href="mailto:ayman@teosegypt.com" className="text-gold-500 hover:underline">ayman@teosegypt.com</a>.</p>
      </div>
    </main>
  );
}
