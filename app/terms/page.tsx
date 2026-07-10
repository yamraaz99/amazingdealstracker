import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'The rules for using Amazing Dealz. Basically: use it, do not abuse it.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <article className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-6">Terms of Use</h1>
      <div className="card p-6 md:p-8 space-y-4 text-gray-800 leading-relaxed text-sm md:text-base">
        <p className="text-xs text-gray-500">Last updated: {new Date().toISOString().slice(0, 10)}</p>

        <h2 className="text-lg font-bold mt-4">Free service</h2>
        <p>Amazing Dealz is provided free of charge, "as is", without warranty of any kind.</p>

        <h2 className="text-lg font-bold mt-4">Price accuracy</h2>
        <p>Prices are pulled from marketplace data and refreshed periodically. Actual prices at the checkout page of the marketplace are the source of truth. We are not liable for pricing differences.</p>

        <h2 className="text-lg font-bold mt-4">Acceptable use</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Personal, non-commercial use only.</li>
          <li>No automated scraping, no bots hitting our endpoints.</li>
          <li>No attempting to reverse-engineer, republish, or resell our data.</li>
        </ul>

        <h2 className="text-lg font-bold mt-4">Marketplace trademarks</h2>
        <p>All product names, logos, and brands (Amazon, Flipkart, Myntra, etc.) are property of their respective owners. Their appearance here is descriptive use only. We are not affiliated with or endorsed by any marketplace.</p>

        <h2 className="text-lg font-bold mt-4">Changes</h2>
        <p>We may update these terms. Continued use of the site after changes means you accept them.</p>
      </div>
    </article>
  );
}
