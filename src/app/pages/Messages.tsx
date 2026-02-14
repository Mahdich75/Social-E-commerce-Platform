import { ChevronLeft, Search } from 'lucide-react';
import { Link } from 'react-router';

const conversations = [
  {
    id: 'm1',
    username: 'parisa_style',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    lastMessage: 'سلام، رنگ مشکیش هم موجوده؟',
    timestamp: '2m',
  },
  {
    id: 'm2',
    username: 'ali_reviews',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    lastMessage: 'سفارش من کی ارسال میشه؟',
    timestamp: '18m',
  },
  {
    id: 'm3',
    username: 'niloofar_daily',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    lastMessage: 'کیفیتش عالی بود، مرسی 🙌',
    timestamp: '1h',
  },
];

export default function Messages() {
  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 bg-white border-b border-zinc-200 z-10 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="p-2 -ml-2 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Back to feed">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        <div className="bg-zinc-100 rounded-full px-4 py-2.5 flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-500">Search chats</span>
        </div>
      </div>

      <div className="divide-y divide-zinc-100">
        {conversations.map((chat) => (
          <button key={chat.id} className="w-full px-4 py-4 flex items-center gap-3 hover:bg-zinc-50 transition-colors text-left">
            <img src={chat.avatar} alt={chat.username} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{chat.username}</p>
              <p className="text-sm text-zinc-600 truncate">{chat.lastMessage}</p>
            </div>
            <span className="text-xs text-zinc-500">{chat.timestamp}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

