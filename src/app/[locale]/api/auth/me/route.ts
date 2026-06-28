import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getEnv } from '@/lib/env';
import { getRegion } from '@/lib/regions';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface CustomerResponse {
  customer: Customer;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const locale = cookieStore.get('shopify_locale')?.value || 'en';

  if (!accessToken) {
    return NextResponse.json({ customer: null });
  }

  try {
    const env = getEnv();
    const region = getRegion(locale);

    const tokenMap: Record<string, string> = {
      US: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US,
      EU: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_EU,
      BR: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR,
      APAC: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_APAC,
    };
    const storefrontToken = tokenMap[region.code] ?? env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US;

    const query = `
      query GetCustomer($accessToken: String!) {
        customer(accessToken: $accessToken) {
          id
          email
          firstName
          lastName
          phone
        }
      }
    `;

    const response = await fetch(`https://${region.shopifyDomain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({
        query,
        variables: { accessToken },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ customer: null });
    }

    const data = (await response.json()) as { data?: CustomerResponse };

    return NextResponse.json({
      customer: data.data?.customer ?? null,
    });
  } catch {
    return NextResponse.json({ customer: null });
  }
}