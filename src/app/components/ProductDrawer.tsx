import { useMemo, useState } from 'react';
import { Product } from '../types';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer';
import { Button } from './ui/button';
import { Star, Check } from 'lucide-react';
import { toast } from 'sonner';
import { formatPriceToman } from '../utils/price';
import { useNavigate } from 'react-router';
import { useCommerceChatStore } from '../store/useCommerceChatStore';
import { mockVideos, reelCommentsFa } from '../data/mockData';
import { buildCommentInsight, sortByUsefulness } from '../utils/commentInsights';

interface ProductDrawerProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDrawer({ product, open, onOpenChange }: ProductDrawerProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const navigate = useNavigate();
  const startPurchaseChat = useCommerceChatStore((state) => state.startPurchaseChat);

  const handleStartNegotiation = () => {
    if (!product) return;
    if (product.sizes && product.sizes.length > 1 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const conversationId = startPurchaseChat({ product });
    toast.success('Negotiation chat opened');
    onOpenChange(false);

    setSelectedSize('');
    setSelectedColor('');
    navigate(`/messages?conversation=${conversationId}`);
  };

  const topOpinionComments = useMemo(() => {
    if (!product) return [];

    const relatedVideoIds = mockVideos
      .filter((video) => video.product?.id === product.id)
      .map((video) => video.id);

    const pool = relatedVideoIds.flatMap((videoId) => reelCommentsFa[videoId] ?? []);
    if (pool.length === 0) return [];

    const enriched = pool.map((text, index) => {
      const likes = 22 + index * 5;
      const insight = buildCommentInsight(text, likes);
      return { text, likes, ...insight };
    });

    return sortByUsefulness(enriched).slice(0, 3);
  }, [product]);

  if (!product) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white max-w-[414px] mx-auto overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-xl font-bold">{product.name}</DrawerTitle>
            <DrawerDescription className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">{product.rating}</span>
              </div>
              <span className="text-sm text-zinc-500">({product.reviews} reviews)</span>
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-8 space-y-6">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-zinc-100">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {topOpinionComments.length > 0 && (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 space-y-2">
                <p className="text-sm font-semibold">نظرهای تاثیرگذار خریدارها</p>
                {topOpinionComments.map((comment, index) => (
                  <div key={`${product.id}-op-${index}`} className="rounded-lg bg-white border border-zinc-200 p-2.5">
                    <p className="text-sm text-zinc-800 leading-5">{comment.text}</p>
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-500">
                      <span>{comment.influencedCount} نفر بر اساس این نظر تصمیم گرفتند</span>
                      <span>مفید: {comment.usefulnessScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{formatPriceToman(product.price)}</span>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/profile?user=${encodeURIComponent(product.creatorUsername)}`)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors"
            >
              <img src={product.creatorAvatar} alt={product.creatorUsername} className="w-10 h-10 rounded-full object-cover" />
              <div className="text-left">
                <p className="text-xs text-zinc-500">Seller</p>
                <p className="text-sm font-semibold">@{product.creatorUsername}</p>
              </div>
            </button>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-zinc-600">{product.description}</p>
            </div>

            {product.sizes && product.sizes.length > 1 && (
              <div>
                <h3 className="font-semibold mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-zinc-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Select Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors relative ${
                        selectedColor === color
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-zinc-300 hover:border-black'
                      }`}
                    >
                      {color}
                      {selectedColor === color && <Check className="w-4 h-4 absolute top-1 right-1" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleStartNegotiation} className="w-full bg-black text-white hover:bg-zinc-800 h-12 text-base font-semibold rounded-xl">
              Buy via Chat
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

