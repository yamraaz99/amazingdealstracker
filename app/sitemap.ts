import type { MetadataRoute } from 'next';
import { STORE_KEYS } from '@/lib/platforms';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base: MetadataRoute.Sitemap = [
    { url: SITE.url,             lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE.url}/track`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE.url}/trending`, lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${SITE.url}/about`,    lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/privacy`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE.url}/terms`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];
  const stores: MetadataRoute.Sitemap = STORE_KEYS.map((s) => ({
    url: `${SITE.url}/stores/${s}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));
  // Phase 5: dynamic deal pages will be appended here from Turso
  return [...base, ...stores];
}
