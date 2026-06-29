/** ponytail: presentation deploy only — swap NEXT_PUBLIC_APP_URL at production cutover. */
export const PRESENTATION_APP_URL = 'https://sinesia.jethro.agency';

/** ponytail: WhatsApp drops og:image above ~300KB; banner-hero.png is ~10MB. */
const SOCIAL_SHARE_IMAGE_PATH = '/og-share.jpg';
/** Bump when replacing og-share.jpg so WhatsApp/Facebook re-scrape the preview. */
const SOCIAL_SHARE_IMAGE_VERSION = '20260629';

export const SITE_DESCRIPTION =
  'Curated leather goods and accessories — enduring design and contemporary craftsmanship.';

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? PRESENTATION_APP_URL;
}

/** Absolute HTTPS URL — WhatsApp ignores relative og:image on some clients. */
export function getSocialShareImageUrl(): string {
  const base = getAppUrl().replace(/\/$/, '');
  return `${base}${SOCIAL_SHARE_IMAGE_PATH}?v=${SOCIAL_SHARE_IMAGE_VERSION}`;
}

/** Relative path for metadataBase resolution on product/collection fallbacks. */
export const SOCIAL_SHARE_IMAGE = SOCIAL_SHARE_IMAGE_PATH;
