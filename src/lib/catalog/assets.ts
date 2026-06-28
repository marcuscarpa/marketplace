/** Marketing image CDN — override with NEXT_PUBLIC_ASSET_ORIGIN to self-host. */
const DEFAULT_ORIGIN = 'https://framerusercontent.com';

export const ASSET_ORIGIN = (
  process.env.NEXT_PUBLIC_ASSET_ORIGIN ?? DEFAULT_ORIGIN
).replace(/\/$/, '');

export function cdnAsset(path: string): string {
  return `${ASSET_ORIGIN}/${path.replace(/^\//, '')}`;
}
