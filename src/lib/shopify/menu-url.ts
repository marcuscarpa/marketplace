import { collectionPath, LEGACY_COLLECTION_REDIRECTS } from '@/lib/catalog/collection-handles';

const PAGE_HANDLE_MAP: Record<string, string> = {
  'size-guide': 'size-chart',
  'contact-us': 'contact',
  'about-us': 'about',
};

/** Map a Shopify Online Store menu URL to an internal storefront path (or external URL). */
export function parseShopifyMenuUrl(url: string): string {
  try {
    const { pathname } = new URL(url);
    const segments = pathname.replace(/^\/+|\/+$/g, '').split('/');

    if (segments[0] === 'collections' && segments[1]) {
      const handle = segments[1].split('/')[0] ?? segments[1];
      const mapped = LEGACY_COLLECTION_REDIRECTS[handle] ?? handle;
      return collectionPath(mapped);
    }

    if (segments[0] === 'pages' && segments[1]) {
      return PAGE_HANDLE_MAP[segments[1]] ?? segments[1];
    }

    if (segments[0] === 'blogs') {
      return url;
    }

    return segments.join('/');
  } catch {
    return url;
  }
}
