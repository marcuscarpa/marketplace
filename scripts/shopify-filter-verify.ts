import { readFileSync } from 'node:fs';

import {
  extractFacets,
  shopifyToFilterable,
} from '../src/lib/product-filters';

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
  const { getShopifyClient } = await import('../src/lib/shopify/client');
  const { GET_COLLECTION_BY_HANDLE } = await import('../src/lib/shopify/queries');
  const client = getShopifyClient('en');

  for (const handle of ['mens-collection', 'dresses', 'swimwear', 'shoes', 'shop-all']) {
    const res = await client.execute<{
      collection: { title: string; products: { nodes: Parameters<typeof shopifyToFilterable>[0][] } } | null;
    }>(GET_COLLECTION_BY_HANDLE, { handle, first: 50 });

    if (!res.collection) {
      console.log(`\n${handle}: not found`);
      continue;
    }

    const filterable = res.collection.products.nodes.map(shopifyToFilterable);
    const facets = extractFacets(filterable);

    console.log(`\n=== ${res.collection.title} (${handle}) ===`);
    console.log('Roupas:', facets.sizes.clothing.join(', ') || '—');
    console.log('Calçados:', facets.sizes.shoes.join(', ') || '—');
    console.log('Acessórios:', facets.sizes.accessories.join(', ') || '—');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
