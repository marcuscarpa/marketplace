import { NextResponse } from 'next/server';

export const AUTH_SESSION_COOKIES = [
  'access_token',
  'refresh_token',
  'access_token_hash',
  'id_token',
  'shopify_customer_id',
  'shopify_locale',
] as const;

export function clearAuthSessionCookies(response: NextResponse): void {
  AUTH_SESSION_COOKIES.forEach((name) => {
    response.cookies.set(name, '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  });
}
