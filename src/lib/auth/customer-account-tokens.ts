import { getOpenIdConfiguration } from '@/lib/auth/customer-account-discovery';
import {
  getShopifyAppOrigin,
  getShopifyTokenRequestHeaders,
} from '@/lib/auth/customer-account-oauth';
import { getEnv } from '@/lib/env';
import { getRegion } from '@/lib/regions';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  id_token?: string;
}

export async function exchangeCustomerAccountAuthCode(options: {
  locale: string;
  code: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<TokenResponse> {
  const env = getEnv();
  const region = getRegion(options.locale);
  const openId = await getOpenIdConfiguration(region.shopifyDomain);

  const response = await fetch(openId.token_endpoint, {
    method: 'POST',
    headers: getShopifyTokenRequestHeaders(
      env.SHOPIFY_CLIENT_ID,
      env.SHOPIFY_CLIENT_SECRET,
      getShopifyAppOrigin(),
    ),
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: env.SHOPIFY_CLIENT_ID,
      redirect_uri: options.redirectUri,
      code: options.code,
      code_verifier: options.codeVerifier,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Token exchange failed (${response.status}): ${body}`);
  }

  return (await response.json()) as TokenResponse;
}

export async function refreshCustomerAccountToken(
  locale: string,
  refreshToken: string,
): Promise<TokenResponse> {
  const env = getEnv();
  const region = getRegion(locale);
  const openId = await getOpenIdConfiguration(region.shopifyDomain);

  const response = await fetch(openId.token_endpoint, {
    method: 'POST',
    headers: getShopifyTokenRequestHeaders(
      env.SHOPIFY_CLIENT_ID,
      env.SHOPIFY_CLIENT_SECRET,
      getShopifyAppOrigin(),
    ),
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: env.SHOPIFY_CLIENT_ID,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Token refresh failed (${response.status}): ${body}`);
  }

  return (await response.json()) as TokenResponse;
}

export async function revokeCustomerAccountRefreshToken(
  locale: string,
  refreshToken: string,
): Promise<void> {
  const env = getEnv();
  const region = getRegion(locale);
  const openId = await getOpenIdConfiguration(region.shopifyDomain);

  await fetch(openId.token_endpoint, {
    method: 'POST',
    headers: getShopifyTokenRequestHeaders(
      env.SHOPIFY_CLIENT_ID,
      env.SHOPIFY_CLIENT_SECRET,
      getShopifyAppOrigin(),
    ),
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: env.SHOPIFY_CLIENT_ID,
      refresh_token: refreshToken,
      action: 'revoke',
    }),
  });
}
