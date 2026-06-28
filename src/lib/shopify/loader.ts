import { getCatalogProductByHandle } from '@/lib/catalog/catalog';
import type { CatalogProduct } from '@/lib/catalog/data';

import { getShopifyClient, isShopifyConfigured } from './client';
import { parseLuxuryMetafields } from './metafields';
import { GET_PRODUCT_BY_HANDLE } from './queries';
import { ShopifyProduct, ShopifyProductOption, ShopifyProductVariant } from './types';

type EnrichedShopifyProduct = ShopifyProduct & { luxury: ReturnType<typeof parseLuxuryMetafields> };

const SHOE_SIZES = ['36', '37', '38', '39', '40', '41'];
const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const ALIGHT_WEDGE_PECAN =
  'https://www.zimmermann.com/media/catalog/product/1/_/1.6791fs26a1.pecn.pecan.jpg?quality=100&bg-color=255,255,255&fit=bounds&height=755&width=581&canvas=581:755';
const ALIGHT_WEDGE_MILK =
  'https://www.zimmermann.com/media/catalog/product/1/_/1.6791fs26a1.milk.milk.jpg?quality=100&bg-color=255,255,255&fit=bounds&height=755&width=581&canvas=581:755';

interface VariantPreset {
  gallery: string[];
  colors: Array<{ name: string; image: string }>;
  sizes: string[];
}

const VARIANT_PRESETS: Record<string, VariantPreset> = {
  'alight-wedge-100': {
    gallery: [ALIGHT_WEDGE_PECAN, ALIGHT_WEDGE_MILK],
    colors: [
      { name: 'Pecan', image: ALIGHT_WEDGE_PECAN },
      { name: 'Milk', image: ALIGHT_WEDGE_MILK },
    ],
    sizes: SHOE_SIZES,
  },
};

function exampleColorsFor(product: CatalogProduct): Array<{ name: string; image: string }> {
  const preset = VARIANT_PRESETS[product.handle];
  if (preset) return preset.colors;

  // ponytail: demo colors until Shopify provides real options
  const colors: Array<{ name: string; image: string }> = [
    { name: 'Black', image: product.image },
  ];
  if (product.hoverImage) {
    colors.push({ name: 'Natural', image: product.hoverImage });
  }
  return colors;
}

function sizesFor(product: CatalogProduct): string[] {
  const preset = VARIANT_PRESETS[product.handle];
  if (preset) return preset.sizes;
  return /wedge|shoe|sandal|boot|heel/i.test(product.title)
    ? SHOE_SIZES
    : APPAREL_SIZES;
}

function buildCatalogVariants(
  product: CatalogProduct,
  amount: string
): { options: ShopifyProductOption[]; variants: ShopifyProductVariant[] } {
  const id = `catalog-${product.handle}`;
  const colors = exampleColorsFor(product);
  const sizes = sizesFor(product);

  const options: ShopifyProductOption[] = [
    { name: 'Color', values: colors.map((c) => c.name) },
    { name: 'Size', values: sizes },
  ];
  const variants: ShopifyProductVariant[] = [];

  for (const color of colors) {
    for (const size of sizes) {
      variants.push({
        id: `gid://shopify/ProductVariant/${id}-${color.name.toLowerCase().replace(/\s+/g, '-')}-${size}`,
        availableForSale: !product.soldOut,
        quantityAvailable: product.soldOut ? 0 : 10,
        price: { amount, currencyCode: 'EUR' },
        selectedOptions: [
          { name: 'Color', value: color.name },
          { name: 'Size', value: size },
        ],
        image: { url: color.image, altText: `${product.title} — ${color.name}` },
      });
    }
  }

  return { options, variants };
}

