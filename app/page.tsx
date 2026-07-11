import { Hero } from '@/components/Hero';
import { TrendingPreview } from '@/components/TrendingPreview';
import { HowItWorks } from '@/components/HowItWorks';
import { StoreGrid } from '@/components/StoreGrid';
import { RecentSearches } from '@/components/RecentSearches';
import { TelegramCTA } from '@/components/TelegramCTA';
import { FAQ } from '@/components/FAQ';
import { SITE } from '@/lib/site';

export default function HomePage() {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.shortName,
    url: SITE.url,
    description: SITE.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.url}/track?url={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.shortName,
    url: SITE.url,
    logo: `${SITE.url}/icons/icon-192.png`,
    sameAs: [SITE.telegram],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      <Hero />
      <TrendingPreview />
      <RecentSearches />
      <HowItWorks />
      <StoreGrid />
      <TelegramCTA />
      <FAQ />
    </>
  );
}
