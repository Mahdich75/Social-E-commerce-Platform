import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X, LocateFixed, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { mockVideos } from '../data/mockData';
import { VideoFeed } from '../types';
import { sanitizeCaptionText } from '../utils/sanitizeCaption';
import { DiscoverSearchAssistant } from '../components/discover/DiscoverSearchAssistant';

type Intent = 'trend' | 'minimal' | 'new_year' | 'formal' | 'color_match' | 'beauty' | 'comfort';

type DiscoverTile = {
  video: VideoFeed;
  shape: 'square' | 'portrait';
  span: string;
};

type MapViewport = {
  cx: number;
  cy: number;
  zoom: number;
};

type MapPoint = { x: number; y: number; city: string };
type AdvisorStep = 'recipient' | 'occasion' | 'budget' | 'style' | 'done';
type AdvisorMessage = { id: string; role: 'assistant' | 'user'; text: string };

const SUGGESTION_CHIPS = ['Nearby', 'ترندهای امسال', 'استایل مینیمال', 'پیشنهاد برای عید ✨', 'چی با این رنگ ست میشه؟'];
const JOURNEY_STARTER_CHIP = 'یه هدیه برای مادرم بخرم';

const INTENT_PATTERNS: Record<Intent, string[]> = {
  trend: ['ترند', 'trend', 'جدید', 'امسال', 'popular'],
  minimal: ['مینیمال', 'minimal', 'ساده', 'clean'],
  new_year: ['سال نو', 'عید', 'نوروز', 'new year'],
  formal: ['رسمی', 'مهمونی', 'party', 'formal'],
  color_match: ['رنگ', 'ست', 'match'],
  beauty: ['پوست', 'مو', 'beauty', 'آرایشی'],
  comfort: ['ماساژ', 'ریلکس', 'آرامش', 'comfort'],
};

const LOCATION_SESSION_KEY = 'discover_map_location_v1';
const VIEWPORT_CACHE_KEY = 'discover_map_viewport_cache_v1';
const LOCATION_DENIED_KEY = 'discover_map_location_denied_v1';
const NEARBY_SAMPLE_MAX = 9;
const VIEWPORT_DEBOUNCE_MS = 650;

const REEL_MAP_POINTS: Record<string, MapPoint> = {
  v5: { x: 47, y: 52, city: 'tehran' },
  v7: { x: 44, y: 57, city: 'tehran' },
  v8: { x: 55, y: 48, city: 'tehran' },
  v9: { x: 50, y: 44, city: 'tehran' },
  v10: { x: 42, y: 61, city: 'tehran' },
  v11: { x: 58, y: 63, city: 'tehran' },
  v12: { x: 69, y: 46, city: 'tehran' },
  v13: { x: 73, y: 52, city: 'tehran' },
  v14: { x: 66, y: 58, city: 'tehran' },
  v16: { x: 31, y: 54, city: 'tehran' },
  v17: { x: 28, y: 49, city: 'tehran' },
  v18: { x: 36, y: 58, city: 'tehran' },
  v19: { x: 33, y: 45, city: 'tehran' },
  v20: { x: 49, y: 68, city: 'tehran' },
  v21: { x: 26, y: 64, city: 'tehran' },
};

const CONSULTATION_TRIGGER_PATTERNS = ['هدیه', 'برای مادرم', 'برای مامانم', 'چی بخرم', 'مشاوره', 'recommend', 'gift'];
const OCCASION_CHOICES = ['تولد', 'سالگرد', 'بدون مناسبت'];
const BUDGET_CHOICES = ['اقتصادی', 'متوسط', 'پریمیوم'];
const STYLE_CHOICES = ['کاربردی', 'احساسی', 'خاص و لوکس'];

const isConsultationIntent = (value: string) => {
  const q = value.trim().toLowerCase();
  if (!q) return false;
  return CONSULTATION_TRIGGER_PATTERNS.some((pattern) => q.includes(pattern));
};

