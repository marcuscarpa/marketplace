import { NextRequest } from 'next/server';
import { getEnv } from '@/lib/env';

export interface Region {
  code: string;
  locale: string;
  currency: string;
  shopifyDomain: string;
  taxRate: number;
  checkoutDomain: string;
  redisUrl: string;
  defaultLanguage: string;
}

let _regions: Record<string, Region> | null = null;

function getRegions(): Record<string, Region> {
  if (_regions) return _regions;
  try {
    const env = getEnv();
    _regions = {
      us: {
        code: 'US',
        locale: 'en',
        currency: 'USD',
        shopifyDomain: env.SHOPIFY_STORE_DOMAIN_US,
        taxRate: 0,
        checkoutDomain: 'checkout.seusite.com',
        redisUrl: env.REDIS_URL,
        defaultLanguage: 'en',
      },
      eu: {
        code: 'EU',
        locale: 'en',
        currency: 'EUR',
        shopifyDomain: env.SHOPIFY_STORE_DOMAIN_EU,
        taxRate: 0.2,
        checkoutDomain: 'checkout.seusite.eu',
        redisUrl: env.REDIS_URL,
        defaultLanguage: 'en',
      },
      br: {
        code: 'BR',
        locale: 'pt',
        currency: 'BRL',
        shopifyDomain: env.SHOPIFY_STORE_DOMAIN_BR,
        taxRate: 0.25,
        checkoutDomain: 'checkout.seusite.com.br',
        redisUrl: env.REDIS_URL,
        defaultLanguage: 'pt',
      },
      apac: {
        code: 'APAC',
        locale: 'en',
        currency: 'SGD',
        shopifyDomain: env.SHOPIFY_STORE_DOMAIN_APAC,
        taxRate: 0.07,
        checkoutDomain: 'checkout.seusite.sg',
        redisUrl: env.REDIS_URL,
        defaultLanguage: 'en',
      },
    };
    return _regions;
  } catch (error) {
    console.error('[regions] Failed to load env:', error);
    throw error;
  }
}

/** ponytail: test-only; clears cached regions after env mock changes */
export function resetRegionsCache(): void {
  _regions = null;
}

export function resolveRegion(req: NextRequest): Region {
  const regions = getRegions();
  const usRegion = regions.us as Region;

  const cookieRegion = req.cookies.get('region')?.value;
  if (cookieRegion) {
    const r = regions[cookieRegion];
    if (r !== undefined) return r;
  }

  const acceptLang = req.headers.get('accept-language') || '';
  const langs = acceptLang.split(',').map((l) => {
    const part = l.split(';')[0];
    return part ? part.trim() : '';
  });
  for (const lang of langs) {
    const langParts = lang.split('-');
    const langCode = langParts[0] ?? '';
    if (!langCode) continue;
    for (const r of Object.values(regions)) {
      if (r.defaultLanguage === langCode) return r;
    }
  }

  const country = req.headers.get('x-vercel-ip-country') || 'US';
  const regionMap: Record<string, string> = {
    US: 'us',
    BR: 'br',
    DE: 'eu',
    FR: 'eu',
    UK: 'eu',
    GB: 'eu',
    SG: 'apac',
    AU: 'apac',
  };
  const code = regionMap[country] || 'us';
  const fallback = regions[code];
  if (fallback !== undefined) return fallback;
  return usRegion;
}

export const getRegion = (code: string): Region => {
  const regions = getRegions();
  const usRegion = regions.us as Region;
  const normalized = code.toLowerCase();
  const localeToRegion: Record<string, string> = { en: 'us', pt: 'br' };
  const regionKey = regions[normalized] ? normalized : localeToRegion[normalized];
  const r = regionKey ? regions[regionKey] : undefined;
  if (r !== undefined) return r;
  return usRegion;
};