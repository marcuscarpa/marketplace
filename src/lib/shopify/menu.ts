import {
  collectionPath,
  isHiddenCollectionHandle,
  resolveCollectionHandle,
} from '@/lib/catalog/collection-handles';
import { catalogGroupByHandle } from '@/lib/catalog/catalog-menu-groups';
import { shouldShowNavCollection, type NavCollectionRef } from '@/lib/catalog/nav-collection';
import {
  combinedCollectionTitle,
  combinedParentHrefForMenuItem,
  isCombinedCollectionHandle,
} from '@/lib/catalog/combined-collections';
import type { NavLink } from '@/lib/catalog/navigation-types';
import { m } from '@/lib/i18n';

import { fetchFooterCatalogMenu, type ShopifyMenu, type ShopifyMenuItem } from './menu-fetch';
import { collectionHandleFromMenuUrl } from './menu-url';

export { FOOTER_CATALOG_MENU_HANDLE, fetchFooterCatalogMenu } from './menu-fetch';
export type { ShopifyMenu, ShopifyMenuItem } from './menu-fetch';
export { collectionHandleFromMenuUrl, isAccessoriesGroupUrl } from './menu-url';

function cleanMenuGroupTitle(title: string): string {
  return title.replace(/^-\s*/, '').trim();
}

type CollectionLookup = Map<string, NavCollectionRef>;

const GROUP_LABEL_KEYS: Record<string, keyof ReturnType<typeof m>['nav']> = {
  'new collections': 'newCollections',
  swimwear: 'swimwear',
  'ready to wear': 'readyToWear',
  accessories: 'accessories',
  acessories: 'accessories',
};

const CHILD_LABEL_KEYS: Record<string, keyof ReturnType<typeof m>['nav']> = {
  enseada: 'enseada',
  'green-tea': 'greenTea',
  'orchid-collection': 'orchidCollection',
  florias: 'florias',
  orquidea: 'orquidea',
  trancoso: 'trancoso',
  'ocean-leque': 'oceanLeque',
  'pearl-tropical': 'pearlTropical',
  'pearl-collection': 'pearlCollection',
  bags: 'bags',
  shoes: 'shoes',
  hats: 'hats',
  dresses: 'dresses',
  bikini: 'bikini',
  'bikini-bottom': 'bikiniBottom',
  'bikini-top': 'bikiniTop',
  'cover-up': 'coverUp',
  'one-piece': 'onePiece',
  'cut-outs': 'cutOuts',
  tops: 'tops',
  'pants-shorts': 'pantsShorts',
  skirts: 'skirts',
  'mens-shirts': 'mensShirts',
  'mens-shorts': 'mensShorts',
  'mens-pants': 'mensPants',
  'mens-shoes': 'mensShoes',
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

function parentHrefForMenuItem(item: ShopifyMenuItem, childHandles: string[]): string {
  const combinedHandle = combinedParentHrefForMenuItem(item.url, childHandles);
  if (combinedHandle) {
    return collectionPath(combinedHandle);
  }
  const handle = collectionHandleFromMenuUrl(item.url);
  return handle ? collectionPath(handle) : item.url;
}

function childNavLinks(
  locale: string,
  items: ShopifyMenuItem[] | undefined,
  byHandle: CollectionLookup
): { links: NavLink[]; handles: string[] } {
  if (!items?.length) return { links: [], handles: [] };

  const links: NavLink[] = [];
  const handles: string[] = [];
  for (const item of items) {
    const rawHandle = collectionHandleFromMenuUrl(item.url);
    if (!rawHandle || isHiddenCollectionHandle(rawHandle)) continue;
    const handle = resolveCollectionHandle(rawHandle);
    if (byHandle && !shouldShowNavCollection(byHandle.get(handle))) continue;

    handles.push(handle);
    links.push({
      label: childLabel(locale, handle, item.title.trim()),
      href: collectionPath(handle),
    });
  }
  return { links, handles };
}

export function buildCatalogNavFromFooterMenu(
  locale: string,
  menu: ShopifyMenu,
  byHandle: CollectionLookup
): NavLink[] {
  const links: NavLink[] = [];

  for (const item of menu.items) {
    if (item.type !== 'COLLECTION' && !item.url.includes('/collections/')) continue;

    const { links: children, handles: childHandles } = childNavLinks(locale, item.items, byHandle);
    const parentHref = parentHrefForMenuItem(item, childHandles);
    const virtualHandle = parentHref.replace(/^collections\//, '');

    const group = catalogGroupByHandle(virtualHandle);
    if (group && byHandle) {
      for (const handle of group.children) {
        if (childHandles.includes(handle)) continue;
        const collection = byHandle.get(handle);
        if (!shouldShowNavCollection(collection)) continue;
        childHandles.push(handle);
        children.push({
          label: childLabel(locale, handle, collection.title),
          href: collectionPath(handle),
        });
      }
    }

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

export function virtualCollectionDisplayTitle(handle: string, locale: string): string | null {
  return combinedCollectionTitle(handle, locale);
}