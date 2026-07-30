/** Request a Shopify CDN size so Next.js image optimization does not fail on multi-MB originals. */
export function shopifyImageUrl(url: string | null | undefined, width = 800): string {
  if (!url) return '';
  if (!url.includes('cdn.shopify.com')) return url;
  if (/[?&]width=\d+/.test(url)) return url;

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}width=${width}`;
}
