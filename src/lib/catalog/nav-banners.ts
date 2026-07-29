import { SITE_IMAGES } from '@/lib/catalog/data';
import type { NavBanner, NavLink } from '@/lib/catalog/navigation-types';
import { m } from '@/lib/i18n';

const NAV_BANNERS: Record<string, NavBanner> = {
  'jardim-oriental': {
    src: SITE_IMAGES.collectionNew,
    alt: 'New Collections',
  },
  swimwear: {
    src: SITE_IMAGES.cycler1,
    alt: 'Swimwear',
  },
  'all-rtw': {
    src: SITE_IMAGES.bestseller1,
    alt: 'Ready-to-Wear',
  },
  accessories: {
    src: SITE_IMAGES.cycler3,
    alt: 'Accessories',
  },
  'mens-collection': {
    src: SITE_IMAGES.collectionWomen,
    alt: 'Men',
  },
  sale: {
    src: '/banner-salle.webp',
    alt: 'Sale',
  },
};

function handleFromHref(href: string): string {
  return href.split('/').pop() ?? href;
}

export function getNavBanner(href: string): NavBanner | undefined {
  return NAV_BANNERS[handleFromHref(href)];
}

export function enrichNavWithBanners(locale: string, links: NavLink[]): NavLink[] {
  const n = m(locale).nav;

  return links.map((link) => {
    const banner = link.banner ?? getNavBanner(link.href);
    const enriched: NavLink = {
      ...link,
      sectionTitle: link.sectionTitle ?? (link.children?.length ? n.shopByCategory : undefined),
    };

    if (banner) {
      enriched.banner = { ...banner, caption: banner.caption ?? link.label };
    }

    return enriched;
  });
}
