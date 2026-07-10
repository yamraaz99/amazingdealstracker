import type { StoreKey } from './platforms';

const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || 'azdealzs-21';

/**
 * Rewrite a marketplace buy-link to include our affiliate tag where we have one.
 * Currently: Amazon. Others to be added when we have affiliate accounts.
 */
export function withAffiliate(rawUrl: string, store: StoreKey): string {
  try {
    const u = new URL(rawUrl);
    if (store === 'amazon' && /amazon\.(in|co\.in|com)$/i.test(u.hostname.replace(/^www\./, ''))) {
      u.searchParams.set('tag', AMAZON_TAG);
      return u.toString();
    }
    return rawUrl;
  } catch {
    return rawUrl;
  }
}

export function amazonProductUrl(asin: string): string {
  return `https://www.amazon.in/dp/${encodeURIComponent(asin)}?tag=${AMAZON_TAG}`;
}
