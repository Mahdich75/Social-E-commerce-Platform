import { create } from 'zustand';
import { BasketItem, Product } from '../types';

interface BasketStore {
  items: BasketItem[];
  addToBasket: (product: Product, size?: string, color?: string) => void;
  removeFromBasket: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearBasket: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useBasketStore = create<BasketStore>((set, get) => ({
  items: [],
  
  addToBasket: (product, size, color) => {
    const existingItem = get().items.find(
      item => 
        item.product.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
    );
    
    if (existingItem) {
      set({
        items: get().items.map(item =>
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({
        items: [...get().items, { product, quantity: 1, selectedSize: size, selectedColor: color }],
      });
    }
  },
  
  removeFromBasket: (productId) => {
    set({
      items: get().items.filter(item => item.product.id !== productId),
    });
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromBasket(productId);
      return;
    }
    
    set({
      items: get().items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    });
  },
  
  clearBasket: () => {
    set({ items: [] });
  },
  
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },
  
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
