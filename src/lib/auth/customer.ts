import { cookies } from 'next/headers';

import { getEnv } from '@/lib/env';
import { getRegion } from '@/lib/regions';

export interface SessionCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface CustomerGraphQLResponse {
  data?: { customer: SessionCustomer | null };
}

export async function fetchCustomerByAccessToken(
  accessToken: string,
  locale: string
): Promise<SessionCustomer | null> {
  try {
    const env = getEnv();
    const region = getRegion(locale);

    const tokenMap: Record<string, string> = {
      US: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US,
      EU: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_EU,
      BR: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR,
      APAC: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_APAC,
    };
    const storefrontToken = tokenMap[region.code] ?? env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US;

    const query = `
      query GetCustomer($accessToken: String!) {
        customer(accessToken: $accessToken) {
          id
          email
          firstName
          lastName
          phone
        }
      }
    `;

    const response = await fetch(`https://${region.shopifyDomain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({ query, variables: { accessToken } }),
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const data = (await response.json()) as CustomerGraphQLResponse;
    return data.data?.customer ?? null;
  } catch {
    return null;
  }
}

/** Logged-in customer from session cookie, or null. */
export async function getSessionCustomer(locale: string): Promise<SessionCustomer | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  if (!accessToken) return null;
  return fetchCustomerByAccessToken(accessToken, locale);
}

/** Redis wishlist owner key — only for authenticated customers. */
export async function getWishlistOwnerId(locale: string): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  if (!accessToken) return null;

  const cachedId = cookieStore.get('shopify_customer_id')?.value;
  if (cachedId) return cachedId;

  const customer = await fetchCustomerByAccessToken(accessToken, locale);
  return customer?.id ?? null;
}
