import { TrackForm } from './TrackForm';

export function Hero() {
  return (
    <section className="w-full pt-10 pb-6 px-4">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold italic tracking-tight text-black mb-4">
          Track Any Product.<br />
          <span className="text-orange-600">Compare Every Store.</span>
        </h1>
        <p className="text-gray-800 font-medium text-base md:text-lg max-w-2xl mx-auto">
          Paste a link from Amazon, Flipkart, Myntra, JioMart & 12+ Indian stores. See full price history,
          find the lowest deal, and never overpay again.
        </p>
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-1 bg-white/60 rounded-full text-xs font-bold text-gray-700">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Free · No signup · Secure
        </div>
      </div>
      <TrackForm />
    </section>
  );
}
