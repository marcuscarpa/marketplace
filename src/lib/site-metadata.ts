/** ponytail: presentation deploy only — swap NEXT_PUBLIC_APP_URL at production cutover. */
export const PRESENTATION_APP_URL = 'https://sinesia.jethro.agency';

/** ponytail: WhatsApp drops og:image above ~300KB; banner-hero.png is ~10MB. */
export const SOCIAL_SHARE_IMAGE = '/og-share.jpg';

export const SITE_DESCRIPTION =
  'Curated leather goods and accessories — enduring design and contemporary craftsmanship.';

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? PRESENTATION_APP_URL;
}
