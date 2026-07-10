'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { rupees } from '@/lib/format';
import { PLATFORMS, type StoreKey } from '@/lib/platforms';

interface RecentEntry {
  url: string;
  title: string;
  image: string;
  store: StoreKey;
  pid: string;
  price: number;
}

export function RecentSearches() {
  const [items, setItems] = useState<RecentEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('adz:recent');
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  if (!ready || items.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 mt-16">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
        <span>🕘</span> Your Recently Searched
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((r) => {
          const meta = PLATFORMS[r.store];
          return (
            <Link key={`${r.store}-${r.pid}`} href={`/deal/${r.store}/${r.pid}`}
                  className="card p-3 hover:-translate-y-1 transition-transform">
              <div className="h-24 flex items-center justify-center bg-white rounded-lg mb-2">
                {r.image ? <img src={r.image} alt={r.title} className="max-h-full max-w-full object-contain" /> : null}
              </div>
              <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1">{r.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold p-cur">{rupees(r.price)}</span>
                {meta && <img src={meta.logo} alt={meta.name} className="w-4 h-4 object-contain" />}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
