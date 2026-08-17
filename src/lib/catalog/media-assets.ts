import { SITE_IMAGES } from '@/lib/catalog/data';

/**
 * Central list of media used on the home page. The `MediaPrefetcher` warms
 * the browser cache for these right after first load so that by the time the
 * user scrolls to a section, its video/image is already downloaded.
 */
export const HOME_VIDEOS: readonly string[] = [
  '/video-banner-hero.mp4',
  SITE_IMAGES.valuesVideo,
  '/bloco%205-video%201-esquerda.mp4',
  '/bloco%205-video%202-direita.mp4',
];

export const HOME_IMAGES: readonly string[] = [
  ...Object.values(SITE_IMAGES),
  '/logotipo.webp',
  '/New-Collections%20-1.webp',
  '/Acessorios-1.webp',
  '/Men-1.png',
  '/Sales-1.webp',
  '/mega-menu-swimwear-1.webp',
  '/mega-menu-swimwear-2.webp',
  '/mega-menu-swimwear-3.webp',
  '/Ready-to-Wear-1.webp',
  '/Ready-to-Wear-2.2.webp',
];
