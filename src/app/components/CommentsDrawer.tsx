import { useState } from 'react';
import { X, Heart, Send } from 'lucide-react';
import { reelCommentsFa } from '../data/mockData';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from './ui/drawer';

interface Comment {
  id: string;
  username: string;
  userAvatar: string;
  text: string;
  likes: number;
  timestamp: string;
}

interface CommentsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
  commentsCount: number;
  commentsOverride?: string[];
}

const mockUsers = [
  {
    username: 'parisa_style',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    username: 'ali_reviews',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43d?w=100&h=100&fit=crop',
  },
  {
    username: 'sahar_shop',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
  {
    username: 'milad_tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    username: 'niloofar_daily',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
  },
  {
    username: 'reza_buyguide',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  },
  {
    username: 'fateme_mod',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
  },
  {
    username: 'omid_compare',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
  },
];

export function CommentsDrawer({ open, onOpenChange, videoId, commentsCount, commentsOverride }: CommentsDrawerProps) {
  const [newComment, setNewComment] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const fallbackComments = [
    'خیلی قشنگه 😍',
    'کارِ دست؟ فوق‌العاده‌ست 👏',
    'رنگ‌بندی‌ها دلبره 💙✨',
    'قیمتش برای هدیه خیلی خوبه، موجودی رنگ کرم هم دارید؟',
    'من اینو برای ست اتاقم می‌خوام، عاشق جزئیاتشم 🫶',
  ];

  const commentsForVideo = commentsOverride ?? reelCommentsFa[videoId] ?? fallbackComments;
  const generatedComments: Comment[] = commentsForVideo.map((text, index) => {
    const user = mockUsers[index % mockUsers.length];
    return {
      id: `${videoId}-${index + 1}`,
      username: user.username,
      userAvatar: user.avatar,
      text,
      likes: 18 + (index + 1) * 7,
      timestamp: `${index + 1} ساعت پیش`,
    };
  });

  const toggleLike = (commentId: string) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleSendComment = () => {
    if (newComment.trim()) {
      setNewComment('');
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} dismissible shouldScaleBackground={false}>
      <DrawerContent className="max-h-[85vh]">
        <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto mt-3 mb-2" />

        <DrawerHeader className="border-b border-zinc-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-lg font-bold">
              {Math.max(commentsCount, generatedComments.length)} نظر
            </DrawerTitle>
            <DrawerClose asChild>
              <button
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                aria-label="Close comments"
              >
                <X className="w-5 h-5" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4" dir="rtl">
          <div className="space-y-6">
            {generatedComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.userAvatar}
                  alt={comment.username}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-right">{comment.username}</p>
                      <p className="text-sm text-zinc-700 mt-1 break-words text-right">{comment.text}</p>
                      <div className="flex items-center gap-4 mt-2 justify-end">
                        <span className="text-xs text-zinc-500">{comment.timestamp}</span>
                        <button className="text-xs text-zinc-500 font-semibold hover:text-zinc-700 transition-colors">
                          پاسخ
                        </button>
                        {likedComments.has(comment.id) && (
                          <span className="text-xs text-zinc-700 font-semibold">
                            {comment.likes + 1} لایک
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleLike(comment.id)}
                      className="flex flex-col items-center gap-1 flex-shrink-0 p-1"
                    >
                      <Heart
                        className={`w-4 h-4 transition-all ${
                          likedComments.has(comment.id)
                            ? 'fill-red-500 text-red-500 scale-110'
                            : 'text-zinc-400 hover:text-red-400'
                        }`}
                      />
                      {!likedComments.has(comment.id) && (
                        <span className="text-[10px] text-zinc-500">{comment.likes}</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-200 p-4 bg-white sticky bottom-0">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
              alt="Your avatar"
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1 flex items-center gap-2 bg-zinc-100 rounded-full px-4 py-2.5" dir="rtl">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                placeholder="نظر خودتو بنویس..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-500 text-right"
              />
              <button
                onClick={handleSendComment}
                disabled={!newComment.trim()}
                className={`transition-colors ${
                  newComment.trim() ? 'text-black hover:opacity-70' : 'text-zinc-400'
                }`}
                aria-label="Send comment"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
