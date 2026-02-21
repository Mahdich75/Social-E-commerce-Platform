import { CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Bell, Bookmark, Heart, MessageCircle, MessageSquare, Share2, ShoppingBag, Volume2, VolumeX } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { FEED_ROW_MATRIX, mockVideos, reelCommentsFa } from '../data/mockData';
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
import { getWarmBudget, warmImage, warmVideoMetadata } from '../utils/mediaWarmCache';
import { useFirstFramePosters } from '../utils/useFirstFramePosters';

interface FeedRow {
  rowId: string;
  product?: Product;
  kind: 'product' | 'concept';
  reels: VideoFeed[];
}

const applyFeedRowMatrix = (rows: FeedRow[]): FeedRow[] => {
  if (FEED_ROW_MATRIX.length === 0) return rows;

  const videoById = new Map<string, VideoFeed>();
  rows.forEach((row) => {
    row.reels.forEach((video) => videoById.set(video.id, video));
  });

  const used = new Set<string>();
  const manualRows: FeedRow[] = FEED_ROW_MATRIX.map((ids, idx) => {
    const reels = ids
      .map((id) => videoById.get(id))
      .filter((video): video is VideoFeed => Boolean(video))
      .filter((video) => {
        if (used.has(video.id)) return false;
        used.add(video.id);
        return true;
      });

    return {
      rowId: `manual-matrix-${idx + 1}`,
      kind: 'concept',
      reels,
      product: reels.length === 1 ? reels[0].product : undefined,
    };
  }).filter((row) => row.reels.length > 0);

  const untouchedRows: FeedRow[] = rows
    .map((row) => ({
      ...row,
      reels: row.reels.filter((video) => !used.has(video.id)),
    }))
    .filter((row) => row.reels.length > 0);

  return [...manualRows, ...untouchedRows];
};

