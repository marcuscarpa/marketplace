/** Virtual PLP handles that merge multiple Shopify collections. */
export const COMBINED_COLLECTION_SOURCES: Record<string, readonly string[]> = {
  accessories: ['bags', 'shoes', 'hats'],
};

export function isCombinedCollectionHandle(handle: string): boolean {
  return handle in COMBINED_COLLECTION_SOURCES;
}

export function sourceHandlesForCollection(handle: string): readonly string[] {
  return COMBINED_COLLECTION_SOURCES[handle] ?? [handle];
}

export function combinedCollectionTitle(handle: string, locale: string): string | null {
  if (handle !== 'accessories') return null;
  return locale === 'pt' ? 'Acessórios' : 'Accessories';
}
