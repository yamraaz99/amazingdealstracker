const STEPS = [
  { icon: '🔗', title: 'Paste the link', desc: 'Grab any product URL from Amazon, Flipkart, Myntra, JioMart, or 12+ other stores.' },
  { icon: '📊', title: 'See the full history', desc: 'We show highest, lowest & average price over months — so you know what a "real" deal looks like.' },
  { icon: '🛍', title: 'Buy at the best store', desc: 'We compare live prices across every marketplace and highlight the cheapest one.' },
];

export function HowItWorks() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 mt-16">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-8">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STEPS.map((s, i) => (
          <div key={i} className="card p-6 text-center">
            <div className="text-4xl mb-3">{s.icon}</div>
            <h3 className="font-extrabold text-gray-900 mb-2">{i + 1}. {s.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
