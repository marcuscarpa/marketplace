import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { fetchCustomerByAccessToken } from '@/lib/auth/customer';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const sessionLocale = cookieStore.get('shopify_locale')?.value || locale;

  if (!accessToken) {
    return NextResponse.json({ customer: null });
  }

  try {
    const customer = await fetchCustomerByAccessToken(accessToken, sessionLocale);
    return NextResponse.json({ customer });
  } catch {
    return NextResponse.json({ customer: null });
  }
}
