export interface NavCollectionRef {
  handle: string;
  title: string;
  /** false = confirmed empty in Shopify; undefined = unknown (static fallback). */
  hasProducts?: boolean;
}

export function shouldShowNavCollection(
  collection: NavCollectionRef | undefined
): collection is NavCollectionRef {
  if (!collection) return false;
  return collection.hasProducts !== false;
}
