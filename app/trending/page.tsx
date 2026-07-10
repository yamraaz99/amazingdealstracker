import type { Metadata } from 'next';
import { TrendingPreview } from '@/components/TrendingPreview';

export const metadata: Metadata = {
  title: 'Trending Deals Right Now',
  description: 'Hottest deals across Amazon, Flipkart, Myntra & more. Updated hourly based on what users are searching.',
  alternates: { canonical: '/trending' },
};

export default function TrendingPage() {
  return (
    <section className="py-10">
      <div className="max-w-4xl mx-auto text-center px-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold italic tracking-tight text-black mb-2">
          🔥 Trending Deals
        </h1>
        <p className="text-gray-800 text-sm md:text-base">
          The hottest picks across every marketplace, refreshed hourly.
        </p>
      </div>
      <TrendingPreview />
      <p className="text-center text-sm text-gray-600 mt-8 max-w-xl mx-auto px-4">
        This page will populate with real trending deals once we launch and users start searching.
        Phase 5 wires this to live data.
      </p>
    </section>
  );
}
