import { cookies } from 'next/headers';

import { getCustomerAccountApiConfiguration } from '@/lib/auth/customer-account-discovery';
import { getRegion } from '@/lib/regions';

interface GraphQLError {
  message: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

export async function getCustomerAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value ?? null;
}

export async function executeCustomerAccountQuery<T>(
  locale: string,
  query: string,
  variables?: Record<string, unknown>,
  accessTokenOverride?: string,
): Promise<T> {
  const accessToken = accessTokenOverride ?? (await getCustomerAccessToken());
  if (!accessToken) {
    throw new Error('Customer Account API: not authenticated');
  }

  const region = getRegion(locale);
  const apiConfig = await getCustomerAccountApiConfiguration(region.shopifyDomain);

  const response = await fetch(apiConfig.graphql_api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
    signal: AbortSignal.timeout(5_000),
  });

  if (!response.ok) {
    throw new Error(`Customer Account API HTTP ${response.status}`);
  }

  const json = (await response.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? 'Customer Account API error');
  }
  if (!json.data) {
    throw new Error('Customer Account API: empty response');
  }

  return json.data;
}
