import { SITE } from '@/lib/site';

export function TelegramCTA() {
  return (
    <section className="w-full max-w-4xl mx-auto mt-8 md:mt-16 px-4">
      <div className="relative bg-white rounded-2xl md:rounded-3xl border-b-4 md:border-b-8 border-r-2 md:border-r-4 border-orange-500 shadow-xl overflow-hidden p-5 md:p-10 transform transition-all hover:-translate-y-1 hover:shadow-2xl duration-300">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 md:w-48 h-40 md:h-48 bg-yellow-300 rounded-full blur-3xl opacity-40 md:opacity-50" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 md:w-48 h-40 md:h-48 bg-orange-200 rounded-full blur-3xl opacity-40 md:opacity-50" />
        <div className="relative flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <div className="flex-shrink-0 relative hidden md:block">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-40 animate-pulse" />
            <div className="relative bg-gradient-to-br from-orange-400 to-red-500 p-5 rounded-2xl shadow-lg border-2 border-yellow-300 rotate-3">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left z-10">
            <h3 className="text-xl md:text-3xl font-extrabold mb-1 md:mb-2 text-gray-900 italic tracking-tight">
              Start Saving <span className="text-orange-600">Huge Money!</span>
            </h3>
            <p className="text-gray-600 font-medium text-xs md:text-base leading-relaxed">
              Don't just track history — get notified instantly. Join our Telegram community for hand-picked deals & flash sales.
            </p>
          </div>
          <div className="flex-shrink-0 z-10">
            <a href={SITE.telegram} target="_blank" rel="noopener noreferrer"
               className="group relative inline-flex items-center gap-2 md:gap-3 bg-[#229ED9] hover:bg-[#1c8bb4] text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-blue-300/50 hover:-translate-y-1 text-sm md:text-base">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm.09 5.86c-.14.01-.27.05-.39.11L3.92 10.3a1.4 1.4 0 0 0 .52 2.64l3.1.98 1.15 3.8a1.4 1.4 0 0 0 2.47.45l2.03-2.3 3.65 2.72a1.4 1.4 0 0 0 2.22-.88l2.35-11.08a1.4 1.4 0 0 0-1.92-1.57l-7.45 2.92z" />
              </svg>
              <span>Join Channel</span>
            </a>
            <div className="mt-2 flex justify-center items-center gap-1 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Deals
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
