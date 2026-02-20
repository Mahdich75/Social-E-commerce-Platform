import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X, LocateFixed, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { mockVideos } from '../data/mockData';
import { VideoFeed } from '../types';
import { sanitizeCaptionText } from '../utils/sanitizeCaption';
import { DiscoverSearchAssistant } from '../components/discover/DiscoverSearchAssistant';
import { getWarmBudget, warmImage, warmVideoMetadata } from '../utils/mediaWarmCache';
import { useFirstFramePosters } from '../utils/useFirstFramePosters';

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

type MapPoint = { x: number; y: number; lat: number; lng: number; city: string };
type MapMarker = { x: number; y: number; count: number; reelIds: string[] };
type AdvisorScenarioStep = { id: string; question: string; chips: string[] };
type AdvisorScenario = {
  id: string;
  chip: string;
  title: string;
  triggerPatterns: string[];
  seedPrompt: string;
  steps: AdvisorScenarioStep[];
  followUps: string[];
  searchSeed: string;
};
type AdvisorMessage = { id: string; role: 'assistant' | 'user'; text: string };

const SUGGESTION_CHIPS = ['Nearby', 'ترندهای امسال', 'استایل مینیمال', 'پیشنهاد برای عید ✨', 'چی با این رنگ ست میشه؟'];
const JOURNEY_STARTER_CHIP = 'یه هدیه برای مادرم بخرم';
const ADVISOR_SCENARIOS: AdvisorScenario[] = [
  {
    id: 'gift_mother',
    chip: 'هدیه برای مادر',
    title: 'سناریو: خرید هدیه برای مادر',
    triggerPatterns: ['هدیه', 'مادر', 'مامان'],
    seedPrompt: 'می‌خوام برای مادرم یه هدیه بخرم',
    searchSeed: 'هدیه مادر',
    steps: [
      { id: 'occasion', question: 'مناسبت چیه؟', chips: ['تولد', 'روز مادر', 'بی‌مناسبت'] },
      { id: 'budget', question: 'حدود بودجه‌ات چقدره؟', chips: ['تا ۱.۵ میلیون', '۱.۵ تا ۳ میلیون', 'بالاتر از ۳ میلیون'] },
      { id: 'style', question: 'چه سبک هدیه‌ای می‌خوای؟', chips: ['احساسی', 'کاربردی', 'لوکس'] },
      { id: 'delivery', question: 'زمان تحویل مهمه؟', chips: ['ارسال فوری', 'تا ۳ روز', 'مهم نیست'] },
    ],
    followUps: ['گزینه‌های اقتصادی‌تر', 'ترندهای امسال', 'کادوهای احساسی'],
  },
  {
    id: 'gift_friend',
    chip: 'هدیه تولد دوست',
    title: 'سناریو: هدیه تولد برای دوست',
    triggerPatterns: ['دوست', 'تولد دوست', 'کادوی دوست'],
    seedPrompt: 'برای تولد دوستم دنبال هدیه‌ام',
    searchSeed: 'هدیه تولد دوست',
    steps: [
      { id: 'gender', question: 'هدیه برای دوست خانم یا آقاست؟', chips: ['خانم', 'آقا', 'فرقی نداره'] },
      { id: 'budget', question: 'بودجه مدنظرت چقدره؟', chips: ['تا ۱ میلیون', '۱ تا ۲.۵ میلیون', 'بالاتر'] },
      { id: 'tone', question: 'حس هدیه چی باشه؟', chips: ['فان', 'خاص', 'کاربردی'] },
      { id: 'delivery', question: 'تحویل سریع می‌خوای؟', chips: ['بله', 'خیر'] },
    ],
    followUps: ['هدیه‌های خاص‌تر', 'بسته‌بندی کادویی', 'گزینه‌های زیر ۱ میلیون'],
  },
  {
    id: 'home_relax',
    chip: 'آرامش خونه',
    title: 'سناریو: خرید برای آرامش خانه',
    triggerPatterns: ['آرامش', 'خونه', 'ریلکس'],
    seedPrompt: 'برای آرامش خونه چی بخرم؟',
    searchSeed: 'آرامش خانه',
    steps: [
      { id: 'target', question: 'بیشتر برای چی می‌خوای؟', chips: ['بدن و سلامتی', 'دکور', 'سرگرمی'] },
      { id: 'budget', question: 'بودجه حدودی؟', chips: ['اقتصادی', 'متوسط', 'پریمیوم'] },
      { id: 'usage', question: 'استفاده روزانه یا گاهی؟', chips: ['روزانه', 'گاهی'] },
      { id: 'delivery', question: 'ارسال فوری نیاز داری؟', chips: ['بله', 'نه'] },
    ],
    followUps: ['گزینه‌های کم‌هزینه', 'محصولات پرفروش این دسته', 'مقایسه کاربردی'],
  },
  {
    id: 'formal_style',
    chip: 'استایل مهمونی رسمی',
    title: 'سناریو: استایل مهمانی رسمی',
    triggerPatterns: ['مهمونی رسمی', 'استایل رسمی', 'لباس رسمی'],
    seedPrompt: 'برای مهمونی رسمی چی بپوشم؟',
    searchSeed: 'استایل رسمی',
    steps: [
      { id: 'event', question: 'نوع مهمونی چیه؟', chips: ['نامزدی', 'عروسی', 'جلسه رسمی'] },
      { id: 'palette', question: 'رنگ مورد علاقه؟', chips: ['خنثی', 'گرم', 'سرد'] },
      { id: 'budget', question: 'بودجه‌ات چقدره؟', chips: ['تا ۲ میلیون', '۲ تا ۵ میلیون', 'بیشتر'] },
      { id: 'priority', question: 'اولویتت چیه؟', chips: ['شیک بودن', 'راحتی', 'ترکیب هر دو'] },
    ],
    followUps: ['استایل مینیمال رسمی', 'اکسسوری مناسب', 'ترند رسمی امسال'],
  },
];

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
const TEHRAN_BOUNDS = {
  minLat: 35.5,
  maxLat: 35.95,
  minLng: 51.1,
  maxLng: 51.75,
};

