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

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN_US;
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? '2026-04';
const REVOCABLE = new Set(['Sinesia Headless Frontend', 'stock-check']);

async function getAdminToken() {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
    }),
  });
  const body = await res.json();
  if (!res.ok || !body.access_token) throw new Error(JSON.stringify(body));
  return body.access_token;
}

async function adminGraphql(adminToken, query, variables = {}) {
  const res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.json();
  if (!res.ok || body.errors?.length) throw new Error(JSON.stringify(body.errors ?? body));
  return body.data;
}

const adminToken = await getAdminToken();
const list = await adminGraphql(
  adminToken,
  `{ shop { storefrontAccessTokens(first: 50) { nodes { id title createdAt } } } }`
);

console.log('existing tokens:', list.shop.storefrontAccessTokens.nodes.length);

for (const node of list.shop.storefrontAccessTokens.nodes.filter((n) => REVOCABLE.has(n.title))) {
  await adminGraphql(
    adminToken,
    `mutation DeleteToken($input: StorefrontAccessTokenDeleteInput!) {
      storefrontAccessTokenDelete(input: $input) {
        deletedStorefrontAccessTokenId
        userErrors { message }
      }
    }`,
    { input: { id: node.id } }
  );
  console.log('deleted:', node.title);
}

const created = await adminGraphql(
  adminToken,
  `mutation CreateToken($input: StorefrontAccessTokenInput!) {
    storefrontAccessTokenCreate(input: $input) {
      storefrontAccessToken { accessToken title }
      userErrors { message }
    }
  }`,
  { input: { title: 'Sinesia Headless Frontend' } }
);

const result = created.storefrontAccessTokenCreate;
if (result.userErrors?.length) {
  console.error('create failed:', result.userErrors);
  process.exit(1);
}

console.log('created token:', result.storefrontAccessToken.accessToken);
