/**
 * BuyHatke API client — SERVER-ONLY.
 * Never import from client components. The whole point is that the browser
 * never sees these hostnames.
 */

import 'server-only';

const API_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  Referer: 'https://compare.buyhatke.com/',
};

export interface CompareItem {
  PID?: string;
  prod?: string;
  image?: string;
  price?: number;
  mrpFloat?: number;
  link?: string;
  site_name?: string;
  site_image?: string;
  site_logo?: string;
  perfect?: boolean;
  src?: string;
  position?: number;
  maxPrice?: number;
  quantity?: string;
  qty?: string;
}

export interface CompareResponse {
  status: number;
  data?: CompareItem[];
  parent_mrp?: number;
}

export interface GraphPoint {
  date: string;
  price: number;
}

async function fetchJson(url: string): Promise<CompareResponse> {
  const res = await fetch(url, { headers: API_HEADERS});
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as CompareResponse;
  if (json.status !== 1 || !json.data || json.data.length === 0) throw new Error('empty');
  return json;
}

export async function fetchComparePrice(pid: string, pos: number): Promise<CompareResponse> {
  return fetchJson(
    `https://search-new.bitbns.com/buyhatke/comparePrice?PID=${encodeURIComponent(pid)}&pos=${pos}`,
  );
}

export async function fetchDittoSearch(pid: string, pos: number): Promise<CompareResponse> {
  return fetchJson(
    `https://search-new.bitbns.com/buyhatke/getDittoSearchNew?pos=${pos}&pid=${encodeURIComponent(pid)}`,
  );
}

export async function fetchGraphData(pid: string, pos: number): Promise<GraphPoint[]> {
  const url = `https://graph.bitbns.com/getPredictedData.php?type=log&indexName=interest_centers&logName=info&pos=${pos}&pid=${encodeURIComponent(pid)}&mainFL=1`;
  const res = await fetch(url, { headers: API_HEADERS});
  if (!res.ok) throw new Error(`graph HTTP ${res.status}`);
  const text = await res.text();
  if (!text || text.trim().length < 10) throw new Error('graph empty');

  const entries = text.split('~*~*').filter((e) => e && e.includes('~'));
  if (entries.length < 2) throw new Error('graph too few entries');

  const points: GraphPoint[] = [];
  for (const entry of entries) {
    const parts = entry.split('~');
    if (parts.length >= 2) {
      const dateStr = parts[0].trim();
      const price = parseFloat(parts[1]);
      if (dateStr && !isNaN(price) && price > 0 && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        points.push({ date: dateStr.substring(0, 10), price });
      }
    }
  }
  if (points.length < 2) throw new Error('graph no valid points');

  // Dedupe by date (last wins)
  const dateMap: Record<string, number> = {};
  for (const p of points) dateMap[p.date] = p.price;

  const dates = Object.keys(dateMap).sort();
  const step = dates.length > 90 ? Math.ceil(dates.length / 90) : 1;
  const sampled: GraphPoint[] = [];
  for (let i = 0; i < dates.length; i += step) {
    sampled.push({ date: dates[i], price: dateMap[dates[i]] });
  }
  const lastDate = dates[dates.length - 1];
  if (sampled[sampled.length - 1]?.date !== lastDate) {
    sampled.push({ date: lastDate, price: dateMap[lastDate] });
  }
  return sampled;
}
