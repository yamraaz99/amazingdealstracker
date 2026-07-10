export const SITE = {
  name: 'Amazing Dealz Tracker',
  shortName: 'Amazing Dealz',
  tagline: 'Track Any Product. Compare Every Store.',
  description:
    'Track prices across Amazon, Flipkart, Myntra, JioMart & 12+ Indian stores. See full price history, get the lowest deal, and never overpay again — free, no signup.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://amazingdealstracker.pages.dev',
  ogImage: '/og-default.jpg',
  logo: '/logo.jpg',
  telegram: 'https://t.me/amazing_Deals_Loots_Flipkart',
  locale: 'en_IN',
  region: 'IN',
} as const;
