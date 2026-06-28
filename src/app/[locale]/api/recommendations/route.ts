import { z } from 'zod';

import { getProductRecommendations } from '@/lib/shopify/recommendations';

const recommendationsSchema = z.object({
  productId: z.string().min(1),
  locale: z.string().default('en'),
  first: z.coerce.number().int().min(1).max(20).default(8),
});

export async function GET(request: Request) {
  const url = new URL(request.url);

  const parsed = recommendationsSchema.safeParse({
    productId: url.searchParams.get('productId') ?? '',
    locale: url.searchParams.get('locale') ?? 'en',
    first: url.searchParams.get('first') ?? '8',
  });

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues.map((i) => i.message).join(', ') },
      { status: 400 }
    );
  }

  try {
    const results = await getProductRecommendations(
      parsed.data.productId,
      parsed.data.locale,
      parsed.data.first
    );

    return Response.json({ results });
  } catch {
    return Response.json({ results: [] });
  }
}