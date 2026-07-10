import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.shortName}`,
  },
  description: SITE.description,
  keywords: [
    'price tracker India', 'Amazon price history', 'Flipkart price tracker',
    'best deals India', 'price comparison', 'deal finder', 'Amazing Dealz',
  ],
  authors: [{ name: 'Amazing Dealz' }],
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.shortName,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: SITE.url },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
    shortcut: '/logo.jpg',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFE135',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans text-gray-900 antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="w-full py-5 px-4 border-b border-black/5 bg-brand-yellow/60 backdrop-blur">
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Amazing Dealz" className="w-10 h-10 rounded-lg object-cover" />
          <span className="text-2xl md:text-3xl font-extrabold italic tracking-tight text-black">
            Amazing Dealz
          </span>
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-800">
          <li><Link href="/trending" className="hover:text-orange-600 transition-colors">Trending</Link></li>
          <li><Link href="/track" className="hover:text-orange-600 transition-colors">Track</Link></li>
          <li><Link href="/#stores" className="hover:text-orange-600 transition-colors">Stores</Link></li>
          <li><Link href="/#faq" className="hover:text-orange-600 transition-colors">FAQ</Link></li>
        </ul>
        <Link href="/track" className="btn-primary py-2 px-4 text-sm">Track a Product</Link>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="w-full mt-16 py-10 px-4 border-t border-black/10 bg-white/40 backdrop-blur">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-extrabold text-gray-900 mb-3">Amazing Dealz</h3>
          <p className="text-gray-700 text-xs leading-relaxed">
            Free price tracker for 12+ Indian marketplaces. No signup, no ads (yet 😉).
          </p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Explore</h4>
          <ul className="space-y-2 text-gray-700">
            <li><Link href="/trending">Trending Deals</Link></li>
            <li><Link href="/track">Track a Product</Link></li>
            <li><Link href="/#stores">All Stores</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Company</h4>
          <ul className="space-y-2 text-gray-700">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Use</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Community</h4>
          <ul className="space-y-2 text-gray-700">
            <li><a href={SITE.telegram} target="_blank" rel="noopener noreferrer">Telegram Channel</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-black/10 text-xs text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Amazing Dealz. All product names, logos, and brands are property of their respective owners.</p>
        <p className="italic">As an Amazon Associate we earn from qualifying purchases.</p>
      </div>
    </footer>
  );
}
