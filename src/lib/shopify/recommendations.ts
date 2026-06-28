import { getCachedOrFetch } from '@/lib/cache/stampede';
import { getShopifyClient } from '@/lib/shopify/client';
import { PRODUCT_RECOMMENDATIONS } from '@/lib/shopify/queries';

interface RecommendationResult {
  id: string;
  title: string;
  handle: string;
  images: { nodes: Array<{ url: string; altText: string | null }> };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
}

interface RecommendationsResponse {
  productRecommendations: RecommendationResult[];
}

export async function getProductRecommendations(
  productId: string,
  locale: string,
  maxResults = 8
): Promise<RecommendationResult[]> {
  const cacheKey = `recommendations:${productId}:${locale}`;

  const client = getShopifyClient(locale);

  const results = await getCachedOrFetch<RecommendationResult[]>(cacheKey, async () => {
    const data = await client.execute<RecommendationsResponse>(
      PRODUCT_RECOMMENDATIONS,
      { productId }
    );
    return data?.productRecommendations ?? [];
  }, 3600);

  return results.slice(0, maxResults);
}

export interface RecommendationEnriched extends RecommendationResult {
  formattedPrice: string;
}

export async function getProductRecommendationsWithFormatting(
  productId: string,
  locale: string
): Promise<RecommendationEnriched[]> {
  const results = await getProductRecommendations(productId, locale);
  const currency = locale === 'pt' ? 'BRL' : 'USD';
  const localeFormat = locale === 'pt' ? 'pt-BR' : 'en-US';

  return results.map((product) => ({
    ...product,
    formattedPrice: new Intl.NumberFormat(localeFormat, {
      style: 'currency',
      currency,
    }).format(Number(product.priceRange.minVariantPrice.amount)),
  }));
}