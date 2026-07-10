import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { trackByPid } from '@/lib/track';
import { TrackResultView } from '@/components/TrackResultView';
import { PLATFORMS, STORE_KEYS, type StoreKey } from '@/lib/platforms';
import { rupees } from '@/lib/format';
import { SITE } from '@/lib/site';

export const runtime = 'edge';
export const revalidate = 900; // 15 min ISR

interface Params { store: string; pid: string; }

function isStoreKey(v: string): v is StoreKey {
  return (STORE_KEYS as string[]).includes(v);
}

async function loadDeal(store: string, pid: string) {
  if (!isStoreKey(store)) return null;
  try {
    return await trackByPid(store, pid);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { store, pid } = await params;
  const data = await loadDeal(store, pid);
  if (!data) return { title: 'Deal Not Found', robots: { index: false } };

  const savings = data.mrp > data.currentPrice
    ? ` (was ${rupees(data.mrp)})` : '';
  const storeName = PLATFORMS[data.detectedStore].name;
  const title = `${data.title || 'Product'} — ${rupees(data.currentPrice)}${savings} | ${storeName} Price History`;
  const description = `Track ${data.title || 'this product'} price. Currently ${rupees(data.currentPrice)}. Lowest ever: ${rupees(data.lowestPrice)}. Compare across Amazon, Flipkart, Myntra & more.`;

  return {
    title,
    description,
    alternates: { canonical: `/deal/${store}/${pid}` },
    openGraph: {
      title, description,
      images: data.image ? [{ url: data.image }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title, description,
      images: data.image ? [data.image] : undefined,
    },
  };
}

export default async function DealPage({ params }: { params: Promise<Params> }) {
  const { store, pid } = await params;
  const data = await loadDeal(store, pid);
  if (!data) notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title || 'Product',
    image: data.image || undefined,
    productID: data.pid,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: data.lowestPrice,
      highPrice: data.highestPrice,
      offerCount: data.stores.length,
      offers: data.stores.map((s) => ({
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: s.price,
        seller: { '@type': 'Organization', name: s.name },
        url: s.link,
        availability: 'https://schema.org/InStock',
      })),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: PLATFORMS[data.detectedStore].name, item: `${SITE.url}/stores/${data.detectedStore}` },
      { '@type': 'ListItem', position: 3, name: data.title || 'Product', item: `${SITE.url}/deal/${data.detectedStore}/${data.pid}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="py-10">
        <TrackResultView data={data} />
      </section>
    </>
  );
}
