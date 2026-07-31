import { readFileSync } from 'node:fs';

function loadEnvLocal() {
  const raw = readFileSync('.env.local', 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    process.env[trimmed.slice(0, idx).trim()] ??= trimmed.slice(idx + 1).trim();
  }
}

loadEnvLocal();

const domain = process.env.SHOPIFY_STORE_DOMAIN_US;
const version = process.env.SHOPIFY_API_VERSION ?? '2026-04';
const tokenArg = process.argv[2];
const token = tokenArg ?? process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US;

if (!domain || !token || token === 'auto') {
  console.error('Need domain and static token (pass as argv[2] or set in env)');
  process.exit(1);
}

const query = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id totalQuantity checkoutUrl }
      userErrors { message }
    }
  }
`;

const response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': token,
  },
  body: JSON.stringify({
    query,
    variables: {
      input: {
        lines: [{ merchandiseId: 'gid://shopify/ProductVariant/43034847117447', quantity: 1 }],
      },
    },
  }),
});

const body = await response.json();
console.log(JSON.stringify(body, null, 2));
