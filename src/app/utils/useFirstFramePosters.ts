import { useEffect, useMemo, useState } from 'react';

const inMemoryPosterByUrl = new Map<string, string>();
const inflightByUrl = new Map<string, Promise<string | null>>();

const extractFirstFrame = async (videoUrl: string): Promise<string | null> => {
  if (inMemoryPosterByUrl.has(videoUrl)) return inMemoryPosterByUrl.get(videoUrl) ?? null;
  if (inflightByUrl.has(videoUrl)) return inflightByUrl.get(videoUrl) ?? null;

  const task = new Promise<string | null>((resolve) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = videoUrl;

    const cleanup = () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
    };

    const fail = () => {
      cleanup();
      resolve(null);
    };

    video.onerror = fail;

    video.onloadeddata = () => {
      const capture = () => {
        try {
          const width = Math.max(1, video.videoWidth || 360);
          const height = Math.max(1, video.videoHeight || 640);
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return fail();
          ctx.drawImage(video, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
          inMemoryPosterByUrl.set(videoUrl, dataUrl);
          cleanup();
          resolve(dataUrl);
        } catch {
          fail();
        }
      };

      // For better first-frame reliability across browsers.
      if (video.currentTime < 0.02) {
        video.currentTime = 0.02;
        video.onseeked = capture;
      } else {
        capture();
      }
    };

    video.load();
  }).finally(() => {
    inflightByUrl.delete(videoUrl);
  });

  inflightByUrl.set(videoUrl, task);
  return task;
};

export const useFirstFramePosters = (items: Array<{ id: string; videoUrl?: string; fallback?: string }>) => {
  const [posterMap, setPosterMap] = useState<Record<string, string>>({});

  const normalized = useMemo(
    () => items.filter((item) => Boolean(item.id) && Boolean(item.videoUrl)) as Array<{ id: string; videoUrl: string; fallback?: string }>,
    [items]
  );

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      for (const item of normalized) {
        const cached = inMemoryPosterByUrl.get(item.videoUrl);
        if (cached) {
          if (!cancelled) {
            setPosterMap((prev) => (prev[item.id] === cached ? prev : { ...prev, [item.id]: cached }));
          }
          continue;
        }

        const extracted = await extractFirstFrame(item.videoUrl);
        if (cancelled || !extracted) continue;
        setPosterMap((prev) => (prev[item.id] === extracted ? prev : { ...prev, [item.id]: extracted }));
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [normalized]);

  return useMemo(() => {
    const merged: Record<string, string> = {};
    items.forEach((item) => {
      merged[item.id] = posterMap[item.id] || item.fallback || '';
    });
    return merged;
  }, [items, posterMap]);
};

