import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { trackUrl } from '@/lib/track';
import { SITE } from '@/lib/site';
import { cacheGet, cacheSet } from '@/lib/cache';
import { rateLimit, clientKey } from '@/lib/ratelimit';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const QuerySchema = z.object({ url: z.string().url().max(2048) });

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  try {
    const u = new URL(origin);
    if (u.hostname === new URL(SITE.url).hostname) return true;
    if (u.hostname.endsWith('.pages.dev')) return true;
    if (u.hostname === 'localhost') return true;
  } catch {}
  return false;
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (!isAllowedOrigin(origin)) {
    return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 });
  }

  // Rate limit — 20 requests / minute per IP
  const rl = await rateLimit(`track:${clientKey(req)}`, 20, 60);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429, headers: { 'Retry-After': String(rl.reset - Math.floor(Date.now() / 1000)) } },
    );
  }

  const url = req.nextUrl.searchParams.get('url');
  const parsed = QuerySchema.safeParse({ url });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid URL parameter' }, { status: 400 });
  }

  const cacheKey = `track:${parsed.data.url}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 's-maxage=900, stale-while-revalidate=1800' },
    });
  }

  try {
    const data = await trackUrl(parsed.data.url);
    await cacheSet(cacheKey, data, 900); // 15 min
    return NextResponse.json(data, {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': 's-maxage=900, stale-while-revalidate=1800' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status = /not found/i.test(message) ? 404
      : /detect|blocked/i.test(message) ? 400
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
