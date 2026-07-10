import 'server-only';

/**
 * Rate limiter using Cloudflare KV.
 *
 * In dev (no KV binding) this is a no-op.
 * In production on Cloudflare Pages, bind a KV namespace named RL to the Pages project
 * (Settings → Functions → KV namespace bindings) and it will enforce limits automatically.
 */

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

interface CFEnv { RL?: KVNamespace; }

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  key: string,
  limit = 10,
  windowSec = 60,
): Promise<RateLimitResult> {
  const env = (globalThis as unknown as { process?: { env?: CFEnv } }).process?.env;
  const kv = env?.RL;
  if (!kv) return { ok: true, remaining: limit, reset: 0 }; // dev fallback

  const bucketKey = `rl:${key}`;
  const raw = await kv.get(bucketKey);
  const now = Math.floor(Date.now() / 1000);

  let count = 0;
  let reset = now + windowSec;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { c: number; r: number };
      if (parsed.r > now) { count = parsed.c; reset = parsed.r; }
    } catch {}
  }

  if (count >= limit) return { ok: false, remaining: 0, reset };

  count += 1;
  await kv.put(bucketKey, JSON.stringify({ c: count, r: reset }), { expirationTtl: windowSec });
  return { ok: true, remaining: limit - count, reset };
}

export function clientKey(req: Request): string {
  const cf = req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || 'unknown';
  return cf;
}
