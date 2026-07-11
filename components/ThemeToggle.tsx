'use client';

import { useEffect, useState } from 'react';

type Mode = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'adz:theme';

function apply(mode: Mode) {
  const root = document.documentElement;
  const dark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.classList.toggle('dark', dark);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Mode | null) ?? 'system';
    setMode(saved);
    setMounted(true);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const current = (localStorage.getItem(STORAGE_KEY) as Mode | null) ?? 'system';
      if (current === 'system') apply('system');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const cycle = () => {
    const next: Mode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  };

  if (!mounted) {
    return <button className="w-9 h-9 rounded-lg" aria-hidden />;
  }

  const label =
    mode === 'light' ? 'Switch to dark mode'
    : mode === 'dark' ? 'Switch to system mode'
    : 'Switch to light mode';

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white transition-colors"
    >
      {mode === 'light' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
      {mode === 'dark' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
      {mode === 'system' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      )}
    </button>
  );
}
