'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  price: string;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const EMPTY_WISHLIST: WishlistItem[] = [];

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(EMPTY_WISHLIST);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wishlist');
if (stored) {
      try {
        const parsed = JSON.parse(stored) as WishlistItem[];
        setItems(parsed.length > 0 ? parsed : EMPTY_WISHLIST);
      } catch {
        setItems(EMPTY_WISHLIST);
      }
    }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && items !== EMPTY_WISHLIST) {
      localStorage.setItem('wishlist', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (item: WishlistItem) => {
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