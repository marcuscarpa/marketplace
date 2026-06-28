'use client';

import { useWishlist as useWishlistContext } from '@/components/providers/wishlist-provider';

export function useWishlist() {
  const { items, addItem, removeItem, isInWishlist, clearWishlist } = useWishlistContext();

  const toggleItem = (productId: string, handle: string) => {
    if (isInWishlist(productId)) {
      removeItem(productId);
    } else {
      addItem({ id: productId, handle, title: '', price: '', image: '' });
    }
  };

  return {
    items,
    isInWishlist,
    toggleItem,
    addItem,
    removeItem,
    clearWishlist,
  };
}