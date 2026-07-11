import { redirect } from 'next/navigation';

export const runtime = 'edge';

// "Check this out https://amzn.in/xyz" → "https://amzn.in/xyz"
function extractUrl(...parts: (string | undefined)[]): string | null {
  const combined = parts.filter(Boolean).join(' ');
  const match = combined.match(/https?:\/\/[^\s<>"']+/i);
  if (!match) return null;
  return match[0].replace(/[)\].,;!?]+$/, '');
}

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<{ title?: string; text?: string; url?: string }>;
}) {
  const { title, text, url } = await searchParams;
  const direct = url && /^https?:\/\//i.test(url) ? url : null;
  const finalUrl = direct ?? extractUrl(title, text, url);
  redirect(finalUrl ? `/track?url=${encodeURIComponent(finalUrl)}` : '/track');
}
