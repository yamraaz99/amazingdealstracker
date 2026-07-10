import type { Metadata } from 'next';
import { TrackForm } from '@/components/TrackForm';
import { PlatformStrip } from '@/components/PlatformStrip';

export const metadata: Metadata = {
  title: 'Track Any Product Price',
  description: 'Paste any Amazon, Flipkart, Myntra, JioMart or other Indian marketplace link to see full price history and cross-store comparison.',
  alternates: { canonical: '/track' },
};

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ url?: string }> }) {
  const sp = await searchParams;
  const initial = typeof sp.url === 'string' ? sp.url : '';
  return (
    <section className="w-full py-10 px-4">
      <div className="max-w-3xl mx-auto text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold italic tracking-tight text-black mb-2">
          Track a Product
        </h1>
        <p className="text-gray-800 text-sm md:text-base">
          Paste any product link below. We'll find the best price across every store and show you full history.
        </p>
      </div>
      <TrackForm initialUrl={initial} />
    </section>
  );
}
