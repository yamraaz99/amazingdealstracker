'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { TrackResultView } from './TrackResultView';
import { PlatformStrip } from './PlatformStrip';
import type { TrackResult } from '@/lib/track';

const RECENT_KEY = 'adz:recent';
const RECENT_MAX = 6;

function saveRecent(entry: { url: string; title: string; image: string; store: string; pid: string; price: number; }) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const list = raw ? (JSON.parse(raw) as typeof entry[]) : [];
    const filtered = list.filter((r) => !(r.store === entry.store && r.pid === entry.pid));
    const next = [entry, ...filtered].slice(0, RECENT_MAX);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {}
}

function friendlyError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes('please paste')) return 'Please paste a product link to continue.';
  if (m.includes('detect') || m.includes('platform')) return 'We could not recognise this link. Make sure it points to a supported marketplace product page.';
  if (m.includes('not found')) return 'We could not find price data for this product yet. It may be brand new or unlisted.';
  if (m.includes('too many')) return 'You are searching a bit fast. Please wait a moment and try again.';
  if (m.includes('forbidden')) return 'Request blocked for security. Please refresh the page and try again.';
  if (m.includes('invalid url')) return 'That does not look like a valid link. Please check and try again.';
  if (m.includes('blocked')) return 'This link is not allowed. Please use a public product URL.';
  return 'Something went wrong on our end. Please try again in a moment.';
}

export function TrackForm({ initialUrl = '' }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const onSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const value = url.trim();
    if (!value) {
      setError('Please paste a product link to continue.');
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/track?url=${encodeURIComponent(value)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      setResult(json as TrackResult);
      const r = json as TrackResult;
      saveRecent({
        url: value, title: r.title, image: r.image,
        store: r.detectedStore, pid: r.pid, price: r.currentPrice,
      });
    } catch (err) {
      const raw = err instanceof Error ? err.message : '';
      setError(friendlyError(raw));
    } finally {
      setLoading(false);
    }
  }, [url]);

  return (
    <div className="w-full">
      <div className="card w-full max-w-2xl mx-auto p-4 md:p-6 mb-6">
        <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-2 md:gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste product link (Amazon, Flipkart, Myntra…)"
            className="flex-1 p-3 md:p-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors text-gray-700 font-medium text-sm md:text-base"
            aria-label="Product URL"
            required
          />
          <button type="submit" disabled={loading} className="btn-primary py-3 md:py-4 px-6 md:px-8 min-w-[130px]">
            {loading ? (
              <>
                <div className="loader" />
                <span>Fetching…</span>
              </>
            ) : (
              <span>Track Price</span>
            )}
          </button>
        </form>
        <PlatformStrip />
        {error && (
          <div className="mt-3 p-3 rounded-lg text-sm text-center font-medium bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}
      </div>

      <div ref={resultRef}>
        {result && <TrackResultView data={result} />}
      </div>
    </div>
  );
}
