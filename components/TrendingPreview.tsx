import Link from 'next/link';

// Phase 5 will wire this to real Turso data. For now — curated placeholder cards
// that demonstrate the layout so the landing page never looks empty.
const PLACEHOLDER = [
  { store: 'amazon',   pid: 'B0DGY8QW6D', title: 'Wireless Earbuds — Trending Pick',    price: 1499, mrp: 4999, image: 'https://compare.buyhatke.com/images/site_icons_m/amazon.png' },
  { store: 'flipkart', pid: 'MOBGXXXXX',   title: 'Smartphone Deal of the Day',          price: 12999, mrp: 18999, image: 'https://compare.buyhatke.com/images/site_icons_m/flipkart1.png' },
  { store: 'myntra',   pid: '12345678',    title: 'Fashion Under ₹499',                  price: 399, mrp: 999, image: 'https://compare.buyhatke.com/images/site_icons_m/myntra1.png' },
  { store: 'bigbasket',pid: '10000001',    title: 'Grocery Combo Bestseller',            price: 249, mrp: 399, image: 'https://compare.buyhatke.com/images/site_icons_m/bigBasket.png' },
];

export function TrendingPreview() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 mt-8 md:mt-16">
      <div className="flex items-end justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <span>🔥</span> Trending Deals
          </h2>
          <p className="text-xs md:text-sm text-gray-700 mt-1">Hottest picks updated hourly.</p>
        </div>
        <Link href="/trending" className="text-xs md:text-sm font-bold text-orange-600 hover:underline">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PLACEHOLDER.map((d, i) => {
          const discount = Math.round(((d.mrp - d.price) / d.mrp) * 100);
          return (
            <div key={i} className="card p-4 hover:-translate-y-1 transition-transform">
              <div className="h-32 flex items-center justify-center bg-white rounded-lg mb-3">
                <img src={d.image} alt={d.title} className="max-h-full max-w-full object-contain" />
              </div>
              <p className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 min-h-[2.5rem]">{d.title}</p>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-lg font-extrabold p-cur">₹{d.price.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-gray-400 line-through ml-1">₹{d.mrp.toLocaleString('en-IN')}</span>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">
                  -{discount}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 text-center mt-4 italic">
        Real trending deals will populate here from live user searches once we launch.
      </p>
    </section>
  );
}
