import { create } from 'zustand';
import { WishlistItem, Product } from '../types';

interface WishlistStore {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  
  addToWishlist: (product) => {
    if (!get().isInWishlist(product.id)) {
      set({
        items: [...get().items, { product, addedAt: new Date() }],
      });
    }
  },
  
  removeFromWishlist: (productId) => {
    set({
      items: get().items.filter(item => item.product.id !== productId),
    });
  },
  
  isInWishlist: (productId) => {
    return get().items.some(item => item.product.id === productId);
  },
  
  toggleWishlist: (product) => {
    if (get().isInWishlist(product.id)) {
      get().removeFromWishlist(product.id);
    } else {
      get().addToWishlist(product);
    }
  },
}));
