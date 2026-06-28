import crypto from 'crypto';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getEnv } from '@/lib/env';
import { getRegion } from '@/lib/regions';

function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

function safeRedirectPath(path: string, locale: string): string {
  if (!path || typeof path !== 'string') return `/${locale}/account`;
  if (path.startsWith('//')) return `/${locale}/account`;
  if (/^https?:\/\//i.test(path)) return `/${locale}/account`;
  if (!path.startsWith('/')) return `/${locale}/account`;
  if (path.includes('\n') || path.includes('\r')) return `/${locale}/account`;
  return path;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const url = new URL(request.url);
  const redirectParam = url.searchParams.get('redirect') || '/account';
  const redirectTo = safeRedirectPath(redirectParam, locale);

  const env = getEnv();
  const region = getRegion(locale);

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = crypto.randomBytes(16).toString('hex');

  const shopDomain = region.shopifyDomain;

  const authUrl = new URL(`https://${shopDomain}/auth/oauth/authorize`);
  authUrl.searchParams.set('client_id', env.SHOPIFY_CLIENT_ID);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${url.host}`;
  const callbackPath = `/${locale}/api/auth/oauth/callback`;
  authUrl.searchParams.set('redirect_uri', `${appUrl.replace(/\/$/, '')}${callbackPath}`);
  authUrl.searchParams.set('scope', 'read_customer, write_customer');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('state', state);

  const cookieStore = await cookies();
  cookieStore.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  cookieStore.set('oauth_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  cookieStore.set('oauth_redirect', redirectTo, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });

  return NextResponse.redirect(authUrl.toString());
}