function catalogProductAsShopify(product: CatalogProduct): EnrichedShopifyProduct {
  const amount = product.price.replace(/[^\d]/g, '') || '0';
  const id = `catalog-${product.handle}`;
  const preset = VARIANT_PRESETS[product.handle];
  const galleryUrls =
    preset?.gallery ??
    [product.image, ...(product.hoverImage ? [product.hoverImage] : [])].filter(Boolean);
  const { options, variants } = buildCatalogVariants(product, amount);

  return {
    id,
    title: product.title,
    description:
      product.handle === 'alight-wedge-100'
        ? 'The Alight Wedge 100 — sculptural platform sandal crafted in Italy.'
        : product.category,
    handle: product.handle,
    vendor: 'House',
    images: {
      nodes: galleryUrls.map((url, index) => ({
        url,
        altText: index === 0 ? product.title : `${product.title} — view ${index + 1}`,
      })),
    },
    options,
    priceRange: { minVariantPrice: { amount, currencyCode: 'EUR' } },
    variants: { nodes: variants },
    metafields: [],
    luxury: parseLuxuryMetafields([]),
  };
}

const PRODUCT_FIELDS = `
  id
  title
  description
  handle
  vendor
  images(first: 8) { nodes { url altText } }
  options { name values }
  priceRange { minVariantPrice { amount currencyCode } }
  variants(first: 100) {
    nodes {
      id
      availableForSale
      quantityAvailable
      price { amount currencyCode }
      selectedOptions { name value }
      image { url altText }
      shopPayInstallmentsPricing {
        eligible
        installmentsCount { count }
        pricePerTerm { amount currencyCode }
        fullPrice { amount currencyCode }
      }
    }
  }
  metafields(identifiers: [
    { namespace: "luxury", key: "certificate_hash" }
    { namespace: "luxury", key: "materials" }
    { namespace: "luxury", key: "made_in" }
    { namespace: "luxury", key: "video_360_url" }
    { namespace: "luxury", key: "limited_edition_number" }
    { namespace: "luxury", key: "care_instructions" }
    { namespace: "reviews", key: "average_rating" }
    { namespace: "reviews", key: "total_reviews" }
  ])
`;

function buildBatchQuery(handles: string[]): string {
  const aliases = handles.map((h, i) => `p${i}: product(handle: $h${i}) { ${PRODUCT_FIELDS} }`).join('\n');
  const variables = handles.map((_, i) => `$h${i}: String!`).join(', ');
  return `query GetProductsByHandles(${variables}) { ${aliases} }`;
}

function parseBatchResponse<T>(data: Record<string, T | null>): Array<T | null> {
  return Object.values(data).map((p) => p as T | null);
}

export async function getProductByHandle(
  handle: string,
  locale: string
): Promise<EnrichedShopifyProduct | null> {
  if (isShopifyConfigured(locale)) {
    try {
      const client = getShopifyClient(locale);
      const data = await client.execute<{ product: ShopifyProduct | null }>(
        GET_PRODUCT_BY_HANDLE,
        { handle }
      );

      if (data?.product) {
        return {
          ...data.product,
          options: data.product.options ?? [],
          luxury: parseLuxuryMetafields(data.product.metafields),
        };
      }
    } catch {
      // ponytail: fall through to static catalog when Shopify is unreachable
    }
  }

  const catalog = getCatalogProductByHandle(handle);
  return catalog ? catalogProductAsShopify(catalog) : null;
}

export async function getProductsByHandles(
  handles: string[],
  locale: string
): Promise<Array<ShopifyProduct & { luxury: ReturnType<typeof parseLuxuryMetafields> }>> {
  if (handles.length === 0) return [];

  const client = getShopifyClient(locale);
  const variables: Record<string, string> = {};
  handles.forEach((h, i) => { variables[`h${i}`] = h; });

  const query = buildBatchQuery(handles);
  const data = await client.execute<Record<string, ShopifyProduct | null>>(query, variables);

  const results = parseBatchResponse(data);
  return results
    .map((p) => {
      if (!p) return null;
      return {
        ...p,
        luxury: parseLuxuryMetafields(p.metafields ?? []),
      };
    })
    .filter(Boolean) as Array<ShopifyProduct & { luxury: ReturnType<typeof parseLuxuryMetafields> }>;
}