import 'server-only';
import { PLATFORMS, SITE_NAME_MAP, type StoreKey } from './platforms';
import { withAffiliate } from './affiliate';
import {
  fetchComparePrice, fetchDittoSearch, fetchGraphData,
  type CompareResponse, type GraphPoint,
} from './buyhatke';
import { resolveUrl, detectDetails } from './url-detect';

export interface StorePrice {
  key: StoreKey;
  name: string;
  logo: string;
  color: string;
  price: number;
  link: string;
}

export interface TrackResult {
  pid: string;
  detectedStore: StoreKey;
  title: string;
  image: string;
  category: string;
  quantity: string;
  mrp: number;
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  stores: StorePrice[];
  chartLabels: string[];
  chartData: number[];
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export async function trackUrl(rawUrl: string): Promise<TrackResult> {
  const finalUrl = await resolveUrl(rawUrl);
  let det = detectDetails(finalUrl);
  if ((!det.store || !det.pid) && finalUrl !== rawUrl) {
    const det2 = detectDetails(rawUrl);
    if (det2.store && det2.pid) det = det2;
  }
  if (!det.store || !det.pid) {
    throw new Error('Could not detect platform or product ID');
  }
  return trackByPid(det.store, det.pid);
}

export async function trackByPid(store: StoreKey, pid: string): Promise<TrackResult> {
  const pos = PLATFORMS[store].pos;

  let compareJson: CompareResponse | null = null;
  for (const fn of [fetchComparePrice, fetchDittoSearch]) {
    try {
      compareJson = await fn(pid, pos);
      if (compareJson) break;
    } catch {}
  }

  let graphData: GraphPoint[] | null = null;
  try { graphData = await fetchGraphData(pid, pos); } catch {}

  if (!graphData && compareJson?.data) {
    for (const item of compareJson.data.slice(0, 5)) {
      if (item.PID && item.position && item.position > 0) {
        try {
          graphData = await fetchGraphData(item.PID, item.position);
          if (graphData) break;
        } catch {}
      }
    }
  }

  if (!compareJson && !graphData) {
    throw new Error('Product not found');
  }

  return buildResult(pid, store, compareJson, graphData);
}

function buildResult(
  pid: string,
  detectedStore: StoreKey,
  compareJson: CompareResponse | null,
  graphData: GraphPoint[] | null,
): TrackResult {
  let title = '', image = '', category = '', quantity = '';
  let currentPrice = 0, mrp = 0;
  let stores: StorePrice[] = [];

  if (compareJson?.data) {
    const items = compareJson.data;
    const exact = items.find((i) => String(i.PID).toLowerCase() === pid.toLowerCase())
      || items.find((i) => i.perfect === true && (i.price ?? 0) > 0)
      || items.find((i) => (i.price ?? 0) > 0)
      || items[0];

    title = exact.prod || '';
    image = exact.image || '';
    mrp = compareJson.parent_mrp || exact.mrpFloat || 0;
    quantity = exact.quantity || exact.qty || '';
    if (exact.price && exact.price > 0) currentPrice = exact.price;

    const storeMap: Record<string, StorePrice> = {};
    for (const item of items) {
      if (!item.price || item.price <= 0) continue;
      if (!item.link || !item.link.startsWith('http')) continue;
      if (item.perfect === false && item.src === 'lens') continue;
      const key = SITE_NAME_MAP[(item.site_name || '').toLowerCase()];
      if (!key) continue;
      const meta = PLATFORMS[key];
      if (!storeMap[key] || item.price < storeMap[key].price) {
        storeMap[key] = {
          key,
          name: meta.name,
          logo: meta.logo,
          color: meta.color,
          price: item.price,
          link: withAffiliate(item.link, key),
        };
      }
    }
    stores = Object.values(storeMap).sort((a, b) => {
      if (a.price !== b.price) return a.price - b.price;
      if (a.key === detectedStore) return -1;
      if (b.key === detectedStore) return 1;
      return 0;
    });
    if (stores.length > 0 && (!currentPrice || currentPrice <= 0)) {
      currentPrice = stores[0].price;
    }
  }

  // Graph-derived stats
  let chartLabels: string[] = [];
  let chartData: number[] = [];
  let lowestPrice = 0, highestPrice = 0, averagePrice = 0;

  if (graphData && graphData.length > 0) {
    chartLabels = graphData.map((p) => {
      const [, m, d] = p.date.split('-');
      return `${MONTHS[parseInt(m, 10) - 1]} ${d}`;
    });
    chartData = graphData.map((p) => p.price);
    lowestPrice = Math.min(...chartData);
    highestPrice = Math.max(...chartData);
    averagePrice = Math.round(chartData.reduce((a, b) => a + b, 0) / chartData.length);

    const latest = chartData[chartData.length - 1];
    if (latest > 0) {
      currentPrice = currentPrice > 0 ? Math.min(currentPrice, latest) : latest;
    }
    if (currentPrice > 0 && currentPrice < lowestPrice) lowestPrice = currentPrice;

    if (!title && compareJson?.data?.[0]?.prod) title = compareJson.data[0].prod;
    if (!image && compareJson?.data?.[0]?.image) image = compareJson.data[0].image;
  }

  // Sync source-store price with accurate currentPrice
  if (currentPrice > 0 && stores.length > 0) {
    const idx = stores.findIndex((s) => s.key === detectedStore);
    if (idx !== -1) {
      if (stores[idx].price > currentPrice) {
        stores[idx].price = currentPrice;
      } else {
        currentPrice = stores[idx].price;
      }
    } else {
      const meta = PLATFORMS[detectedStore];
      let buyLink = '';
      if (detectedStore === 'amazon') buyLink = `https://www.amazon.in/dp/${pid}`;
      else if (detectedStore === 'flipkart') buyLink = `https://www.flipkart.com/search?q=${pid}`;
      else if (detectedStore === 'myntra') buyLink = `https://www.myntra.com/${pid}/buy`;
      if (buyLink) {
        stores.push({
          key: detectedStore,
          name: meta.name,
          logo: meta.logo,
          color: meta.color,
          price: currentPrice,
          link: withAffiliate(buyLink, detectedStore),
        });
      }
    }
    stores.sort((a, b) => {
      if (a.price !== b.price) return a.price - b.price;
      if (a.key === detectedStore) return -1;
      if (b.key === detectedStore) return 1;
      return 0;
    });
    if (stores[0].price < lowestPrice || !lowestPrice) lowestPrice = stores[0].price;
  }

  // Fallback: single-store injection
  if (stores.length === 0 && currentPrice > 0) {
    const meta = PLATFORMS[detectedStore];
    let buyLink = '';
    if (detectedStore === 'amazon') buyLink = `https://www.amazon.in/dp/${pid}`;
    else if (detectedStore === 'flipkart') buyLink = `https://www.flipkart.com/search?q=${pid}`;
    else if (detectedStore === 'myntra') buyLink = `https://www.myntra.com/${pid}/buy`;
    if (buyLink) {
      stores.push({
        key: detectedStore,
        name: meta.name,
        logo: meta.logo,
        color: meta.color,
        price: currentPrice,
        link: withAffiliate(buyLink, detectedStore),
      });
    }
  }

  // Stats fallbacks
  if (compareJson?.data) {
    const maxPrices = compareJson.data.map((i) => i.maxPrice ?? 0).filter(Boolean);
    if (!highestPrice && maxPrices.length > 0) highestPrice = Math.max(...maxPrices);
  }
  if (!lowestPrice) lowestPrice = currentPrice;
  if (!highestPrice) highestPrice = mrp || currentPrice;
  if (!averagePrice) averagePrice = currentPrice;

  return {
    pid, detectedStore, title, image, category, quantity, mrp,
    currentPrice, lowestPrice, highestPrice, averagePrice,
    stores, chartLabels, chartData,
  };
}
