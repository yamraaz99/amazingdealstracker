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
  const [pasted, setPasted] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPaste = useCallback(async () => {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (text) {
        setUrl(text);
        setError(null);
        setPasted(true);
        window.setTimeout(() => setPasted(false), 1200);
        inputRef.current?.focus();
      }
    } catch {
      setError('Clipboard access blocked. Please paste manually.');
    }
  }, []);

  const onClear = useCallback(() => {
    setUrl('');
    setError(null);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  // Auto-fetch on mount when a URL was prefilled (e.g. share intent, deep link)
  useEffect(() => {
    if (initialUrl && /^https?:\/\//i.test(initialUrl)) {
      onSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste product link (Amazon, Flipkart, Myntra…)"
              className="w-full p-3 md:p-4 pr-12 md:pr-14 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors text-gray-700 font-medium text-sm md:text-base"
              aria-label="Product URL"
              required
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={url.trim() ? onClear : onPaste}
              aria-label={url.trim() ? 'Clear URL' : 'Paste from clipboard'}
              title={url.trim() ? 'Clear' : 'Paste from clipboard'}
              className="absolute inset-y-0 right-2 my-auto w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors"
            >
              {url.trim() ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : pasted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="8" y="2" width="8" height="4" rx="1" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                </svg>
              )}
            </button>
          </div>
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

      <div ref={resultRef} className="scroll-mt-20 md:scroll-mt-24">
        {result && <TrackResultView data={result} />}
      </div>
    </div>
  );
}