const FEATURED_PRODUCT_NAMES = ['???? ?? ????', '??????? ??????'];
const DENTAL_LIGHT_PRODUCT_NAME = '??? ??? ?????? ?????????? ??????';
const EVERDELL_PRODUCT_NAME = '???? ???? Everdell';
const BIRD_CAMERA_PRODUCT_NAME = '?????? ?????';
const HIDDEN_REEL_PRODUCT_NAMES = ['???????? ??? ????'];
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
  { username: 'gole.manoto.shop', avatar: `${import.meta.env.BASE_URL}pics/profile/SaveGram.App_448391674_868650641947746_1136848269883995888_n.jpg` },
  { username: 'sara.relax.shop', avatar: `${import.meta.env.BASE_URL}pics/avatars/avatar2.jpg` },
  { username: 'mina.beautyroom', avatar: `${import.meta.env.BASE_URL}pics/profile/SaveGram.App_448391831_1021416656274678_3127390317532272881_n.jpg` },
  { username: 'elmira.homevibe', avatar: `${import.meta.env.BASE_URL}pics/avatars/avatar3.jpg` },
  { username: 'mehrdad.gadgetshop', avatar: `${import.meta.env.BASE_URL}pics/avatars/avatar1.jpg` },
  { username: 'niloofar.puzzlehome', avatar: `${import.meta.env.BASE_URL}pics/profile/SaveGram.App_607748365_3282722678561396_6572646971023833447_n.jpg` },
  { username: 'parisa.stylecorner', avatar: `${import.meta.env.BASE_URL}pics/profile/SaveGram.App_608007693_759320143196138_7188041296922647007_n.jpg` },
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
  const [soundIndicator, setSoundIndicator] = useState<'muted' | 'unmuted' | null>(null);
  const [isFullscreenVideo, setIsFullscreenVideo] = useState(false);
  const [loadedVideoKeys, setLoadedVideoKeys] = useState<Record<string, true>>({});
  const globalVolume = 0.9;

  const scrollRef = useRef<HTMLDivElement>(null);
  const horizontalRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const topNavRef = useRef<HTMLDivElement | null>(null);
  const verticalScrollRafRef = useRef<number | null>(null);
  const horizontalScrollRafRef = useRef<Record<number, number | null>>({});
  const soundIndicatorTimerRef = useRef<number | null>(null);
  const warmQueueRef = useRef<string[]>([]);
  const lastScrollTopRef = useRef(0);
  const lastScrollTsRef = useRef(0);
  const scrollVelocityRef = useRef(0);

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

    return applyFeedRowMatrix(rowsWithoutPrioritized);
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

  const handleVerticalScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const viewportHeight = target.clientHeight;
      if (!viewportHeight) return;

      if (verticalScrollRafRef.current !== null) {
        cancelAnimationFrame(verticalScrollRafRef.current);
      }

      verticalScrollRafRef.current = requestAnimationFrame(() => {
        const now = performance.now();
        const deltaY = Math.abs(target.scrollTop - lastScrollTopRef.current);
        const deltaT = Math.max(16, now - lastScrollTsRef.current);
        scrollVelocityRef.current = deltaY / deltaT;
        lastScrollTopRef.current = target.scrollTop;
        lastScrollTsRef.current = now;

        const snapped = Math.round(target.scrollTop / viewportHeight);
        const nextIndex = Math.max(0, Math.min(productRows.length - 1, snapped));
        if (nextIndex !== activeIndex) {
          setActiveIndex(nextIndex);
        }
      });
    },
    [activeIndex, productRows.length]
  );

  const handleHorizontalScroll = useCallback((rowIndex: number, e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (!target.clientWidth) return;
    const previousRaf = horizontalScrollRafRef.current[rowIndex];
    if (previousRaf !== null && previousRaf !== undefined) {
      cancelAnimationFrame(previousRaf);
    }

    horizontalScrollRafRef.current[rowIndex] = requestAnimationFrame(() => {
      const snapped = Math.round(target.scrollLeft / target.clientWidth);

      setHorizontalPositions((prev) => {
        if ((prev[rowIndex] ?? 0) === snapped) return prev;
        return { ...prev, [rowIndex]: snapped };
      });
    });
  }, []);

  useEffect(() => {
    return () => {
      if (verticalScrollRafRef.current !== null) {
        cancelAnimationFrame(verticalScrollRafRef.current);
      }

      Object.values(horizontalScrollRafRef.current).forEach((rafId) => {
        if (rafId !== null && rafId !== undefined) cancelAnimationFrame(rafId);
      });

      if (soundIndicatorTimerRef.current !== null) {
        window.clearTimeout(soundIndicatorTimerRef.current);
      }
    };
  }, []);

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
    if (!productRows.length) return;

    // Keep only active reel + immediate neighbors warm; avoids full-feed media fetch.
    const toWarm = new Set<string>();
    const activeRowRef = productRows[activeIndex];
    if (!activeRowRef) return;

    const currentRowPos = horizontalPositions[activeIndex] ?? 0;
    const activeReel = activeRowRef.reels[currentRowPos];
    const nextReel = activeRowRef.reels[currentRowPos + 1];
    const prevReel = activeRowRef.reels[currentRowPos - 1];

    const velocity = scrollVelocityRef.current;
    const quickScroll = velocity > 1.1;
    if (activeReel) toWarm.add(`${activeIndex}-${currentRowPos}`);
    if (nextReel) toWarm.add(`${activeIndex}-${currentRowPos + 1}`);
    // Keep previous warm only when scrolling is not too fast.
    if (!quickScroll && prevReel) toWarm.add(`${activeIndex}-${currentRowPos - 1}`);

    const nextRow = productRows[activeIndex + 1];
    const prevRow = productRows[activeIndex - 1];
    if (nextRow?.reels[0]) toWarm.add(`${activeIndex + 1}-0`);
    if (prevRow?.reels[0]) toWarm.add(`${activeIndex - 1}-0`);

    setLoadedVideoKeys((prev) => {
      const next = { ...prev };
      const queue = warmQueueRef.current.slice();
      const { feedCacheSize } = getWarmBudget();
      const budget = quickScroll ? Math.max(3, feedCacheSize - 3) : feedCacheSize;

      toWarm.forEach((key) => {
        if (!next[key]) next[key] = true;
        const idx = queue.indexOf(key);
        if (idx !== -1) queue.splice(idx, 1);
        queue.push(key);
      });

      while (queue.length > budget) {
        const removedKey = queue.shift();
        if (!removedKey || toWarm.has(removedKey)) continue;
        delete next[removedKey];
        const video = videoRefs.current[removedKey];
        if (video) {
          // Explicitly release far-away buffers to reduce memory/network pressure.
          video.pause();
          video.removeAttribute('src');
          video.load();
        }
      }

      warmQueueRef.current = queue;
      return next;
    });

    [activeReel, nextReel, prevReel].forEach((reel) => {
      if (!reel) return;
      warmImage(reel.thumbnail);
      warmVideoMetadata(reel.videoUrl);
    });
  }, [activeHorizontal, activeIndex, horizontalPositions, productRows]);

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

  useLayoutEffect(() => {
    const node = topNavRef.current;
    if (!node) return;

    const updateTopNavHeight = () => {
      const height = node.getBoundingClientRect().height;
      if (!height) return;
      document.documentElement.style.setProperty('--top-nav-actual-height', `${height}px`);
    };

    updateTopNavHeight();
    const resizeObserver = new ResizeObserver(updateTopNavHeight);
    resizeObserver.observe(node);
    window.addEventListener('resize', updateTopNavHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateTopNavHeight);
    };
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

  const toggleSoundFromReelTap = useCallback(() => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      setSoundIndicator(nextMuted ? 'muted' : 'unmuted');
      if (soundIndicatorTimerRef.current !== null) {
        window.clearTimeout(soundIndicatorTimerRef.current);
      }
      soundIndicatorTimerRef.current = window.setTimeout(() => setSoundIndicator(null), 800);
      return nextMuted;
    });
  }, []);

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
      `${product.name} ???? ????? ??`,
      `?? @${product.creatorUsername} ??? ???? ?????? ???? ${product.category} ?????? ??????`,
      `???? ${product.name} ?? @${product.creatorUsername} ?????? ???? ?? ????? ?????`,
      `@${product.creatorUsername} ??? ????? ?? ????? ?????? ??????? ????? ??? ??`,
      `@${product.creatorUsername} ????????/??? ???? ???? ${product.name} ?? ????`,
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

  const firstFramePosterById = useFirstFramePosters(
    baseReels.map((video) => ({ id: video.id, videoUrl: video.videoUrl }))
  );

  return (
    <>
      <div
        className="relative w-full overflow-hidden bg-black"
        style={
          {
            // Unified safe offsets for feed overlays (header + bottom nav + device insets).
            '--feed-safe-top': 'calc(var(--top-nav-actual-height) + clamp(0.5rem, 1.6vh, 0.9rem))',
            '--feed-overlay-clearance': 'clamp(0.28rem, 0.8vh, 0.55rem)',
            '--feed-safe-bottom': 'calc(var(--bottom-nav-actual-height) + var(--feed-overlay-clearance) + env(safe-area-inset-bottom, 0px))',
            height: '100dvh',
          } as CSSProperties
        }
      >
        <div
          ref={scrollRef}
          onScroll={handleVerticalScroll}
          className="absolute inset-0 overflow-y-auto snap-y snap-mandatory overscroll-y-contain"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
        >
          {productRows.map((row, rowIndex) => {
            const rowHorizontalPos = horizontalPositions[rowIndex] ?? 0;

            return (
              <section key={`row-${row.rowId}`} className="relative snap-start overflow-hidden" style={{ height: '100dvh' }}>
                <div
                  ref={(el) => {
                    horizontalRefs.current[rowIndex] = el;
                  }}
                  onScroll={(e) => handleHorizontalScroll(rowIndex, e)}
                  className="absolute inset-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex overscroll-x-contain"
                  style={{ touchAction: 'auto', WebkitOverflowScrolling: 'touch', scrollSnapStop: 'always' }}
                >
                  {row.reels.map((video, reelIndex) => {
                    const currentProduct = video.product ?? row.product;
                    const currentIsLiked = isLiked(video.id);
                    const isFollowingPage = isFollowing(video.username);
                    const isWishlisted = currentProduct
                      ? wishlistItems.some((item) => item.product.id === currentProduct.id)
                      : false;

                    return (
                      <article
                        key={`${video.id}-${reelIndex}`}
                        className="relative h-full w-full shrink-0 snap-start overflow-hidden"
                        style={{ contentVisibility: 'auto', containIntrinsicSize: '100vh' }}
                        onClick={(event) => {
                          const target = event.target as HTMLElement;
                          if (target.closest('button, a, input, textarea, select, label')) return;
                          toggleSoundFromReelTap();
                        }}
                      >
                        <video
                          ref={(el) => {
                            videoRefs.current[`${rowIndex}-${reelIndex}`] = el;
                          }}
                          src={loadedVideoKeys[`${rowIndex}-${reelIndex}`] ? video.videoUrl : undefined}
                          poster={firstFramePosterById[video.id] || undefined}
                          className="absolute inset-0 w-full h-full object-cover"
                          autoPlay={rowIndex === activeIndex && reelIndex === rowHorizontalPos}
                          muted={isMuted}
                          loop
                          playsInline
                          preload={
                            rowIndex === activeIndex && reelIndex === rowHorizontalPos
                              ? 'auto'
                              : isNearViewport(rowIndex, reelIndex)
                                ? 'metadata'
                                : 'none'
                          }
                          onLoadedMetadata={(e) => {
                            e.currentTarget.volume = globalVolume;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/45 pointer-events-none" />
                        {rowIndex === activeIndex && reelIndex === rowHorizontalPos && soundIndicator && (
                          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                            <div className="rounded-full bg-black/45 backdrop-blur-sm p-3">
                              {soundIndicator === 'muted' ? (
                                <VolumeX className="h-7 w-7 text-white" />
                              ) : (
                                <Volume2 className="h-7 w-7 text-white" />
                              )}
                            </div>
                          </div>
                        )}

                        {video.isLive && (
                          <div
                            className="absolute left-4 z-20 pointer-events-none"
                            style={{ top: 'var(--feed-safe-top)' }}
                          >
                            <div className="flex items-center gap-2 bg-red-500 px-3 py-1.5 rounded-md">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              <span className="text-white text-sm font-bold">LIVE</span>
                            </div>
                          </div>
                        )}

                        <div
                          className="absolute right-0 w-20 flex flex-col items-center justify-end gap-[clamp(0.7rem,2vh,1rem)] z-30 pointer-events-none"
                          style={{
                            bottom: 'var(--feed-safe-bottom)',
                          }}
                        >
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
                          // Keep feed product card anchored above bottom nav with responsive safe spacing.
                          style={{ bottom: 'calc(var(--feed-safe-bottom) + clamp(0.18rem, 0.45vh, 0.3rem))' }}
                        >
                          <div className="mb-2 pr-24 pointer-events-auto w-[min(60vw,14.5rem)] max-w-[calc(100%-7.25rem)]">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  toggleFollow(video.username);
                                  toast.success(isFollowingPage ? `Unfollowed @${video.username}` : `Followed @${video.username}`);
                                }}
                                className="relative w-11 h-11 flex-shrink-0 ui-pressable ui-focus-ring"
                                aria-label={isFollowingPage ? `Unfollow ${video.username}` : `Follow ${video.username}`}
                              >
                                <img
                                  src={video.userAvatar}
                                  alt={video.username}
                                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white/90 shadow-[0_6px_14px_rgba(0,0,0,0.35)]"
                                />
                                <div
                                  className={`absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border border-black ${
                                    isFollowingPage ? 'bg-emerald-500' : 'bg-red-500'
                                  }`}
                                >
                                  <span className="text-white text-[10px] font-bold">{isFollowingPage ? 'âœ“' : '+'}</span>
                                </div>
                              </button>
                              <button
                                onClick={() => navigate(`/profile?user=${encodeURIComponent(video.username)}`)}
                                className="text-white font-bold text-base hover:text-white/85 transition-colors"
                              >
                                @{video.username}
                              </button>
                            </div>
                          </div>

                          {currentProduct && !isFullscreenVideo && (
                            <div className="pointer-events-auto w-[min(60vw,14.5rem)] max-w-[calc(100%-7.25rem)]">
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

        <div
          ref={topNavRef}
          className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[414px] z-30 bg-gradient-to-b from-black/55 to-transparent pt-[max(env(safe-area-inset-top),0.5rem)] pb-3 pointer-events-none"
        >
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

              <div aria-hidden className="w-10 h-10" />

              <div className="flex items-center gap-1 pointer-events-auto">
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











