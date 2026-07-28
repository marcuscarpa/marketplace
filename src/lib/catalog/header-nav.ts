import { collectionPath } from '@/lib/catalog/collection-handles';
import type { NavLink } from '@/lib/catalog/navigation-types';
import { m } from '@/lib/i18n';

/** Header catalog groups — mirrors Shopify footer menu structure. */
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
    handle: 'hats',
    children: ['bags', 'shoes', 'hats'],
  },
] as const;

const STATIC_CHILD_LABELS: Record<string, string> = {
  enseada: 'Enseada',
  'green-tea': 'Green Tea',
  'garden-collection': 'Garden Collection',
  'floral-print-collection': 'Floral Print Collection',
  bikini: 'All Bikinis',
  'bikini-bottom': 'Bikini Bottoms',
  'bikini-top': 'Bikini Top',
  'cover-up': 'Cover-up',
  'one-piece': 'One Piece',
  dresses: 'Dresses',
  tops: 'Tops',
  'pants-shorts': 'Pants + Shorts',
  skirts: 'Skirts',
  bags: 'Bags',
  shoes: 'Shoes',
  hats: 'Hats',
};

type CollectionLookup = Map<string, { handle: string; title: string }> | null;

export function buildHeaderCatalogNav(locale: string, byHandle: CollectionLookup): NavLink[] {
  const n = m(locale).nav;

  return HEADER_CATALOG_GROUPS.flatMap((group) => {
    const parent = byHandle?.get(group.handle);
    if (byHandle && !parent) return [];

    const children: NavLink[] = [];
    for (const handle of group.children) {
      const collection = byHandle?.get(handle);
      if (byHandle && !collection) continue;
      children.push({
        label: collection?.title ?? STATIC_CHILD_LABELS[handle] ?? handle,
        href: collectionPath(handle),
      });
    }

    return [
      {
        label: n[group.labelKey],
        href: collectionPath(group.handle),
        children: children.length > 0 ? children : undefined,
      },
    ];
  });
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

export function buildMainHeaderNav(locale: string, byHandle: CollectionLookup): NavLink[] {
  return [...buildHeaderCatalogNav(locale, byHandle), ...buildHeaderTrailingNav(locale, byHandle)];
}
