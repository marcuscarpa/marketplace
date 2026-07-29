import {
  collectionPath,
  isHiddenCollectionHandle,
  SHOPIFY_COLLECTION,
} from '@/lib/catalog/collection-handles';
import { buildMainHeaderNav } from '@/lib/catalog/header-nav';
import type { MenuSections, NavLink, SiteNavigation } from '@/lib/catalog/navigation-types';
import { getStaticNavigation } from '@/lib/catalog/navigation-static';
import { m } from '@/lib/i18n';

import { getShopifyClient, isShopifyConfigured } from './client';
import { GET_COLLECTIONS } from './queries';

interface ShopifyCollectionNode {
  handle: string;
  title: string;
}


const DRAWER_GROUP_HANDLES: string[][] = [
  [
    SHOPIFY_COLLECTION.newArrivals,
    SHOPIFY_COLLECTION.shopAll,
    SHOPIFY_COLLECTION.swimwear,
    SHOPIFY_COLLECTION.readyToWear,
  ],
  ['all-swim', 'bikini', 'bikini-top', 'bikini-bottom', 'one-piece', 'cover-up'],
  ['dresses', 'tops', 'pants-shorts', 'skirts'],
  [
    'florias',
    'orquidea',
    SHOPIFY_COLLECTION.featured,
    'trancoso',
    'enseada',
    'green-tea',
    'jardim-oriental',
    'ocean-leque',
    'pearl-tropical',
    'pearl-collection',
  ],
  ['bags', 'hats', 'shoes'],
  [SHOPIFY_COLLECTION.bestsellers, SHOPIFY_COLLECTION.sale],
];

async function fetchCollections(locale: string): Promise<ShopifyCollectionNode[]> {
  const client = getShopifyClient(locale);
  const data = await client.execute<{ collections: { nodes: ShopifyCollectionNode[] } }>(
    GET_COLLECTIONS,
    { first: 100 },
    `shopify:collections:${locale}`
  );
  return data.collections.nodes.filter((c) => !isHiddenCollectionHandle(c.handle));
}

function toNavLink(collection: ShopifyCollectionNode, options?: { sale?: boolean; chevron?: boolean }): NavLink {
  return {
    label: collection.title,
    href: collectionPath(collection.handle),
    sale: options?.sale,
    chevron: options?.chevron,
  };
}

function buildMainNav(locale: string, byHandle: Map<string, ShopifyCollectionNode>): NavLink[] {
  return buildMainHeaderNav(locale, byHandle);
}

function buildDrawerLinks(byHandle: Map<string, ShopifyCollectionNode>): NavLink[] {
  const seen = new Set<string>();
  const links: NavLink[] = [];

  for (const group of DRAWER_GROUP_HANDLES) {
    for (const handle of group) {
      if (seen.has(handle)) continue;
      const collection = byHandle.get(handle);
      if (!collection) continue;
      seen.add(handle);
      links.push(toNavLink(collection, { chevron: handle === SHOPIFY_COLLECTION.shopAll }));
    }
  }

  for (const collection of byHandle.values()) {
    if (seen.has(collection.handle)) continue;
    seen.add(collection.handle);
    links.push(toNavLink(collection));
  }

  return links;
}

function buildMenuSections(locale: string, productLinks: NavLink[]): MenuSections {
  const n = m(locale).nav;
  return {
    products: { label: n.shop, links: productLinks },
    brand: {
      label: n.ourBrand,
      links: [
        { label: n.about, href: 'about' },
        { label: n.locations, href: 'locations' },
      ],
    },
    utility: [
      { label: n.faqs, href: 'faq' },
      { label: n.contact, href: 'contact' },
      { label: n.newsroom, href: 'newsroom' },
    ],
    utilityMobile: [
      { label: n.search, href: 'search' },
      { label: n.account, href: 'account' },
      { label: n.wishlist, href: 'wishlist' },
    ],
  };
}

function buildSearchCategories(locale: string, links: NavLink[]) {
  return links.map((link) => ({
    label: link.label,
    href: `/${locale}/${link.href}`,
    query: link.href.split('/').pop() ?? link.label.toLowerCase(),
  }));
}

function buildShopifyNavigation(locale: string, collections: ShopifyCollectionNode[]): SiteNavigation {
  const byHandle = new Map(collections.map((c) => [c.handle, c]));
  const mainNav = buildMainNav(locale, byHandle);
  const drawerLinks = buildDrawerLinks(byHandle);
  const menuSections = buildMenuSections(locale, drawerLinks);

  const footerShop = drawerLinks
    .filter((link) => !link.href.endsWith(SHOPIFY_COLLECTION.sale))
    .slice(0, 8);

  return {
    mainNav,
    menuSections,
    footerShop,
    searchCategories: buildSearchCategories(locale, drawerLinks.slice(0, 12)),
    source: 'shopify',
  };
}

export async function getShopifyNavigation(locale: string): Promise<SiteNavigation> {
  if (!isShopifyConfigured(locale)) {
    return getStaticNavigation(locale);
  }

  const [collectionsResult] = await Promise.allSettled([fetchCollections(locale)]);

  const collections =
    collectionsResult.status === 'fulfilled' ? collectionsResult.value : [];

  if (collections.length === 0) {
    return getStaticNavigation(locale);
  }

  return buildShopifyNavigation(locale, collections);
}
