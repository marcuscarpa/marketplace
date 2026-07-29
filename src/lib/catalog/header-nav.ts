import { collectionPath } from '@/lib/catalog/collection-handles';
import { isCombinedCollectionHandle } from '@/lib/catalog/combined-collections';
import type { NavLink } from '@/lib/catalog/navigation-types';
import { m } from '@/lib/i18n';

/** Fallback when Shopify footer menu is unavailable. Mirrors live footer menu structure. */
export const HEADER_CATALOG_GROUPS = [
  {
    labelKey: 'newCollections' as const,
    handle: 'jardim-oriental',
    children: ['enseada', 'green-tea', 'garden-collection', 'floral-print-collection'],
  },
  {
    labelKey: 'swimwear' as const,
    handle: 'swimwear',
    children: ['bikini', 'bikini-bottom', 'bikini-top', 'cover-up', 'one-piece'],
  },
  {
    labelKey: 'readyToWear' as const,
    handle: 'all-rtw',
    children: ['dresses', 'tops', 'pants-shorts', 'skirts'],
  },
  {
    labelKey: 'accessories' as const,
    handle: 'accessories',
    children: ['bags', 'shoes', 'hats'],
  },
] as const;

const CHILD_LABEL_KEYS: Record<string, keyof ReturnType<typeof m>['nav']> = {
  enseada: 'enseada',
  'green-tea': 'greenTea',
  'garden-collection': 'gardenCollection',
  'floral-print-collection': 'floralPrintCollection',
  bikini: 'bikini',
  'bikini-bottom': 'bikiniBottom',
  'bikini-top': 'bikiniTop',
  'cover-up': 'coverUp',
  'one-piece': 'onePiece',
  dresses: 'dresses',
  tops: 'tops',
  'pants-shorts': 'pantsShorts',
  skirts: 'skirts',
  bags: 'bags',
  shoes: 'shoes',
  hats: 'hats',
};

type CollectionLookup = Map<string, { handle: string; title: string }> | null;

function childLabel(locale: string, handle: string, fallback: string): string {
  const n = m(locale).nav;
  const key = CHILD_LABEL_KEYS[handle];
  return key ? n[key] : fallback;
}

export function buildHeaderCatalogNav(locale: string, byHandle: CollectionLookup): NavLink[] {
  const n = m(locale).nav;

  return HEADER_CATALOG_GROUPS.flatMap((group) => {
    const isVirtual = isCombinedCollectionHandle(group.handle);
    const parent = byHandle?.get(group.handle);
    if (byHandle && !parent && !isVirtual) return [];

    const children: NavLink[] = [];
    for (const handle of group.children) {
      const collection = byHandle?.get(handle);
      if (byHandle && !collection) continue;
      children.push({
        label: childLabel(locale, handle, collection?.title ?? handle),
        href: collectionPath(handle),
      });
    }

    if (byHandle && !parent && !isVirtual && children.length === 0) return [];

    return [
      {
        label: n[group.labelKey],
        href: collectionPath(group.handle),
        children: children.length > 0 ? children : undefined,
      },
    ];
  });
}

export function buildMainHeaderNav(locale: string, byHandle: CollectionLookup): NavLink[] {
  return [...buildHeaderCatalogNav(locale, byHandle), ...buildHeaderTrailingNav(locale, byHandle)];
}

export function buildHeaderTrailingNav(locale: string, byHandle: CollectionLookup): NavLink[] {
  const n = m(locale).nav;
  const items: NavLink[] = [{ label: n.about, href: 'about' }];

  if (!byHandle || byHandle.get('mens-collection')) {
    items.push({ label: n.men, href: collectionPath('mens-collection') });
  }

  if (!byHandle || byHandle.get('sale')) {
    items.push({ label: n.sale, href: collectionPath('sale'), sale: true });
  }

  return items;
}
