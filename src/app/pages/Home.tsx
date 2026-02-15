import { useCallback, useMemo, useRef, useState } from 'react';
import { Bell, Bookmark, Heart, MessageCircle, MessageSquare, Share2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import { mockVideos } from '../data/mockData';
import { ProductDrawer } from '../components/ProductDrawer';
import { CommentsDrawer } from '../components/CommentsDrawer';
import { SwipeGuide } from '../components/SwipeGuide';
import { useBasketStore } from '../store/useBasketStore';
import { useReelStore } from '../store/useReelStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { Product, VideoFeed } from '../types';
import { toast } from 'sonner';
import { sanitizeCaptionText } from '../utils/sanitizeCaption';
import { formatPriceToman } from '../utils/price';

export default function Home() {
  const [feedReels, setFeedReels] = useState<VideoFeed[]>(mockVideos);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentsVideoId, setCommentsVideoId] = useState<string>(mockVideos[0]?.id ?? '');
  const [expandedCaptionIndex, setExpandedCaptionIndex] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const lockedAxisRef = useRef<'x' | 'y' | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchCurrentRef = useRef<{ x: number; y: number } | null>(null);

  const axisLockDistance = 12;
  const swipeDistance = 50;

  const { addToBasket } = useBasketStore();
  const { toggleLike, isLiked } = useReelStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const activeVideo = feedReels[activeIndex] ?? mockVideos[0];

  const handleVerticalScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const viewportHeight = target.clientHeight;
    if (viewportHeight === 0) return;

    const nextIndex = Math.max(
      0,
      Math.min(feedReels.length - 1, Math.round(target.scrollTop / viewportHeight))
    );
    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
      setExpandedCaptionIndex(null);
    }
  }, [activeIndex, feedReels.length]);

  const moveHorizontal = useCallback((direction: 1 | -1) => {
    setFeedReels((previous) => {
      if (activeIndex < 0 || activeIndex >= previous.length) return previous;
      const current = previous[activeIndex];
      if (!current) return previous;

      const relatedGroup = [current, ...(current.similarReels ?? [])].filter(
        (candidate, index, all) => all.findIndex((item) => item.id === candidate.id) === index
      );
      if (relatedGroup.length <= 1) return previous;

      const currentPosition = Math.max(0, relatedGroup.findIndex((item) => item.id === current.id));
      const nextPosition =
        direction === 1
          ? (currentPosition + 1) % relatedGroup.length
          : (currentPosition - 1 + relatedGroup.length) % relatedGroup.length;

      const next = [...previous];
      next[activeIndex] = relatedGroup[nextPosition];
      return next;
    });
  }, [activeIndex]);

  const onTouchStart = (e: React.TouchEvent) => {
    lockedAxisRef.current = null;
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    touchCurrentRef.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    const touchStart = touchStartRef.current;
    if (!touchStart) return;

    if (!lockedAxisRef.current) {
      const deltaX = Math.abs(touchStart.x - currentTouch.x);
      const deltaY = Math.abs(touchStart.y - currentTouch.y);

      if (deltaX > axisLockDistance && deltaX > deltaY) {
        lockedAxisRef.current = 'x';
      } else if (deltaY > axisLockDistance && deltaY > deltaX) {
        lockedAxisRef.current = 'y';
      }
    }

    if (lockedAxisRef.current === 'x') {
      e.preventDefault();
    }

    touchCurrentRef.current = currentTouch;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const touchStart = touchStartRef.current;
    const changedTouch = e.changedTouches[0];
    const touchEnd = touchCurrentRef.current ?? {
      x: changedTouch?.clientX ?? 0,
      y: changedTouch?.clientY ?? 0,
    };
    if (!touchStart) return;

    const distanceX = touchStart.x - touchEnd.x;
    if (lockedAxisRef.current === 'x' && Math.abs(distanceX) > swipeDistance) {
      moveHorizontal(distanceX > 0 ? 1 : -1);
    }

    lockedAxisRef.current = null;
    touchStartRef.current = null;
    touchCurrentRef.current = null;
  };

  const handleLike = (video: VideoFeed) => {
    const wasLiked = isLiked(video.id);
    toggleLike(video.id);
    toast.success(wasLiked ? 'Like removed' : 'Liked reel');
  };

  const handleProductClick = (product?: Product) => {
    if (!product) return;
    setSelectedProduct(product);
    setIsProductDrawerOpen(true);
  };

  const handleQuickAddToCart = (product?: Product) => {
    if (!product) return;
    addToBasket(product, product.sizes[0], product.colors?.[0]);
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = (product?: Product) => {
    if (!product) return;
    const saved = wishlistItems.some((item) => item.product.id === product.id);
    toggleWishlist(product);
    toast.success(saved ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const commentsCount = useMemo(() => {
    const target = feedReels.find((item) => item.id === commentsVideoId);
    return target?.comments ?? activeVideo?.comments ?? 0;
  }, [activeVideo?.comments, commentsVideoId, feedReels]);

  const sanitizedFeedReels = useMemo(
    () =>
      feedReels.map((video) => ({
        ...video,
        description: sanitizeCaptionText(video.description),
        hashtags: (video.hashtags ?? [])
          .map((tag) => sanitizeCaptionText(tag))
          .filter((tag) => tag.length > 0),
      })),
    [feedReels]
  );

  return (
    <>
      <div
        className="relative w-full h-screen overflow-hidden bg-black"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          ref={scrollRef}
          onScroll={handleVerticalScroll}
          className="absolute inset-0 overflow-y-auto snap-y snap-mandatory"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
        >
          {sanitizedFeedReels.map((video, index) => {
            const currentProduct = video.product;
            const currentIsLiked = isLiked(video.id);
            const isWishlisted = currentProduct
              ? wishlistItems.some((item) => item.product.id === currentProduct.id)
              : false;
            const isCaptionExpanded = expandedCaptionIndex === index;

            return (
              <section key={`${video.id}-${index}`} className="relative h-screen snap-start overflow-hidden">
                <video
                  src={video.videoUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/45 pointer-events-none" />

                {video.isLive && (
                  <div className="absolute top-12 left-4 z-20 pointer-events-none">
                    <div className="flex items-center gap-2 bg-red-500 px-3 py-1.5 rounded-md">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-sm font-bold">LIVE</span>
                    </div>
                  </div>
                )}

                <div className="absolute right-0 top-[54%] -translate-y-1/2 w-20 flex flex-col items-center gap-4 z-30 pointer-events-none">
                  <div className="relative">
                    <img
                      src={video.userAvatar}
                      alt={video.username}
                      className="w-11 h-11 rounded-full border-2 border-white"
                    />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-black">
                      <span className="text-white text-xs font-bold">+</span>
                    </div>
                  </div>

                  <button onClick={() => handleLike(video)} className="flex flex-col items-center gap-1 w-full pointer-events-auto">
                    <Heart
                      className={`w-8 h-8 ${currentIsLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
                      strokeWidth={2}
                    />
                    <span className="text-white text-xs font-semibold text-center w-full leading-none">
                      {formatNumber(video.likes + (currentIsLiked ? 1 : 0))}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setCommentsVideoId(video.id);
                      setIsCommentsOpen(true);
                    }}
                    className="flex flex-col items-center gap-1 active:scale-90 transition-transform w-full pointer-events-auto"
                  >
                    <MessageCircle className="w-8 h-8 text-white" strokeWidth={2} />
                    <span className="text-white text-xs font-semibold text-center w-full leading-none">
                      {formatNumber(video.comments)}
                    </span>
                  </button>

                  <button className="flex flex-col items-center gap-1 w-full pointer-events-auto">
                    <Share2 className="w-7 h-7 text-white" strokeWidth={2} />
                    <span className="text-white text-xs font-semibold text-center w-full leading-none">Share</span>
                  </button>

                  <button
                    onClick={() => handleWishlistToggle(currentProduct)}
                    className="flex flex-col items-center gap-1 w-full pointer-events-auto"
                  >
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Bookmark
                        className={`w-5 h-5 ${isWishlisted ? 'fill-white text-white' : 'text-white'}`}
                        strokeWidth={2}
                      />
                    </div>
                    <span className="text-white text-[10px] font-semibold text-center w-full leading-none">
                      Wishlist
                    </span>
                  </button>

                  <button
                    onClick={() => handleQuickAddToCart(currentProduct)}
                    className="flex flex-col items-center gap-1 w-full pointer-events-auto"
                  >
                    <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-lg">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="text-white text-[10px] font-semibold text-center w-full leading-none">
                      Buy
                    </span>
                  </button>
                </div>

                <div className="absolute bottom-24 left-0 right-0 px-4 z-10 pointer-events-none">
                  <div className="mb-2">
                    <p className="text-white font-bold text-base">@{video.username}</p>
                    <div className="mt-2 pr-24 pointer-events-auto">
                      {!isCaptionExpanded ? (
                        <div>
                          <p className="text-white text-sm leading-5 line-clamp-2">{video.description}</p>
                          <button
                            onClick={() => setExpandedCaptionIndex(index)}
                            className="text-white/90 text-xs font-semibold mt-0.5 hover:text-white transition-colors"
                          >
                            See more
                          </button>
                        </div>
                      ) : (
                        <div className="bg-black/45 backdrop-blur-sm rounded-xl px-3 py-2.5 max-h-32 overflow-y-auto">
                          <p className="text-white text-sm leading-5">{video.description}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {video.hashtags.map((tag, i) => (
                              <span key={i} className="text-white font-semibold text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => setExpandedCaptionIndex(null)}
                            className="text-white/90 text-xs font-semibold mt-1.5 hover:text-white transition-colors"
                          >
                            Show less
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {currentProduct && (
                    <button
                      onClick={() => handleProductClick(currentProduct)}
                      className="inline-flex items-center gap-2.5 bg-white/30 backdrop-blur-md px-3 py-2.5 rounded-xl border border-white/35 shadow-[0_10px_28px_rgba(0,0,0,0.18)] pointer-events-auto max-w-[calc(100%-6rem)]"
                    >
                      <img
                        src={currentProduct.image}
                        alt={currentProduct.name}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <div className="text-left">
                        <p className="font-semibold text-xs leading-4 line-clamp-1">{currentProduct.name}</p>
                        <p className="text-sm font-bold mt-0.5">{formatPriceToman(currentProduct.price)}</p>
                      </div>
                      <ShoppingBag className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[414px] z-30 bg-gradient-to-b from-black/55 to-transparent pt-[max(env(safe-area-inset-top),0.5rem)] pb-3 pointer-events-none">
          <div className="px-4">
            <div className="flex items-center justify-between pointer-events-auto">
              <Link
                to="/notifications"
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors relative"
                aria-label="Open notifications"
              >
                <Bell className="w-6 h-6 text-white" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-black" />
              </Link>

              <div className="flex items-center gap-4">
                <button className="text-white/60 text-[15px] font-semibold">Following</button>
                <div className="w-px h-3 bg-white/25" />
                <button className="text-white text-[17px] font-bold">For You</button>
              </div>

              <Link
                to="/messages"
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                aria-label="Open messages"
              >
                <MessageSquare className="w-6 h-6 text-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ProductDrawer
        product={selectedProduct}
        open={isProductDrawerOpen}
        onOpenChange={setIsProductDrawerOpen}
      />

      <CommentsDrawer
        open={isCommentsOpen}
        onOpenChange={setIsCommentsOpen}
        videoId={commentsVideoId}
        commentsCount={commentsCount}
      />

      <SwipeGuide />
    </>
  );
}
