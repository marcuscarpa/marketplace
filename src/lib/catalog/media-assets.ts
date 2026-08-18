import { SITE_IMAGES } from '@/lib/catalog/data';

/**
 * Central list of media used on the home page. The `MediaPrefetcher` warms
 * the browser cache for these without starving the critical path:
 * - Images are warmed in small idle batches after first load.
 * - Videos are only fetched once the user scrolls near their section.
 */
export interface HomeVideoGroup {
  anchorId: string;
  videos: readonly string[];
}

export const HOME_VIDEO_GROUPS: readonly HomeVideoGroup[] = [
  {
    anchorId: 'collection-cta',
    videos: ['/bloco%205-video%201-esquerda.mp4', '/bloco%205-video%202-direita.mp4'],
  },
  {
    anchorId: 'our-values',
    videos: [SITE_IMAGES.valuesVideo],
  },
];

export const HOME_IMAGES: readonly string[] = [
  ...Object.values(SITE_IMAGES),
  '/logotipo.webp',
  '/New-Collections%20-1.webp',
  '/Acessorios-1.webp',
  '/Men-1.webp',
  '/Sales-1.webp',
  '/mega-menu-swimwear-1.webp',
  '/mega-menu-swimwear-2.webp',
  '/mega-menu-swimwear-3.webp',
  '/Ready-to-Wear-1.webp',
  '/Ready-to-Wear-2.2.webp',
];
