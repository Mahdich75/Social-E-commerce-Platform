import { create } from 'zustand';

interface ReelStore {
  likedReels: string[];
  toggleLike: (reelId: string) => void;
  isLiked: (reelId: string) => boolean;
}

export const useReelStore = create<ReelStore>((set, get) => ({
  likedReels: [],

  toggleLike: (reelId) => {
    const alreadyLiked = get().likedReels.includes(reelId);
    set({
      likedReels: alreadyLiked
        ? get().likedReels.filter((id) => id !== reelId)
        : [...get().likedReels, reelId],
    });
  },

  isLiked: (reelId) => get().likedReels.includes(reelId),
}));

