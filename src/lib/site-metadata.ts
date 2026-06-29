/** ponytail: presentation deploy only — swap NEXT_PUBLIC_APP_URL at production cutover. */
export const PRESENTATION_APP_URL = 'https://sinesia.jethro.agency';

/** ponytail: WhatsApp drops og:image above ~300KB; banner-hero.png is ~10MB. */
const SOCIAL_SHARE_IMAGE_PATH = '/og-share.jpg';
/** Bump when replacing og-share.jpg so WhatsApp/Facebook re-scrape the preview. */
const SOCIAL_SHARE_IMAGE_VERSION = '20260630';

export const SITE_DESCRIPTION =
  'Curated leather goods and accessories — enduring design and contemporary craftsmanship.';

/** Origem canónica para OG/Twitter — igual ao Alist_MKT; nunca incluir segmento /en. */
export function resolveMetadataBase(): URL | undefined {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (raw) {
    try {
      return new URL(new URL(raw).origin);
    } catch {
      /* invalid env URL */
    }
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    try {
      return new URL(`https://${vercel}`);
    } catch {
      /* invalid VERCEL_URL */
    }
  }
  try {
    return new URL(PRESENTATION_APP_URL);
  } catch {
    return undefined;
  }
}

export function getAppUrl(): string {
  return resolveMetadataBase()?.origin ?? PRESENTATION_APP_URL;
}

/** Absolute HTTPS URL — `new URL(path, origin)` evita prefixo /en/ nas rotas localizadas. */
export function getSocialShareImageUrl(): string {
  const base = resolveMetadataBase();
  if (!base) {
    return `${SOCIAL_SHARE_IMAGE_PATH}?v=${SOCIAL_SHARE_IMAGE_VERSION}`;
  }
  const url = new URL(SOCIAL_SHARE_IMAGE_PATH, base);
  url.searchParams.set('v', SOCIAL_SHARE_IMAGE_VERSION);
  return url.href;
}

/** Relative path only — do not use in openGraph; prefer getSocialShareImageUrl(). */
export const SOCIAL_SHARE_IMAGE = SOCIAL_SHARE_IMAGE_PATH;
