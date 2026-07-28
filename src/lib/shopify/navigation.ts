import {
  collectionPath,
  isHiddenCollectionHandle,
  SHOPIFY_COLLECTION,
} from '@/lib/catalog/collection-handles';
import type { MenuSections, NavLink, SiteNavigation } from '@/lib/catalog/navigation-types';
import { getStaticNavigation } from '@/lib/catalog/navigation-static';
import { m } from '@/lib/i18n';

import { getShopifyClient, isShopifyConfigured } from './client';
import { parseShopifyMenuUrl } from './menu-url';
import { GET_COLLECTIONS, GET_MENU } from './queries';

interface ShopifyCollectionNode {
  handle: string;
  title: string;
}

interface ShopifyMenuItem {
  title: string;
  url: string;
  type: string;
  items?: ShopifyMenuItem[];
}

interface ShopifyMenu {
  title: string;
  items: ShopifyMenuItem[];
}

const MAIN_MENU_HANDLE = 'main-menu';
const FOOTER_MENU_HANDLE = 'footer';

const MAIN_NAV_HANDLES = [
  SHOPIFY_COLLECTION.newArrivals,
  SHOPIFY_COLLECTION.shopAll,
  SHOPIFY_COLLECTION.swimwear,
  SHOPIFY_COLLECTION.readyToWear,
  SHOPIFY_COLLECTION.featured,
  SHOPIFY_COLLECTION.accessories,
] as const;

const MAIN_NAV_LABEL_KEY: Record<string, 'newArrivals' | 'all' | 'swimwear' | 'readyToWear' | 'collections' | 'accessories'> = {
  [SHOPIFY_COLLECTION.newArrivals]: 'newArrivals',
  [SHOPIFY_COLLECTION.shopAll]: 'all',
  [SHOPIFY_COLLECTION.swimwear]: 'swimwear',
  [SHOPIFY_COLLECTION.readyToWear]: 'readyToWear',
  [SHOPIFY_COLLECTION.featured]: 'collections',
  [SHOPIFY_COLLECTION.accessories]: 'accessories',
};

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

async function fetchMenu(locale: string, handle: string): Promise<ShopifyMenu | null> {
  const client = getShopifyClient(locale);
  const data = await client.execute<{ menu: ShopifyMenu | null }>(
    GET_MENU,
    { handle },
    `shopify:menu:${handle}:${locale}`
  );
  return data.menu;
}

async function fetchCollections(locale: string): Promise<ShopifyCollectionNode[]> {
  const client = getShopifyClient(locale);
  const data = await client.execute<{ collections: { nodes: ShopifyCollectionNode[] } }>(
    GET_COLLECTIONS,
    { first: 100 },
    `shopify:collections:${locale}`
  );
  return data.collections.nodes.filter((c) => !isHiddenCollectionHandle(c.handle));
}

function isSaleHref(href: string): boolean {
  return href.endsWith(`/${SHOPIFY_COLLECTION.sale}`) || href === collectionPath(SHOPIFY_COLLECTION.sale);
}

function menuItemToNavLink(item: ShopifyMenuItem, options?: { chevron?: boolean }): NavLink {
  const href = parseShopifyMenuUrl(item.url);
  return {
    label: item.title.replace(/^-\s*/, ''),
    href,
    sale: isSaleHref(href),
    chevron: options?.chevron,
  };
}

function buildMainNavFromMenu(items: ShopifyMenuItem[]): NavLink[] {
  return items.map((item) => menuItemToNavLink(item));
}

function flattenFooterMenu(items: ShopifyMenuItem[]): NavLink[] {
  const links: NavLink[] = [];

  for (const item of items) {
    links.push(
      menuItemToNavLink(item, {
        chevron: item.type === 'CATALOG' || (item.items?.length ?? 0) > 0,
      })
    );
    for (const child of item.items ?? []) {
      links.push(menuItemToNavLink(child));
    }
  }

  return links;
}

function toNavLink(collection: ShopifyCollectionNode, options?: { sale?: boolean; chevron?: boolean }): NavLink {
  return {
    label: collection.title,
    href: collectionPath(collection.handle),
    sale: options?.sale,
    chevron: options?.chevron,
  };
}

function buildMainNavFromCollections(locale: string, byHandle: Map<string, ShopifyCollectionNode>): NavLink[] {
  const n = m(locale).nav;
  const items: NavLink[] = [];

  for (const handle of MAIN_NAV_HANDLES) {
    const collection = byHandle.get(handle);
    if (!collection) continue;
    const labelKey = MAIN_NAV_LABEL_KEY[handle];
    items.push({
      label: labelKey ? n[labelKey] : collection.title,
      href: collectionPath(handle),
    });
  }

  items.push({ label: n.about, href: 'about' });

  const sale = byHandle.get(SHOPIFY_COLLECTION.sale);
  if (sale) {
    items.push({ label: n.sale, href: collectionPath(sale.handle), sale: true });
  }

  return items;
}

function buildDrawerLinksFromCollections(byHandle: Map<string, ShopifyCollectionNode>): NavLink[] {
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

function buildNavigation(
  locale: string,
  options: {
    mainNav: NavLink[];
    drawerLinks: NavLink[];
    footerShop: NavLink[];
  }
): SiteNavigation {
  const menuSections = buildMenuSections(locale, options.drawerLinks);
  return {
    mainNav: options.mainNav,
    menuSections,
    footerShop: options.footerShop,
    searchCategories: buildSearchCategories(locale, options.drawerLinks.slice(0, 12)),
    source: 'shopify',
  };
}

export async function getShopifyNavigation(locale: string): Promise<SiteNavigation> {
  if (!isShopifyConfigured(locale)) {
    return getStaticNavigation(locale);
  }

  try {
    const [mainMenu, footerMenu, collections] = await Promise.all([
      fetchMenu(locale, MAIN_MENU_HANDLE),
      fetchMenu(locale, FOOTER_MENU_HANDLE),
      fetchCollections(locale),
    ]);

    const byHandle = new Map(collections.map((c) => [c.handle, c]));

    if (mainMenu?.items.length || footerMenu?.items.length) {
      const mainNav =
        mainMenu?.items.length
          ? buildMainNavFromMenu(mainMenu.items)
          : buildMainNavFromCollections(locale, byHandle);

      const drawerLinks =
        footerMenu?.items.length
          ? flattenFooterMenu(footerMenu.items)
          : buildDrawerLinksFromCollections(byHandle);

      const footerShop = footerMenu?.items.length
        ? footerMenu.items
            .map((item) => menuItemToNavLink(item))
            .filter((link) => !link.sale)
            .slice(0, 8)
        : drawerLinks.filter((link) => !link.sale).slice(0, 8);

      return buildNavigation(locale, { mainNav, drawerLinks, footerShop });
    }

    if (collections.length === 0) {
      return getStaticNavigation(locale);
    }

    const mainNav = buildMainNavFromCollections(locale, byHandle);
    const drawerLinks = buildDrawerLinksFromCollections(byHandle);
    return buildNavigation(locale, {
      mainNav,
      drawerLinks,
      footerShop: drawerLinks.filter((link) => !link.sale).slice(0, 8),
    });
  } catch {
    return getStaticNavigation(locale);
  }
}
