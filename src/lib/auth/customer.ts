import { cookies } from 'next/headers';

import { getCustomerAccountApiConfiguration } from '@/lib/auth/customer-account-discovery';
import { getRegion } from '@/lib/regions';

export interface SessionCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface CustomerAccountCustomer {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddress?: { emailAddress?: string | null } | null;
  phoneNumber?: { phoneNumber?: string | null } | null;
}

interface CustomerGraphQLResponse {
  data?: { customer: CustomerAccountCustomer | null };
}

function mapCustomerAccountCustomer(customer: CustomerAccountCustomer): SessionCustomer {
  return {
    id: customer.id,
    email: customer.emailAddress?.emailAddress ?? '',
    firstName: customer.firstName ?? '',
    lastName: customer.lastName ?? '',
    phone: customer.phoneNumber?.phoneNumber ?? undefined,
  };
}

export async function fetchCustomerByAccessToken(
  accessToken: string,
  locale: string,
): Promise<SessionCustomer | null> {
  try {
    const region = getRegion(locale);
    const apiConfig = await getCustomerAccountApiConfiguration(region.shopifyDomain);

    const query = `
      query GetCustomer {
        customer {
          id
          firstName
          lastName
          emailAddress {
            emailAddress
          }
          phoneNumber {
            phoneNumber
          }
        }
      }
    `;

    const response = await fetch(apiConfig.graphql_api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as CustomerGraphQLResponse;
    const customer = data.data?.customer;
    if (!customer) return null;

    return mapCustomerAccountCustomer(customer);
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
