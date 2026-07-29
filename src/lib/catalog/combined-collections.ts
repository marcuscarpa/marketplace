import { unstable_cache } from 'next/cache';

import {
  buildCombinedSourcesFromMenu,
  sourceHandlesForCollection,
} from '@/lib/catalog/combined-collections-static';
import { fetchFooterCatalogMenu } from '@/lib/shopify/menu-fetch';

export {
  COMBINED_COLLECTION_SOURCES,
  buildCombinedSourcesFromMenu,
  combinedCollectionTitle,
  combinedParentHrefForMenuItem,
  isCombinedCollectionHandle,
  sourceHandlesForCollection,
} from '@/lib/catalog/combined-collections-static';

const getMenuCombinedSources = unstable_cache(
  async (locale: string) => {
    const menu = await fetchFooterCatalogMenu(locale);
    if (!menu) return {};
    return buildCombinedSourcesFromMenu(menu);
  },
  ['menu-combined-sources-v3'],
  { revalidate: 3600 }
);

export async function resolveSourceHandles(
  handle: string,
  locale: string
): Promise<readonly string[]> {
  const staticHandles = sourceHandlesForCollection(handle);
  const menuMap = await getMenuCombinedSources(locale);
  const fromMenu = menuMap[handle];

  if (!fromMenu?.length) return staticHandles;
  if (staticHandles.length <= 1) return fromMenu;

  return [...new Set([...fromMenu, ...staticHandles])];
}

export async function isCombinedCollectionHandleForLocale(
  handle: string,
  locale: string
): Promise<boolean> {
  const sources = await resolveSourceHandles(handle, locale);
  return sources.length > 1;
}
