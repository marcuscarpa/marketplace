import { readFileSync } from 'fs';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

function loadEnv() {
  for (const f of ['.env.local', '.env.development']) {
    try {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m && !process.env[m[1]]) {
          process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
        }
      }
    } catch {
      // ignore missing env files
    }
  }
}

loadEnv();

const domain = process.env.SHOPIFY_STORE_DOMAIN_US;
let token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US;
const version = process.env.SHOPIFY_API_VERSION || '2026-04';
const clientId = process.env.SHOPIFY_CLIENT_ID;
const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

async function resolveToken() {
  if (token && token !== 'auto') return token;
  if (!domain || !clientId || !clientSecret) return null;
  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const body = await res.json();
  if (!body.access_token) throw new Error('Admin token failed: ' + JSON.stringify(body));
  const gql = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': body.access_token,
    },
    body: JSON.stringify({
      query: `mutation { storefrontAccessTokenCreate(input: { title: "stock-check" }) {
        storefrontAccessToken { accessToken }
        userErrors { message }
      }}`,
    }),
  });
  const gqlBody = await gql.json();
  const sf = gqlBody.data?.storefrontAccessTokenCreate?.storefrontAccessToken?.accessToken;
  if (!sf) throw new Error('Storefront token failed: ' + JSON.stringify(gqlBody));
  return sf;
}

token = await resolveToken();
if (!domain || !token) {
  console.log('SKIP: could not resolve Shopify credentials');
  process.exit(0);
}

const client = createStorefrontApiClient({
  storeDomain: domain,
  apiVersion: version,
  publicAccessToken: token,
});

const query = `
  query ProductStock($handle: String!) {
    product(handle: $handle) {
      title
      handle
      totalInventory
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
          quantityAvailable
          selectedOptions { name value }
        }
      }
    }
  }
`;

const handles = ['neia-bikini-top-pistachio', 'michelle-pareo-poa-pistachio-copy-1'];

for (const handle of handles) {
  const { data, errors } = await client.request(query, { variables: { handle } });
  if (errors) {
    console.log(handle, 'ERR', JSON.stringify(errors));
    continue;
  }
  const product = data?.product;
  if (!product) {
    console.log(handle, 'NOT FOUND');
    continue;
  }
  console.log(`\n=== ${product.title} (${handle}) ===`);
  console.log('totalInventory:', product.totalInventory);
  for (const variant of product.variants.nodes) {
    const size = variant.selectedOptions?.find((o) => /size/i.test(o.name))?.value ?? variant.title;
    console.log(
      `  ${size} | availableForSale: ${variant.availableForSale} | quantityAvailable: ${variant.quantityAvailable}`
    );
  }
}