const toGeoFromGrid = (x: number, y: number) => {
  const lng = TEHRAN_BOUNDS.minLng + (x / 100) * (TEHRAN_BOUNDS.maxLng - TEHRAN_BOUNDS.minLng);
  const lat = TEHRAN_BOUNDS.maxLat - (y / 100) * (TEHRAN_BOUNDS.maxLat - TEHRAN_BOUNDS.minLat);
  return { lat, lng };
};

const REEL_MAP_POINTS: Record<string, MapPoint> = {
  v5: { x: 47, y: 52, city: 'tehran', ...toGeoFromGrid(47, 52) },
  v7: { x: 44, y: 57, city: 'tehran', ...toGeoFromGrid(44, 57) },
  v8: { x: 55, y: 48, city: 'tehran', ...toGeoFromGrid(55, 48) },
  v9: { x: 50, y: 44, city: 'tehran', ...toGeoFromGrid(50, 44) },
  v10: { x: 42, y: 61, city: 'tehran', ...toGeoFromGrid(42, 61) },
  v11: { x: 58, y: 63, city: 'tehran', ...toGeoFromGrid(58, 63) },
  v12: { x: 69, y: 46, city: 'tehran', ...toGeoFromGrid(69, 46) },
  v13: { x: 73, y: 52, city: 'tehran', ...toGeoFromGrid(73, 52) },
  v14: { x: 66, y: 58, city: 'tehran', ...toGeoFromGrid(66, 58) },
  v16: { x: 31, y: 54, city: 'tehran', ...toGeoFromGrid(31, 54) },
  v17: { x: 28, y: 49, city: 'tehran', ...toGeoFromGrid(28, 49) },
  v18: { x: 36, y: 58, city: 'tehran', ...toGeoFromGrid(36, 58) },
  v19: { x: 33, y: 45, city: 'tehran', ...toGeoFromGrid(33, 45) },
  v20: { x: 49, y: 68, city: 'tehran', ...toGeoFromGrid(49, 68) },
  v21: { x: 26, y: 64, city: 'tehran', ...toGeoFromGrid(26, 64) },
};

