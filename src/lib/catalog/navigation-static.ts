import { buildMainHeaderNav } from '@/lib/catalog/header-nav';
import { collectionPath, SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';
import type { MenuSections, NavLink, SiteNavigation } from '@/lib/catalog/navigation-types';
import { m } from '@/lib/i18n';

function buildStaticMainNav(locale: string): NavLink[] {
  return buildMainHeaderNav(locale, null);
}

function buildStaticMenuSections(locale: string): MenuSections {
  const n = m(locale).nav;
  const f = m(locale).footer;
  return {
    products: {
      label: n.shop,
      links: [
        { label: n.newArrivals, href: collectionPath(SHOPIFY_COLLECTION.newArrivals), chevron: true },
        { label: n.all, href: collectionPath(SHOPIFY_COLLECTION.shopAll), chevron: true },
        { label: n.swimwear, href: collectionPath(SHOPIFY_COLLECTION.swimwear) },
        { label: n.readyToWear, href: collectionPath(SHOPIFY_COLLECTION.readyToWear) },
        { label: n.collections, href: collectionPath(SHOPIFY_COLLECTION.featured) },
        { label: n.accessories, href: collectionPath(SHOPIFY_COLLECTION.accessories) },
        { label: n.sale, href: collectionPath(SHOPIFY_COLLECTION.sale) },
      ],
    },
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

export function getStaticNavigation(locale: string): SiteNavigation {
  const mainNav = buildStaticMainNav(locale);
  const menuSections = buildStaticMenuSections(locale);
  return {
    mainNav,
    menuSections,
    footerShop: menuSections.products.links.filter((link) => !link.sale),
    searchCategories: menuSections.products.links.map((link) => ({
      label: link.label,
      href: `/${locale}/${link.href}`,
      query: link.href.split('/').pop() ?? link.label.toLowerCase(),
    })),
    source: 'static',
  };
}
