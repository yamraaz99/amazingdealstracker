import type { StoreKey } from './platforms';

export interface DetectedProduct {
  store: StoreKey | null;
  pid: string | null;
}

/**
 * SSRF-hardened URL resolver + product detector.
 * Ported from legacy netlify/functions/track.js with:
 *   - private IP / metadata endpoint blocking
 *   - typed return
 *   - shorter/faster resolution
 */

const DIRECT_DOMAINS = [
  'amazon.in','amazon.co.in','amazon.com','flipkart.com','jiomart.com','myntra.com',
  'vijaysales.com','meesho.com','bigbasket.com','blinkit.com','zeptonow.com','zepto.com',
  'swiggy.com','nykaa.com','snapdeal.com','ajio.com','tatacliq.com','shopclues.com',
  'netmeds.com','1mg.com',
];

// Blocked hostnames — SSRF protection. Never fetch anything targeting infra.
const BLOCKED_HOST_RE = /^(?:localhost|0\.0\.0\.0|127\.|10\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.|\[?::1\]?|fc00:|fd00:|fe80:)/i;

function isBlockedHost(hostname: string): boolean {
  return BLOCKED_HOST_RE.test(hostname);
}

export function isDirectProductUrl(urlStr: string): boolean {
  try {
    const u = new URL(urlStr);
    const host = u.hostname.replace(/^(www\.|m\.)/, '');
    if (host === 'dl.flipkart.com' && u.pathname.startsWith('/s/')) return false;
    return DIRECT_DOMAINS.some((d) => host === d || host.endsWith('.' + d));
  } catch {
    return false;
  }
}

export async function resolveUrl(inputUrl: string): Promise<string> {
  let normalized = inputUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) normalized = 'https://' + normalized;

  const parsed = new URL(normalized);
  if (isBlockedHost(parsed.hostname)) {
    throw new Error('Blocked host');
  }

  if (isDirectProductUrl(normalized)) return normalized;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(normalized, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,*/*',
      },
    });
    const finalUrl = res.url || normalized;

    // Re-check final URL for SSRF
    try {
      const fu = new URL(finalUrl);
      if (isBlockedHost(fu.hostname)) throw new Error('Blocked host after redirect');
    } catch {}

    if (finalUrl !== normalized && isDirectProductUrl(finalUrl)) {
      try { res.body?.cancel(); } catch {}
      return finalUrl;
    }

    const html = await res.text();
    const metaMatch = html.match(/content\s*=\s*["'][^"']*url\s*=\s*(https?:\/\/[^"'\s>]+)/i);
    if (metaMatch) return metaMatch[1];
    const jsMatch = html.match(/(?:window\.location|location\.href)\s*=\s*["'](https?:\/\/[^"']+)["']/i);
    if (jsMatch) return jsMatch[1];
    const canonMatch = html.match(/<link[^>]+rel\s*=\s*["']canonical["'][^>]+href\s*=\s*["'](https?:\/\/[^"']+)["']/i);
    if (canonMatch) return canonMatch[1];

    return finalUrl;
  } finally {
    clearTimeout(timeout);
  }
}

export function detectDetails(url: string): DetectedProduct {
  let store: StoreKey | null = null;
  let pid: string | null = null;
  const lower = url.toLowerCase();

  const match = (re: RegExp, group = 1): string | null => {
    const m = url.match(re);
    return m ? m[group] : null;
  };

  if (/amazon\.(in|co\.in|com)/.test(lower) || lower.includes('amzn.to') || lower.includes('amzn.in')) {
    store = 'amazon';
    pid = match(/\/dp\/([A-Z0-9]{10})/i)
      || match(/\/gp\/product\/([A-Z0-9]{10})/i)
      || match(/\/gp\/aw\/d\/([A-Z0-9]{10})/i)
      || match(/[?&]asin=([A-Z0-9]{10})/i)
      || match(/\/(B[A-Z0-9]{9})(?:[/?&#]|$)/);
  } else if (
    lower.includes('flipkart.com') || lower.includes('fkrt.it') || lower.includes('fkrt.cc') ||
    lower.includes('fktr.in') || lower.includes('fkrt.site') || lower.includes('dl.flipkart.com')
  ) {
    store = 'flipkart';
    try { const u = new URL(url); pid = u.searchParams.get('pid'); } catch {}
    pid = pid
      || match(/[?&]pid=([A-Za-z0-9]{10,20})/)
      || match(/\/p\/([A-Za-z0-9]+)/)
      || match(/pid=([A-Za-z0-9]+)/i);
  } else if (lower.includes('jiomart.com') || lower.includes('jiomartjcp.com')) {
    store = 'jiomart';
    const m = url.match(/\/p\/(.+?)(?:\?|#|$)/);
    if (m) pid = m[1].replace(/\/+$/, '');
    if (!pid) pid = match(/\/(\d{6,15})(?:[/?&#]|$)/);
  } else if (lower.includes('myntra.com') || lower.includes('myntr.it') || lower.includes('myntra.bit')) {
    store = 'myntra';
    pid = match(/\/(\d{5,12})(?:\/buy|\/|$|\?)/);
  } else if (lower.includes('vijaysales.com')) {
    store = 'vijaysales';
    pid = match(/\/(\d{4,10})(?:\/[a-z]|$|\?)/i);
  } else if (lower.includes('meesho.com')) {
    store = 'meesho';
    pid = match(/\/p\/([A-Za-z0-9]+)/);
  } else if (lower.includes('bigbasket.com') || lower.includes('bbassets.com')) {
    store = 'bigbasket';
    pid = match(/\/pd\/(\d+)/);
  } else if (lower.includes('blinkit.com')) {
    store = 'blinkit';
    pid = match(/\/prid\/(\d+)/) || match(/\/(\d{2,10})(?:[/?&#]|$)/);
  } else if (lower.includes('zepto.com') || lower.includes('zeptonow.com')) {
    store = 'zepto';
    pid = match(/\/pvid\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i)
      || match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  } else if (lower.includes('swiggy.com')) {
    store = 'swiggy';
    pid = match(/\/item\/([A-Za-z0-9]+)/) || match(/[-/]([A-Z0-9]{6,14})(?:\?|$)/);
  } else if (lower.includes('nykaa.com')) {
    store = 'nykaa';
    pid = match(/\/p\/(\d+)/);
    if (!pid) {
      try { const u = new URL(url); pid = u.searchParams.get('productId') || u.searchParams.get('skuId'); } catch {}
    }
    if (!pid) pid = match(/\/(\d{5,15})(?:[/?&#]|$)/);
  } else if (lower.includes('snapdeal.com')) {
    store = 'snapdeal';
    pid = match(/\/(\d{8,16})(?:[/?&#]|$)/) || match(/\/product\/[^/]+\/(\d+)/);
  } else if (lower.includes('ajio.com')) {
    store = 'ajio';
    pid = match(/\/p\/([A-Za-z0-9_-]+)/);
  } else if (lower.includes('tatacliq.com')) {
    store = 'tatacliq';
    pid = match(/\/p\/([A-Za-z0-9]+)/);
  } else if (lower.includes('shopclues.com')) {
    store = 'shopclues';
    pid = match(/\/([A-Za-z0-9-]+)-(\d{8,})(?:[/?&#]|$)/, 2);
  } else if (lower.includes('netmeds.com')) {
    store = 'netmeds';
    pid = match(/\/(\d{4,15})(?:[/?&#]|$)/);
  } else if (lower.includes('1mg.com')) {
    store = 'onemg';
    pid = match(/\/([a-z0-9-]+-(\d+))/, 2);
  }

  return { store, pid };
}
