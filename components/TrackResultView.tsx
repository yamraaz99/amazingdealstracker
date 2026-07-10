'use client';

import { rupees, verdictFor } from '@/lib/format';
import type { TrackResult } from '@/lib/track';
import { PriceChart } from './PriceChart';
import { PLATFORMS } from '@/lib/platforms';

const TONE: Record<string, string> = {
  green: 'text-green-600',
  blue: 'text-blue-600',
  red: 'text-red-500',
  gray: 'text-gray-500',
};

export function TrackResultView({ data }: { data: TrackResult }) {
  const verdict = verdictFor(data.currentPrice, data.lowestPrice, data.highestPrice, data.averagePrice);
  const detected = PLATFORMS[data.detectedStore];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-4">
      {/* Product header */}
      <div className="card p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 bg-white rounded-lg p-2 border border-gray-100 flex items-center justify-center">
          {data.image ? (
            <img src={data.image} alt={data.title || 'Product'} className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-gray-300 text-xs">No image</span>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 leading-tight mb-2">
            {data.title || 'Product'}
          </h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600">
              {data.category || 'General'}
            </span>
            <span className="bg-yellow-100 px-3 py-1 rounded-full text-xs font-mono font-semibold text-yellow-800">
              ID: {data.pid}
            </span>
            {detected && (
              <span className="bg-blue-100 px-3 py-1 rounded-full text-xs font-semibold text-blue-700">
                📍 {detected.name}
              </span>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-6 border-t border-gray-100 pt-4">
            <div>
              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Current Best Price</span>
              <div className="text-4xl font-extrabold p-cur">{rupees(data.currentPrice)}</div>
            </div>
            <div className="flex-1">
              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Analysis</span>
              <div className={`text-lg font-bold mt-1 ${TONE[verdict.tone]}`}>{verdict.text}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Highest Price" value={rupees(data.highestPrice)} colorClass="p-high" border="border-red-500" />
        <StatCard label="Average Price" value={rupees(data.averagePrice)} colorClass="p-avg" border="border-yellow-500" />
        <StatCard label="Lowest Price"  value={rupees(data.lowestPrice)}  colorClass="p-low" border="border-green-500" />
      </div>

      {/* Best across stores */}
      {data.stores.length > 0 && (
        <div className="card p-4 md:p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-yellow-500 pl-3">
            Best Price Across Stores
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {data.stores.map((store, i) => {
              const isLowest = i === 0;
              const diff = store.price - data.stores[0].price;
              const diffText = isLowest ? 'Lowest Price' : `+${rupees(diff)}`;
              const buyBg = store.color === '#F8CC1B' ? '#D4A900' : store.color || '#666';
              const buyColor = store.color === '#F8CC1B' ? '#1a1a00' : '#ffffff';
              return (
                <div key={store.key} className={`store-card${isLowest ? ' lowest' : ''}`}>
                  <img src={store.logo} alt={store.name} className="store-logo" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="store-price">{rupees(store.price)}</div>
                  <div className="store-diff">{diffText}</div>
                  <a href={store.link} target="_blank" rel="noopener noreferrer sponsored"
                     className="store-buy" style={{ background: buyBg, color: buyColor }}>
                    Buy →
                  </a>
                </div>
              );
            })}
          </div>
          {data.mrp > 0 && (
            <p className="text-xs text-gray-400 mt-4 text-right">
              Prices fetched in real-time · Sorted lowest first · MRP {rupees(data.mrp)}
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="card p-4 md:p-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-yellow-500 pl-3">
          Price History Graph
        </h3>
        <PriceChart labels={data.chartLabels} data={data.chartData} />
      </div>
    </div>
  );
}

function StatCard({ label, value, colorClass, border }: { label: string; value: string; colorClass: string; border: string; }) {
  return (
    <div className={`card p-5 border-b-4 md:border-b-0 md:border-l-4 ${border} text-center md:text-left`}>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className={`text-3xl font-bold ${colorClass} mt-1`}>{value}</p>
    </div>
  );
}
