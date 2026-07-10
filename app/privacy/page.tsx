import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Amazing Dealz handles your data. Short answer: we do not collect personal information.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-6">Privacy Policy</h1>
      <div className="card p-6 md:p-8 space-y-4 text-gray-800 leading-relaxed text-sm md:text-base">
        <p className="text-xs text-gray-500">Last updated: {new Date().toISOString().slice(0, 10)}</p>

        <h2 className="text-lg font-bold mt-4">Short version</h2>
        <p>
          We do not collect your personal data. We do not require signup. Your recently-searched
          products are stored on YOUR device (browser localStorage) and never sent to us.
        </p>

        <h2 className="text-lg font-bold mt-4">What we do collect</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Anonymous request logs</strong> (IP, user agent, product URL requested) — kept for up to 30 days for abuse prevention and rate limiting. Not sold, not shared.</li>
          <li><strong>Anonymized aggregate stats</strong> via Cloudflare Web Analytics — cookieless, GDPR-friendly.</li>
        </ul>

        <h2 className="text-lg font-bold mt-4">Cookies</h2>
        <p>We use no tracking cookies. The only browser storage we touch is localStorage on your device for the "Recently Searched" feature — and you can clear it any time.</p>

        <h2 className="text-lg font-bold mt-4">Affiliate links</h2>
        <p>Product buy-links may include affiliate tags. If you buy through them, we earn a small commission at no extra cost to you. This helps keep the service free.</p>

        <h2 className="text-lg font-bold mt-4">Third parties</h2>
        <p>We use Cloudflare (hosting, DDoS protection) and price aggregation partners. We do not share personal data with any of them.</p>

        <h2 className="text-lg font-bold mt-4">Contact</h2>
        <p>Questions? Reach out via our <a href="https://t.me/amazing_Deals_Loots_Flipkart" className="text-orange-600 font-semibold" target="_blank" rel="noopener noreferrer">Telegram channel</a>.</p>
      </div>
    </article>
  );
}
