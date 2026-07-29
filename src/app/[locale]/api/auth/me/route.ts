import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { fetchCustomerByAccessToken } from '@/lib/auth/customer';
import { clearAuthSessionCookies } from '@/lib/auth/session-cookies';

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
    if (!customer) {
      const response = NextResponse.json({ customer: null });
      clearAuthSessionCookies(response);
      return response;
    }

    return NextResponse.json({ customer });
  } catch {
    const response = NextResponse.json({ customer: null });
    clearAuthSessionCookies(response);
    return response;
  }
}
