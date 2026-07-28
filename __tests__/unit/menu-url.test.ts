import { describe, expect, it } from 'vitest';

import { parseShopifyMenuUrl } from '@/lib/shopify/menu-url';

describe('parseShopifyMenuUrl', () => {
  it('maps legacy collection handles', () => {
    expect(parseShopifyMenuUrl('https://sinesiakarol.com/collections/all')).toBe('collections/shop-all');
  });

  it('maps collection handles', () => {
    expect(parseShopifyMenuUrl('https://sinesiakarol.com/collections/swimwear')).toBe('collections/swimwear');
  });

  it('maps Shopify pages to internal routes', () => {
    expect(parseShopifyMenuUrl('https://sinesiakarol.com/pages/size-guide')).toBe('size-chart');
    expect(parseShopifyMenuUrl('https://sinesiakarol.com/pages/contact-us')).toBe('contact');
    expect(parseShopifyMenuUrl('https://sinesiakarol.com/pages/about-us')).toBe('about');
  });

  it('keeps blog URLs external', () => {
    const url = 'https://sinesiakarol.com/blogs/news';
    expect(parseShopifyMenuUrl(url)).toBe(url);
  });
});
