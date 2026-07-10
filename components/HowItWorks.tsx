const STEPS = [
  { icon: '🔗', title: 'Paste the link', desc: 'Grab any product URL from Amazon, Flipkart, Myntra, JioMart, or 12+ other stores.' },
  { icon: '📊', title: 'See the full history', desc: 'We show highest, lowest & average price over months — so you know what a "real" deal looks like.' },
  { icon: '🛍', title: 'Buy at the best store', desc: 'We compare live prices across every marketplace and highlight the cheapest one.' },
];

export function HowItWorks() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 mt-8 md:mt-16">
      <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 text-center mb-4 md:mb-8">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {STEPS.map((s, i) => (
          <div key={i} className="card p-4 md:p-6 text-center flex md:block items-start gap-3 md:gap-0 text-left md:text-center">
            <div className="text-3xl md:text-4xl md:mb-3 shrink-0">{s.icon}</div>
            <div>
              <h3 className="font-extrabold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">{i + 1}. {s.title}</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
