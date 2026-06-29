/** ponytail: presentation deploy only — swap NEXT_PUBLIC_APP_URL at production cutover. */
export const PRESENTATION_APP_URL = 'https://sinesia.jethro.agency';

export const SOCIAL_SHARE_IMAGE = '/banner-hero.png';

export const SITE_DESCRIPTION =
  'Curated leather goods and accessories — enduring design and contemporary craftsmanship.';

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? PRESENTATION_APP_URL;
}