const isConsultationIntent = (value: string) => {
  const q = value.trim().toLowerCase();
  if (!q) return false;
  return ADVISOR_SCENARIOS.some((scenario) => scenario.triggerPatterns.some((pattern) => q.includes(pattern)));
};

const matchAdvisorScenario = (value: string) => {
  const q = value.trim().toLowerCase();
  return (
    ADVISOR_SCENARIOS.find((scenario) => scenario.triggerPatterns.some((pattern) => q.includes(pattern))) ??
    ADVISOR_SCENARIOS[0]
  );
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

const getVisibleMapPoints = (viewport: MapViewport) => {
  const b = viewportToBounds(viewport);
  return Object.entries(REEL_MAP_POINTS)
    .filter(([, point]) => point.x >= b.minX && point.x <= b.maxX && point.y >= b.minY && point.y <= b.maxY)
    .map(([reelId, point]) => ({ reelId, point }));
};

const buildMapMarkers = (viewport: MapViewport): MapMarker[] => {
  const visible = getVisibleMapPoints(viewport);
  if (visible.length === 0) return [];

  // Zoom-aware cell clustering keeps marker density low when zoomed out
  // while naturally separating markers as users zoom in.
  const clusterCell = viewport.zoom <= 1.15 ? 12 : viewport.zoom <= 1.7 ? 8 : 5;
  const clusters = new Map<string, { sumX: number; sumY: number; count: number; reelIds: string[] }>();

  visible.forEach(({ reelId, point }) => {
    const cellX = Math.floor(point.x / clusterCell);
    const cellY = Math.floor(point.y / clusterCell);
    const key = `${cellX}:${cellY}`;
    const cluster = clusters.get(key);
    if (!cluster) {
      clusters.set(key, { sumX: point.x, sumY: point.y, count: 1, reelIds: [reelId] });
      return;
    }
    cluster.sumX += point.x;
    cluster.sumY += point.y;
    cluster.count += 1;
    cluster.reelIds.push(reelId);
  });

  return Array.from(clusters.values()).map((cluster) => ({
    x: cluster.sumX / cluster.count,
    y: cluster.sumY / cluster.count,
    count: cluster.count,
    reelIds: cluster.reelIds,
  }));
};

const pickNearbyForViewport = (viewport: MapViewport, source: VideoFeed[]) => {
  const visibleIds = new Set(getVisibleMapPoints(viewport).map((item) => item.reelId));
  return source
    .filter((video) => visibleIds.has(video.id))
    .slice(0, NEARBY_SAMPLE_MAX);
};

const toTehranGridCenter = (lat: number, lng: number): { cx: number; cy: number } | null => {
  const { minLat, maxLat, minLng, maxLng } = TEHRAN_BOUNDS;
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
  const [isNearbyLoading, setIsNearbyLoading] = useState(false);
  const [nearbyInitialized, setNearbyInitialized] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [mapViewport, setMapViewport] = useState<MapViewport>({ cx: 50, cy: 52, zoom: 1 });
  const [advisorActive, setAdvisorActive] = useState(false);
  const [advisorFullscreen, setAdvisorFullscreen] = useState(false);
  const [advisorStepIndex, setAdvisorStepIndex] = useState(0);
  const [advisorCollapsed, setAdvisorCollapsed] = useState(false);
  const [advisorMessages, setAdvisorMessages] = useState<AdvisorMessage[]>([]);
  const [advisorScenarioId, setAdvisorScenarioId] = useState(ADVISOR_SCENARIOS[0].id);
  const [advisorAnswers, setAdvisorAnswers] = useState<string[]>([]);

  const gridTileRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const checkedMediaIdsRef = useRef<Set<string>>(new Set());
  const viewportDebounceRef = useRef<number | null>(null);
  const nearbyCacheRef = useRef<Record<string, string[]>>({});
  const mapDragRef = useRef<{ startX: number; startY: number; startCx: number; startCy: number } | null>(null);
  const warmIntentTimeoutRef = useRef<number | null>(null);
  const [nearViewportIds, setNearViewportIds] = useState<Record<string, true>>({});
  const [primedVideoIds, setPrimedVideoIds] = useState<Record<string, true>>({});
  const scrollDirectionRef = useRef<'down' | 'up'>('down');
  const lastWindowScrollYRef = useRef(0);

  const rankedVideos = useMemo(
    () => rankBySemanticIntent(mockVideos, activeQuery).filter((video) => !failedMediaIds[video.id]),
    [activeQuery, failedMediaIds]
  );
  const tiles = useMemo(() => getTileConfig(rankedVideos.slice(0, visibleCount)), [rankedVideos, visibleCount]);
  const firstFramePosterById = useFirstFramePosters(
    rankedVideos.slice(0, visibleCount + 6).map((video) => ({
      id: video.id,
      videoUrl: video.videoUrl,
    }))
  );

  const markMediaFailed = useCallback((videoId: string) => {
    setFailedMediaIds((prev) => {
      if (prev[videoId]) return prev;
      return { ...prev, [videoId]: true };
    });
  }, []);

  useEffect(() => {
    const candidates = rankedVideos.slice(0, Math.min(visibleCount + 6, rankedVideos.length));
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
    const nodes = Object.values(gridTileRefs.current).filter((node): node is HTMLButtonElement => Boolean(node));
    if (nodes.length === 0) return;

    // Track only tiles near viewport and progressively warm nearby media.
    const observer = new IntersectionObserver(
      (entries) => {
        const next: Record<string, true> = {};
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = (entry.target as HTMLButtonElement).dataset.videoId;
          if (!id) return;
          next[id] = true;
        });
        setNearViewportIds((prev) => ({ ...prev, ...next }));
      },
      { rootMargin: '220px 0px', threshold: [0.01, 0.2] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [tiles]);

  useEffect(() => {
    const ordered = rankedVideos.filter((video) => nearViewportIds[video.id]);
    const warmCount = getWarmBudget().discoverWarmupCount;
    const source = scrollDirectionRef.current === 'down' ? ordered : [...ordered].reverse();
    source.slice(0, warmCount).forEach((video) => {
      warmImage(video.thumbnail);
      warmVideoMetadata(video.videoUrl);
      setPrimedVideoIds((prev) => (prev[video.id] ? prev : { ...prev, [video.id]: true }));
    });
  }, [nearViewportIds, rankedVideos]);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      scrollDirectionRef.current = current >= lastWindowScrollYRef.current ? 'down' : 'up';
      lastWindowScrollYRef.current = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openReelInFeed = (videoId: string) => {
    navigate(`/?reel=${encodeURIComponent(videoId)}`);
  };

  const activeAdvisorScenario = useMemo(
    () => ADVISOR_SCENARIOS.find((scenario) => scenario.id === advisorScenarioId) ?? ADVISOR_SCENARIOS[0],
    [advisorScenarioId]
  );
  const advisorCompleted = advisorStepIndex >= activeAdvisorScenario.steps.length;

  const runQuery = useCallback((nextQuery: string) => {
    if (nextQuery === 'Nearby') {
      setIsNearbyMapOpen(true);
      return;
    }

    setQueryInput(nextQuery);
    setActiveQuery(nextQuery);
    setVisibleCount(18);
  }, []);

  const pushAdvisorMessage = useCallback((role: AdvisorMessage['role'], text: string) => {
    setAdvisorMessages((prev) => [...prev, { id: `${role}-${Date.now()}-${Math.random()}`, role, text }]);
  }, []);

  const closeAdvisor = useCallback(() => {
    setAdvisorActive(false);
    setAdvisorFullscreen(false);
    setAdvisorCollapsed(false);
    setAdvisorStepIndex(0);
    setAdvisorAnswers([]);
    setAdvisorMessages([]);
  }, []);

  const startAdvisor = useCallback((seedQuestion: string, scenarioId?: string) => {
    const scenario =
      ADVISOR_SCENARIOS.find((item) => item.id === (scenarioId ?? '')) ??
      matchAdvisorScenario(seedQuestion);
    setAdvisorScenarioId(scenario.id);
    setAdvisorActive(true);
    setAdvisorFullscreen(false);
    setAdvisorStepIndex(0);
    setAdvisorCollapsed(false);
    setAdvisorAnswers([]);
    setAdvisorMessages([
      { id: 'a-1', role: 'assistant', text: `${scenario.title} فعال شد.` },
      { id: 'u-seed', role: 'user', text: seedQuestion || scenario.seedPrompt },
      { id: 'a-2', role: 'assistant', text: scenario.steps[0]?.question ?? 'چه کمکی می‌خوای؟' },
    ]);
  }, []);

  const completeAdvisor = useCallback(
    (scenario: AdvisorScenario, answers: string[]) => {
      const composedQuery = [scenario.searchSeed, ...answers].join(' ').trim();
      pushAdvisorMessage('assistant', 'پیشنهادها آماده شد و اکسپلور دقیق‌تر شد. اگر خواستی می‌تونیم دوباره refine کنیم.');
      setQueryInput('');
      setActiveQuery(composedQuery);
      setVisibleCount(18);
      setAdvisorStepIndex(scenario.steps.length);
    },
    [pushAdvisorMessage]
  );

  const handleAdvisorAnswer = useCallback(
    (value: string) => {
      if (!advisorActive) return;
      const answer = value.trim();
      if (!answer) return;

      pushAdvisorMessage('user', answer);
      const scenario = activeAdvisorScenario;
      if (advisorCompleted) {
        runQuery(answer);
        pushAdvisorMessage('assistant', 'اکسپلور با ورودی جدیدت دوباره تنظیم شد.');
        return;
      }

      const nextAnswers = [...advisorAnswers, answer];
      const nextStepIndex = advisorStepIndex + 1;
      setAdvisorAnswers(nextAnswers);
      setAdvisorStepIndex(nextStepIndex);

      if (nextStepIndex >= scenario.steps.length) {
        completeAdvisor(scenario, nextAnswers);
        return;
      }

      pushAdvisorMessage('assistant', scenario.steps[nextStepIndex].question);
    },
    [
      activeAdvisorScenario,
      advisorActive,
      advisorAnswers,
      advisorCompleted,
      advisorStepIndex,
      completeAdvisor,
      pushAdvisorMessage,
      runQuery,
    ]
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
      const matched = matchAdvisorScenario(nextQuery);
      startAdvisor(nextQuery, matched.id);
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
        setIsNearbyLoading(false);
        return;
      }

      const sampled = pickNearbyForViewport(viewport, mockVideos);
      nearbyCacheRef.current[key] = sampled.map((video) => video.id);
      setNearbyReels(sampled);
      setIsNearbyLoading(false);

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
      setIsNearbyLoading(true);

      // Debounced viewport sync prevents excessive recompute/API-like churn
      // while keeping map -> reels updates responsive after movement settles.
      viewportDebounceRef.current = window.setTimeout(() => {
        applyViewportResult(nextViewport);
      }, VIEWPORT_DEBOUNCE_MS);
    },
    [applyViewportResult]
  );

  useEffect(() => {
    if (isNearbyMapOpen) return;
    if (viewportDebounceRef.current) {
      window.clearTimeout(viewportDebounceRef.current);
    }
    mapDragRef.current = null;
    setIsNearbyLoading(false);
  }, [isNearbyMapOpen]);

  useEffect(() => {
    return () => {
      if (viewportDebounceRef.current) {
        window.clearTimeout(viewportDebounceRef.current);
      }
      if (warmIntentTimeoutRef.current) {
        window.clearTimeout(warmIntentTimeoutRef.current);
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
  const mapMarkers = useMemo(() => buildMapMarkers(mapViewport), [mapViewport]);
  const advisorScenarioChips = useMemo(() => ADVISOR_SCENARIOS.map((item) => item.chip), []);
  const contextualAdvisorChips = useMemo(() => {
    if (!advisorActive) return [];
    if (advisorCompleted) return activeAdvisorScenario.followUps;
    return activeAdvisorScenario.steps[advisorStepIndex]?.chips ?? [];
  }, [activeAdvisorScenario, advisorActive, advisorCompleted, advisorStepIndex]);

  useEffect(() => {
    if (!advisorFullscreen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [advisorFullscreen]);

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
          onStarterChipPress={() => startAdvisor(JOURNEY_STARTER_CHIP, 'gift_mother')}
          scenarioChips={advisorScenarioChips}
          onScenarioChipPress={(value) => {
            const scenario = ADVISOR_SCENARIOS.find((item) => item.chip === value);
            if (!scenario) return runQuery(value);
            startAdvisor(scenario.seedPrompt, scenario.id);
          }}
          advisorActive={advisorActive}
          advisorCollapsed={advisorCollapsed}
          advisorFullscreen={advisorFullscreen}
          onToggleAdvisorFullscreen={() => setAdvisorFullscreen((prev) => !prev)}
          onCloseAdvisor={closeAdvisor}
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
              {tiles.map(({ video, span }) => (
                <button
                  key={video.id}
                  ref={(el) => {
                    gridTileRefs.current[video.id] = el;
                  }}
                  data-video-id={video.id}
                  onClick={() => openReelInFeed(video.id)}
                  onMouseEnter={() => {
                    if (warmIntentTimeoutRef.current) window.clearTimeout(warmIntentTimeoutRef.current);
                    // Intent-based warmup: pre-warm video metadata only when interaction is likely.
                    warmIntentTimeoutRef.current = window.setTimeout(() => {
                      warmVideoMetadata(video.videoUrl);
                      setPrimedVideoIds((prev) => (prev[video.id] ? prev : { ...prev, [video.id]: true }));
                    }, 140);
                  }}
                  onMouseLeave={() => {
                    if (warmIntentTimeoutRef.current) {
                      window.clearTimeout(warmIntentTimeoutRef.current);
                      warmIntentTimeoutRef.current = null;
                    }
                  }}
                  className={`relative overflow-hidden rounded-[10px] ${span}`}
                >
                  {nearViewportIds[video.id] || primedVideoIds[video.id] ? (
                    <video
                      src={video.videoUrl}
                      poster={firstFramePosterById[video.id] || undefined}
                      muted
                      playsInline
                      preload={nearViewportIds[video.id] ? 'metadata' : 'none'}
                      className="w-full h-full object-cover"
                      onError={() => markMediaFailed(video.id)}
                    />
                  ) : (
                    <img
                      src={firstFramePosterById[video.id] || video.thumbnail}
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
              <div className="absolute inset-0 pointer-events-none">
                {mapMarkers.map((marker, idx) => (
                  <div
                    key={`marker-${idx}`}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-red-500 text-white shadow-sm ${
                      marker.count > 1 ? 'h-[18px] min-w-[18px] px-1 text-[10px] font-semibold flex items-center justify-center' : 'w-3.5 h-3.5'
                    }`}
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    aria-hidden
                  >
                    {marker.count > 1 ? marker.count : null}
                  </div>
                ))}
              </div>
              {isNearbyLoading && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="h-8 px-3 rounded-full bg-black/55 text-white text-xs font-semibold">Updating nearby reels...</div>
                </div>
              )}
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
                        src={video.videoUrl}
                        poster={firstFramePosterById[video.id] || undefined}
                        muted
                        loop
                        playsInline
                        preload="none"
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
