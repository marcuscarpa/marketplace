/** Fast local JWT exp check — skip Shopify when session is already dead. */
export function isAccessTokenExpired(token: string): boolean {
  try {
    const segment = token.split('.')[1];
    if (!segment) return false;

    const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(normalized, 'base64').toString('utf8')) as {
      exp?: number;
    };

    if (typeof payload.exp !== 'number') return false;
    return payload.exp * 1000 <= Date.now() + 30_000;
  } catch {
    return false;
  }
}
