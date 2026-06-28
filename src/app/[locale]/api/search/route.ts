import { z } from 'zod';

import { searchProductsWithFallback } from '@/lib/shopify/search';

const searchSchema = z.object({
  q: z.string().min(2, 'Query must be at least 2 characters'),
  locale: z.string().default('en'),
  first: z.coerce.number().int().min(1).max(50).default(6),
});

export async function GET(request: Request) {
  const url = new URL(request.url);

  const parsed = searchSchema.safeParse({
    q: url.searchParams.get('q') ?? '',
    locale: url.searchParams.get('locale') ?? 'en',
    first: url.searchParams.get('first') ?? '6',
  });

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues.map((i) => i.message).join(', ') },
      { status: 400 }
    );
  }

  try {
    const results = await searchProductsWithFallback(
      parsed.data.q,
      parsed.data.locale,
      parsed.data.first
    );

    return Response.json({ results });
  } catch {
    return Response.json({ error: 'Search failed' }, { status: 500 });
  }
}
