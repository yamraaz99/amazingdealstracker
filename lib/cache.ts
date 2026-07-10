import 'server-only';

/**
 * Tiny KV-backed cache for BuyHatke responses. Falls back to in-memory Map in dev.
 * Bind a KV namespace called CACHE to the Cloudflare Pages project to activate.
 */

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

const memory = new Map<string, { v: string; e: number }>();

function getKV(): KVNamespace | null {
  const env = (globalThis as unknown as { process?: { env?: { CACHE?: KVNamespace } } }).process?.env;
  return env?.CACHE ?? null;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const kv = getKV();
  if (kv) {
    const raw = await kv.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }
  const hit = memory.get(key);
  if (!hit) return null;
  if (hit.e < Date.now()) { memory.delete(key); return null; }
  return JSON.parse(hit.v) as T;
}

export async function cacheSet<T>(key: string, value: T, ttlSec = 900): Promise<void> {
  const payload = JSON.stringify(value);
  const kv = getKV();
  if (kv) {
    await kv.put(key, payload, { expirationTtl: ttlSec });
    return;
  }
  memory.set(key, { v: payload, e: Date.now() + ttlSec * 1000 });
}
