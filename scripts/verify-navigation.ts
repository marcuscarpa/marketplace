import { readFileSync } from 'node:fs';

import { getRedisClient } from '../src/lib/redis/client';
import { getShopifyNavigation } from '../src/lib/shopify/navigation';

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
  const redis = getRedisClient();
  const keys = [...(await redis.keys('navigation:*')), ...(await redis.keys('shopify:storefront_token:*'))];
  for (const key of keys) await redis.del(key);
  console.log('cleared keys:', keys);

  const nav = await getShopifyNavigation('en');
  console.log('source:', nav.source);
  console.log('mainNav:', nav.mainNav.map((i) => `${i.label} -> ${i.href}`).join('\n  '));
  console.log('drawer links:', nav.menuSections.products.links.length);
}

main().catch(console.error);
