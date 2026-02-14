import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

type Activity = {
  id: string;
  user: string;
  avatar: string;
  action: string;
  time: string;
  productThumb?: string;
};

const activities: Activity[] = [
  {
    id: 'n1',
    user: 'parisa_style',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    action: 'bought Leather Wallet',
    time: '2m ago',
    productThumb: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop',
  },
  {
    id: 'n2',
    user: 'ali_reviews',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    action: 'added Sunglasses to wishlist',
    time: '14m ago',
    productThumb: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop',
  },
  {
    id: 'n3',
    user: 'fateme_mod',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    action: 'sent you a follow request',
    time: '1h ago',
  },
  {
    id: 'n4',
    user: 'omid_compare',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    action: 'bought Minimalist Backpack',
    time: '3h ago',
    productThumb: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
  },
  {
    id: 'n5',
    user: 'niloofar_daily',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    action: 'added Smart Watch to wishlist',
    time: '5h ago',
    productThumb: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
  },
];

export default function Notifications() {
  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 bg-white border-b border-zinc-200 z-10 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Back to feed">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
      </div>

      <div className="divide-y divide-zinc-100">
        {activities.map((item) => (
          <div key={item.id} className="px-4 py-4 flex items-center gap-3">
            <img src={item.avatar} alt={item.user} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-800">
                <span className="font-semibold">{item.user}</span> {item.action}
              </p>
              <p className="text-xs text-zinc-500 mt-1">{item.time}</p>
            </div>
            {item.productThumb && (
              <img
                src={item.productThumb}
                alt="Product"
                className="w-12 h-12 rounded-lg object-cover border border-zinc-200 flex-shrink-0"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

