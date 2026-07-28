export function sanitizeLoginHint(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== 'string') return null;

  const email = raw.trim().toLowerCase();
  if (email.length === 0 || email.length > 254) return null;
  if (/[\s\r\n]/.test(email)) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return email;
}

export function buildOAuthAuthorizeUrl(locale: string, redirectTo: string, email?: string): string {
  const params = new URLSearchParams({ redirect: redirectTo });
  const hint = sanitizeLoginHint(email);
  if (hint) params.set('login_hint', hint);
  return `/${locale}/api/auth/oauth/authorize?${params.toString()}`;
}
