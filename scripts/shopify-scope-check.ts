import { readFileSync } from 'node:fs';

import { getEnv } from '../src/lib/env';
import { getRedisClient } from '../src/lib/redis/client';
import { getShopifyClient } from '../src/lib/shopify/client';

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
  const env = getEnv();
  const domain = env.SHOPIFY_STORE_DOMAIN_US;

  const tokenRes = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: env.SHOPIFY_CLIENT_ID,
      client_secret: env.SHOPIFY_CLIENT_SECRET,
    }),
  });
  const tokenBody = await tokenRes.json();
  console.log('admin token status:', tokenRes.status, tokenBody.scope ?? tokenBody.error);

  if (!tokenBody.access_token) return;

  const scopesQuery = `{ currentAppInstallation { accessScopes { handle } } }`;
  const scopesRes = await fetch(`https://${domain}/admin/api/${env.SHOPIFY_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': tokenBody.access_token,
    },
    body: JSON.stringify({ query: scopesQuery }),
  });
  const scopesData = await scopesRes.json();
  console.log('granted scopes:', scopesData.data?.currentAppInstallation?.accessScopes?.map((s: { handle: string }) => s.handle));

  const redis = getRedisClient();
  await redis.del('shopify:storefront_token:US');

  const client = getShopifyClient('en');
  try {
    const menu = await client.execute<{ menu: { title: string; items: Array<{ title: string; url: string }> } | null }>(
      `query { menu(handle: \"main-menu\") { title items { title url type } } }`
    );
    console.log('menu main-menu:', menu.menu ? JSON.stringify(menu.menu, null, 2) : 'null');
  } catch (error) {
    console.log('menu error:', error instanceof Error ? error.message.slice(0, 500) : error);
  }
}

main().catch(console.error);
