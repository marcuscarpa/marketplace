/** Parent PLP handle → Shopify child collection handles (from live footer menu structure). */
export const CATALOG_MENU_GROUPS = [
  {
    labelKey: 'newCollections' as const,
    handle: 'jardim-oriental',
    children: [
      'enseada',
      'green-tea',
      'orchid-collection',
      'florias',
      'orquidea',
      'trancoso',
      'ocean-leque',
      'pearl-tropical',
      'pearl-collection',
    ],
  },
  {
    labelKey: 'swimwear' as const,
    handle: 'swimwear',
    children: ['bikini', 'bikini-bottom', 'bikini-top', 'cover-up', 'one-piece', 'cut-outs'],
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

export type CatalogMenuGroup = (typeof CATALOG_MENU_GROUPS)[number];
export type CatalogMenuLabelKey = CatalogMenuGroup['labelKey'];

export function catalogGroupByHandle(handle: string): CatalogMenuGroup | undefined {
  return CATALOG_MENU_GROUPS.find((group) => group.handle === handle);
}
