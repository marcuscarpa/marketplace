export interface OpenIdConfiguration {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
  issuer?: string;
}

export interface CustomerAccountApiConfiguration {
  graphql_api: string;
}

type CacheEntry<T> = { value: T; expiresAt: number };

const TTL_MS = 60 * 60 * 1000;
const openIdCache = new Map<string, CacheEntry<OpenIdConfiguration>>();
const apiCache = new Map<string, CacheEntry<CustomerAccountApiConfiguration>>();

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Discovery request failed (${response.status}) for ${url}`);
  }

  return (await response.json()) as T;
}

export async function getOpenIdConfiguration(shopDomain: string): Promise<OpenIdConfiguration> {
  const cached = openIdCache.get(shopDomain);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const config = await fetchJson<OpenIdConfiguration>(
    `https://${shopDomain}/.well-known/openid-configuration`,
  );

  openIdCache.set(shopDomain, { value: config, expiresAt: Date.now() + TTL_MS });
  return config;
}

export async function getCustomerAccountApiConfiguration(
  shopDomain: string,
): Promise<CustomerAccountApiConfiguration> {
  const cached = apiCache.get(shopDomain);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const config = await fetchJson<CustomerAccountApiConfiguration>(
    `https://${shopDomain}/.well-known/customer-account-api`,
  );

  apiCache.set(shopDomain, { value: config, expiresAt: Date.now() + TTL_MS });
  return config;
}

/** ponytail: test-only */
export function resetCustomerAccountDiscoveryCache(): void {
  openIdCache.clear();
  apiCache.clear();
}
