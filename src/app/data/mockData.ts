import { Product, VideoFeed } from '../types';

const staticAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const mockProducts: Product[] = [
  {
    id: '1',
    category: 'accessory',
    name: 'هدبند گل‌دوزی‌شده',
    price: 29.99,
    image: 'https://dkstatics-public.digikala.com/digikala-products/05602f23a8f7d6511716ab5fceeeda9d9fecb883_1737840704.jpg?x-oss-process=image/resize,m_lfit,h_800,w_800/quality,q_90',
    description: 'هدبند گل‌دوزی‌شده زیبا 🌸، مناسب برای استایل خاص و جلوه بیشتر در هر موقعیت!',
    sizes: ['One Size'],
    rating: 4.8,
    reviews: 256,
  },
  {
    id: '2',
    category: 'wearables',
    name: 'کیت نور دوقلوی دندانپزشکی اوسینو',
    price: 249.99,
    image: 'https://tse2.mm.bing.net/th/id/OIP.awWmYRb1LkPkl1d7cB1x0QHaHa?cb=defcachec2&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'کیت نور دوقلوی دندان‌پزشکی اوسینو؛ ترکیبی از نور یکنواخت، طراحی حرفه‌ای و عملکرد دقیق برای محیط‌های کلینیکی.',
    sizes: ['کوچک', 'متوسط', 'بزرگ'],
    colors: ['مشکی', 'نقره‌ای', 'طلایی'],
    rating: 4.7,
    reviews: 892,
  },
  {
    id: '3',
    category: 'accessories',
    name: 'بازی فکری Everdell',
    price: 79.99,
    image: 'https://th.bing.com/th/id/OIP.MyPy-noNXurOuxYrzGPktgHaHa?o=7&cb=defcachec2rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'طراحی چشم‌نواز و جمع‌وجور با اینسرت منظم؛ همه اجزای بازی دقیق و مرتب در جعبه قرار می‌گیرند.',
    sizes: ['تک‌سایز'],
    colors: ['سبز جنگلی', 'قهوه‌ای چوبی', 'کرم'],
    rating: 4.3,
    reviews: 567,
  },
  {
    id: '4',
    category: 'accessories',
    name: 'کرم کاندیشنر آف نیچر',
    price: 45.99,
    image: 'https://tse4.mm.bing.net/th/id/OIP.VflHillMV-3rM6_zhLo56QHaHa?cb=defcachec2&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'کرم کاندیشنر آف نیچر؛ تغذیه عمیق، نرمی ماندگار و مراقبت حرفه‌ای از مو ',
    sizes: ['One Size'],
    colors: ['Brown', 'Black'],
    rating: 4.6,
    reviews: 345,
  },
  {
    id: '5',
    category: 'eyewear',
    name: 'Sunglasses',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
    description: 'UV protection polarized lenses',
    sizes: ['One Size'],
    colors: ['Black', 'Tortoise', 'Blue'],
    rating: 4.8,
    reviews: 678,
  },
  {
    id: '6',
    category: 'footwear',
    name: 'Running Shoes',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    description: 'Lightweight and breathable athletic shoes',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['White', 'Black', 'Blue', 'Red'],
    rating: 4.4,
    reviews: 1567,
  },
];