const normalize = (value: string) =>
  sanitizeCaptionText(value)
    .toLowerCase()
    .replace(/[.,!?،؛:()\[\]{}"'`]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

const detectIntents = (query: string): Intent[] => {
  const q = query.toLowerCase();
  return (Object.keys(INTENT_PATTERNS) as Intent[]).filter((intent) => INTENT_PATTERNS[intent].some((item) => q.includes(item)));
};

const rankBySemanticIntent = (videos: VideoFeed[], query: string) => {
  if (!query.trim()) {
    return [...videos].sort((a, b) => b.likes + b.comments - (a.likes + a.comments));
  }

  const intents = detectIntents(query);
  const queryTokens = new Set(normalize(query));

  return [...videos]
    .map((video) => {
      const corpus = `${video.description} ${video.product?.name ?? ''} ${video.product?.category ?? ''} ${(video.hashtags ?? []).join(' ')}`;
      const tokens = normalize(corpus);
      let score = 0;

      tokens.forEach((token) => {
        if (queryTokens.has(token)) score += 7;
      });

      if (intents.includes('trend')) score += video.likes > 10000 ? 20 : 8;
      if (intents.includes('beauty') && (video.product?.category ?? '').includes('beauty')) score += 18;
      if (intents.includes('comfort') && (video.product?.category ?? '').includes('health')) score += 18;
      if (intents.includes('minimal') && (video.product?.category ?? '').includes('fashion')) score += 12;
      if (intents.includes('new_year') && (video.product?.category ?? '').includes('puzzle')) score += 10;
      if (intents.includes('formal') && (video.product?.category ?? '').includes('access')) score += 10;
      if (intents.includes('color_match') && (video.hashtags ?? []).some((tag) => tag.includes('رنگ'))) score += 10;
      score += Math.min(video.comments / 130, 7);

      return { video, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.video);
};

const getTileConfig = (videos: VideoFeed[]): DiscoverTile[] => {
  const pattern: Array<{ shape: DiscoverTile['shape']; span: string }> = [
    { shape: 'square', span: 'col-span-1 row-span-1' },
    { shape: 'square', span: 'col-span-1 row-span-1' },
    { shape: 'portrait', span: 'col-span-1 row-span-2' },
    { shape: 'square', span: 'col-span-1 row-span-1' },
    { shape: 'portrait', span: 'col-span-2 row-span-2' },
    { shape: 'square', span: 'col-span-1 row-span-1' },
  ];

  return videos.map((video, idx) => {
    const style = pattern[idx % pattern.length];
    return { video, shape: style.shape, span: style.span };
  });
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const viewportToBounds = (viewport: MapViewport) => {
  const width = 34 / viewport.zoom;
  const height = 24 / viewport.zoom;
  return {
    minX: clamp(viewport.cx - width / 2, 0, 100),
    maxX: clamp(viewport.cx + width / 2, 0, 100),
    minY: clamp(viewport.cy - height / 2, 0, 100),
    maxY: clamp(viewport.cy + height / 2, 0, 100),
  };
};

const viewportCacheKey = (viewport: MapViewport) => {
  const b = viewportToBounds(viewport);
  const rounded = [b.minX, b.maxX, b.minY, b.maxY].map((v) => Math.round(v / 3) * 3);
  return rounded.join('_');
};

const pickNearbyForViewport = (viewport: MapViewport, source: VideoFeed[]) => {
  const b = viewportToBounds(viewport);
  return source
    .filter((video) => {
      const point = REEL_MAP_POINTS[video.id];
      if (!point) return false;
      return point.x >= b.minX && point.x <= b.maxX && point.y >= b.minY && point.y <= b.maxY;
    })
    .slice(0, NEARBY_SAMPLE_MAX);
};

const toTehranGridCenter = (lat: number, lng: number): { cx: number; cy: number } | null => {
  const minLat = 35.5;
  const maxLat = 35.95;
  const minLng = 51.1;
  const maxLng = 51.75;
  if (lat < minLat || lat > maxLat || lng < minLng || lng > maxLng) return null;

  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
  return { cx: clamp(x, 10, 90), cy: clamp(y, 10, 90) };
};

export default function Discover() {
  const navigate = useNavigate();
  const [queryInput, setQueryInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(18);
  const [failedMediaIds, setFailedMediaIds] = useState<Record<string, true>>({});
  const [isLoadingGrid, setIsLoadingGrid] = useState(false);
  const [isNearbyMapOpen, setIsNearbyMapOpen] = useState(false);
  const [nearbyReels, setNearbyReels] = useState<VideoFeed[]>([]);
  const [nearbyInitialized, setNearbyInitialized] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [mapViewport, setMapViewport] = useState<MapViewport>({ cx: 50, cy: 52, zoom: 1 });
  const [advisorActive, setAdvisorActive] = useState(false);
  const [advisorStep, setAdvisorStep] = useState<AdvisorStep>('recipient');
  const [advisorCollapsed, setAdvisorCollapsed] = useState(false);
  const [advisorMessages, setAdvisorMessages] = useState<AdvisorMessage[]>([]);
  const [advisorAnswers, setAdvisorAnswers] = useState<Record<'recipient' | 'occasion' | 'budget' | 'style', string>>({
    recipient: '',
    occasion: '',
    budget: '',
    style: '',
  });

  const gridVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const nearbyVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const checkedMediaIdsRef = useRef<Set<string>>(new Set());
  const viewportDebounceRef = useRef<number | null>(null);
  const nearbyCacheRef = useRef<Record<string, string[]>>({});
  const mapDragRef = useRef<{ startX: number; startY: number; startCx: number; startCy: number } | null>(null);

  const rankedVideos = useMemo(
    () => rankBySemanticIntent(mockVideos, activeQuery).filter((video) => !failedMediaIds[video.id]),
    [activeQuery, failedMediaIds]
  );
  const tiles = useMemo(() => getTileConfig(rankedVideos.slice(0, visibleCount)), [rankedVideos, visibleCount]);

  const markMediaFailed = useCallback((videoId: string) => {
    setFailedMediaIds((prev) => {
      if (prev[videoId]) return prev;
      return { ...prev, [videoId]: true };
    });
  }, []);

  useEffect(() => {
    const candidates = rankedVideos.slice(0, Math.min(visibleCount + 18, rankedVideos.length));
    const unchecked = candidates.filter((video) => !checkedMediaIdsRef.current.has(video.id));
    if (unchecked.length === 0) return;

    let cancelled = false;

    unchecked.forEach((video) => {
      checkedMediaIdsRef.current.add(video.id);

      const probe = new Image();
      probe.decoding = 'async';
      probe.onload = () => {
        if (cancelled) return;
      };
      probe.onerror = () => {
        if (cancelled) return;
        markMediaFailed(video.id);
      };
      probe.src = video.thumbnail;
    });

    return () => {
      cancelled = true;
    };
  }, [markMediaFailed, rankedVideos, visibleCount]);

  useEffect(() => {
    setIsLoadingGrid(true);
    const timeout = window.setTimeout(() => setIsLoadingGrid(false), 260);
    return () => window.clearTimeout(timeout);
  }, [activeQuery]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setVisibleCount((prev) => Math.min(prev + 9, rankedVideos.length));
        });
      },
      { rootMargin: '240px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rankedVideos.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (!video) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0.4, 0.55, 0.8] }
    );

    Object.values(gridVideoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [tiles]);


  useEffect(() => {
    if (!isNearbyMapOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (!video) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0.45, 0.6, 0.8] }
    );

    Object.values(nearbyVideoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [isNearbyMapOpen, nearbyReels]);

  const openReelInFeed = (videoId: string) => {
    navigate(`/?reel=${encodeURIComponent(videoId)}`);
  };

  const runQuery = useCallback((nextQuery: string) => {
    if (nextQuery === 'Nearby') {
      setIsNearbyMapOpen(true);
      return;
    }

    setQueryInput(nextQuery);
    setActiveQuery(nextQuery);
    setVisibleCount(18);
    setAdvisorActive(false);
    setAdvisorStep('recipient');
    setAdvisorMessages([]);
  }, []);

  const pushAdvisorMessage = useCallback((role: AdvisorMessage['role'], text: string) => {
    setAdvisorMessages((prev) => [...prev, { id: `${role}-${Date.now()}-${Math.random()}`, role, text }]);
  }, []);

  const startAdvisor = useCallback(
    (seedQuestion: string) => {
      setAdvisorActive(true);
      setAdvisorStep('recipient');
      setAdvisorCollapsed(false);
      setAdvisorAnswers({ recipient: '', occasion: '', budget: '', style: '' });
      setAdvisorMessages([
        { id: 'a-1', role: 'assistant', text: 'عالیه، با هم سریع بهترین گزینه رو پیدا می‌کنیم.' },
        { id: 'u-seed', role: 'user', text: seedQuestion },
        { id: 'a-2', role: 'assistant', text: 'این هدیه برای چه کسیه؟ (مثلا مادر، دوست، همکار)' },
      ]);
    },
    []
  );

  const completeAdvisor = useCallback(
    (answers: Record<'recipient' | 'occasion' | 'budget' | 'style', string>) => {
      const composedQuery = `${answers.recipient} ${answers.occasion} ${answers.budget} ${answers.style}`.trim();
      pushAdvisorMessage('assistant', 'پیشنهادها آماده شد. اکسپلور بر اساس جواب‌هات بازچینی شد.');
      setQueryInput(composedQuery);
      setActiveQuery(composedQuery);
      setVisibleCount(18);
      setAdvisorActive(false);
      setAdvisorStep('done');
    },
    [pushAdvisorMessage]
  );

  const handleAdvisorAnswer = useCallback(
    (value: string) => {
      if (!advisorActive) return;
      const answer = value.trim();
      if (!answer) return;

      pushAdvisorMessage('user', answer);

      if (advisorStep === 'recipient') {
        const next = { ...advisorAnswers, recipient: answer };
        setAdvisorAnswers(next);
        setAdvisorStep('occasion');
        pushAdvisorMessage('assistant', 'مناسبت خرید چیه؟');
        return;
      }

      if (advisorStep === 'occasion') {
        const next = { ...advisorAnswers, occasion: answer };
        setAdvisorAnswers(next);
        setAdvisorStep('budget');
        pushAdvisorMessage('assistant', 'بازه بودجه مدنظرت چیه؟');
        return;
      }

      if (advisorStep === 'budget') {
        const next = { ...advisorAnswers, budget: answer };
        setAdvisorAnswers(next);
        setAdvisorStep('style');
        pushAdvisorMessage('assistant', 'سبک هدیه رو ترجیح میدی کاربردی باشه یا احساسی/خاص؟');
        return;
      }

      if (advisorStep === 'style') {
        const next = { ...advisorAnswers, style: answer };
        setAdvisorAnswers(next);
        completeAdvisor(next);
      }
    },
    [advisorActive, advisorAnswers, advisorStep, completeAdvisor, pushAdvisorMessage]
  );

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextQuery = queryInput.trim();
    if (!nextQuery) return;

    if (advisorActive) {
      handleAdvisorAnswer(nextQuery);
      setQueryInput('');
      return;
    }

    if (isConsultationIntent(nextQuery)) {
      startAdvisor(nextQuery);
      setQueryInput('');
      return;
    }

    runQuery(nextQuery);
  };

  const applyViewportResult = useCallback(
    (viewport: MapViewport) => {
      const key = viewportCacheKey(viewport);
      const cachedIds = nearbyCacheRef.current[key];
      if (cachedIds) {
        const cached = cachedIds
          .map((id) => mockVideos.find((video) => video.id === id))
          .filter((video): video is VideoFeed => Boolean(video));
        setNearbyReels(cached);
        return;
      }

      const sampled = pickNearbyForViewport(viewport, mockVideos);
      nearbyCacheRef.current[key] = sampled.map((video) => video.id);
      setNearbyReels(sampled);

      try {
        sessionStorage.setItem(VIEWPORT_CACHE_KEY, JSON.stringify(nearbyCacheRef.current));
      } catch {
        // ignore cache write errors
      }
    },
    []
  );

  const scheduleViewportFetch = useCallback(
    (nextViewport: MapViewport) => {
      if (viewportDebounceRef.current) {
        window.clearTimeout(viewportDebounceRef.current);
      }

      viewportDebounceRef.current = window.setTimeout(() => {
        applyViewportResult(nextViewport);
      }, VIEWPORT_DEBOUNCE_MS);
    },
    [applyViewportResult]
  );

  useEffect(() => {
    return () => {
      if (viewportDebounceRef.current) {
        window.clearTimeout(viewportDebounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isNearbyMapOpen || nearbyInitialized) return;

    try {
      const denied = sessionStorage.getItem(LOCATION_DENIED_KEY) === '1';
      setLocationDenied(denied);

      const cachedLocationRaw = sessionStorage.getItem(LOCATION_SESSION_KEY);
      if (cachedLocationRaw) {
        const parsed = JSON.parse(cachedLocationRaw) as { cx: number; cy: number };
        setMapViewport((prev) => ({ ...prev, cx: parsed.cx, cy: parsed.cy }));
      }

      const viewportCacheRaw = sessionStorage.getItem(VIEWPORT_CACHE_KEY);
      if (viewportCacheRaw) {
        nearbyCacheRef.current = JSON.parse(viewportCacheRaw) as Record<string, string[]>;
      }
    } catch {
      // ignore cache read errors
    }

    setNearbyInitialized(true);
    scheduleViewportFetch(mapViewport);
  }, [isNearbyMapOpen, nearbyInitialized, mapViewport, scheduleViewportFetch]);

  const requestCoarseLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const center = toTehranGridCenter(position.coords.latitude, position.coords.longitude);
        if (!center) {
          scheduleViewportFetch(mapViewport);
          return;
        }

        const nextViewport = { ...mapViewport, cx: center.cx, cy: center.cy };
        setMapViewport(nextViewport);
        setLocationDenied(false);
        try {
          sessionStorage.setItem(LOCATION_DENIED_KEY, '0');
          sessionStorage.setItem(LOCATION_SESSION_KEY, JSON.stringify(center));
        } catch {
          // ignore cache write errors
        }

        scheduleViewportFetch(nextViewport);
      },
      () => {
        setLocationDenied(true);
        try {
          sessionStorage.setItem(LOCATION_DENIED_KEY, '1');
        } catch {
          // ignore cache write errors
        }
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000 * 60 * 60 * 6,
        timeout: 4500,
      }
    );
  };

  const handleMapPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    mapDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startCx: mapViewport.cx,
      startCy: mapViewport.cy,
    };
  };

  const handleMapPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!mapDragRef.current) return;

    const dx = e.clientX - mapDragRef.current.startX;
    const dy = e.clientY - mapDragRef.current.startY;
    const sensitivity = 0.13 / mapViewport.zoom;

    setMapViewport((prev) => ({
      ...prev,
      cx: clamp(mapDragRef.current!.startCx - dx * sensitivity, 0, 100),
      cy: clamp(mapDragRef.current!.startCy - dy * sensitivity, 0, 100),
    }));
  };

  const finishMapInteraction = () => {
    if (!mapDragRef.current) return;
    mapDragRef.current = null;
    scheduleViewportFetch(mapViewport);
  };

  const changeZoom = (delta: number) => {
    const nextZoom = clamp(mapViewport.zoom + delta, 1, 2.8);
    if (nextZoom === mapViewport.zoom) return;
    const nextViewport = { ...mapViewport, zoom: nextZoom };
    setMapViewport(nextViewport);
    scheduleViewportFetch(nextViewport);
  };

  const mapTransform = `translate(${(50 - mapViewport.cx) * 1.15}%, ${(50 - mapViewport.cy) * 1.15}%) scale(${mapViewport.zoom})`;
  const contextualAdvisorChips = useMemo(() => {
    if (!advisorActive) return [];
    if (advisorStep === 'occasion') return OCCASION_CHOICES;
    if (advisorStep === 'budget') return BUDGET_CHOICES;
    if (advisorStep === 'style') return STYLE_CHOICES;
    return ['بودجه کم', 'ترندهای امسال', 'استایل رسمی'];
  }, [advisorActive, advisorStep]);

  return (
    <>
      <div className="min-h-screen bg-zinc-50 pb-24">
        <DiscoverSearchAssistant
          queryInput={queryInput}
          onQueryInputChange={setQueryInput}
          onSubmit={handleSearchSubmit}
          quickChips={SUGGESTION_CHIPS}
          onQuickChipPress={runQuery}
          starterChip={JOURNEY_STARTER_CHIP}
          onStarterChipPress={() => startAdvisor(JOURNEY_STARTER_CHIP)}
          advisorActive={advisorActive}
          advisorCollapsed={advisorCollapsed}
          onToggleAdvisorCollapse={() => setAdvisorCollapsed((prev) => !prev)}
          advisorMessages={advisorMessages}
          contextualChips={contextualAdvisorChips}
          onContextChipPress={handleAdvisorAnswer}
        />

        <div className="px-1.5 pt-1.5">
          {isLoadingGrid ? (
            <div className="grid grid-cols-3 auto-rows-[120px] gap-1.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={`rounded-lg bg-zinc-200/70 animate-pulse ${i % 5 === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 auto-rows-[120px] gap-1.5 grid-flow-dense">
              {tiles.map(({ video, shape, span }) => (
                <button
                  key={video.id}
                  onClick={() => openReelInFeed(video.id)}
                  className={`relative overflow-hidden rounded-[10px] ${span}`}
                >
                  {video.id.startsWith('ldr-') ? (
                    <img
                      src={video.thumbnail}
                      alt={video.product?.name ?? video.username}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={() => markMediaFailed(video.id)}
                    />
                  ) : shape === 'portrait' ? (
                    <video
                      ref={(el) => {
                        gridVideoRefs.current[video.id] = el;
                      }}
                      src={video.videoUrl}
                      poster={video.thumbnail}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                      onMouseEnter={(e) => e.currentTarget.play().catch(() => undefined)}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                      onError={() => markMediaFailed(video.id)}
                    />
                  ) : (
                    <img
                      src={video.thumbnail}
                      alt={video.product?.name ?? video.username}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={() => markMediaFailed(video.id)}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                </button>
              ))}
            </div>
          )}
          <div ref={loadMoreRef} className="h-14" />
        </div>
      </div>

      {isNearbyMapOpen && (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[1px]" onClick={() => setIsNearbyMapOpen(false)}>
          <div className="absolute inset-x-0 top-0 mx-auto w-full max-w-[414px] h-[82vh] bg-white rounded-b-2xl border-b border-zinc-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-3 pt-12 pb-2 border-b border-zinc-200 flex items-center justify-between">
              <h2 className="text-lg font-bold">Nearby</h2>
              <button onClick={() => setIsNearbyMapOpen(false)} className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-3 py-2 border-b border-zinc-200 flex items-center justify-between gap-2">
              <button
                onClick={requestCoarseLocation}
                className="h-9 px-3 rounded-lg border border-zinc-300 text-sm font-semibold flex items-center gap-1.5 hover:bg-zinc-100"
              >
                <LocateFixed className="w-4 h-4" /> Use my area
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => changeZoom(-0.25)} className="w-8 h-8 rounded-lg border border-zinc-300 flex items-center justify-center hover:bg-zinc-100">
                  <Minus className="w-4 h-4" />
                </button>
                <button onClick={() => changeZoom(0.25)} className="w-8 h-8 rounded-lg border border-zinc-300 flex items-center justify-center hover:bg-zinc-100">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              className="relative h-[40vh] overflow-hidden bg-zinc-100 touch-none"
              onPointerDown={handleMapPointerDown}
              onPointerMove={handleMapPointerMove}
              onPointerUp={finishMapInteraction}
              onPointerCancel={finishMapInteraction}
            >
              <div
                className="absolute inset-0"
                style={{
                  transform: mapTransform,
                  transformOrigin: 'center',
                  transition: mapDragRef.current ? 'none' : 'transform 240ms ease-out',
                  background:
                    'radial-gradient(circle at 38% 40%, rgba(134,239,172,0.45) 0 18%, transparent 19%), radial-gradient(circle at 63% 58%, rgba(125,211,252,0.42) 0 20%, transparent 21%), linear-gradient(135deg, #e5e7eb 0%, #d4d4d8 100%)',
                }}
              />
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:36px_36px]" />
            </div>

            <div className="px-3 py-2 border-t border-zinc-200">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-semibold">Nearby Reels</p>
                {locationDenied && <p className="text-[11px] text-zinc-500">Location denied. Manual map mode.</p>}
              </div>

              {nearbyReels.length > 0 ? (
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {nearbyReels.map((video) => (
                    <button
                      key={`map-nearby-${video.id}`}
                      onClick={() => openReelInFeed(video.id)}
                      className="relative shrink-0 w-[34vw] max-w-[136px] aspect-[9/16] overflow-hidden rounded-[10px] bg-zinc-200"
                    >
                      <video
                        ref={(el) => {
                          nearbyVideoRefs.current[video.id] = el;
                        }}
                        src={video.videoUrl}
                        poster={video.thumbnail}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 py-2">Reels for this area will appear here after map movement.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
