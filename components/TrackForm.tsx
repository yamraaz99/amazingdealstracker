'use client';

import { useState, useCallback } from 'react';
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

export function TrackForm({ initialUrl = '' }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ msg: string; tone: 'ok' | 'err' } | null>(null);
  const [result, setResult] = useState<TrackResult | null>(null);

  const onSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const value = url.trim();
    if (!value) {
      setStatus({ msg: 'Please paste a valid product link.', tone: 'err' });
      return;
    }
    setStatus(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/track?url=${encodeURIComponent(value)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      setResult(json as TrackResult);
      setStatus({ msg: 'Data loaded successfully!', tone: 'ok' });
      const r = json as TrackResult;
      saveRecent({
        url: value, title: r.title, image: r.image,
        store: r.detectedStore, pid: r.pid, price: r.currentPrice,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setStatus({ msg: message, tone: 'err' });
    } finally {
      setLoading(false);
    }
  }, [url]);

  return (
    <div className="w-full">
      <div className="card w-full max-w-2xl mx-auto p-6 mb-8">
        <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste any product link (Amazon, Flipkart, Myntra, JioMart, Meesho…)"
            className="flex-1 p-4 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-colors text-gray-700 font-medium text-sm md:text-base"
            aria-label="Product URL"
            required
          />
          <button type="submit" disabled={loading} className="btn-primary py-4 px-8 min-w-[140px]">
            {loading ? (
              <>
                <div className="loader" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Track Price</span>
            )}
          </button>
        </form>
        <PlatformStrip />
        {status && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center font-semibold ${
            status.tone === 'ok' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>{status.msg}</div>
        )}
      </div>

      {result && <TrackResultView data={result} />}
    </div>
  );
}
