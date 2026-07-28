import type { WishlistStoredItem } from '@/lib/catalog/wishlist-seed';

const STORAGE_KEY = 'sinesia_guest_wishlist';

export function readGuestWishlist(): WishlistStoredItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WishlistStoredItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeGuestWishlist(items: WishlistStoredItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full or disabled
  }
}

export function clearGuestWishlist(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
