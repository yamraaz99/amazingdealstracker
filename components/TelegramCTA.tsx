import { SITE } from '@/lib/site';

export function TelegramCTA() {
  return (
    <section className="w-full max-w-4xl mx-auto mt-8 md:mt-16 px-4">
      <div className="card p-4 md:p-6 flex items-center gap-3 md:gap-5">
        <div className="flex-shrink-0 w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-[#229ED9]/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 text-[#229ED9]" fill="currentColor" aria-hidden="true">
            <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.24 3.64 11.95c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-lg font-bold text-gray-900 leading-tight">
            Deals dropping daily on Telegram
          </h3>
          <p className="text-[11px] md:text-sm text-gray-600 leading-snug mt-0.5 hidden sm:block">
            Hand-picked deals & flash sales. No signup, unsubscribe anytime.
          </p>
        </div>

        <a
          href={SITE.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-1.5 bg-[#229ED9] hover:bg-[#1c8bb4] text-white font-bold text-xs md:text-sm py-2.5 md:py-3 px-3.5 md:px-6 rounded-xl transition-colors whitespace-nowrap"
        >
          <span>Join</span>
          <span className="hidden sm:inline">Channel</span>
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
