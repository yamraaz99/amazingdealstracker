import Link from 'next/link';
import { PLATFORMS, STORE_KEYS } from '@/lib/platforms';

export function StoreGrid() {
  return (
    <section id="stores" className="w-full max-w-6xl mx-auto px-4 mt-16">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-2">
        Browse by Store
      </h2>
      <p className="text-center text-gray-700 mb-8 text-sm">
        We track prices across every major marketplace in India.
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {STORE_KEYS.map((key) => {
          const p = PLATFORMS[key];
          return (
            <Link key={key} href={`/stores/${key}`}
                  className="card p-4 flex flex-col items-center gap-2 hover:-translate-y-1 transition-transform">
              <img src={p.logo} alt={p.name} className="w-10 h-10 object-contain" />
              <span className="text-xs font-bold text-gray-800">{p.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
