import {
  collectionPath,
  isHiddenCollectionHandle,
  SHOPIFY_COLLECTION,
} from '@/lib/catalog/collection-handles';
import { buildHeaderCatalogNav, buildHeaderTrailingNav } from '@/lib/catalog/header-nav';
import { enrichNavWithBanners } from '@/lib/catalog/nav-banners';
import { shouldShowNavCollection } from '@/lib/catalog/nav-collection';
import type { MenuSections, NavLink, SiteNavigation } from '@/lib/catalog/navigation-types';
import { getStaticNavigation } from '@/lib/catalog/navigation-static';
import { m } from '@/lib/i18n';

import { getShopifyClient, isShopifyConfigured } from './client';
import {
  buildCatalogNavFromFooterMenu,
  fetchFooterCatalogMenu,
} from './menu';
import { GET_COLLECTIONS } from './queries';

interface ShopifyCollectionNode {
  handle: string;
  title: string;
  hasProducts: boolean;
}


const DRAWER_GROUP_HANDLES: string[][] = [
  [
    SHOPIFY_COLLECTION.newArrivals,
    SHOPIFY_COLLECTION.shopAll,
    SHOPIFY_COLLECTION.swimwear,
    SHOPIFY_COLLECTION.readyToWear,
  ],
  ['all-swim', 'bikini', 'bikini-top', 'bikini-bottom', 'one-piece', 'cover-up', 'cut-outs'],
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
  const data = await client.execute<{
    collections: {
      nodes: Array<{
        handle: string;
        title: string;
        products: { nodes: Array<{ id: string }> };
      }>;
    };
  }>(GET_COLLECTIONS, { first: 100 }, `shopify:collections-v2:${locale}`);

  return data.collections.nodes
    .filter((c) => !isHiddenCollectionHandle(c.handle))
    .map((c) => ({
      handle: c.handle,
      title: c.title,
      hasProducts: c.products.nodes.length > 0,
    }));
}

function toNavLink(collection: ShopifyCollectionNode, options?: { sale?: boolean; chevron?: boolean }): NavLink {
  return {
    label: collection.title,
    href: collectionPath(collection.handle),
    sale: options?.sale,
    chevron: options?.chevron,
  };
}

function buildMainNav(locale: string, byHandle: Map<string, ShopifyCollectionNode>, footerMenu: Awaited<ReturnType<typeof fetchFooterCatalogMenu>>): NavLink[] {
  const catalogNav =
    footerMenu && footerMenu.items.length > 0
      ? buildCatalogNavFromFooterMenu(locale, footerMenu, byHandle)
      : buildHeaderCatalogNav(locale, byHandle);

  return enrichNavWithBanners(locale, [...catalogNav, ...buildHeaderTrailingNav(locale, byHandle)]);
}

function buildDrawerLinks(byHandle: Map<string, ShopifyCollectionNode>): NavLink[] {
  const seen = new Set<string>();
  const links: NavLink[] = [];

  for (const group of DRAWER_GROUP_HANDLES) {
    for (const handle of group) {
      if (seen.has(handle)) continue;
      const collection = byHandle.get(handle);
      if (!shouldShowNavCollection(collection)) continue;
      seen.add(handle);
      links.push(toNavLink(collection, { chevron: handle === SHOPIFY_COLLECTION.shopAll }));
    }
  }

  for (const collection of byHandle.values()) {
    if (seen.has(collection.handle)) continue;
    if (!shouldShowNavCollection(collection)) continue;
    seen.add(collection.handle);
    links.push(toNavLink(collection));
  }

  return links;
}

function buildMenuSections(locale: string, productLinks: NavLink[]): MenuSections {
  const n = m(locale).nav;
  const f = m(locale).footer;
  return {
    products: { label: n.shop, links: productLinks },
    brand: {
      label: n.aboutUs,
      links: [],
    },
    utility: [
      { label: f.sizeGuide, href: 'size-chart' },
      { label: n.locations, href: 'locations' },
      { label: n.contact, href: 'contact' },
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

function buildShopifyNavigation(
  locale: string,
  collections: ShopifyCollectionNode[],
  footerMenu: Awaited<ReturnType<typeof fetchFooterCatalogMenu>>
): SiteNavigation {
  const byHandle = new Map(collections.map((c) => [c.handle, c]));
  const mainNav = buildMainNav(locale, byHandle, footerMenu);
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

  const [collectionsResult, footerMenuResult] = await Promise.allSettled([
    fetchCollections(locale),
    fetchFooterCatalogMenu(locale),
  ]);

  const collections =
    collectionsResult.status === 'fulfilled' ? collectionsResult.value : [];
  const footerMenu =
    footerMenuResult.status === 'fulfilled' ? footerMenuResult.value : null;

  if (collections.length === 0) {
    return getStaticNavigation(locale);
  }

  return buildShopifyNavigation(locale, collections, footerMenu);
}
