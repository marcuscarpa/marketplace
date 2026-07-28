import { readFileSync } from 'node:fs';

import { getShopifyClient } from '../src/lib/shopify/client';
import { GET_COLLECTIONS } from '../src/lib/shopify/queries';

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
  const client = getShopifyClient('en');

  const collections = await client.execute<{ collections: { nodes: Array<{ handle: string; title: string }> } }>(
    GET_COLLECTIONS,
    { first: 50 }
  );
  console.log('COLLECTIONS:');
  for (const c of collections.collections.nodes) {
    console.log(`  - ${c.handle} :: ${c.title}`);
  }

  const menuHandles = ['main-menu', 'footer', 'header-menu', 'main', 'navigation', 'main-navigation'];
  for (const handle of menuHandles) {
    try {
      const menu = await client.execute<{
        menu: {
          id: string;
          title: string;
          items: Array<{ title: string; url: string; type: string; items?: Array<{ title: string; url: string }> }>;
        } | null;
      }>(
        `query Menu($handle: String!) {
          menu(handle: $handle) {
            id
            title
            items { title url type items { title url type } }
          }
        }`,
        { handle }
      );
      if (menu.menu) {
        console.log(`\nMENU "${handle}":`);
        console.log(JSON.stringify(menu.menu, null, 2));
      }
    } catch {
      console.log(`MENU "${handle}": unavailable (needs unauthenticated_read_content scope)`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
