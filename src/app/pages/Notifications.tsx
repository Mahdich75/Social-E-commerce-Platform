import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';
import { mockProducts } from '../data/mockData';

const staticAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
const FEMALE_AVATAR_LINK =
  'https://cdn.nody.ir/files/2025/05/26/nody-%D8%B9%DA%A9%D8%B3-%D9%BE%D8%B1%D9%88%D9%81%D8%A7%DB%8C%D9%84-%D8%AF%D8%AE%D8%AA%D8%B1%D8%A7%D9%86%D9%87-%D8%A8%D8%AF%D9%88%D9%86-%DA%86%D9%87%D8%B1%D9%87-%D8%B9%DA%A9%D8%B3-%D9%BE%D8%B1%D9%88%D9%81%D8%A7%DB%8C%D9%84-%D8%AF%D8%AE%D8%AA%D8%B1%D8%A7%D9%86%D9%87-%D8%A8%D8%AF%D9%88%D9%86-%D8%B5%D9%88%D8%B1%D8%AA-%D8%B9%DA%A9%D8%B3-%D9%BE%D8%B1%D9%88%D9%81%D8%A7%DB%8C%D9%84-%D8%AF%D8%AE%D8%AA%D8%B1-%D8%A7%DB%8C%D8%B1%D8%A7%D9%86%DB%8C-%D8%A8%D8%AF%D9%88%D9%86-%D8%B5%D9%88%D8%B1%D8%AA-1748228111.jpg';

type Activity = {
  id: string;
  user: string;
  avatar: string;
  action: string;
  time: string;
  productThumb?: string;
};

const productImage = (id: string, fallback: string) => mockProducts.find((p) => p.id === id)?.image ?? fallback;

const activities: Activity[] = [
  {
    id: 'n1',
    user: 'parisa.style',
    avatar: staticAsset('/pics/avatars/avatar3.jpg'),
    action: 'کیف چرمی دست‌دوز را خرید',
    time: '۲ دقیقه پیش',
    productThumb: productImage('8', staticAsset('/images/reel-first-frames/ldr-70e033508449.jpg')),
  },
  {
    id: 'n2',
    user: 'ali.review',
    avatar: staticAsset('/pics/avatars/avatar1.jpg'),
    action: 'عینک آفتابی را به علاقه‌مندی‌ها اضافه کرد',
    time: '۱۴ دقیقه پیش',
    productThumb: productImage('5', staticAsset('/images/reel-first-frames/ldr-a3fe9f0c93dd.jpg')),
  },
  {
    id: 'n3',
    user: 'fateme.mod',
    avatar: FEMALE_AVATAR_LINK,
    action: 'برات درخواست دنبال‌کردن فرستاد',
    time: '۱ ساعت پیش',
  },
  {
    id: 'n4',
    user: 'omid.compare',
    avatar: staticAsset('/pics/avatars/avatar2.jpg'),
    action: 'کوله مینیمال را خرید',
    time: '۳ ساعت پیش',
    productThumb: productImage('13', staticAsset('/images/reel-first-frames/ldr-737d42a0d4bf.jpg')),
  },
  {
    id: 'n5',
    user: 'niloofar.daily',
    avatar: staticAsset('/pics/avatars/avatar3.jpg'),
    action: 'ساعت هوشمند را به علاقه‌مندی‌ها اضافه کرد',
    time: '۵ ساعت پیش',
    productThumb: productImage('10', staticAsset('/images/reel-first-frames/ldr-34dfe527ec64.jpg')),
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
