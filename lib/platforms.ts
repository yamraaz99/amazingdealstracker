/**
 * Platform registry — the single source of truth for every supported marketplace.
 * Adding a new store = adding one entry here + one detector in url-detect.ts.
 */

export type StoreKey =
  | 'amazon' | 'flipkart' | 'jiomart' | 'myntra' | 'vijaysales'
  | 'meesho' | 'bigbasket' | 'blinkit' | 'zepto' | 'swiggy'
  | 'nykaa' | 'snapdeal' | 'ajio' | 'tatacliq' | 'shopclues'
  | 'netmeds' | 'onemg';

export interface PlatformMeta {
  key: StoreKey;
  name: string;
  logo: string;
  color: string;
  pos: number;          // BuyHatke position identifier
  domain: string;       // primary domain for buy links
}

export const PLATFORMS: Record<StoreKey, PlatformMeta> = {
  amazon:     { key: 'amazon',     name: 'Amazon',      logo: 'https://compare.buyhatke.com/images/site_icons_m/amazon.png',     color: '#FF9900', pos: 63,    domain: 'amazon.in' },
  flipkart:   { key: 'flipkart',   name: 'Flipkart',    logo: 'https://compare.buyhatke.com/images/site_icons_m/flipkart1.png',  color: '#2874F0', pos: 2,     domain: 'flipkart.com' },
  jiomart:    { key: 'jiomart',    name: 'JioMart',     logo: 'https://compare.buyhatke.com/images/site_icons_m/jiomart.png',    color: '#003087', pos: 6660,  domain: 'jiomart.com' },
  myntra:     { key: 'myntra',     name: 'Myntra',      logo: 'https://compare.buyhatke.com/images/site_icons_m/myntra1.png',    color: '#FF3F6C', pos: 111,   domain: 'myntra.com' },
  vijaysales: { key: 'vijaysales', name: 'Vijay Sales', logo: 'https://compare.buyhatke.com/images/site_icons_m/vijaysales.png', color: '#E30613', pos: 6645,  domain: 'vijaysales.com' },
  meesho:     { key: 'meesho',     name: 'Meesho',      logo: 'https://compare.buyhatke.com/images/site_icons_m/meesho.png',     color: '#F43397', pos: 7376,  domain: 'meesho.com' },
  bigbasket:  { key: 'bigbasket',  name: 'BigBasket',   logo: 'https://compare.buyhatke.com/images/site_icons_m/bigBasket.png',  color: '#84C225', pos: 2268,  domain: 'bigbasket.com' },
  blinkit:    { key: 'blinkit',    name: 'Blinkit',     logo: 'https://compare.buyhatke.com/images/site_icons_m/blinkit.png',    color: '#F8CC1B', pos: 7740,  domain: 'blinkit.com' },
  zepto:      { key: 'zepto',      name: 'Zepto',       logo: 'https://compare.buyhatke.com/images/site_icons_m/zepto.png',      color: '#8B2FC9', pos: 7907,  domain: 'zeptonow.com' },
  swiggy:     { key: 'swiggy',     name: 'Swiggy',      logo: 'https://compare.buyhatke.com/images/site_icons_m/swiggy.png',     color: '#FC8019', pos: 25622, domain: 'swiggy.com' },
  nykaa:      { key: 'nykaa',      name: 'Nykaa',       logo: 'https://compare.buyhatke.com/images/site_icons_m/nykaa.png',      color: '#FC2779', pos: 7461,  domain: 'nykaa.com' },
  snapdeal:   { key: 'snapdeal',   name: 'Snapdeal',    logo: 'https://compare.buyhatke.com/images/site_icons_m/snapdeal.png',   color: '#E40046', pos: 1,     domain: 'snapdeal.com' },
  ajio:       { key: 'ajio',       name: 'Ajio',        logo: 'https://compare.buyhatke.com/images/site_icons_m/ajio.png',       color: '#3B3B3B', pos: 2191,  domain: 'ajio.com' },
  tatacliq:   { key: 'tatacliq',   name: 'Tata CLiQ',   logo: 'https://compare.buyhatke.com/images/site_icons_m/tatacliq.png',   color: '#E52E71', pos: 2190,  domain: 'tatacliq.com' },
  shopclues:  { key: 'shopclues',  name: 'ShopClues',   logo: 'https://compare.buyhatke.com/images/site_icons_m/shopclues.png',  color: '#EE2D2D', pos: 421,   domain: 'shopclues.com' },
  netmeds:    { key: 'netmeds',    name: 'Netmeds',     logo: 'https://compare.buyhatke.com/images/site_icons_m/netmeds.png',    color: '#28A745', pos: 2238,  domain: 'netmeds.com' },
  onemg:      { key: 'onemg',      name: '1mg',         logo: 'https://compare.buyhatke.com/images/site_icons_m/1mg.png',        color: '#FF6F61', pos: 2237,  domain: '1mg.com' },
};

export const SITE_NAME_MAP: Record<string, StoreKey> = {
  amazon: 'amazon', flipkart: 'flipkart', jiomart: 'jiomart', myntra: 'myntra',
  'vijay sales': 'vijaysales', vijaysales: 'vijaysales', meesho: 'meesho',
  bigbasket: 'bigbasket', 'big basket': 'bigbasket', blinkit: 'blinkit',
  zepto: 'zepto', 'swiggy instamart': 'swiggy', swiggy: 'swiggy',
  nykaa: 'nykaa', snapdeal: 'snapdeal', ajio: 'ajio',
  'tata cliq': 'tatacliq', tatacliq: 'tatacliq', shopclues: 'shopclues',
  netmeds: 'netmeds', '1mg': 'onemg',
};

export const STORE_KEYS = Object.keys(PLATFORMS) as StoreKey[];
