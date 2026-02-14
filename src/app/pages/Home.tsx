import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Music, ShoppingBag, Bell, MessageSquare, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

export default function Home() {
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);
  const [visibleReels, setVisibleReels] = useState<VideoFeed[]>(mockVideos);
  const [visibleReelIndex, setVisibleReelIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [transitionAxis, setTransitionAxis] = useState<'x' | 'y'>('y');
  const [transitionDirection, setTransitionDirection] = useState<1 | -1>(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const lockedAxisRef = useRef<'x' | 'y' | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchCurrentRef = useRef<{ x: number; y: number } | null>(null);

  const axisLockDistance = 12;
  const swipeDistance = 50;

  const { addToBasket } = useBasketStore();
  const { toggleLike, isLiked } = useReelStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const currentVideo = visibleReels[visibleReelIndex];
  const currentProduct = currentVideo?.product;
  const isWishlisted = currentProduct
    ? wishlistItems.some((item) => item.product.id === currentProduct.id)
    : false;

  const findRelatedReels = useCallback((reel: VideoFeed | undefined) => {
    if (!reel) return [] as VideoFeed[];
    const group = [reel, ...(reel.similarReels ?? [])];
    const unique = group.filter(
      (candidate, index, all) => all.findIndex((item) => item.id === candidate.id) === index
    );
    return unique;
  }, []);

  const relatedReels = useMemo(() => findRelatedReels(currentVideo), [currentVideo, findRelatedReels]);

  const isRelatedContext = useMemo(() => {
    if (visibleReels.length !== relatedReels.length) return false;
    return visibleReels.every((reel, index) => reel.id === relatedReels[index]?.id);
  }, [relatedReels, visibleReels]);

  const currentIsLiked = currentVideo ? isLiked(currentVideo.id) : false;

  const moveVertical = useCallback((direction: 1 | -1) => {
    setActiveFeedIndex((previous) => {
      const next = Math.max(0, Math.min(mockVideos.length - 1, previous + direction));
      if (next === previous) return previous;

      setTransitionAxis('y');
      setTransitionDirection(direction);
      setVisibleReels(mockVideos);
      setVisibleReelIndex(next);
      return next;
    });
  }, []);

  const moveHorizontal = useCallback((direction: 1 | -1) => {
    const baseIndex = isRelatedContext
      ? visibleReelIndex
      : Math.max(0, relatedReels.findIndex((reel) => reel.id === currentVideo?.id));

    if (relatedReels.length <= 1 || baseIndex < 0) return;

    const nextIndex =
      direction === 1
        ? (baseIndex + 1) % relatedReels.length
        : (baseIndex - 1 + relatedReels.length) % relatedReels.length;

    setTransitionAxis('x');
    setTransitionDirection(direction);
    setVisibleReels(relatedReels);
    setVisibleReelIndex(nextIndex);
  }, [currentVideo?.id, isRelatedContext, relatedReels, visibleReelIndex]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (isCommentsOpen || isProductDrawerOpen) return;

    lockedAxisRef.current = null;
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    touchCurrentRef.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isCommentsOpen || isProductDrawerOpen) return;

    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    const touchStart = touchStartRef.current;

    if (touchStart && !lockedAxisRef.current) {
      const deltaX = Math.abs(touchStart.x - currentTouch.x);
      const deltaY = Math.abs(touchStart.y - currentTouch.y);

      if (deltaX > axisLockDistance && deltaX > deltaY) {
        lockedAxisRef.current = 'x';
      } else if (deltaY > axisLockDistance && deltaY > deltaX) {
        lockedAxisRef.current = 'y';
      }
    }

    touchCurrentRef.current = currentTouch;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (isCommentsOpen || isProductDrawerOpen) return;

    const touchStart = touchStartRef.current;
    const changedTouch = e.changedTouches[0];
    const touchEnd = touchCurrentRef.current ?? {
      x: changedTouch?.clientX ?? 0,
      y: changedTouch?.clientY ?? 0,
    };

    if (!touchStart) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;

    if (lockedAxisRef.current === 'x' && Math.abs(distanceX) > swipeDistance) {
      if (distanceX > 0) {
        moveHorizontal(1);
      } else {
        moveHorizontal(-1);
      }
    } else if (lockedAxisRef.current === 'y' && Math.abs(distanceY) > swipeDistance) {
      if (distanceY > 0) {
        moveVertical(1);
      } else {
        moveVertical(-1);
      }
    }

    lockedAxisRef.current = null;
    touchStartRef.current = null;
    touchCurrentRef.current = null;
  };

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        moveVertical(1);
      } else if (e.deltaY < 0) {
        moveVertical(-1);
      }
    };

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleScroll);
    return () => container.removeEventListener('wheel', handleScroll);
  }, [moveVertical]);

  const handleLike = () => {
    if (!currentVideo) return;

    const wasLiked = isLiked(currentVideo.id);
    toggleLike(currentVideo.id);
    toast.success(wasLiked ? 'Like removed' : 'Liked reel');
  };

  const handleProductClick = () => {
    if (!currentProduct) return;
    setSelectedProduct(currentProduct);
    setIsProductDrawerOpen(true);
  };

  const handleQuickAddToCart = () => {
    if (!currentProduct) return;
    addToBasket(currentProduct, currentProduct.sizes[0], currentProduct.colors?.[0]);
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = () => {
    if (!currentProduct) return;
    toggleWishlist(currentProduct);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (!currentVideo) return null;

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden bg-black"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVideo.id}
            initial={{
              opacity: 0,
              x: transitionAxis === 'x' ? transitionDirection * 70 : 0,
              y: transitionAxis === 'y' ? transitionDirection * 90 : 0,
            }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{
              opacity: 0,
              x: transitionAxis === 'x' ? transitionDirection * -70 : 0,
              y: transitionAxis === 'y' ? transitionDirection * -90 : 0,
            }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="absolute inset-0"
          >
          <video
              key={currentVideo.id}
              src={currentVideo.videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          </motion.div>
        </AnimatePresence>

        {currentVideo.isLive && (
          <div className="absolute top-12 left-4 z-20">
            <div className="flex items-center gap-2 bg-red-500 px-3 py-1.5 rounded-md">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white text-sm font-bold">LIVE</span>
            </div>
          </div>
        )}

        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[414px] z-30 bg-gradient-to-b from-black/55 to-transparent pt-[max(env(safe-area-inset-top),0.5rem)] pb-3">
          <div className="relative flex items-center justify-center px-4">
            <div className="flex items-center gap-4">
              <button className="text-white/60 text-[15px] font-semibold">Following</button>
              <div className="w-px h-3 bg-white/25" />
              <button className="text-white text-[17px] font-bold">For You</button>
            </div>

            <div className="absolute right-2 top-0 flex items-center gap-1">
              <Link
                to="/messages"
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Open messages"
              >
                <MessageSquare className="w-6 h-6 text-white" />
              </Link>
              <Link
                to="/notifications"
                className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
                aria-label="Open notifications"
              >
                <Bell className="w-6 h-6 text-white" />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black" />
              </Link>
            </div>
          </div>
        </div>

        {currentProduct && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={handleQuickAddToCart}
            className="absolute top-32 right-4 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <ShoppingBag className="w-6 h-6 text-black" />
          </motion.button>
        )}

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 flex flex-col items-center gap-5 z-10">
          <div className="relative">
            <img
              src={currentVideo.userAvatar}
              alt={currentVideo.username}
              className="w-12 h-12 rounded-full border-2 border-white"
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-black">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>

          <button onClick={handleLike} className="flex flex-col items-center gap-1 w-full">
            <Heart
              className={`w-8 h-8 ${currentIsLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
              strokeWidth={2}
            />
            <span className="text-white text-xs font-semibold text-center w-full leading-none">
              {formatNumber(currentVideo.likes + (currentIsLiked ? 1 : 0))}
            </span>
          </button>

          <button
            onClick={() => setIsCommentsOpen(true)}
            className="flex flex-col items-center gap-1 active:scale-90 transition-transform w-full"
          >
            <MessageCircle className="w-8 h-8 text-white" strokeWidth={2} />
            <span className="text-white text-xs font-semibold text-center w-full leading-none">
              {formatNumber(currentVideo.comments)}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1 w-full">
            <Share2 className="w-7 h-7 text-white" strokeWidth={2} />
            <span className="text-white text-xs font-semibold text-center w-full leading-none">Share</span>
          </button>

          <button
            onClick={handleWishlistToggle}
            className="flex flex-col items-center gap-1 w-full"
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
        </div>

        <div className="absolute bottom-32 left-0 right-0 px-4 z-10">
          <div className="mb-3">
            <p className="text-white font-bold text-base">@{currentVideo.username}</p>
            <p className="text-white text-sm mt-2">{currentVideo.description}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {currentVideo.hashtags.map((tag, i) => (
                <span key={i} className="text-white font-semibold text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Music className="w-3 h-3 text-white" />
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-sm animate-marquee whitespace-nowrap">{currentVideo.musicTitle}</p>
            </div>
          </div>

          {currentProduct && (
            <div className="space-y-2">
              <AnimatePresence mode="wait">
                <motion.button
                  key={currentVideo.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleProductClick}
                  className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg"
                >
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="text-left">
                    <p className="font-bold text-sm">{currentProduct.name}</p>
                    <p className="text-lg font-bold">${currentProduct.price}</p>
                  </div>
                  <ShoppingBag className="w-5 h-5 ml-2" />
                </motion.button>
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-24 flex flex-col items-center gap-2 z-10">
          <div className="flex gap-1">
            {mockVideos.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-1 rounded-full transition-all ${
                  index === activeFeedIndex ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {relatedReels.length > 1 && (
            <div className="flex items-center gap-1">
              {relatedReels.map((reel, index) => {
                const activeIndex = isRelatedContext
                  ? visibleReelIndex
                  : Math.max(0, relatedReels.findIndex((item) => item.id === currentVideo.id));
                return (
                  <div
                    key={reel.id}
                    className={`h-1 rounded-full transition-all ${
                      index === activeIndex ? 'bg-white w-5' : 'bg-white/40 w-2'
                    }`}
                  />
                );
              })}
              <span className="text-white/80 text-[10px] ml-1">Related reels</span>
            </div>
          )}
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
        videoId={currentVideo.id}
        commentsCount={currentVideo.comments}
      />

      <SwipeGuide />
    </>
  );
}
