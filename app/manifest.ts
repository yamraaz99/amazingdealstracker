import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  const m = {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#FFE135',
    theme_color: '#FFE135',
    orientation: 'portrait',
    categories: ['shopping', 'utilities'],
    icons: [
      { src: '/logo.jpg', sizes: '640x640', type: 'image/jpeg', purpose: 'any' },
      { src: '/logo.jpg', sizes: '640x640', type: 'image/jpeg', purpose: 'maskable' },
    ],
    share_target: {
      action: '/share',
      method: 'GET',
      params: { title: 'title', text: 'text', url: 'url' },
    },
  };
  return m as unknown as MetadataRoute.Manifest;
}
