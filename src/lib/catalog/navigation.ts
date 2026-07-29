import { unstable_cache } from 'next/cache';

import { getStaticNavigation } from '@/lib/catalog/navigation-static';
import type { SiteNavigation } from '@/lib/catalog/navigation-types';
import { isShopifyConfigured } from '@/lib/shopify/client';
import { getShopifyNavigation } from '@/lib/shopify/navigation';

export type { NavLink, MenuSections, SiteNavigation } from '@/lib/catalog/navigation-types';

/** Never block page render on Shopify nav — cap wait, cache hits, static fallback. */
const NAV_RACE_MS = 1_500;

const getCachedShopifyNavigation = unstable_cache(
  async (locale: string) => getShopifyNavigation(locale),
  ['site-navigation'],
  { revalidate: 3600 },
);

export async function getSiteNavigation(locale: string): Promise<SiteNavigation> {
  if (!isShopifyConfigured(locale)) {
    return getStaticNavigation(locale);
  }

  try {
    const navigation = await Promise.race([
      getCachedShopifyNavigation(locale),
      new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), NAV_RACE_MS);
      }),
    ]);

    return navigation ?? getStaticNavigation(locale);
  } catch {
    return getStaticNavigation(locale);
  }
}
