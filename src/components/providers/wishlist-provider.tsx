'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import {
  WISHLIST_SEED_ITEMS,
  normalizeWishlistItems,
  type WishlistStoredItem,
} from '@/lib/catalog/wishlist-seed';

interface WishlistContextType {
  items: WishlistStoredItem[];
  addItem: (item: WishlistStoredItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const EMPTY_WISHLIST: WishlistStoredItem[] = [];
const STORAGE_KEY = 'wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistStoredItem[]>(EMPTY_WISHLIST);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // ponytail: demo favorites — same 6 products as search modal; upgrade path: account sync
      setItems(WISHLIST_SEED_ITEMS);
      setHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as WishlistStoredItem[];
      const normalized = normalizeWishlistItems(parsed);
      setItems(normalized.length > 0 ? normalized : WISHLIST_SEED_ITEMS);
    } catch {
      setItems(WISHLIST_SEED_ITEMS);
      localStorage.removeItem(STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    if (items.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = (item: WishlistStoredItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const isInWishlist = (id: string) => items.some((i) => i.id === id);

  const clearWishlist = () => setItems(EMPTY_WISHLIST);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
