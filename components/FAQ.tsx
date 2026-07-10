const FAQS = [
  {
    q: 'Is Amazing Dealz free to use?',
    a: 'Yes, 100% free. No signup, no ads. We may earn a small commission when you buy through affiliate links — that keeps the site running at no cost to you.',
  },
  {
    q: 'Which stores do you support?',
    a: 'Amazon, Flipkart, Myntra, JioMart, Meesho, BigBasket, Blinkit, Zepto, Swiggy Instamart, Nykaa, Vijay Sales, Snapdeal, Ajio, Tata CLiQ, Netmeds, 1mg — 16+ marketplaces and growing.',
  },
  {
    q: 'How accurate is the price history?',
    a: 'We aggregate live prices from marketplaces and cross-check against historical data updated every few hours. Some products have months of history, others are newly tracked.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. Everything runs in your browser. You can also add Amazing Dealz to your home screen as a PWA — one-tap access without an app.',
  },
  {
    q: 'Is my data safe?',
    a: 'We do not collect personal information. Search history is stored on YOUR device (browser localStorage), never sent to us. We use no tracking cookies.',
  },
  {
    q: 'Where does the data come from?',
    a: 'We use publicly available marketplace data through trusted price aggregation partners. All buy-links take you directly to the seller — we never resell anything.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="w-full max-w-4xl mx-auto px-4 mt-16">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-8">
        Frequently Asked
      </h2>
      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <details key={i} className="card p-5 group">
            <summary className="font-bold text-gray-900 cursor-pointer flex items-center justify-between">
              <span>{f.q}</span>
              <span className="text-orange-500 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
            </summary>
            <p className="mt-3 text-sm text-gray-700 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
