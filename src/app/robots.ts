import type { MetadataRoute } from 'next';

import { getAppUrl } from '@/lib/site-metadata';

export default function robots(): MetadataRoute.Robots {
  const base = getAppUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/account/', '/cart/', '/wishlist/', '/search'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
