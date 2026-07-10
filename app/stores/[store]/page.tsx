import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PLATFORMS, STORE_KEYS, type StoreKey } from '@/lib/platforms';

interface Params { store: string; }

function isStoreKey(v: string): v is StoreKey {
  return (STORE_KEYS as string[]).includes(v);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { store } = await params;
  if (!isStoreKey(store)) return { title: 'Store Not Found', robots: { index: false } };
  const p = PLATFORMS[store];
  return {
    title: `${p.name} Price Tracker`,
    description: `Track prices on ${p.name}. See historical highs & lows, compare against Amazon, Flipkart, Myntra and more, and never overpay.`,
    alternates: { canonical: `/stores/${store}` },
  };
}

export function generateStaticParams() {
  return STORE_KEYS.map((store) => ({ store }));
}

export default async function StorePage({ params }: { params: Promise<Params> }) {
  const { store } = await params;
  if (!isStoreKey(store)) notFound();
  const p = PLATFORMS[store];

  return (
    <section className="py-10 px-4">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <img src={p.logo} alt={p.name} className="w-16 h-16 mx-auto mb-3" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-2">
          {p.name} Price Tracker
        </h1>
        <p className="text-gray-800 text-sm md:text-base max-w-xl mx-auto">
          Paste any {p.name} product link to see full price history, compare across other Indian marketplaces,
          and find the lowest available price.
        </p>
      </div>

      <div className="max-w-2xl mx-auto card p-6 text-center">
        <p className="text-sm text-gray-700 mb-4">Have a {p.name} link ready?</p>
        <Link href="/track" className="btn-primary py-3 px-6 inline-flex">
          Track a {p.name} Product →
        </Link>
      </div>

      <p className="text-xs text-gray-500 text-center mt-6 max-w-lg mx-auto italic">
        Popular {p.name} deals will list here in Phase 5 once we're logging real searches.
      </p>
    </section>
  );
}
