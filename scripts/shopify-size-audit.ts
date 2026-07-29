import { readFileSync } from 'node:fs';

type ProductNode = {
  handle: string;
  title: string;
  productType: string;
  tags: string[];
  collections: { nodes: Array<{ handle: string; title: string }> };
  options: Array<{ name: string; values: string[] }>;
};

type SizeAuditResponse = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: ProductNode[];
  };
};

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
  const client = getShopifyClient('en');

  const query = `query SizeAudit($cursor: String) {
    products(first: 50, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      nodes {
        handle
        title
        productType
        tags
        collections(first: 15) { nodes { handle title } }
        options { name values }
      }
    }
  }`;

  let cursor: string | null = null;
  const all: ProductNode[] = [];

  for (let page = 0; page < 20; page++) {
    const res: SizeAuditResponse = await client.execute<SizeAuditResponse>(query, { cursor });
    all.push(...res.products.nodes);
    if (!res.products.pageInfo.hasNextPage) break;
    cursor = res.products.pageInfo.endCursor;
  }

  console.log('TOTAL PRODUCTS', all.length);

  const byType: Record<string, number> = {};
  const sizeByType: Record<string, Set<string>> = {};
  const collSizes: Record<string, Set<string>> = {};
  const allSizes = new Set<string>();

  for (const product of all) {
    const productType = product.productType?.trim() || '(empty)';
    byType[productType] = (byType[productType] ?? 0) + 1;

    const sizeOpt = product.options?.find((opt) => /size|tamanho/i.test(opt.name));
    if (!sizeOpt) continue;

    for (const value of sizeOpt.values) {
      allSizes.add(value);
      (sizeByType[productType] ??= new Set()).add(value);

      for (const collection of product.collections?.nodes ?? []) {
        (collSizes[collection.handle] ??= new Set()).add(value);
      }
    }
  }

  console.log('\nPRODUCT TYPES:');
  console.log(JSON.stringify(byType, null, 2));

  console.log('\nALL UNIQUE SIZES:', [...allSizes].sort().join(', '));

  console.log('\nSIZES BY PRODUCT TYPE:');
  for (const [type, sizes] of Object.entries(sizeByType).sort()) {
    console.log(`  ${type}: ${[...sizes].sort().join(', ')}`);
  }

  console.log('\nSIZES BY COLLECTION:');
  for (const [handle, sizes] of Object.entries(collSizes).sort()) {
    console.log(`  ${handle}: ${[...sizes].sort().join(', ')}`);
  }

  console.log('\nSAMPLE PRODUCTS WITH SIZES:');
  for (const product of all.filter((p) => p.options?.some((o) => /size|tamanho/i.test(o.name))).slice(0, 15)) {
    const sizeOpt = product.options!.find((o) => /size|tamanho/i.test(o.name))!;
    console.log(
      `  ${product.handle} | type=${product.productType || '-'} | sizes=${sizeOpt.values.join('/')} | tags=${(product.tags ?? []).slice(0, 5).join(', ')}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
