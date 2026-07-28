import type { Region } from '@/lib/regions';

const CUSTOMER_ACCOUNT_SCOPE = 'openid email customer-account-api:full';

export function getCustomerAccountScope(): string {
  return CUSTOMER_ACCOUNT_SCOPE;
}

export function getOAuthCallbackUrl(locale: string, requestHost?: string | null): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? (requestHost ? `https://${requestHost}` : '');
  const base = appUrl.replace(/\/$/, '');
  return `${base}/${locale}/api/auth/oauth/callback`;
}

export function getOAuthLocaleParams(
  locale: string,
  region: Pick<Region, 'code' | 'defaultLanguage'>,
): { locale: string; region_country: string } {
  if (locale === 'pt' || region.defaultLanguage === 'pt') {
    return { locale: 'pt-BR', region_country: 'BR' };
  }

  if (region.code === 'EU') return { locale: 'en-GB', region_country: 'GB' };
  if (region.code === 'APAC') return { locale: 'en-US', region_country: 'SG' };
  return { locale: 'en-US', region_country: 'US' };
}

export function getShopifyBasicAuthHeader(clientId: string, clientSecret: string): string {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
}

export function getShopifyTokenRequestHeaders(
  clientId: string,
  clientSecret: string,
  origin?: string | null,
): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: getShopifyBasicAuthHeader(clientId, clientSecret),
    'User-Agent': 'SinesiaKarolMarketplace/1.0',
  };

  if (origin) {
    headers.Origin = origin;
  }

  return headers;
}

export function getShopifyAppOrigin(): string | undefined {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return undefined;
  try {
    return new URL(appUrl).origin;
  } catch {
    return undefined;
  }
}
