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

const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN_US;
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? '2026-04';

async function getAdminToken() {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { throw new Error(`admin token ${res.status}: ${text.slice(0, 500)}`); }
  if (!res.ok) throw new Error(`admin token ${res.status}: ${JSON.stringify(body)}`);
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
  if (!res.ok) throw new Error(`graphql ${res.status}: ${JSON.stringify(body)}`);
  if (body.errors?.length) throw new Error(JSON.stringify(body.errors));
  return body.data;
}

async function createStorefrontToken(adminToken) {
  const data = await adminGraphql(
    adminToken,
    `mutation CreateStorefrontToken($input: StorefrontAccessTokenInput!) {
      storefrontAccessTokenCreate(input: $input) {
        storefrontAccessToken { accessToken title }
        userErrors { field message }
      }
    }`,
    { input: { title: 'Sinesia Headless Frontend' } }
  );
  const result = data.storefrontAccessTokenCreate;
  if (result.userErrors?.length) throw new Error(JSON.stringify(result.userErrors));
  return result.storefrontAccessToken.accessToken;
}

async function testStorefront(storefrontToken) {
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({
      query: `{ products(first: 3) { nodes { handle title } } }`,
    }),
  });
  const body = await res.json();
  console.log('storefront test', JSON.stringify(body, null, 2));
}

const adminToken = await getAdminToken();
console.log('admin token ok');
const storefrontToken = await createStorefrontToken(adminToken);
console.log('storefront token:', storefrontToken);
await testStorefront(storefrontToken);
