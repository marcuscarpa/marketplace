import type { SiteNavigation } from '@/lib/catalog/navigation-types';
import { getShopifyNavigation } from '@/lib/shopify/navigation';

export type { NavLink, MenuSections, SiteNavigation } from '@/lib/catalog/navigation-types';

export async function getSiteNavigation(locale: string): Promise<SiteNavigation> {
  return getShopifyNavigation(locale);
}
