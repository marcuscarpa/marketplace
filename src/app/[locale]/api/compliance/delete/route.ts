import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { checkRateLimit } from '@/lib/security/bot-protection';
import { getEnv } from '@/lib/env';
import { createDeletionRequest } from '@/lib/compliance/audit';

async function validateTokenOwnsUserId(
  accessToken: string,
  shopifyDomain: string,
  storefrontToken: string,
  userId: string
): Promise<boolean> {
  try {
    const res = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({
        query: `query GetCustomer($accessToken: String!) { customer(accessToken: $accessToken) { id } }`,
        variables: { accessToken },
      }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { data?: { customer?: { id: string } } };
    return data.data?.customer?.id === userId;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';
  const { blocked } = await checkRateLimit(ip);
  if (blocked) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const locale = cookieStore.get('shopify_locale')?.value || 'en';

    if (!accessToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const userId = body.userId;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const env = getEnv();
    const tokenMap: Record<string, string> = {
      US: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US,
      EU: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_EU,
      BR: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR,
      APAC: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_APAC,
    };
    const region = locale === 'pt' ? 'BR' : 'US';
    const storefrontToken = tokenMap[region] ?? env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US;

    const isOwner = await validateTokenOwnsUserId(
      accessToken,
      region === 'BR' ? env.SHOPIFY_STORE_DOMAIN_BR : env.SHOPIFY_STORE_DOMAIN_US,
      storefrontToken,
      userId
    );

    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden: token does not own userId' }, { status: 403 });
    }

    const requestId = await createDeletionRequest(userId);

    return NextResponse.json({
      deleted: true,
      requestId,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process deletion request' },
      { status: 500 }
    );
  }
}
