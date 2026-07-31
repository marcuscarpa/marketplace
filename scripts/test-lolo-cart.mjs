import { readFileSync } from 'node:fs';

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

loadEnvLocal();

const { getShopifyClient } = await import('../src/lib/shopify/client.ts');
const { CART_CREATE } = await import('../src/lib/shopify/queries.ts');

const client = getShopifyClient('en');
const variantId = 'gid://shopify/ProductVariant/43034847117447';

try {
  const result = await client.execute(CART_CREATE, {
    input: { lines: [{ merchandiseId: variantId, quantity: 1 }] },
  });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error('ERR', error instanceof Error ? error.message : error);
}
