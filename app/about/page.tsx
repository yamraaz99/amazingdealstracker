import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Amazing Dealz — a free, independent price tracker for Indian marketplaces.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto py-12 px-4 prose prose-neutral">
      <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-6">About Amazing Dealz</h1>
      <div className="card p-6 md:p-8 space-y-4 text-gray-800 leading-relaxed text-sm md:text-base">
        <p>
          Amazing Dealz is a free, independent tool that helps Indian shoppers track prices across
          Amazon, Flipkart, Myntra, JioMart and 12+ more marketplaces. We show you the full price
          history of any product so you can tell a real deal from marketing fluff.
        </p>
        <p>
          We are not affiliated with any marketplace. We use publicly available price data through
          trusted aggregation partners and never resell or store your personal information.
        </p>
        <p>
          <strong>Why we built this:</strong> tired of "70% OFF!" tags that were actually the same
          price a week ago. So we made the tool we wished existed.
        </p>
        <p className="italic text-gray-600">
          As an Amazon Associate we earn from qualifying purchases. That is our only source of funding —
          the site is free and always will be.
        </p>
      </div>
    </article>
  );
}
