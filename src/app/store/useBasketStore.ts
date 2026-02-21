import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BasketItem, Product } from '../types';

type OrderStatus = BasketItem['orderStatus'];

interface AddPaidOrderInput {
  product: Product;
  finalPrice: number;
  sellerName: string;
  orderId: string;
  selectedSize?: string;
  selectedColor?: string;
}

interface BasketStore {
  items: BasketItem[];
  upsertNegotiatingOrder: (input: { product: Product; sellerName: string; orderId: string }) => void;
  addPaidOrder: (input: AddPaidOrderInput) => void;
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
  removeFromBasket: (orderId: string) => void;
  updateQuantity: (_orderId: string, _quantity: number) => void;
  clearBasket: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useBasketStore = create<BasketStore>()(
  persist(
    (set, get) => ({
      items: [],

      upsertNegotiatingOrder: ({ product, sellerName, orderId }) => {
        const exists = get().items.some((item) => item.orderId === orderId);
        if (exists) return;

        set({
          items: [
            {
              orderId,
              product,
              finalPrice: product.price,
              sellerName,
              paymentConfirmed: false,
              orderStatus: 'Negotiating',
              quantity: 1,
            },
            ...get().items,
          ],
        });
      },

      addPaidOrder: ({ product, finalPrice, sellerName, orderId, selectedSize, selectedColor }) => {
        const existing = get().items.find((item) => item.orderId === orderId);
        if (existing) {
          set({
            items: get()
              .items
              .filter(
                (item) =>
                  !(
                    item.orderStatus === 'Negotiating' &&
                    item.product.id === product.id &&
                    item.orderId !== orderId
                  )
              )
              .map((item) =>
                item.orderId === orderId
                  ? {
                      ...item,
                      product,
                      finalPrice,
                      sellerName,
                      paymentConfirmed: true,
                      orderStatus: 'Paid',
                      selectedSize: selectedSize ?? item.selectedSize,
                      selectedColor: selectedColor ?? item.selectedColor,
                    }
                  : item
              ),
          });
          return;
        }

        set({
          items: [
            {
              orderId,
              product,
              finalPrice,
              sellerName,
              paymentConfirmed: true,
              orderStatus: 'Paid',
              quantity: 1,
              selectedSize,
              selectedColor,
            },
            ...get().items.filter(
              (item) => !(item.orderStatus === 'Negotiating' && item.product.id === product.id)
            ),
          ],
        });
      },

      setOrderStatus: (orderId, status) => {
        set({
          items: get().items.map((item) => (item.orderId === orderId ? { ...item, orderStatus: status } : item)),
        });
      },

      removeFromBasket: (orderId) => {
        set({
          items: get().items.filter((item) => item.orderId !== orderId),
        });
      },

      updateQuantity: () => {
        // Basket is intentionally read-only in negotiation-first flow.
      },

      clearBasket: () => {
        set({ items: [] });
      },

      getTotalPrice: () =>
        get()
          .items.filter((item) => item.paymentConfirmed)
          .reduce((sum, item) => sum + item.finalPrice, 0),

      getTotalItems: () => get().items.length,
    }),
    {
      name: 'basket-orders-v2',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
