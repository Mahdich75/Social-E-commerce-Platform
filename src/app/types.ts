export interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
  image: string;
  description: string;
  sizes: string[];
  creatorId: string;
  creatorUsername: string;
  creatorAvatar: string;
  colors?: string[];
  rating?: number;
  reviews?: number;
}

export interface VideoFeed {
  id: string;
  videoUrl: string;
  thumbnail: string;
  username: string;
  userAvatar: string;
  likes: number;
  comments: number;
  shares: number;
  description: string;
  hashtags: string[];
  musicTitle: string;
  processType?: string;
  product?: Product;
  isLive?: boolean;
  similarReels?: VideoFeed[];
}

export interface BasketItem {
  orderId: string;
  product: Product;
  finalPrice: number;
  sellerName: string;
  paymentConfirmed: boolean;
  orderStatus: 'Negotiating' | 'Paid' | 'Shipped';
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}
