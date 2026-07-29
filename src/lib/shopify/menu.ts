import { collectionPath, isHiddenCollectionHandle } from '@/lib/catalog/collection-handles';
import {
  combinedCollectionTitle,
  isCombinedCollectionHandle,
} from '@/lib/catalog/combined-collections';
import type { NavLink } from '@/lib/catalog/navigation-types';
import { m } from '@/lib/i18n';

import { getShopifyClient, isShopifyConfigured } from './client';

export const FOOTER_CATALOG_MENU_HANDLE = 'footer';

export interface ShopifyMenuItem {
  title: string;
  url: string;
  type: string;
  items?: ShopifyMenuItem[];
}

interface ShopifyMenu {
  id: string;
  title: string;
  items: ShopifyMenuItem[];
}

export const GET_MENU_BY_HANDLE = `
  query GetMenuByHandle($handle: String!) {
    menu(handle: $handle) {
      id
      title
      items {
        title
        url
        type
        items {
          title
          url
          type
        }
      }
    }
  }
`;

/** Extract primary collection handle from a Shopify menu URL. */
export function collectionHandleFromMenuUrl(url: string): string | null {
  const match = url.match(/\/collections\/([^/?#+]+)/i);
  return match?.[1] ?? null;
}

/** Footer "Accessories" parent uses a multi-tag URL — route to virtual accessories PLP. */
export function isAccessoriesGroupUrl(url: string): boolean {
  return /\/collections\/[^/]+\/[^/?#]*\+/i.test(url);
}

function cleanMenuGroupTitle(title: string): string {
  return title.replace(/^-\s*/, '').trim();
}

type CollectionLookup = Map<string, { handle: string; title: string }>;

const GROUP_LABEL_KEYS: Record<string, keyof ReturnType<typeof m>['nav']> = {
  'new collections': 'newCollections',
  swimwear: 'swimwear',
  'ready to wear': 'readyToWear',
  accessories: 'accessories',
  acessories: 'accessories',
};

const CHILD_LABEL_KEYS: Record<string, keyof ReturnType<typeof m>['nav']> = {
  bags: 'bags',
  shoes: 'shoes',
  hats: 'hats',
  dresses: 'dresses',
  bikini: 'bikini',
  'bikini-bottom': 'bikiniBottom',
  'bikini-top': 'bikiniTop',
  'cover-up': 'coverUp',
  'one-piece': 'onePiece',
  tops: 'tops',
  'pants-shorts': 'pantsShorts',
  skirts: 'skirts',
};

function groupLabel(locale: string, rawTitle: string): string {
  const n = m(locale).nav;
  const key = GROUP_LABEL_KEYS[cleanMenuGroupTitle(rawTitle).toLowerCase()];
  return key ? n[key] : cleanMenuGroupTitle(rawTitle);
}

function childLabel(locale: string, handle: string, fallback: string): string {
  const n = m(locale).nav;
  const key = CHILD_LABEL_KEYS[handle];
  return key ? n[key] : fallback;
}

function parentHrefForMenuItem(item: ShopifyMenuItem): string {
  if (isAccessoriesGroupUrl(item.url)) {
    return collectionPath('accessories');
  }
  const handle = collectionHandleFromMenuUrl(item.url);
  return handle ? collectionPath(handle) : item.url;
}

function childNavLinks(
  locale: string,
  items: ShopifyMenuItem[] | undefined,
  byHandle: CollectionLookup
): NavLink[] {
  if (!items?.length) return [];

  const links: NavLink[] = [];
  for (const item of items) {
    const handle = collectionHandleFromMenuUrl(item.url);
    if (!handle || isHiddenCollectionHandle(handle)) continue;
    if (byHandle && !byHandle.has(handle)) continue;

    links.push({
      label: childLabel(locale, handle, item.title.trim()),
      href: collectionPath(handle),
    });
  }
  return links;
}

export function buildCatalogNavFromFooterMenu(
  locale: string,
  menu: ShopifyMenu,
  byHandle: CollectionLookup
): NavLink[] {
  const links: NavLink[] = [];

  for (const item of menu.items) {
    if (item.type !== 'COLLECTION' && !item.url.includes('/collections/')) continue;

    const children = childNavLinks(locale, item.items, byHandle);
    const parentHref = parentHrefForMenuItem(item);
    const virtualHandle = parentHref.replace(/^collections\//, '');

    if (byHandle && !byHandle.has(virtualHandle) && !isCombinedCollectionHandle(virtualHandle)) {
      if (children.length === 0) continue;
    }

    links.push({
      label: groupLabel(locale, item.title),
      href: parentHref,
      children: children.length > 0 ? children : undefined,
    });
  }

  return links;
}

export async function fetchFooterCatalogMenu(locale: string): Promise<ShopifyMenu | null> {
  if (!isShopifyConfigured(locale)) return null;

  try {
    const client = getShopifyClient(locale);
    const data = await client.execute<{ menu: ShopifyMenu | null }>(
      GET_MENU_BY_HANDLE,
      { handle: FOOTER_CATALOG_MENU_HANDLE },
      `shopify:menu:${FOOTER_CATALOG_MENU_HANDLE}:${locale}`
    );
    return data.menu;
  } catch {
    return null;
  }
}

export function virtualCollectionDisplayTitle(handle: string, locale: string): string | null {
  return combinedCollectionTitle(handle, locale);
}