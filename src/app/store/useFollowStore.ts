import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FollowStore {
  followedUsernames: string[];
  toggleFollow: (username: string) => void;
  isFollowing: (username: string) => boolean;
}

export const useFollowStore = create<FollowStore>()(
  persist(
    (set, get) => ({
      followedUsernames: [],

      toggleFollow: (username) => {
        const normalized = username.trim().replace(/^@/, '');
        if (!normalized) return;

        const followed = get().followedUsernames;
        const exists = followed.includes(normalized);
        set({
          followedUsernames: exists
            ? followed.filter((item) => item !== normalized)
            : [normalized, ...followed],
        });
      },

      isFollowing: (username) => {
        const normalized = username.trim().replace(/^@/, '');
        return get().followedUsernames.includes(normalized);
      },
    }),
    {
      name: 'follow-store-v1',
      partialize: (state) => ({ followedUsernames: state.followedUsernames }),
    }
  )
);

