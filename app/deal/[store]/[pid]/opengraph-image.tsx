import { ImageResponse } from 'next/og';
import { trackByPid } from '@/lib/track';
import { PLATFORMS, STORE_KEYS, type StoreKey } from '@/lib/platforms';
import { rupees } from '@/lib/format';

export const runtime = 'edge';
export const alt = 'Amazing Dealz — Deal Card';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Params { store: string; pid: string; }

function isStoreKey(v: string): v is StoreKey {
  return (STORE_KEYS as string[]).includes(v);
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { store, pid } = await params;
  let title = 'Amazing Dealz';
  let price = '';
  let low = '';
  let storeName = '';
  try {
    if (isStoreKey(store)) {
      const data = await trackByPid(store, pid);
      title = (data.title || 'Product').slice(0, 80);
      price = rupees(data.currentPrice);
      low = rupees(data.lowestPrice);
      storeName = PLATFORMS[data.detectedStore].name;
    }
  } catch {}

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        background: '#FFE135', padding: 60,
        fontFamily: 'sans-serif',
      }}>
        <div style={{ fontSize: 44, fontWeight: 900, fontStyle: 'italic', color: '#000' }}>
          Amazing Dealz
        </div>
        <div style={{ marginTop: 40, fontSize: 60, fontWeight: 800, color: '#111', lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ display: 'flex', marginTop: 'auto', gap: 40, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 24, color: '#555', fontWeight: 700 }}>Current Price</span>
            <span style={{ fontSize: 80, color: '#111', fontWeight: 900 }}>{price}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 24, color: '#555', fontWeight: 700 }}>Lowest Ever</span>
            <span style={{ fontSize: 56, color: '#15803D', fontWeight: 800 }}>{low}</span>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 28, color: '#000', fontWeight: 700 }}>
            {storeName ? `on ${storeName}` : ''}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
