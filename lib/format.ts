export const rupees = (val: number | null | undefined): string =>
  '₹' + Math.floor(val || 0).toLocaleString('en-IN');

export function verdictFor(cur: number, low: number, high: number, avg: number): {
  text: string;
  tone: 'green' | 'blue' | 'red' | 'gray';
} {
  const TOL = 2;
  if (cur <= 0) return { text: '—', tone: 'gray' };
  if (low > 0 && cur <= low + TOL) return { text: '🔥 Insane Deal! Lowest Price Ever.', tone: 'green' };
  if (low > 0 && cur <= low * 1.03) return { text: '🎯 Great Deal! Very close to all-time low.', tone: 'green' };
  if (avg > 0 && cur < avg) {
    const diff = Math.round(((avg - cur) / avg) * 100);
    if (diff >= 1) return { text: `✅ Good Deal. ${diff}% below average.`, tone: 'blue' };
    return { text: '👍 Fair Price. Around average.', tone: 'blue' };
  }
  if (avg > 0 && Math.abs(cur - avg) <= avg * 0.02) return { text: '👍 Fair Price. Around average.', tone: 'blue' };
  if (high > 0 && cur >= high - TOL) return { text: '🚫 Highest Price! Definitely wait.', tone: 'red' };
  return { text: '⚠️ Price is High. Wait for a drop.', tone: 'red' };
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
