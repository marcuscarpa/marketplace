/** Extract primary collection handle from a Shopify menu URL. */
export function collectionHandleFromMenuUrl(url: string): string | null {
  const match = url.match(/\/collections\/([^/?#+]+)/i);
  return match?.[1] ?? null;
}

/** Footer "Accessories" parent uses a multi-tag URL — route to virtual accessories PLP. */
export function isAccessoriesGroupUrl(url: string): boolean {
  return /\/collections\/[^/]+\/[^/?#]*\+/i.test(url);
}
