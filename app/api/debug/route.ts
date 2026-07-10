import { NextRequest, NextResponse } from 'next/server';
import { resolveUrl, detectDetails } from '@/lib/url-detect';
import { fetchComparePrice, fetchDittoSearch, fetchGraphData } from '@/lib/buyhatke';
import { PLATFORMS, type StoreKey } from '@/lib/platforms';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface StepResult {
  ok: boolean;
  ms: number;
  detail?: unknown;
  error?: string;
}

async function timed<T>(fn: () => Promise<T>): Promise<StepResult & { value?: T }> {
  const start = Date.now();
  try {
    const value = await fn();
    return { ok: true, ms: Date.now() - start, value };
  } catch (e) {
    return { ok: false, ms: Date.now() - start, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({
      usage: 'Add ?url=<product-url> to test the pipeline.',
      example: '/api/debug?url=https://www.amazon.in/dp/B08N5WRWNW',
    });
  }

  const trace: Record<string, unknown> = { input: url };

  const resolveStep = await timed(() => resolveUrl(url));
  trace.resolve = {
    ok: resolveStep.ok,
    ms: resolveStep.ms,
    error: resolveStep.error,
    finalUrl: resolveStep.value,
  };

  if (!resolveStep.ok || !resolveStep.value) {
    return NextResponse.json(trace, { status: 200 });
  }

  const finalUrl = resolveStep.value;
  const det = detectDetails(finalUrl);
  const detOriginal = detectDetails(url);
  trace.detect = {
    fromResolved: det,
    fromOriginalInput: detOriginal,
  };

  const store = (det.store || detOriginal.store) as StoreKey | null;
  const pid = det.pid || detOriginal.pid;
  if (!store || !pid) {
    trace.error = 'Detection failed for both resolved and original URL';
    return NextResponse.json(trace, { status: 200 });
  }

  const pos = PLATFORMS[store].pos;
  trace.selected = { store, pid, pos };

  // Test all three BuyHatke endpoints independently
  const [compare, ditto, graph] = await Promise.all([
    timed(() => fetchComparePrice(pid, pos)),
    timed(() => fetchDittoSearch(pid, pos)),
    timed(() => fetchGraphData(pid, pos)),
  ]);

  trace.buyhatke = {
    comparePrice: {
      ok: compare.ok,
      ms: compare.ms,
      error: compare.error,
      itemCount: compare.value?.data?.length,
      firstItem: compare.value?.data?.[0]
        ? {
            prod: compare.value.data[0].prod?.slice(0, 60),
            price: compare.value.data[0].price,
            site_name: compare.value.data[0].site_name,
          }
        : undefined,
    },
    dittoSearch: {
      ok: ditto.ok,
      ms: ditto.ms,
      error: ditto.error,
      itemCount: ditto.value?.data?.length,
    },
    graphData: {
      ok: graph.ok,
      ms: graph.ms,
      error: graph.error,
      pointCount: graph.value?.length,
      firstPoint: graph.value?.[0],
      lastPoint: graph.value?.[graph.value.length - 1],
    },
  };

  // Also test a raw fetch to BuyHatke to see the HTTP layer
  const rawTest = await timed(async () => {
    const u = `https://search-new.bitbns.com/buyhatke/comparePrice?PID=${encodeURIComponent(pid)}&pos=${pos}`;
    const res = await fetch(u, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        Referer: 'https://compare.buyhatke.com/',
      },
    });
    const text = await res.text();
    return {
      status: res.status,
      contentType: res.headers.get('content-type'),
      bodyPreview: text.slice(0, 300),
      bodyLength: text.length,
    };
  });
  trace.rawFetchProbe = rawTest;

  return NextResponse.json(trace, { status: 200, headers: { 'Cache-Control': 'no-store' } });
}
