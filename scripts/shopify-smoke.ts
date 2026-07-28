import { readFileSync } from 'node:fs';
import { getShopifyClient, isShopifyConfigured } from '../src/lib/shopify/client';
import { GET_PRODUCT_BY_HANDLE, PRODUCT_RECOMMENDATIONS, CART_CREATE } from '../src/lib/shopify/queries';

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

  const locale = 'en';
  console.log('configured:', isShopifyConfigured(locale));

  const client = getShopifyClient(locale);

  const product = await client.execute<{ product: { id: string; title: string; handle: string; variants: { nodes: Array<{ id: string }> } } | null }>(
    GET_PRODUCT_BY_HANDLE,
    { handle: 'cora-bikini-top' }
  );
  console.log('pdp cora-bikini-top:', product.product ? { title: product.product.title, variants: product.product.variants.nodes.length } : 'NOT FOUND');

  const anyProduct = await client.execute<{ products: { nodes: Array<{ id: string; handle: string; title: string; variants: { nodes: Array<{ id: string }> } }> } }>(
    `{ products(first: 1) { nodes { id handle title variants(first: 1) { nodes { id } } } } }`
  );
  const sample = anyProduct.products.nodes[0];
  console.log('sample product:', sample ? { handle: sample.handle, title: sample.title } : null);

  if (sample) {
    const recs = await client.execute<{ productRecommendations: Array<{ handle: string; title: string }> }>(
      PRODUCT_RECOMMENDATIONS,
      { productId: sample.id }
    );
    console.log('recommendations:', recs.productRecommendations?.slice(0, 3).map((p) => p.handle) ?? []);

    const variantId = sample.variants.nodes[0]?.id;
    if (variantId) {
      const cart = await client.execute<{ cartCreate: { cart: { id: string; totalQuantity: number; checkoutUrl: string } | null; userErrors: Array<{ message: string }> } }>(
        CART_CREATE,
        { input: { lines: [{ merchandiseId: variantId, quantity: 1 }] } }
      );
      console.log('cart:', cart.cartCreate.userErrors?.length
        ? { errors: cart.cartCreate.userErrors }
        : { id: cart.cartCreate.cart?.id, qty: cart.cartCreate.cart?.totalQuantity, checkout: !!cart.cartCreate.cart?.checkoutUrl });
    }
  }
}

main().catch((error) => {
  console.error('smoke failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