const baseVideos: Omit<VideoFeed, 'similarReels'>[] = [
  {
    id: 'v1',
    videoUrl: staticAsset('/videos/reels1.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=414&h=896&fit=crop',
    username: 'golsare_nazi',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 4445,
    comments: 64,
    shares: 123,
    description: 'هدبند گل‌دوزی‌شده فوق‌العاده زیبا 🌸، بهترین انتخاب برای استایل خاص و جذاب شما!',
    hashtags: ['#هدبند', '#گل_دوزی', '#استایل_خاص', '#مد', '#زیبایی'],
    musicTitle: 'پاییز سردم',
    product: mockProducts[0],
    isLive: false,
  },
  {
    id: 'v2',
    videoUrl: staticAsset('/videos/reels2.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=414&h=896&fit=crop',
    username: 'olenz_ir',
    userAvatar: staticAsset('/pics/avatars/avatar2.jpg'),
    likes: 328700,
    comments: 578,
    shares: 891,
    description: 'رضایت‌بخش‌ترین آنباکسینگ کیت نور دندان‌پزشکی ✨ کیفیت، دقت و نور فوق‌العاده که از همون لحظه اول حس میشه.',
    hashtags: ['#دندانپزشکی', '#کیت_نور', '#تجهیزات_دندانپزشکی', '#آنباکسینگ', '#رضایت_بخش', '#کلینیک', '#ریلز'],
    musicTitle: 'Just Good Music 24/7 Stay See Live Radio 🎧',
    product: mockProducts[1],
    isLive: false,
  },
  {
    id: 'v3',
    videoUrl: staticAsset('/videos/reels3.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=414&h=896&fit=crop',
    username: 'fashionista_jane',
    userAvatar: staticAsset('/pics/avatars/avatar4.jpg'),
    likes: 12500,
    comments: 234,
    shares: 456,
    description: 'بازی فکری :contentReference[oaicite:0]{index=0}؛ دنیایی آرام و هنرمندانه از برنامه‌ریزی، استراتژی و ساخت شهر در دل طبیعت 🌳🦔',
    hashtags: ['#بازی_فکری', '#بردگیم', '#Everdell', '#بازی_استراتژیک', '#دورهمی', '#فکری'],
    musicTitle: 'موسیقی آرام لوفای – Chill Vibes',
    product: mockProducts[2],
    isLive: false,
  },
  {
    id: 'v4',
    videoUrl: staticAsset('/videos/reels4.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=414&h=896&fit=crop',
    username: 'style_guru',
    userAvatar: staticAsset('/pics/avatars/avatar3.jpg'),
    likes: 8900,
    comments: 156,
    shares: 234,
    description: 'کرم کاندیشنر آف نیچر؛ تغذیه عمیق، نرمی ماندگار و مراقبت حرفه‌ای از مو 🌿',
    hashtags: ['#مراقبت_مو', '#کاندیشنر', '#آف_نیچر', '#مو_سالم', '#روتین_مو'],
    musicTitle: 'Smooth Jazz Collection',
    product: mockProducts[3],
    isLive: true,
  },
];

export const mockVideos: VideoFeed[] = baseVideos.map((video) => ({
  ...video,
  similarReels: [],
}));

const videoById = Object.fromEntries(mockVideos.map((video) => [video.id, video])) as Record<string, VideoFeed>;

const setSimilarReels = (videoId: string, similarIds: string[]) => {
  const source = videoById[videoId];
  if (!source) return;

  source.similarReels = similarIds
    .map((id) => videoById[id])
    .filter((video): video is VideoFeed => Boolean(video));
};

setSimilarReels('v1', ['v2', 'v3']);
setSimilarReels('v2', ['v1', 'v4']);
setSimilarReels('v3', ['v4', 'v1']);
setSimilarReels('v4', ['v3', 'v2']);

export const reelCommentsFa: Record<string, string[]> = {
  v1: [
    'گل‌دوزیش خیلی تمیز کار شده 🌸 نخ‌ها بعد از شستشو خراب نمی‌شن؟',
    'رنگ قرمزش فوق‌العاده‌ست، مدل کرم یا مشکی هم دارید؟ 🤍',
    'روی سر محکم می‌ایسته؟ موهام لیزه می‌ترسم سر بخوره 😅',
    'جنس پارچش نرمه؟ برای استفاده طولانی اذیت نمی‌کنه؟',
    'قیمتش نسبت به کار دست بودنش خیلی مناسبه، احتمال زیاد سفارش می‌دم 💸',
    'برای مهمونی و استایل مجلسی هم میشه استفاده کرد یا بیشتر روزمره‌ست؟ ✨'
  ],
  v2: [
    'این ساعت هوشمند با آیفون کامل سینک میشه؟ ⌚',
    'رنگ طلاییش خیلی لاکچریه، برای هدیه گزینه خوبیه 🎁',
    'سایز M برای مچ باریک مناسبه یا S بهتره؟',
    'دقت سنسور ضربان قلبش چطوره؟ برای ورزش می‌خوام',
    'قیمتش بالاست ولی اگر کیفیتش خوب باشه ارزش خرید داره 👌',
    'بند اضافه هم داخل جعبه هست یا جدا باید بخریم؟',
  ],
  v3: [
    'این کوله برای لپ‌تاپ 15.6 اینچ جا داره؟ 🎒',
    'رنگ سرمه‌ایش خیلی قشنگه، کاش موجود بشه 🙏',
    'کیفیت زیپ و دوختش چطوره؟ من استفاده روزانه دارم',
    'برای دانشگاه خیلی کاربردیه، سبک هم هست؟',
    'قیمتش نسبت به طراحی مینیمالش منطقیه، به نظرم ارزش خرید داره 💯',
    'ضد آب هست؟ برای روزهای بارونی لازم دارم ☔',
  ],
  v4: [
    'این کیف پول چرمی خیلی خوش‌فرمه 👛 چرم طبیعیه یا مصنوعی؟',
    'رنگ قهوه‌ایش فوق‌العاده‌ست، موجودی همیشگی دارید؟',
    'کیفیت دوخت کناره‌ها عالی به نظر میاد، دوامش چقدره؟',
    'جای کارت‌هاش برای استفاده روزمره کافیه؟',
    'قیمتش برای این کیفیت خیلی خوبه، من یکی می‌خوام 😍',
    'برندش ضمانت کیفیت یا مرجوعی هم داره؟',
  ],
};
