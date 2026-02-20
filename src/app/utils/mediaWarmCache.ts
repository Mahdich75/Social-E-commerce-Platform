const warmedImages = new Set<string>();
const warmedVideos = new Set<string>();

const getConnectionHints = () => {
  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  const saveData = Boolean(connection?.saveData);
  const effectiveType = connection?.effectiveType ?? '4g';
  const isSlow = /(^2g$|^slow-2g$|^3g$)/i.test(effectiveType);
  return { saveData, isSlow };
};

export const getWarmBudget = () => {
  const { saveData, isSlow } = getConnectionHints();
  if (saveData) return { feedCacheSize: 4, discoverWarmupCount: 1 };
  if (isSlow) return { feedCacheSize: 6, discoverWarmupCount: 2 };
  return { feedCacheSize: 10, discoverWarmupCount: 4 };
};

export const warmImage = (src?: string) => {
  if (!src || warmedImages.has(src)) return;
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  warmedImages.add(src);
};

export const warmVideoMetadata = (src?: string) => {
  if (!src || warmedVideos.has(src)) return;
  const video = document.createElement('video');
  video.preload = 'metadata';
  video.muted = true;
  video.playsInline = true;
  video.src = src;
  // Trigger a lightweight metadata fetch without attaching the node to UI.
  video.load();
  warmedVideos.add(src);
};

export const isVideoWarmed = (src?: string) => (src ? warmedVideos.has(src) : false);

