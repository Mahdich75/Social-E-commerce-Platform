import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ContentType = 'showcase' | 'review';

export interface VendorListing {
  id: string;
  productId: string;
  vendorUsername: string;
  affiliateRate: number;
  productImageName?: string;
  productDescription?: string;
  instagramUrl?: string;
  createdAt: string;
  isActive: boolean;
}

export interface CreatorContentSubmission {
  id: string;
  listingId: string;
  productId: string;
  creatorUsername: string;
  contentType: ContentType;
  caption: string;
  mediaName: string;
  instagramUrl?: string;
  createdAt: string;
  sourceOrderId?: string;
}

interface CreatorFlowState {
  vendorListings: VendorListing[];
  creatorSubmissions: CreatorContentSubmission[];
  addVendorListing: (input: {
    productId: string;
    vendorUsername: string;
    affiliateRate: number;
    productImageName?: string;
    productDescription?: string;
    instagramUrl?: string;
  }) => VendorListing;
  submitCreatorContent: (input: {
    listingId: string;
    productId: string;
    creatorUsername: string;
    contentType: ContentType;
    caption: string;
    mediaName: string;
    instagramUrl?: string;
    sourceOrderId?: string;
  }) => CreatorContentSubmission;
}

const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`;
const nowIso = () => new Date().toISOString();

export const useCreatorFlowStore = create<CreatorFlowState>()(
  persist(
    (set, get) => ({
      vendorListings: [],
      creatorSubmissions: [],

      addVendorListing: ({ productId, vendorUsername, affiliateRate, productImageName, productDescription, instagramUrl }) => {
        const normalizedRate = Math.max(1, Math.min(50, Math.round(affiliateRate)));
        const existing = get().vendorListings.find(
          (item) => item.productId === productId && item.vendorUsername === vendorUsername && item.isActive
        );
        if (existing) {
          const updated = {
            ...existing,
            affiliateRate: normalizedRate,
            productImageName: productImageName ?? existing.productImageName,
            productDescription: productDescription ?? existing.productDescription,
            instagramUrl: instagramUrl ?? existing.instagramUrl,
          };
          set({
            vendorListings: get().vendorListings.map((item) => (item.id === existing.id ? updated : item)),
          });
          return updated;
        }

        const listing: VendorListing = {
          id: uid('listing'),
          productId,
          vendorUsername,
          affiliateRate: normalizedRate,
          productImageName,
          productDescription,
          instagramUrl,
          createdAt: nowIso(),
          isActive: true,
        };
        set({ vendorListings: [listing, ...get().vendorListings] });
        return listing;
      },

      submitCreatorContent: ({ listingId, productId, creatorUsername, contentType, caption, mediaName, instagramUrl, sourceOrderId }) => {
        const submission: CreatorContentSubmission = {
          id: uid('submission'),
          listingId,
          productId,
          creatorUsername,
          contentType,
          caption: caption.trim(),
          mediaName,
          instagramUrl,
          createdAt: nowIso(),
          sourceOrderId,
        };
        set({ creatorSubmissions: [submission, ...get().creatorSubmissions] });
        return submission;
      },
    }),
    {
      name: 'creator-flow-v1',
      partialize: (state) => ({
        vendorListings: state.vendorListings,
        creatorSubmissions: state.creatorSubmissions,
      }),
    }
  )
);
