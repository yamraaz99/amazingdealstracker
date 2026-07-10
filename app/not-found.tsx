import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="max-w-2xl mx-auto py-20 px-4 text-center">
      <div className="card p-8 md:p-12">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-3">Deal Not Found</h1>
        <p className="text-gray-700 mb-6">
          We couldn't find this product. It may be delisted, or the link might be malformed.
        </p>
        <Link href="/track" className="btn-primary py-3 px-6 inline-flex">
          Track a Product →
        </Link>
      </div>
    </section>
  );
}
