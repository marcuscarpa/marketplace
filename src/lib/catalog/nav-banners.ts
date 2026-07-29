import { collectionPath } from '@/lib/catalog/collection-handles';
import { SITE_IMAGES } from '@/lib/catalog/data';
import type { NavBanner, NavBannerTile, NavLink } from '@/lib/catalog/navigation-types';
import { m } from '@/lib/i18n';

const NAV_BANNERS: Record<string, NavBanner> = {
  'jardim-oriental': {
    src: SITE_IMAGES.collectionNew,
    alt: 'New Collections',
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

const SWIMWEAR_GALLERY_IMAGES = [
  '/mega-menu-swimwear-1.webp',
  '/mega-menu-swimwear-2.webp',
  '/mega-menu-swimwear-3.webp',
] as const;

function handleFromHref(href: string): string {
  return href.split('/').pop() ?? href;
}

export function getNavBanner(href: string): NavBanner | undefined {
  return NAV_BANNERS[handleFromHref(href)];
}

function getSwimwearBannerGallery(locale: string): NavBannerTile[] {
  const n = m(locale).nav;

  return [
    {
      src: SWIMWEAR_GALLERY_IMAGES[1],
      alt: n.bikini,
      caption: n.bikini,
      href: collectionPath('bikini'),
    },
    {
      src: SWIMWEAR_GALLERY_IMAGES[0],
      alt: n.onePiece,
      caption: n.onePiece,
      href: collectionPath('one-piece'),
    },
    {
      src: SWIMWEAR_GALLERY_IMAGES[2],
      alt: n.coverUp,
      caption: n.coverUp,
      href: collectionPath('cover-up'),
    },
  ];
}

export function enrichNavWithBanners(locale: string, links: NavLink[]): NavLink[] {
  const n = m(locale).nav;

  return links.map((link) => {
    const handle = handleFromHref(link.href);
    const bannerGallery = handle === 'swimwear' ? getSwimwearBannerGallery(locale) : link.bannerGallery;
    const banner = handle === 'swimwear' ? undefined : link.banner ?? getNavBanner(link.href);

    const enriched: NavLink = {
      ...link,
      sectionTitle: link.sectionTitle ?? (link.children?.length ? n.shopByCategory : undefined),
      bannerGallery,
      banner: banner
        ? { ...banner, caption: banner.caption ?? link.label }
        : undefined,
    };

    return enriched;
  });
}
