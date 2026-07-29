import { unstable_cache } from 'next/cache';

import {
  CATALOG_MENU_GROUPS,
  catalogGroupByHandle,
  type CatalogMenuLabelKey,
} from '@/lib/catalog/catalog-menu-groups';
import { isHiddenCollectionHandle } from '@/lib/catalog/collection-handles';
import { m } from '@/lib/i18n';

import { fetchFooterCatalogMenu, type ShopifyMenu } from '@/lib/shopify/menu-fetch';
import { collectionHandleFromMenuUrl, isAccessoriesGroupUrl } from '@/lib/shopify/menu-url';

/** Static fallback — parent menu click merges all submenu collections. */
export const COMBINED_COLLECTION_SOURCES: Record<string, readonly string[]> =
  Object.fromEntries(CATALOG_MENU_GROUPS.map((group) => [group.handle, group.children]));

export function buildCombinedSourcesFromMenu(
  menu: ShopifyMenu
): Record<string, readonly string[]> {
  const combined: Record<string, readonly string[]> = {};

  for (const item of menu.items) {
    const childHandles = (item.items ?? [])
      .map((child) => collectionHandleFromMenuUrl(child.url))
      .filter(
        (handle): handle is string => Boolean(handle) && !isHiddenCollectionHandle(handle)
      );

    if (childHandles.length === 0) continue;

    if (isAccessoriesGroupUrl(item.url)) {
      combined.accessories = childHandles;
      continue;
    }

    const parentHandle = collectionHandleFromMenuUrl(item.url);
    if (parentHandle) {
      combined[parentHandle] = childHandles;
    }
  }

  return combined;
}

const getMenuCombinedSources = unstable_cache(
  async (locale: string) => {
    const menu = await fetchFooterCatalogMenu(locale);
    if (!menu) return {};
    return buildCombinedSourcesFromMenu(menu);
  },
  ['menu-combined-sources'],
  { revalidate: 3600 }
);

export function isCombinedCollectionHandle(handle: string): boolean {
  return handle in COMBINED_COLLECTION_SOURCES;
}

/** Static lookup — submenu handles resolve to themselves only. */
export function sourceHandlesForCollection(handle: string): readonly string[] {
  return COMBINED_COLLECTION_SOURCES[handle] ?? [handle];
}

export async function resolveSourceHandles(
  handle: string,
  locale: string
): Promise<readonly string[]> {
  const menuMap = await getMenuCombinedSources(locale);
  const fromMenu = menuMap[handle];
  if (fromMenu?.length) return fromMenu;
  return sourceHandlesForCollection(handle);
}

export async function isCombinedCollectionHandleForLocale(
  handle: string,
  locale: string
): Promise<boolean> {
  const sources = await resolveSourceHandles(handle, locale);
  return sources.length > 1;
}

export function combinedCollectionTitle(handle: string, locale: string): string | null {
  const group = catalogGroupByHandle(handle);
  if (!group) return null;
  return m(locale).nav[group.labelKey as CatalogMenuLabelKey];
}

export function combinedParentHrefForMenuItem(
  itemUrl: string,
  childHandles: readonly string[]
): string | null {
  if (childHandles.length === 0) return null;
  if (isAccessoriesGroupUrl(itemUrl)) return 'accessories';
  return collectionHandleFromMenuUrl(itemUrl);
}
