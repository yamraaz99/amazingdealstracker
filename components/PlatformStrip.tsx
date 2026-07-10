import { PLATFORMS, STORE_KEYS } from '@/lib/platforms';

export function PlatformStrip() {
  return (
    <div className="platform-strip flex flex-wrap items-center justify-center gap-3 mt-4">
      <span className="text-xs text-gray-400 font-semibold mr-1">Works with:</span>
      {STORE_KEYS.slice(0, 12).map((key) => {
        const p = PLATFORMS[key];
        return (
          <img
            key={key}
            src={p.logo}
            alt={p.name}
            title={p.name}
            loading="lazy"
          />
        );
      })}
    </div>
  );
}
