import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';
import { useBasketStore } from './useBasketStore';
import { mockProducts } from '../data/mockData';

export type ChatMessageType = 'text' | 'system' | 'payment_request' | 'payment_confirmation';

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'buyer' | 'seller' | 'system';
  type: ChatMessageType;
  text: string;
  timestamp: string;
  paymentRequest?: {
    orderId: string;
    finalPrice: number;
    productId: string;
    status: 'pending' | 'paid';
  };
}

export interface CommerceConversation {
  id: string;
  productId: string;
  productName: string;
  sellerName: string;
  pageOwnerName: string;
  buyerName: string;
  lastMessage: string;
  lastMessageAt: string;
}

interface CommerceChatState {
  conversations: CommerceConversation[];
  messagesByConversation: Record<string, ChatMessage[]>;
  startPurchaseChat: (input: { product: Product; buyerName?: string; sellerName?: string; pageOwnerName?: string }) => string;
  sendBuyerText: (conversationId: string, text: string) => void;
  sendSellerPaymentRequest: (conversationId: string, finalPrice: number) => void;
  markOrderShipped: (conversationId: string, orderId: string) => void;
  payFromRequest: (conversationId: string, messageId: string) => { orderId: string } | null;
}

const nowIso = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`;

const updateConversationMeta = (
  conversations: CommerceConversation[],
  conversationId: string,
  lastMessage: string
): CommerceConversation[] =>
  conversations.map((conversation) =>
    conversation.id === conversationId
      ? { ...conversation, lastMessage, lastMessageAt: nowIso() }
      : conversation
  );

export const useCommerceChatStore = create<CommerceChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messagesByConversation: {},

      startPurchaseChat: ({ product, buyerName = 'you', sellerName, pageOwnerName }) => {
        const existing = get().conversations.find((item) => item.productId === product.id && item.buyerName === buyerName);
        if (existing) {
          useBasketStore.getState().upsertNegotiatingOrder({
            product,
            sellerName: existing.sellerName,
            orderId: existing.id,
          });
          return existing.id;
        }

        const conversationId = uid('conv');
        const seller = sellerName ?? product.creatorUsername;
        const owner = pageOwnerName ?? product.creatorUsername;
        const intro: ChatMessage[] = [
          {
            id: uid('msg'),
            conversationId,
            sender: 'system',
            type: 'system',
            text: `Negotiation started for ${product.name}.`,
            timestamp: nowIso(),
          },
          {
            id: uid('msg'),
            conversationId,
            sender: 'seller',
            type: 'text',
            text: `سلام 👋 برای ${product.name} قیمت پیشنهادی خودت رو بفرست تا مذاکره کنیم.`,
            timestamp: nowIso(),
          },
        ];

        set({
          conversations: [
            {
              id: conversationId,
              productId: product.id,
              productName: product.name,
              sellerName: seller,
              pageOwnerName: owner,
              buyerName,
              lastMessage: intro[intro.length - 1].text,
              lastMessageAt: nowIso(),
            },
            ...get().conversations,
          ],
          messagesByConversation: {
            ...get().messagesByConversation,
            [conversationId]: intro,
          },
        });

        useBasketStore.getState().upsertNegotiatingOrder({
          product,
          sellerName: seller,
          orderId: conversationId,
        });

        return conversationId;
      },

      sendBuyerText: (conversationId, text) => {
        if (!text.trim()) return;

        const message: ChatMessage = {
          id: uid('msg'),
          conversationId,
          sender: 'buyer',
          type: 'text',
          text: text.trim(),
          timestamp: nowIso(),
        };

        const list = get().messagesByConversation[conversationId] ?? [];
        set({
          messagesByConversation: {
            ...get().messagesByConversation,
            [conversationId]: [...list, message],
          },
          conversations: updateConversationMeta(get().conversations, conversationId, message.text),
        });
      },

      sendSellerPaymentRequest: (conversationId, finalPrice) => {
        if (!finalPrice || finalPrice <= 0) return;

        const conversation = get().conversations.find((item) => item.id === conversationId);
        if (!conversation) return;

        const orderId = `ORD-${Date.now().toString().slice(-8)}`;
        const message: ChatMessage = {
          id: uid('msg'),
          conversationId,
          sender: 'seller',
          type: 'payment_request',
          text: `Payment request for ${conversation.productName}`,
          timestamp: nowIso(),
          paymentRequest: {
            orderId,
            finalPrice,
            productId: conversation.productId,
            status: 'pending',
          },
        };

        const list = get().messagesByConversation[conversationId] ?? [];
        set({
          messagesByConversation: {
            ...get().messagesByConversation,
            [conversationId]: [...list, message],
          },
          conversations: updateConversationMeta(get().conversations, conversationId, 'Payment request sent'),
        });
      },

      markOrderShipped: (conversationId, orderId) => {
        const conversation = get().conversations.find((item) => item.id === conversationId);
        if (!conversation) return;

        useBasketStore.getState().setOrderStatus(orderId, 'Shipped');

        const shippedMessage: ChatMessage = {
          id: uid('msg'),
          conversationId,
          sender: 'system',
          type: 'system',
          text: `Order ${orderId} was marked as shipped by seller.`,
          timestamp: nowIso(),
        };

        const list = get().messagesByConversation[conversationId] ?? [];
        set({
          messagesByConversation: {
            ...get().messagesByConversation,
            [conversationId]: [...list, shippedMessage],
          },
          conversations: updateConversationMeta(get().conversations, conversationId, shippedMessage.text),
        });
      },

      payFromRequest: (conversationId, messageId) => {
        const conversation = get().conversations.find((item) => item.id === conversationId);
        if (!conversation) return null;

        const messages = get().messagesByConversation[conversationId] ?? [];
        const target = messages.find((msg) => msg.id === messageId && msg.type === 'payment_request' && msg.sender === 'seller');
        if (!target?.paymentRequest || target.paymentRequest.status !== 'pending') return null;

        const paidMessages = messages.map((msg) =>
          msg.id === messageId && msg.paymentRequest
            ? {
                ...msg,
                paymentRequest: { ...msg.paymentRequest, status: 'paid' },
              }
            : msg
        );

        const confirmation: ChatMessage = {
          id: uid('msg'),
          conversationId,
          sender: 'system',
          type: 'payment_confirmation',
          text: `Payment confirmed for order ${target.paymentRequest.orderId}.`,
          timestamp: nowIso(),
        };

        const product = mockProducts.find((item) => item.id === conversation.productId);
        if (product) {
          useBasketStore.getState().addPaidOrder({
            orderId: target.paymentRequest.orderId,
            finalPrice: target.paymentRequest.finalPrice,
            product,
            sellerName: conversation.sellerName,
          });
        }

        set({
          messagesByConversation: {
            ...get().messagesByConversation,
            [conversationId]: [...paidMessages, confirmation],
          },
          conversations: updateConversationMeta(get().conversations, conversationId, confirmation.text),
        });

        return { orderId: target.paymentRequest.orderId };
      },
    }),
    {
      name: 'commerce-chat-v1',
      partialize: (state) => ({
        conversations: state.conversations,
        messagesByConversation: state.messagesByConversation,
      }),
    }
  )
);
