import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Bookmark, Heart, MessageCircle, MessageSquare, Share2, ShoppingBag, Volume2, VolumeX } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { mockVideos, reelCommentsFa } from '../data/mockData';
import { ProductDrawer } from '../components/ProductDrawer';
import { CommentsDrawer } from '../components/CommentsDrawer';
import { SwipeGuide } from '../components/SwipeGuide';
import { useReelStore } from '../store/useReelStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { Product, VideoFeed } from '../types';
import { toast } from 'sonner';
import { sanitizeCaptionText } from '../utils/sanitizeCaption';
import { formatPriceToman } from '../utils/price';
import { useCommerceChatStore } from '../store/useCommerceChatStore';
import { sortByUsefulness } from '../utils/commentInsights';
import { useFollowStore } from '../store/useFollowStore';

interface FeedRow {
  rowId: string;
  product?: Product;
  kind: 'product' | 'concept';
  reels: VideoFeed[];
}

const FEATURED_PRODUCT_NAMES = ['پازل سه بعدی', 'ماساژور رباتیک'];
const DENTAL_LIGHT_PRODUCT_NAME = 'کیت نور دوقلوی دندانپزشکی اوسینو';
const EVERDELL_PRODUCT_NAME = 'بازی فکری Everdell';
const BIRD_CAMERA_PRODUCT_NAME = 'دوربین پرنده';
const HIDDEN_REEL_PRODUCT_NAMES = ['روبوتایم طرح کافه'];
const PROCESS_STAGE_ORDER: Record<string, number> = {
  intro: 1,
  build: 2,
  usage: 3,
  comparison: 4,
  detail: 5,
  benefit: 6,
  before_after: 7,
  result: 8,
};
const COMMENT_PREVIEW_USERS = [
  { username: 'niloofar.shop', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { username: 'amir_style', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43d?w=100&h=100&fit=crop' },
  { username: 'sara.market', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
  { username: 'mobin.review', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { username: 'parisa_buy', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { username: 'zahra.kala', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop' },
  { username: 'omid.store', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
] as const;

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentsVideoId, setCommentsVideoId] = useState<string>(mockVideos[0]?.id ?? '');
  const [horizontalPositions, setHorizontalPositions] = useState<Record<number, number>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreenVideo, setIsFullscreenVideo] = useState(false);
  const globalVolume = 0.9;

  const scrollRef = useRef<HTMLDivElement>(null);
  const horizontalRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const { toggleLike, isLiked } = useReelStore();
  const startPurchaseChat = useCommerceChatStore((state) => state.startPurchaseChat);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const toggleFollow = useFollowStore((state) => state.toggleFollow);
  const isFollowing = useFollowStore((state) => state.isFollowing);

  const sanitizedVideoById = useMemo(() => {
    return Object.fromEntries(
      mockVideos.map((video) => [
        video.id,
        {
          ...video,
          description: sanitizeCaptionText(video.description),
          hashtags: (video.hashtags ?? [])
            .map((tag) => sanitizeCaptionText(tag))
            .filter((tag) => tag.length > 0),
        },
      ])
    ) as Record<string, VideoFeed>;
  }, []);

  const baseReels = useMemo(
    () =>
      mockVideos
        .map((video) => sanitizedVideoById[video.id] ?? video)
        .filter((video) => !HIDDEN_REEL_PRODUCT_NAMES.includes(video.product?.name ?? '')),
    [sanitizedVideoById]
  );

  const productRows = useMemo<FeedRow[]>(() => {
    const groupedByProduct = new Map<string, VideoFeed[]>();
    const noProductVideos: VideoFeed[] = [];

    baseReels.forEach((video) => {
      const productId = video.product?.id;
      if (!productId) {
        noProductVideos.push(video);
        return;
      }

      const existing = groupedByProduct.get(productId);
      if (existing) {
        existing.push(video);
      } else {
        groupedByProduct.set(productId, [video]);
      }
    });

    const productRowsRaw: FeedRow[] = Array.from(groupedByProduct.entries()).map(([productId, reels]) => ({
      rowId: `product-${productId}`,
      kind: 'product',
      product: reels[0]?.product,
      reels: reels.slice().sort((a, b) => {
        const stageA = PROCESS_STAGE_ORDER[a.processType ?? ''] ?? Number.MAX_SAFE_INTEGER;
        const stageB = PROCESS_STAGE_ORDER[b.processType ?? ''] ?? Number.MAX_SAFE_INTEGER;
        if (stageA !== stageB) return stageA - stageB;
        return a.id.localeCompare(b.id);
      }),
    }));

    const featuredRows = productRowsRaw.filter((row) => FEATURED_PRODUCT_NAMES.includes(row.product?.name ?? ''));
    const nonFeaturedRows = productRowsRaw.filter((row) => !FEATURED_PRODUCT_NAMES.includes(row.product?.name ?? ''));

    const singleReelRows = nonFeaturedRows.filter((row) => row.reels.length === 1);
    const multiReelRows = nonFeaturedRows.filter((row) => row.reels.length > 1);

    const conceptCandidates = [...singleReelRows.flatMap((row) => row.reels), ...noProductVideos];

    const hasConceptMatch = (source: VideoFeed, candidate: VideoFeed) => {
      if (source.id === candidate.id) return false;

      const sourceProductId = source.product?.id;
      const candidateProductId = candidate.product?.id;
      if (sourceProductId && candidateProductId && sourceProductId === candidateProductId) return false;

      const sourceSimilarIds = new Set((source.similarReels ?? []).map((reel) => reel.id));
      const candidateSimilarIds = new Set((candidate.similarReels ?? []).map((reel) => reel.id));
      if (sourceSimilarIds.has(candidate.id) || candidateSimilarIds.has(source.id)) return true;

      const sourceTags = new Set((source.hashtags ?? []).map((tag) => tag.toLowerCase()));
      const candidateTags = (candidate.hashtags ?? []).map((tag) => tag.toLowerCase());
      const overlap = candidateTags.reduce((count, tag) => (sourceTags.has(tag) ? count + 1 : count), 0);
      if (overlap >= 2) return true;

      const sourceCategory = source.product?.category ?? '';
      const candidateCategory = candidate.product?.category ?? '';
      if (!sourceCategory || !candidateCategory) return false;

      const normalizeCategory = (value: string) => value.split('/')[0].trim().toLowerCase();
      return normalizeCategory(sourceCategory) === normalizeCategory(candidateCategory);
    };

    const conceptRows: FeedRow[] = [];
    const visited = new Set<string>();

    conceptCandidates.forEach((video) => {
      if (visited.has(video.id)) return;

      const queue = [video];
      const grouped: VideoFeed[] = [];
      visited.add(video.id);

      while (queue.length > 0) {
        const current = queue.shift();
        if (!current) continue;
        grouped.push(current);

        conceptCandidates.forEach((candidate) => {
          if (visited.has(candidate.id)) return;
          if (!hasConceptMatch(current, candidate)) return;
          visited.add(candidate.id);
          queue.push(candidate);
        });
      }

      if (grouped.length > 1) {
        conceptRows.push({
          rowId: `concept-${video.id}`,
          kind: 'concept',
          reels: grouped,
        });
      } else {
        const single = grouped[0];
        conceptRows.push({
          rowId: `single-${single.id}`,
          kind: 'product',
          product: single.product,
          reels: [single],
        });
      }
    });

    const sortFeatured = (rows: FeedRow[]) =>
      rows.slice().sort((a, b) => {
        const rankA = FEATURED_PRODUCT_NAMES.indexOf(a.product?.name ?? '');
        const rankB = FEATURED_PRODUCT_NAMES.indexOf(b.product?.name ?? '');
        return rankA - rankB;
      });

    const orderedRows: FeedRow[] = [...sortFeatured(featuredRows), ...multiReelRows, ...conceptRows];
    const moveToLastRowProductNames = [DENTAL_LIGHT_PRODUCT_NAME, BIRD_CAMERA_PRODUCT_NAME];
    const movedLastRowReels: VideoFeed[] = [];

    const rowsWithoutMovedLast = orderedRows
      .map((row) => {
        const reels = row.reels.filter((video) => {
          const shouldMoveToLast = moveToLastRowProductNames.includes(video.product?.name ?? '');
          if (shouldMoveToLast) movedLastRowReels.push(video);
          return !shouldMoveToLast;
        });
        return { ...row, reels };
      })
      .filter((row) => row.reels.length > 0);

    const rowsAfterLastMove =
      movedLastRowReels.length === 0
        ? rowsWithoutMovedLast
        : rowsWithoutMovedLast.length === 0
          ? [
              {
                rowId: 'moved-dental-row',
                kind: 'concept',
                reels: movedLastRowReels,
              } satisfies FeedRow,
            ]
          : rowsWithoutMovedLast.map((row, rowIndex, allRows) => {
              if (rowIndex !== allRows.length - 1) return row;
              return {
                ...row,
                reels: [...row.reels, ...movedLastRowReels],
              };
            });

    const moveToFirstRowProductNames = [EVERDELL_PRODUCT_NAME];
    const prioritizedReels: VideoFeed[] = [];
    const rowsWithoutPrioritized = rowsAfterLastMove
      .map((row) => {
        const reels = row.reels.filter((video) => {
          const productName = video.product?.name;
          const shouldMoveToFirstRow = productName ? moveToFirstRowProductNames.includes(productName) : false;
          if (shouldMoveToFirstRow) prioritizedReels.push(video);
          return !shouldMoveToFirstRow;
        });
        return { ...row, reels };
      })
      .filter((row) => row.reels.length > 0);

    if (prioritizedReels.length === 0) {
      return rowsAfterLastMove;
    }

    if (rowsWithoutPrioritized.length === 0) {
      return [
        {
          rowId: 'moved-priority-row',
          kind: 'concept',
          reels: prioritizedReels,
        },
      ];
    }

    const sortedPrioritized = prioritizedReels.slice().sort((a, b) => {
      const rankA = moveToFirstRowProductNames.indexOf(a.product?.name ?? '');
      const rankB = moveToFirstRowProductNames.indexOf(b.product?.name ?? '');
      return rankA - rankB;
    });

    const firstRow = rowsWithoutPrioritized[0];
    rowsWithoutPrioritized[0] = {
      ...firstRow,
      reels: [...firstRow.reels, ...sortedPrioritized],
    };

    return rowsWithoutPrioritized;
  }, [baseReels]);

  useEffect(() => {
    const targetReelId = searchParams.get('reel');
    if (!targetReelId || productRows.length === 0) return;

    let targetRow = -1;
    let targetCol = -1;
    for (let rowIndex = 0; rowIndex < productRows.length; rowIndex += 1) {
      const colIndex = productRows[rowIndex].reels.findIndex((video) => video.id === targetReelId);
      if (colIndex !== -1) {
        targetRow = rowIndex;
        targetCol = colIndex;
        break;
      }
    }

    if (targetRow === -1 || targetCol === -1) return;

    setActiveIndex(targetRow);
    setHorizontalPositions((prev) => {
      if ((prev[targetRow] ?? 0) === targetCol) return prev;
      return { ...prev, [targetRow]: targetCol };
    });

    requestAnimationFrame(() => {
      const vertical = scrollRef.current;
      if (vertical) {
        vertical.scrollTo({ top: targetRow * vertical.clientHeight, behavior: 'auto' });
      }

      const horizontal = horizontalRefs.current[targetRow];
      if (horizontal) {
        horizontal.scrollTo({ left: targetCol * horizontal.clientWidth, behavior: 'auto' });
      }
    });
  }, [productRows, searchParams]);

  const activeRow = productRows[activeIndex];
  const activeHorizontal = horizontalPositions[activeIndex] ?? 0;
  const activeVideo = activeRow?.reels[activeHorizontal] ?? activeRow?.reels[0] ?? baseReels[0];

  const isNearViewport = useCallback(
    (rowIndex: number, horizontalIndex: number) => {
      if (Math.abs(rowIndex - activeIndex) > 1) return false;
      const rowPosition = horizontalPositions[rowIndex] ?? 0;
      return Math.abs(horizontalIndex - rowPosition) <= 1;
    },
    [activeIndex, horizontalPositions]
  );

  const preloadNearby = useCallback((reels: VideoFeed[]) => {
    reels.forEach((reel) => {
      const preloader = document.createElement('video');
      preloader.src = reel.videoUrl;
      preloader.preload = 'metadata';
      preloader.muted = true;
      preloader.playsInline = true;
    });
  }, []);

  const handleVerticalScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const viewportHeight = target.clientHeight;
      if (!viewportHeight) return;

      const nextIndex = Math.max(0, Math.min(productRows.length - 1, Math.round(target.scrollTop / viewportHeight)));
      if (nextIndex !== activeIndex) {
        setActiveIndex(nextIndex);
      }
    },
    [activeIndex, productRows.length]
  );

  const handleHorizontalScroll = useCallback((rowIndex: number, e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (!target.clientWidth) return;
    const nextPos = Math.round(target.scrollLeft / target.clientWidth);

    setHorizontalPositions((prev) => {
      if ((prev[rowIndex] ?? 0) === nextPos) return prev;
      return { ...prev, [rowIndex]: nextPos };
    });
  }, []);

  useEffect(() => {
    const row = productRows[activeIndex];
    if (!row) return;

    const position = horizontalPositions[activeIndex] ?? 0;
    const nearby: VideoFeed[] = [];

    if (row.reels[position - 1]) nearby.push(row.reels[position - 1]);
    if (row.reels[position + 1]) nearby.push(row.reels[position + 1]);

    const similar = activeVideo?.similarReels ?? [];
    const rowVideoIds = new Set(row.reels.map((video) => video.id));
    similar
      .filter((video) => rowVideoIds.has(video.id))
      .slice(0, 2)
      .forEach((video) => nearby.push(video));

    preloadNearby(
      nearby.filter((candidate, index, all) => all.findIndex((item) => item.id === candidate.id) === index)
    );
  }, [activeIndex, activeVideo, horizontalPositions, preloadNearby, productRows]);

  useEffect(() => {
    const extra: VideoFeed[] = [];
    [activeIndex - 1, activeIndex + 1].forEach((rowIndex) => {
      const row = productRows[rowIndex];
      if (!row) return;
      const rowPos = horizontalPositions[rowIndex] ?? 0;
      const center = row.reels[rowPos];
      const left = row.reels[rowPos - 1];
      const right = row.reels[rowPos + 1];
      if (center) extra.push(center);
      if (left) extra.push(left);
      if (right) extra.push(right);
    });

    preloadNearby(
      extra.filter((candidate, index, all) => all.findIndex((item) => item.id === candidate.id) === index)
    );
  }, [activeIndex, horizontalPositions, preloadNearby, productRows]);

  useEffect(() => {
    const container = horizontalRefs.current[activeIndex];
    if (!container) return;

    const targetPos = horizontalPositions[activeIndex] ?? 0;
    const targetLeft = targetPos * container.clientWidth;
    if (Math.abs(container.scrollLeft - targetLeft) < 2) return;
    container.scrollTo({ left: targetLeft, behavior: 'smooth' });
  }, [activeIndex, horizontalPositions]);

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([key, video]) => {
      if (!video) return;
      const [rowIdx, reelIdx] = key.split('-').map((value) => Number(value));
      const shouldPlay = rowIdx === activeIndex && reelIdx === activeHorizontal;
      video.muted = isMuted;
      video.volume = globalVolume;

      if (shouldPlay) {
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [activeHorizontal, activeIndex, isMuted]);

  useEffect(() => {
    if (!activeVideo?.id) return;
    setCommentsVideoId(activeVideo.id);
  }, [activeVideo?.id]);

  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreenVideo(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => document.removeEventListener('fullscreenchange', handleFullscreen);
  }, []);

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
    const conversationId = startPurchaseChat({ product });
    toast.success('Continue purchase in chat');
    navigate(`/messages?conversation=${conversationId}`);
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
    const target = baseReels.find((item) => item.id === commentsVideoId) ?? activeVideo;
    return target?.comments ?? 0;
  }, [activeVideo, baseReels, commentsVideoId]);

  const dynamicComments = useMemo(() => {
    const video = baseReels.find((item) => item.id === commentsVideoId) ?? activeVideo;
    const product = video?.product;
    const reelComments = video ? reelCommentsFa[video.id] ?? [] : [];
    if (!product) return reelComments.length > 0 ? reelComments : undefined;

    const productComments = [
      `${product.name} خیلی قشنگه 😍`,
      `از @${product.creatorUsername} کسی خرید داشته؟ برای ${product.category} کیفیتش چطوره؟`,
      `قیمت ${product.name} که @${product.creatorUsername} گذاشته نسبت به بازار خوبه؟`,
      `@${product.creatorUsername} این محصول رو موجود دارید؟ می‌خوام سفارش بدم 🛒`,
      `@${product.creatorUsername} رنگ‌بندی/مدل دیگه برای ${product.name} هم هست؟`,
    ];

    const mergedComments = [...reelComments, ...productComments].filter(
      (text, index, all) => all.findIndex((item) => item === text) === index
    );

    return mergedComments.length > 0 ? mergedComments : undefined;
  }, [activeVideo, baseReels, commentsVideoId]);

  const inlineCommentsByVideoId = useMemo(() => {
    const entries = baseReels.map((video) => {
      const comments = reelCommentsFa[video.id] ?? [];
      if (comments.length === 0) return [video.id, []] as const;

      const ranked = sortByUsefulness(comments.map((text, index) => ({ text, likes: 20 + index * 4 })))
        .slice(0, 5)
        .map((item, index) => {
          const reelSeed = video.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
          const user = COMMENT_PREVIEW_USERS[(reelSeed + index) % COMMENT_PREVIEW_USERS.length];
          return {
            username: user.username,
            avatar: user.avatar,
            text: item.text,
          };
        });

      return [video.id, ranked] as const;
    });

    return Object.fromEntries(entries) as Record<string, Array<{ username: string; avatar: string; text: string }>>;
  }, [baseReels]);

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <div
          ref={scrollRef}
          onScroll={handleVerticalScroll}
          className="absolute inset-0 overflow-y-auto snap-y snap-mandatory overscroll-y-contain"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
        >
          {productRows.map((row, rowIndex) => {
            const rowHorizontalPos = horizontalPositions[rowIndex] ?? 0;

            return (
              <section key={`row-${row.rowId}`} className="relative h-screen snap-start overflow-hidden">
                <div
                  ref={(el) => {
                    horizontalRefs.current[rowIndex] = el;
                  }}
                  onScroll={(e) => handleHorizontalScroll(rowIndex, e)}
                  className="absolute inset-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex overscroll-x-contain scroll-smooth"
                  style={{ touchAction: 'auto', WebkitOverflowScrolling: 'touch' }}
                >
                  {row.reels.map((video, reelIndex) => {
                    const currentProduct = video.product ?? row.product;
                    const currentIsLiked = isLiked(video.id);
                    const isFollowingPage = isFollowing(video.username);
                    const isWishlisted = currentProduct
                      ? wishlistItems.some((item) => item.product.id === currentProduct.id)
                      : false;
                    const inlineComments = inlineCommentsByVideoId[video.id] ?? [];
                    const visibleInlineComments = inlineComments.slice(0, 2);

                    return (
                      <article
                        key={`${video.id}-${reelIndex}`}
                        className="relative h-full w-full shrink-0 snap-start overflow-hidden"
                        style={{ contentVisibility: 'auto', containIntrinsicSize: '100vh' }}
                      >
                        <video
                          ref={(el) => {
                            videoRefs.current[`${rowIndex}-${reelIndex}`] = el;
                          }}
                          src={video.videoUrl}
                          className="absolute inset-0 w-full h-full object-cover"
                          autoPlay={rowIndex === activeIndex && reelIndex === rowHorizontalPos}
                          muted={isMuted}
                          loop
                          playsInline
                          preload={isNearViewport(rowIndex, reelIndex) ? 'metadata' : 'none'}
                          onLoadedMetadata={(e) => {
                            e.currentTarget.volume = globalVolume;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/45 pointer-events-none" />

                        {video.isLive && (
                          <div className="absolute top-28 left-4 z-20 pointer-events-none">
                            <div className="flex items-center gap-2 bg-red-500 px-3 py-1.5 rounded-md">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              <span className="text-white text-sm font-bold">LIVE</span>
                            </div>
                          </div>
                        )}

                        <div className="absolute right-0 top-[56%] -translate-y-1/2 w-20 flex flex-col items-center gap-4 z-30 pointer-events-none">
                          <button
                            onClick={() => {
                              toggleFollow(video.username);
                              toast.success(isFollowingPage ? `Unfollowed @${video.username}` : `Followed @${video.username}`);
                            }}
                            className="relative pointer-events-auto ui-pressable ui-focus-ring"
                            aria-label={isFollowingPage ? `Unfollow ${video.username}` : `Follow ${video.username}`}
                          >
                            <img src={video.userAvatar} alt={video.username} className="w-11 h-11 rounded-full border-2 border-white" />
                            <div
                              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center border-2 border-black ${
                                isFollowingPage ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                            >
                              <span className="text-white text-xs font-bold">{isFollowingPage ? '✓' : '+'}</span>
                            </div>
                          </button>

                          <button onClick={() => handleLike(video)} className="flex flex-col items-center gap-1 w-full pointer-events-auto ui-pressable ui-focus-ring">
                            <Heart className={`w-8 h-8 ${currentIsLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} strokeWidth={2} />
                            <span className="text-white text-xs font-semibold text-center w-full leading-none">
                              {formatNumber(video.likes + (currentIsLiked ? 1 : 0))}
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              setCommentsVideoId(video.id);
                              setIsCommentsOpen(true);
                            }}
                            className="flex flex-col items-center gap-1 active:scale-90 transition-transform w-full pointer-events-auto ui-focus-ring"
                          >
                            <MessageCircle className="w-8 h-8 text-white" strokeWidth={2} />
                            <span className="text-white text-xs font-semibold text-center w-full leading-none">
                              {formatNumber(video.comments)}
                            </span>
                          </button>

                          <button className="flex flex-col items-center gap-1 w-full pointer-events-auto ui-pressable ui-focus-ring">
                            <Share2 className="w-7 h-7 text-white" strokeWidth={2} />
                            <span className="text-white text-xs font-semibold text-center w-full leading-none">Share</span>
                          </button>

                          <button onClick={() => handleWishlistToggle(currentProduct)} className="flex flex-col items-center gap-1 w-full pointer-events-auto ui-pressable ui-focus-ring">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <Bookmark className={`w-5 h-5 ${isWishlisted ? 'fill-white text-white' : 'text-white'}`} strokeWidth={2} />
                            </div>
                            <span className="text-white text-[10px] font-semibold text-center w-full leading-none">Wishlist</span>
                          </button>

                          <button onClick={() => handleQuickAddToCart(currentProduct)} className="flex flex-col items-center gap-1 w-full pointer-events-auto ui-pressable ui-focus-ring">
                            <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-lg">
                              <ShoppingBag className="w-5 h-5" />
                            </div>
                            <span className="text-white text-[10px] font-semibold text-center w-full leading-none">Buy</span>
                          </button>
                        </div>

                        <div
                          className="absolute left-0 right-0 px-4 z-10 pointer-events-none"
                          // Keep feed product card above fixed bottom nav across mobile Chrome/PWA viewport changes.
                          style={{ bottom: 'calc(var(--bottom-nav-offset) + 0.75rem)' }}
                        >
                          <div className="mb-2 pr-24 pointer-events-auto">
                            <button
                              onClick={() => navigate(`/profile?user=${encodeURIComponent(video.username)}`)}
                              className="text-white font-bold text-base hover:text-white/85 transition-colors"
                            >
                              @{video.username}
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              setCommentsVideoId(video.id);
                              setIsCommentsOpen(true);
                            }}
                            className="mb-2 max-w-[calc(100%-6rem)] w-full px-1 py-1 text-left pointer-events-auto ui-pressable ui-focus-ring"
                          >
                            <div
                              className="space-y-1.5"
                              style={{
                                maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                              }}
                            >
                              {visibleInlineComments.map((comment, idx) => (
                                <div key={`${video.id}-inline-${idx}`} className="flex items-center gap-2">
                                  <img src={comment.avatar} alt={comment.username} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                                  <p className="text-[12px] text-white leading-4 line-clamp-1">
                                    <span className="font-semibold mr-1">{comment.username}</span>
                                    {comment.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                            {inlineComments.length > 2 && (
                              <p className="text-[10px] text-white/75 mt-1">برای دیدن همه کامنت‌ها بزن</p>
                            )}
                          </button>

                          {currentProduct && !isFullscreenVideo && (
                            <div className="pointer-events-auto max-w-[calc(100%-6rem)] w-full">
                              <button
                                onClick={() => handleProductClick(currentProduct)}
                                className="w-full text-left rounded-2xl bg-white/22 backdrop-blur-md shadow-[0_10px_26px_rgba(0,0,0,0.2)] px-3 py-2.5 flex items-center gap-2.5 ui-surface ui-pressable ui-focus-ring"
                              >
                                <img
                                  src={currentProduct.image}
                                  alt={currentProduct.name}
                                  className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-sm text-white font-semibold leading-5 line-clamp-1">{currentProduct.name}</p>
                                  <p className="text-xs text-white/85 mt-0.5 line-clamp-1">{formatPriceToman(currentProduct.price)}</p>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
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
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors relative ui-pressable ui-focus-ring"
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

              <div className="flex items-center gap-1 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors ui-pressable ui-focus-ring"
                  aria-label={isMuted ? 'Unmute videos' : 'Mute videos'}
                >
                  {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
                </button>
                <Link
                  to="/messages"
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors ui-pressable ui-focus-ring"
                  aria-label="Open messages"
                >
                  <MessageSquare className="w-6 h-6 text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductDrawer product={selectedProduct} open={isProductDrawerOpen} onOpenChange={setIsProductDrawerOpen} />

      <CommentsDrawer
        open={isCommentsOpen}
        onOpenChange={setIsCommentsOpen}
        videoId={commentsVideoId}
        commentsCount={commentsCount}
        commentsOverride={dynamicComments}
      />

      <SwipeGuide />
    </>
  );
}
