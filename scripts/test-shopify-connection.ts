import { readFileSync } from 'node:fs';
import { resolveStorefrontAccessToken } from '../src/lib/shopify/token';

function loadEnvLocal() {
  const raw = readFileSync('.env.local', 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();

  const domain = process.env.SHOPIFY_STORE_DOMAIN_US;
  const staticToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US;
  const apiVersion = process.env.SHOPIFY_API_VERSION ?? '2026-04';

  if (!domain) throw new Error('Missing SHOPIFY_STORE_DOMAIN_US');

  const token = await resolveStorefrontAccessToken('US', domain, staticToken);
  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({
      query: `{ products(first: 3) { nodes { handle title } } }`,
    }),
  });
  const body = await res.json();
  console.log(
    JSON.stringify(
      { ok: res.ok, tokenPrefix: token.slice(0, 8), products: body.data?.products?.nodes ?? body.errors ?? body },
      null,
      2
    )
  );
  if (!res.ok || body.errors) process.exit(1);
}

main().catch((error) => {
  console.error('Shopify connection failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
