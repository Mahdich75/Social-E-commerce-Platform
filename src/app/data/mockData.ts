import { Product, VideoFeed } from '../types';
import { localStaticProducts, localStaticReelCommentsFa, localStaticVideoSeeds } from './localReelsStatic';
import { generatedProfileCreators, generatedProfileMedia } from './generatedProfiles';

const staticAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const curatedAvatarPool = [
  staticAsset('/pics/profile/avatar.jpg'),
  staticAsset('/pics/avatars/avatar1.jpg'),
  staticAsset('/pics/avatars/avatar2.jpg'),
  staticAsset('/pics/avatars/avatar3.jpg'),
  staticAsset('/pics/avatars/avatar4.jpg'),
  staticAsset('/pics/profile/SaveGram.App_448391674_868650641947746_1136848269883995888_n.jpg'),
  staticAsset('/pics/profile/SaveGram.App_448391825_449107604735778_6801152150428754043_n.jpg'),
  staticAsset('/pics/profile/SaveGram.App_448391831_1021416656274678_3127390317532272881_n.jpg'),
  staticAsset('/pics/profile/SaveGram.App_471937391_18483278374009808_3031180894812256315_n.jpg'),
  staticAsset('/pics/profile/SaveGram.App_539048858_18520031005009808_8127691562838658154_n.jpg'),
  staticAsset('/pics/profile/SaveGram.App_607748365_3282722678561396_6572646971023833447_n.jpg'),
  staticAsset('/pics/profile/SaveGram.App_608007693_759320143196138_7188041296922647007_n.jpg'),
] as const;

const usernameOverrides: Record<string, string> = {
  tech_hub: 'mehrdad.gadgetshop',
  puzzle_gallery: 'niloofar.puzzlehome',
  massage_corner: 'sara.relax.shop',
  beauty_daily: 'mina.beautyroom',
  style_guru: 'parisa.stylecorner',
  golsare_nazi: 'gole.manoto.shop',
  itsmehamoon: 'hamoon.boardgames',
  styleline_ir: 'leila.styleline',
  gadget_kade: 'amir.gadgetkadeh',
  homevibe_ir: 'elmira.homevibe',
  fitgear_store: 'iman.fitgear',
  streetwear_lab: 'navid.streetwear',
  parandeh_camera: 'arman.parandehcam',
  pazzel_world: 'pazel.world.shop',
  maquette_house: 'maquette.by.ati',
  wellness_shop: 'wellness.by.naz',
  aramish_plus: 'aramesh.plus.shop',
  takbama_ir: 'takbama.store',
  trend_massage: 'trend.massage.home',
  massage_compare: 'massage.compare.ir',
  olenz_ir: 'olenz.ir',
  reyhan_banoo_19: 'reyhanoo.shop',
};

const avatarOverridesByUsername: Record<string, string> = {
  tech_hub: curatedAvatarPool[1],
  puzzle_gallery: curatedAvatarPool[6],
  massage_corner: curatedAvatarPool[2],
  beauty_daily: curatedAvatarPool[7],
  style_guru: curatedAvatarPool[8],
  golsare_nazi: curatedAvatarPool[5],
  olenz_ir: curatedAvatarPool[9],
  itsmehamoon: curatedAvatarPool[10],
  styleline_ir: curatedAvatarPool[3],
  reyhan_banoo_19: curatedAvatarPool[4],
  gadget_kade: curatedAvatarPool[11],
  homevibe_ir: curatedAvatarPool[1],
  fitgear_store: curatedAvatarPool[2],
  streetwear_lab: curatedAvatarPool[6],
  parandeh_camera: curatedAvatarPool[3],
  pazzel_world: curatedAvatarPool[5],
  maquette_house: curatedAvatarPool[7],
  wellness_shop: curatedAvatarPool[8],
  aramish_plus: curatedAvatarPool[9],
  takbama_ir: curatedAvatarPool[10],
  trend_massage: curatedAvatarPool[11],
  massage_compare: curatedAvatarPool[4],
};

const baseMockCreators = [
  { id: 'creator_shirinbuttons', username: 'shirinbuttons', avatar: staticAsset('/pics/profile/avatar.jpg') },
  { id: 'creator_tech_hub', username: 'mehrdad.gadgetshop', avatar: staticAsset('/pics/avatars/avatar1.jpg') },
  { id: 'creator_puzzle_gallery', username: 'niloofar.puzzlehome', avatar: staticAsset('/pics/profile/SaveGram.App_448391825_449107604735778_6801152150428754043_n.jpg') },
  { id: 'creator_massage_corner', username: 'sara.relax.shop', avatar: staticAsset('/pics/avatars/avatar2.jpg') },
  { id: 'creator_beauty_daily', username: 'mina.beautyroom', avatar: staticAsset('/pics/profile/SaveGram.App_448391831_1021416656274678_3127390317532272881_n.jpg') },
  { id: 'creator_style_guru', username: 'parisa.stylecorner', avatar: staticAsset('/pics/profile/SaveGram.App_471937391_18483278374009808_3031180894812256315_n.jpg') },
] as const;

export const mockCreators = [
  ...baseMockCreators,
  ...generatedProfileCreators
    .filter((creator) => !baseMockCreators.some((baseCreator) => baseCreator.username === creator.username))
    .map((creator) => ({
      id: creator.id,
      username: creator.username,
      avatar: staticAsset(creator.avatar),
    })),
];

const creatorById = Object.fromEntries(mockCreators.map((creator) => [creator.id, creator])) as Record<
  string,
  (typeof baseMockCreators)[number]
>;

const creatorByCategory: Record<string, string> = {
  'electronics/health': 'creator_massage_corner',
  electronics: 'creator_tech_hub',
  'toy/puzzle': 'creator_puzzle_gallery',
  puzzle: 'creator_puzzle_gallery',
  art: 'creator_shirinbuttons',
  'fantasy-buttons': 'creator_shirinbuttons',
  fantasy_buttons: 'creator_shirinbuttons',
  beauty: 'creator_beauty_daily',
  fashion: 'creator_style_guru',
  accessories: 'creator_style_guru',
  accessory: 'creator_style_guru',
  wearables: 'creator_tech_hub',
  lifestyle: 'creator_style_guru',
  eyewear: 'creator_style_guru',
  home: 'creator_style_guru',
};

const creatorByProductId: Record<string, string> = {
  '15': 'creator_shirinbuttons',
  '16': 'creator_puzzle_gallery',
  '17': 'creator_massage_corner',
  '18': 'creator_tech_hub',
};

// -----------------------------
// Static editing controls (single source in mockData.ts)
// -----------------------------
export const FEED_LAYOUT_STATIC = {
  topRowProductNames: ['پازل سه بعدی', 'ماساژور رباتیک'],
  hiddenProductNames: ['روبوتایم طرح کافه'],
  moveProductReelsToLastRow: ['کیت نور دوقلوی دندانپزشکی اوسینو', 'دوربین پرنده'],
  moveProductReelsToFirstRow: ['بازی فکری Everdell'],
} as const;

export type FeedReelManualMove = {
  videoId: string;
  // 1-based row number to make manual editing easier.
  toRow: number;
  // optional: 'start' | 'end' (default: 'end')
  position?: 'start' | 'end';
};

// Quick manual reel placement by video id.
// Example:
// { videoId: 'v20', toRow: 2 } -> move v20 to end of row 2
// { videoId: 'v3', toRow: 1, position: 'start' } -> move v3 to start of row 1
export const FEED_REEL_MANUAL_MOVES: FeedReelManualMove[] = [
  // { videoId: 'v20', toRow: 2 },
];

// Optional hard row matrix for Home/Feed.
// Only listed reel ids are re-grouped; all other reels remain with existing logic/order.
// Each inner array is one horizontal row.
// Example:
// [
//   ['v12', 'v13', 'v14'], // puzzle process in one row
//   ['v16', 'v17', 'v18', 'v19', 'v21'], // massager concept row
// ]
export const FEED_ROW_MATRIX: string[][] = [
  ['v5', 'v7', 'v8', 'v10', 'v11', 'v20'],
  // ['v12', 'v13', 'v14'],
  // ['v16', 'v17', 'v18', 'v19', 'v21'],
];

export type ProductCardOverride = Partial<
  Pick<Product, 'name' | 'price' | 'image' | 'description' | 'category' | 'sizes' | 'rating' | 'reviews'>
>;

// Edit product card content here by product id.
export const PRODUCT_CARD_OVERRIDES: Record<string, ProductCardOverride> = {
  'local-row-product-1': {
    name: 'بیگودی فومی',
    description: 'پک بیگودی فومی بدون حرارت مناسب حالت‌دهی مو با کمترین آسیب.',
    price: 6900000,
    category: 'beauty/hair',
  },
  'local-row-product-2': {
    name: 'ماکت ماشین کلکسیونی',
    description: 'ماکت ماشین فلزی کلکسیونی با جزئیات بالا، مناسب دکور و هدیه.',
    price: 125000000,
    category: 'hobby/model',
  },
  'local-row-product-3': {
    name: 'زیورآلات دست‌ساز قاشق و چنگال',
    description: 'اکسسوری دست‌ساز هنری با متریال استیل، مناسب استایل خاص و متفاوت.',
    price: 35900000,
    category: 'accessories/handmade',
  },
  'local-row-product-4': {
    name: 'دسته گل دست‌ساز تزئینی',
    description: 'دسته‌گل دست‌ساز سفارشی مناسب هدیه، دکور و مناسبت‌های خاص.',
    price: 24900000,
    category: 'gift/flowers',
  },
};

export type ReelTextOverride = {
  description?: string;
  hashtags?: string[];
};

// Edit reel text/hashtags here by reel id.
export const REEL_TEXT_OVERRIDES: Record<string, ReelTextOverride> = {
  // Example:
  // v1: {
  //   description: 'متن جدید ریلز ۱',
  //   hashtags: ['#هدبند', '#استایل'],
  // },
};

const baseMockProducts: Omit<Product, 'creatorId' | 'creatorUsername' | 'creatorAvatar'>[] = [
  {
    id: '1',
    category: 'accessory',
    name: 'هدبند گل‌دوزی‌شده',
    price: 5900000,
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
    price: 185000000,
    image: 'https://tse2.mm.bing.net/th/id/OIP.awWmYRb1LkPkl1d7cB1x0QHaHa?cb=defcachec2&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'کیت نور دوقلوی دندان‌پزشکی اوسینو با نور یکنواخت و کیفیت حرفه‌ای برای کلینیک.',
    sizes: ['کوچک', 'متوسط', 'بزرگ'],
    rating: 4.7,
    reviews: 892,
  },
  {
    id: '3',
    category: 'accessories',
    name: 'بازی فکری Everdell',
    price: 42000000,
    image: 'https://th.bing.com/th/id/OIP.MyPy-noNXurOuxYrzGPktgHaHa?o=7&cb=defcachec2rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'بازی فکری استراتژیک با طراحی چشم‌نواز و کیفیت ساخت بالا برای دورهمی.',
    sizes: ['تک‌سایز'],
    rating: 4.3,
    reviews: 567,
  },
  {
    id: '4',
    category: 'beauty',
    name: 'کرم کاندیشنر آف نیچر',
    price: 4950000,
    image: 'https://tse4.mm.bing.net/th/id/OIP.VflHillMV-3rM6_zhLo56QHaHa?cb=defcachec2&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'کرم کاندیشنر آف نیچر برای تغذیه عمیق مو و حفظ نرمی روزانه.',
    sizes: ['One Size'],
    rating: 4.6,
    reviews: 345,
  },
  {
    id: '5',
    category: 'eyewear',
    name: 'عینک آفتابی پلاریزه',
    price: 16500000,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
    description: 'لنز پلاریزه با محافظت UV و فریم سبک برای استفاده روزمره.',
    sizes: ['One Size'],
    rating: 4.8,
    reviews: 678,
  },
    {
    id: '6',
    category: 'puzzle',
    name: 'روبوتایم طرح کافه',
    price: 24500000,
    image: 'https://dkstatics-public.digikala.com/digikala-products/3193675.jpg?x-oss-process=image/resize,m_lfit,h_800,w_800/format,webp/quality,q_90',
    description: 'کیت پازل سه‌بعدی برند روبوتایم با نور LED و دفترچه راهنمای تصویری کامل.',
    sizes: ['One Size'],
    rating: 4.8,
    reviews: 973,
  },
  {
    id: '7',
    category: 'electronics',
    name: 'دوربین فیلم‌برداری ورزشی اس جی کم مدل C100',
    price: 32900000,
    image: 'https://dkstatics-public.digikala.com/digikala-products/8df4970be34c8a6600ac76690d6d0180b9a458a6_1706609981.jpg?x-oss-process=image/resize,m_lfit,h_800,w_800/format,webp/quality,q_90',
    description: 'دوربین ورزشی جمع‌وجور و مقاوم با کیفیت تصویر بالا؛ مناسب ثبت لحظات هیجانی در ورزش، سفر و فعالیت‌های ماجراجویانه.',
    sizes: ['—'],
    rating: 4.5,
    reviews: 412,
  },
  {
    id: '8',
    category: 'accessories',
    name: 'کیف دوشی مینیمال زنانه',
    price: 21900000,
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&h=800&fit=crop',
    description: 'کیف دوشی جمع‌وجور با فضای کاربردی برای استفاده روزانه و مهمانی.',
    sizes: ['One Size'],
    rating: 4.4,
    reviews: 358,
  },
  {
    id: '9',
    category: 'beauty',
    name: 'سرم آبرسان هیالورونیک',
    price: 9800000,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&h=800&fit=crop',
    description: 'سرم آبرسان سبک برای رطوبت‌رسانی عمیق و کاهش خشکی پوست.',
    sizes: ['30ml'],
    rating: 4.7,
    reviews: 521,
  },
  {
    id: '10',
    category: 'wearables',
    name: 'ساعت هوشمند روزانه',
    price: 44900000,
    image: 'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=800&h=800&fit=crop',
    description: 'ساعت هوشمند با پایش فعالیت، اعلان‌ها و شارژدهی مناسب.',
    sizes: ['42mm', '46mm'],
    rating: 4.5,
    reviews: 287,
  },
  {
    id: '11',
    category: 'beauty',
    name: 'بالم لب ترمیم‌کننده',
    price: 7600000,
    image: 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=800&h=800&fit=crop',
    description: 'بالم لب مغذی برای آبرسانی عمیق، جلوگیری از خشکی و نرمی طولانی‌مدت لب‌ها.',
    sizes: ['15ml'],
    rating: 4.3,
    reviews: 194,
  },
  {
    id: '12',
    category: 'lifestyle',
    name: 'بطری هوشمند ورزشی',
    price: 12400000,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop',
    description: 'بطری ورزشی با طراحی ارگونومیک و متریال مقاوم برای استفاده روزانه.',
    sizes: ['750ml'],
    rating: 4.2,
    reviews: 143,
  },
  {
    id: '13',
    category: 'fashion',
    name: 'هودی اورسایز پاییزی',
    price: 27400000,
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=800&fit=crop',
    description: 'هودی اورسایز با پارچه نرم و گرم؛ مناسب استایل خیابانی.',
    sizes: ['M', 'L', 'XL'],
    rating: 4.6,
    reviews: 333,
  },
  {
    id: '15',
    category: 'art',
    name: 'پک دکمه‌های فانتزی',
    price: 18900000,
    image: 'https://images.unsplash.com/photo-1456086272160-b28b0645b729?w=800&h=800&fit=crop',
    description: 'محصول هنری روبوتایم با تمرکز بر تجربه ساخت، آرامش ذهن و دکور جذاب.',
    sizes: ['One Size'],
    rating: 4.9,
    reviews: 77,
  },
  {
    id: '16',
    category: 'toy/puzzle',
    name: 'پازل سه بعدی',
    price: 12900000,
    image: 'https://dkstatics-public.digikala.com/digikala-products/3193675.jpg?x-oss-process=image/resize,m_lfit,h_800,w_800/format,webp/quality,q_90',
    description: 'پازل سه بعدی زیبا و سرگرم‌کننده، مناسب برای تمام سنین!',
    sizes: ['Medium', 'Large'],
    rating: 4.8,
    reviews: 200,
  },
  {
    id: '17',
    category: 'electronics/health',
    name: 'ماساژور رباتیک',
    price: 21900000,
    image: 'https://turkeymetalshop.com/wp-content/uploads/2025/09/kf-S9996fde6d22245d0a66327e0983d6619s.webp',
    description: 'ماساژور رباتیک حرفه‌ای برای رفع خستگی و آرامش عضلات، مناسب برای استفاده در خانه و محل کار.',
    sizes: ['Medium', 'Large'],
    rating: 4.8,
    reviews: 200,
  },
  {
    id: '18',
    category: 'electronics',
    name: 'دوربین پرنده',
    price: 28900000,
    image: 'https://www.syma-iran.com/wp-content/uploads/2024/02/%D9%87%D9%84%DB%8C-%D8%B4%D8%A7%D8%AA-440x411.jpg',
    description: 'دوربین پرنده سبک و خوش‌دست برای ثبت ویدیوهای سریع، ولاگ و تولید محتوا با کیفیت بالا.',
    sizes: ['One Size'],
    rating: 4.7,
    reviews: 318,
  },
  {
    id: 'btn-1',
    category: 'fantasy-buttons',
    name: 'دکمه فانتزی مدل آبی گل‌ریز',
    price: 2850000,
    image: staticAsset('/pics/profile/SaveGram.App_448391674_868650641947746_1136848269883995888_n.jpg'),
    description: 'دکمه تزئینی دست‌ساز مناسب لباس، کیف و پروژه‌های هنری.',
    sizes: ['قطر 20mm'],
    rating: 4.7,
    reviews: 41,
  },
  {
    id: 'btn-2',
    category: 'fantasy-buttons',
    name: 'دکمه فانتزی مدل مرواریدی',
    price: 3150000,
    image: staticAsset('/pics/profile/SaveGram.App_448391825_449107604735778_6801152150428754043_n.jpg'),
    description: 'طراحی فانتزی با رنگ‌بندی خاص برای کارهای تزئینی.',
    sizes: ['قطر 18mm'],
    rating: 4.8,
    reviews: 36,
  },
  {
    id: 'btn-3',
    category: 'fantasy-buttons',
    name: 'دکمه فانتزی مدل قلبی',
    price: 2650000,
    image: staticAsset('/pics/profile/SaveGram.App_448391831_1021416656274678_3127390317532272881_n.jpg'),
    description: 'دکمه تزئینی سبک و مقاوم، مناسب دوخت‌های خلاقانه.',
    sizes: ['قطر 16mm'],
    rating: 4.6,
    reviews: 28,
  },
  {
    id: 'btn-4',
    category: 'fantasy-buttons',
    name: 'دکمه فانتزی مدل کلاسیک',
    price: 2980000,
    image: staticAsset('/pics/profile/SaveGram.App_471937391_18483278374009808_3031180894812256315_n.jpg'),
    description: 'دکمه دکوراتیو با حس کلاسیک برای لباس و اکسسوری.',
    sizes: ['قطر 22mm'],
    rating: 4.5,
    reviews: 33,
  },
  {
    id: 'btn-5',
    category: 'fantasy-buttons',
    name: 'دکمه فانتزی مدل رزگلد',
    price: 3420000,
    image: staticAsset('/pics/profile/SaveGram.App_539048858_18520031005009808_8127691562838658154_n.jpg'),
    description: 'رنگ رزگلد خاص با جلوه براق مناسب آیتم‌های فانتزی.',
    sizes: ['قطر 20mm'],
    rating: 4.9,
    reviews: 52,
  },
  {
    id: 'btn-6',
    category: 'fantasy-buttons',
    name: 'دکمه فانتزی مدل مینیمال',
    price: 2540000,
    image: staticAsset('/pics/profile/SaveGram.App_607748365_3282722678561396_6572646971023833447_n.jpg'),
    description: 'سبک مینیمال برای ست‌های مدرن و طراحی‌های ساده.',
    sizes: ['قطر 14mm'],
    rating: 4.4,
    reviews: 24,
  },
  {
    id: 'btn-7',
    category: 'fantasy-buttons',
    name: 'دکمه فانتزی مدل وینتیج',
    price: 3240000,
    image: staticAsset('/pics/profile/SaveGram.App_608007693_759320143196138_7188041296922647007_n.jpg'),
    description: 'طراحی وینتیج با رنگ‌های گرم برای پروژه‌های دست‌دوز.',
    sizes: ['قطر 24mm'],
    rating: 4.8,
    reviews: 39,
  },
];

const mappedBaseProducts: Product[] = baseMockProducts.map((product) => {
  const creatorId = creatorByProductId[product.id] ?? creatorByCategory[product.category] ?? 'creator_style_guru';
  const creator = creatorById[creatorId] ?? creatorById.creator_style_guru;
  return {
    ...product,
    creatorId: creator.id,
    creatorUsername: creator.username,
    creatorAvatar: creator.avatar,
  };
});

export const mockProducts: Product[] = [
  ...mappedBaseProducts,
  ...localStaticProducts.map((product) => {
    const overrides = PRODUCT_CARD_OVERRIDES[product.id];
    return {
      ...product,
      ...(overrides ?? {}),
      image: product.image.startsWith('http') ? product.image : staticAsset(product.image),
      creatorAvatar: staticAsset(product.creatorAvatar),
    };
  }),
];

const manualBaseVideos: Omit<VideoFeed, 'similarReels'>[] = [
  {
    id: 'v1',
    videoUrl: staticAsset('/videos/reels1.mp4'),
    thumbnail: staticAsset('/pics/profile/SaveGram.App_448391674_868650641947746_1136848269883995888_n.jpg'),
    username: 'golsare_nazi',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 4445,
    comments: 64,
    shares: 123,
    description: 'هدبند گل‌دوزی‌شده با دوخت تمیز و رنگ‌بندی خاص، انتخاب جذاب برای استایل روزانه.',
    hashtags: ['#هدبند', '#استایل_زنانه', '#اکسسوری_شیک'],
    musicTitle: '',
    product: mockProducts[0],
    isLive: false,
  },
  {
    id: 'v2',
    videoUrl: staticAsset('/videos/reels2.mp4'),
    thumbnail: staticAsset('/pics/profile/SaveGram.App_448391825_449107604735778_6801152150428754043_n.jpg'),
    username: 'olenz_ir',
    userAvatar: staticAsset('/pics/avatars/avatar2.jpg'),
    likes: 328700,
    comments: 578,
    shares: 891,
    description: 'نمای نزدیک از کیت نور دندانپزشکی اوسینو با تمرکز روی کیفیت نور و دقت عملکرد.',
    hashtags: ['#تجهیزات_دندانپزشکی', '#کیت_نور', '#کلینیک'],
    musicTitle: '',
    product: mockProducts[1],
    isLive: false,
  },
  {
    id: 'v3',
    videoUrl: staticAsset('/videos/reels3.mp4'),
    thumbnail: staticAsset('/pics/profile/SaveGram.App_448391831_1021416656274678_3127390317532272881_n.jpg'),
    username: 'itsmehamoon',
    userAvatar: staticAsset('/pics/avatars/avatar4.jpg'),
    likes: 12500,
    comments: 234,
    shares: 456,
    description: 'مرور کیفیت قطعات و تجربه بازی Everdell برای دورهمی‌های خانوادگی.',
    hashtags: ['#بازی_فکری', '#بردگیم', '#Everdell'],
    musicTitle: '',
    product: mockProducts[2],
    isLive: false,
  },
  {
    id: 'v4',
    videoUrl: staticAsset('/videos/reels4.mp4'),
    thumbnail: staticAsset('/pics/profile/SaveGram.App_471937391_18483278374009808_3031180894812256315_n.jpg'),
    username: 'style_guru',
    userAvatar: staticAsset('/pics/avatars/avatar3.jpg'),
    likes: 8900,
    comments: 156,
    shares: 234,
    description: 'کرم کاندیشنر آف نیچر با بافت سبک و نتیجه نرم‌کنندگی مناسب برای استفاده روزانه.',
    hashtags: ['#مراقبت_مو', '#کاندیشنر', '#روتین_مو'],
    musicTitle: '',
    product: mockProducts[3],
    isLive: false,
  },
  {
    id: 'v5',
    videoUrl: staticAsset('/videos/SaveGram.App_AQMNHLwMyDok4Qhw-TM58AEewKFOUhu_B1D67wAgDAdjA0xsCIg1ATikNVJEdrV2Fa4hSXUoiqofQ6INSRjixlbDI9pLRKBFRp0Vt4g.mp4'),
    thumbnail: staticAsset('/pics/profile/SaveGram.App_539048858_18520031005009808_8127691562838658154_n.jpg'),
    username: 'styleline_ir',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 21340,
    comments: 345,
    shares: 512,
    description: 'دوربین ورزشی جمع‌وجور و مقاوم با کیفیت تصویر بالا؛ مناسب ثبت لحظات هیجانی در ورزش، سفر و ماجراجویی.',
    hashtags: ['#دوربین_ورزشی', '#فیلمبرداری', '#ماجراجویی'],
    musicTitle: '',
    processType: 'intro',
    product: mockProducts[6],
    isLive: false,
  },
    {
    id: 'v6',
    videoUrl: staticAsset('/videos/reels6.mp4'),
    thumbnail: staticAsset('/pics/profile/SaveGram.App_607748365_3282722678561396_6572646971023833447_n.jpg'),
    username: 'reyhan_banoo_19',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 3582,
    comments: 973,
    shares: 286,
    description: 'میدونی قراره صفر تا صد این کافه رو با دستای خودت بسازی؟🥹🥐 برای دریافت سریع قیمت و مشخصات کلمه «کافه» رو کامنت کن🧋 ✔️وارداتی ✔️دارای بارکد اصالت کالا ✔️از برند محبوب روبوتایم ✔️موجود در ایران ارسال سریع به سراسر کشور پازل های ۳ بعدی ترند این روزها در دنیا…😍 هر چیزی که تو این فیلم میبینید ریز به ریز قطعاتشو خودتون مونتاژ میکنید یه دفترچه راهنمای جامع و کامل تصویری داره که در همه مراحل همراهمتونه و کمکتون می‌کنه🫶🏻 اما قشنگ‌ترین بخشش اینه که LED دارن و وقتی روشنشون میکنید، یه حال‌وهوای گرم و دلنشین به فضای خونه میدن🥹✨🤎 ثبت سفارش از طریق وبسایت و دایرکت💌 لینک سایت در بایو قرار دارد🌐 اشاره: @asal_mahjouri @ava.u1999 @dean_raha',
    hashtags: ['#کافه', '#کافهرستوران', '#قهوه', '#پازل', '#پازل_هزارتیکه', '#پازل_سه_بعدی', '#مینیاتوری', '#خانه_مینیاتوری', '#بوک_نوک', '#دکوری', '#سرگرمی_فکری', '#ماکت_باز', '#ماکت'],
    musicTitle: '',
    product: mockProducts[5],
    isLive: false,
  },
  {
    id: 'v7',
    videoUrl: staticAsset('/videos/SaveGram.App_AQNKEQMwE4y1x0Y8ExA0COVZ_mf4rDl_gPJKyHzXBYImN_CUgHhHZ5OGNi4G9gz9Eh_RPVMx6OgjaiIRatmTRgmQ1Bmyb8aju3Mm_ew.mp4'),
    thumbnail: staticAsset('/pics/profile/SaveGram.App_608007693_759320143196138_7188041296922647007_n.jpg'),
    username: 'beauty_daily',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 29500,
    comments: 462,
    shares: 603,
    description: 'دوربین ورزشی جمع‌وجور و مقاوم با کیفیت تصویر بالا؛ مناسب ثبت لحظات هیجانی در ورزش، سفر و ماجراجویی.',
    hashtags: ['#دوربین_ورزشی', '#فیلمبرداری', '#ماجراجویی'],
    musicTitle: '',
    processType: 'usage',
    product: mockProducts[6],
    isLive: false,
  },
  {
    id: 'v8',
    videoUrl: staticAsset('/videos/SaveGram.App_AQNnCQGDGPRt6QBZZ-Q6vXwyWRpdWrD_GDnHX__jvtGv94sdwjzGkbBZ5Mmjzl2sS7ZQJ04nncSoL0ICd3_Nd8V0HlaWr6IvJfYmdDE.mp4'),
    thumbnail: staticAsset('/pics/profile/SaveGram.App_448391674_868650641947746_1136848269883995888_n.jpg'),
    username: 'gadget_kade',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 35440,
    comments: 519,
    shares: 740,
    description: 'دوربین ورزشی جمع‌وجور و مقاوم با کیفیت تصویر بالا؛ مناسب ثبت لحظات هیجانی در ورزش، سفر و ماجراجویی.',
    hashtags: ['#دوربین_ورزشی', '#فیلمبرداری', '#ماجراجویی'],
    musicTitle: '',
    processType: 'detail',
    product: mockProducts[6],
    isLive: false,
  },
  {
    id: 'v9',
    videoUrl: staticAsset('/videos/SaveGram.App_AQOnQLjlvkpnZF35gv6BGC_lLAxLKRAQpqSggae2sX5uOewy_rWcoF8Ip4xJ98bjCwEQ2BgSHHv1EdP9Bc9agebzVlgF7goIY44BlcQ.mp4'),
    thumbnail: staticAsset('/pics/profile/SaveGram.App_448391825_449107604735778_6801152150428754043_n.jpg'),
    username: 'homevibe_ir',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 16220,
    comments: 205,
    shares: 298,
    description: 'بالم لب ترمیم‌کننده با بافت سبک و جذب سریع برای نرم‌کردن و مراقبت روزانه از لب‌ها.',
    hashtags: ['#بالم_لب', '#مراقبت_پوست', '#لب_نرم'],
    musicTitle: '',
    product: mockProducts[10],
    isLive: false,
  },
  {
    id: 'v10',
    videoUrl: staticAsset('/videos/SaveGram.App_AQOzgDFofpQUCrb0hhK-Cscpf2195-InXtdLeCEzCCNztPV03XrLvg3-1iWdyOdyYI_DBZUA6UWXaB6wDg1u0HAaTrKhgB2JCLsPO2Y.mp4'),
    thumbnail: staticAsset('/pics/profile/SaveGram.App_448391831_1021416656274678_3127390317532272881_n.jpg'),
    username: 'fitgear_store',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 14170,
    comments: 182,
    shares: 247,
    description: 'دوربین ورزشی جمع‌وجور و مقاوم با کیفیت تصویر بالا؛ مناسب ثبت لحظات هیجانی در ورزش، سفر و ماجراجویی.',
    hashtags: ['#دوربین_ورزشی', '#فیلمبرداری', '#ماجراجویی'],
    musicTitle: '',
    processType: 'before_after',
    product: mockProducts[6],   
    isLive: false,
  },
  {
    id: 'v11',
    videoUrl: staticAsset('/videos/SaveGram.App_AQPvIPy3xH57cG-uEElCjdr8pPQQ-wIx91h2_x158mMTa2FVvA80R9rrB7_Hu4ff6PAcA4QwJW5MHrOKNascYSUv4L8ftjILKcOh-Y8.mp4'),
    thumbnail: staticAsset('/pics/profile/SaveGram.App_471937391_18483278374009808_3031180894812256315_n.jpg'),
    username: 'streetwear_lab',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 26900,
    comments: 333,
    shares: 421,
    description: 'دوربین ورزشی جمع‌وجور و مقاوم با کیفیت تصویر بالا؛ مناسب ثبت لحظات هیجانی در ورزش، سفر و ماجراجویی.',
    hashtags: ['#دوربین_ورزشی', '#فیلمبرداری', '#ماجراجویی'],
    musicTitle: '',
    processType: 'result',
    product: mockProducts[6],
    isLive: false,
  },
  {
    id: 'v20',
    videoUrl: staticAsset('/videos/فقط کف دستتو باز کن بقیه_ش با خودشه 🚀📸💬 برای دریافت قیمت کلمه پرنده رو کامنت کن 👇🏽این دوربی.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=414&h=896&fit=crop',
    username: 'parandeh_camera',
    userAvatar: staticAsset('/pics/avatars/avatar2.jpg'),
    likes: 7420,
    comments: 612,
    shares: 284,
    description: 'فقط کف دستتو باز کن، بقیه‌ش با خودشه 🚀📸💬 برای دریافت قیمت کلمه «پرنده» رو کامنت کن 👇🏽',
    hashtags: ['#دوربین_پرنده', '#تولید_محتوا', '#ولاگ', '#دوربین_ورزشی'],
    musicTitle: '',
    processType: 'usage',
    product: mockProducts[16],
    isLive: false,
  },
  {
    id: 'v12',
    videoUrl: staticAsset('/videos/reels6.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1606503153255-59d8b8b6d8b3?w=414&h=896&fit=crop',
    username: 'pazzel_world',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 8420,
    comments: 218,
    shares: 167,
    description: 'این پازل سه‌بعدی رو ببین! مرحله‌به‌مرحله می‌سازی و آخرش یه دکور فوق‌العاده داری 🧩✨',
    hashtags: ['#پازل', '#پازل_سه_بعدی', '#سرگرمی_فکری', '#ماکت', '#دکوری'],
    musicTitle: '',
    processType: 'intro',
    product: mockProducts[14],
    isLive: false,
  },
  {
    id: 'v13',
    videoUrl: staticAsset('/videos/__بفرس واسش تا تموم نشده😌😂جهت استعلام قیمت و دیدن جزئیات کلمه « هری » رو کامنت کنید✨قشنگی ماجر.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=414&h=896&fit=crop',
    username: 'maquette_house',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 12640,
    comments: 403,
    shares: 259,
    description: 'جزئیات این پازل سه‌بعدی واقعا خیره‌کننده‌ست 😍 برای استعلام قیمت کلمه «هری» رو کامنت کن.',
    hashtags: ['#پازل', '#پازل_سه_بعدی', '#هری_پاتر', '#مینیاتوری', '#خلاقیت'],
    musicTitle: '',
    processType: 'build',
    product: mockProducts[14],
    isLive: false,
  },
  {
    id: 'v14',
    videoUrl: staticAsset('/videos/استوری رو پستش کردم تا دوستانی ک جدید ما رو فالو میکنن جزئیات پازلامونو_ببینن☺️❤️🫶🏻#پازل #پازل.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=414&h=896&fit=crop',
    username: 'puzzle_gallery',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 9730,
    comments: 287,
    shares: 198,
    description: 'استوری کامل این پازل سه‌بعدی رو گذاشتیم؛ از بازکردن جعبه تا نتیجه نهایی رو ببینید 👀🧩',
    hashtags: ['#پازل', '#پازل_سه_بعدی', '#استوری', '#کاردستی', '#سرگرمی'],
    musicTitle: '',
    processType: 'result',
    product: mockProducts[14],
    isLive: false,
  },
  {
    id: 'v16',
    videoUrl: staticAsset('/videos/__ماساژور حرارتی 💀🔥قیمت - ۸۹۸ تومن 💸________@tarapel.ir________ 📮برای خرید این کالا کلمه ی« .mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=414&h=896&fit=crop',
    username: 'wellness_shop',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 11420,
    comments: 351,
    shares: 223,
    description: 'ماساژور رباتیک حرارتی برای ریلکس شدن بعد از یک روز پرکار؛ هم گرما داره هم ماساژ عمیق 💆‍♀️🔥',
    hashtags: ['#ماساژور', '#ماساژور_رباتیک', '#رفع_خستگی', '#سلامتی', '#ریلکس'],
    musicTitle: '',
    processType: 'intro',
    product: mockProducts[15],
    isLive: false,
  },
  {
    id: 'v17',
    videoUrl: staticAsset('/videos/__🍀 ماساژور شانه و گردن طرح دست ، کپشن 👇.🔹 اگه بعد از یک روز کاری طولانی گردن و شونه_هات سفت .mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=414&h=896&fit=crop',
    username: 'aramish_plus',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 9870,
    comments: 294,
    shares: 176,
    description: 'اگه شانه و گردنت همیشه گرفته‌ست، این ماساژور رباتیک واقعا نجات‌دهنده‌ست 👌',
    hashtags: ['#ماساژور_گردن', '#ماساژور_شانه', '#ارامش', '#درد_عضلات', '#ماساژ'],
    musicTitle: '',
    processType: 'usage',
    product: mockProducts[15],
    isLive: false,
  },
  {
    id: 'v18',
    videoUrl: staticAsset('/videos/اگه گفتی کی بهش نیاز داره؟ 😩✋ راستی تو کـپـ ـشن هندونست 👇 🍉👀بها- ۱۲۹۷ تومن 💸 @takbama 👩_💻.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=414&h=896&fit=crop',
    username: 'takbama_ir',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 13450,
    comments: 427,
    shares: 309,
    description: 'این ماساژور رباتیک برای کساییه که زیاد پشت سیستم میشینن و گردن‌درد دارن 😩💆',
    hashtags: ['#گردن_درد', '#پشت_میزنشینی', '#ماساژور', '#سلامت_بدن', '#آرامش_عضلانی'],
    musicTitle: '',
    processType: 'benefit',
    product: mockProducts[15],
    isLive: false,
  },
  {
    id: 'v19',
    videoUrl: staticAsset('/videos/ترندترین ماساژور جهانه💆_♀️یه ماساژ عمیق و باحال جهت باز کردن عمقی گرفتگی هامناسب گردن، ساق پا ب.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=414&h=896&fit=crop',
    username: 'trend_massage',
    userAvatar: staticAsset('/pics/avatars/avatar1.jpg'),
    likes: 15820,
    comments: 503,
    shares: 341,
    description: 'ترندترین ماساژور رباتیک با ماساژ عمیق برای گردن، کتف و ساق پا؛ تجربه آرامش واقعی ✨',
    hashtags: ['#ماساژور_ترند', '#ماساژ_عمیق', '#رفع_گرفتگی', '#لایف_استایل', '#ماساژور_رباتیک'],
    musicTitle: '',
    processType: 'result',
    product: mockProducts[15],
    isLive: false,
  },
  {
    id: 'v21',
    videoUrl: staticAsset('/videos/مقایسه ماساژور شونه و گردن خرچنگی و با ماشاژور شونه گردن شیاتسو انجام دادمممممویدئورو با دقت ببی.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=414&h=896&fit=crop',
    username: 'massage_compare',
    userAvatar: staticAsset('/pics/avatars/avatar2.jpg'),
    likes: 9320,
    comments: 418,
    shares: 231,
    description: 'مقایسه کامل ماساژور شانه و گردن خرچنگی با شیاتسو؛ ویدیو رو دقیق ببین تا بهترین انتخاب رو داشته باشی 💆‍♂️',
    hashtags: ['#ماساژور_رباتیک', '#ماساژور_گردن', '#مقایسه_محصول', '#شیاتسو', '#سلامت_عضلات'],
    musicTitle: '',
    processType: 'comparison',
    product: mockProducts[15],
    isLive: false,
  },
  {
    id: '15',
    videoUrl: staticAsset('/videos/intro_video.mp4'),
    thumbnail: staticAsset('/pics/profile/SaveGram.App_539048858_18520031005009808_8127691562838658154_n.jpg'),
    username: 'shirinbuttons',
    userAvatar: staticAsset('/pics/profile/avatar.jpg'),
    likes: 584,
    comments: 77,
    shares: 63,
    description: 'هنر جهان را نجات خواهد داد🤝🧵🪡 . بله من هنوز دارم آبی میدوزم💙 و اگه نمیدونی داستان آبی چیه، دوتا پست قبلم رو ببین🫂 . امیدوارم تو هم برای گذر از روزهای سخت و بیحوصله، آبی خودت رو داشته باشی🫂 . مراقب خودت باش❣️ • 1 month ago • @zeynabbanoo508781 @crosstitch_anil @moonlandgate',
    hashtags: ['#هنر', '#دوخت', '#گلدوزی', '#آرامش', '#هنر_درمانی'],
    musicTitle: '',
    product: mockProducts[13],
    isLive: false,
  },
];

const productById = Object.fromEntries(mockProducts.map((product) => [product.id, product])) as Record<string, Product>;

const localStaticVideos: Omit<VideoFeed, 'similarReels'>[] = localStaticVideoSeeds
  .map((video) => {
    const product = productById[video.productId];
    if (!product) return null;

    return {
      ...video,
      videoUrl: staticAsset(video.videoUrl),
      thumbnail: video.thumbnail.startsWith('http') ? video.thumbnail : staticAsset(video.thumbnail),
      userAvatar: staticAsset(video.userAvatar),
      product,
      hashtags: (video.hashtags ?? []).map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)),
    };
  })
  .filter((video): video is Omit<VideoFeed, 'similarReels'> => Boolean(video));

const baseVideos: Omit<VideoFeed, 'similarReels'>[] = [...manualBaseVideos, ...localStaticVideos];

export const mockVideos: VideoFeed[] = baseVideos.map((video, index) => {
  const normalizedUsername = usernameOverrides[video.username] ?? video.username;
  const normalizedAvatar = avatarOverridesByUsername[video.username] ?? video.userAvatar ?? curatedAvatarPool[index % curatedAvatarPool.length];

  return {
    ...video,
    username: normalizedUsername,
    userAvatar: normalizedAvatar,
    description: REEL_TEXT_OVERRIDES[video.id]?.description ?? video.description,
    hashtags:
      REEL_TEXT_OVERRIDES[video.id]?.hashtags?.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)) ?? video.hashtags,
    similarReels: [],
  };
});

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
setSimilarReels('v12', ['v13', 'v14', 'v6']);
setSimilarReels('v13', ['v12', 'v14', 'v6']);
setSimilarReels('v14', ['v13', 'v12', 'v6']);
setSimilarReels('v16', ['v17', 'v18', 'v19']);
setSimilarReels('v17', ['v16', 'v18', 'v19']);
setSimilarReels('v18', ['v17', 'v16', 'v19']);
setSimilarReels('v19', ['v18', 'v17', 'v16']);
setSimilarReels('v21', ['v19', 'v18', 'v17', 'v16']);
setSimilarReels('v20', ['v5', 'v7', 'v8', 'v10']);

mockVideos.forEach((video) => {
  if ((video.similarReels?.length ?? 0) > 0) return;

  const relatedPool = mockVideos
    .filter((candidate) => candidate.id !== video.id)
    .map((candidate) => {
      let score = 0;
      if (video.product?.id && candidate.product?.id && video.product.id === candidate.product.id) score += 100;
      if (video.processType && candidate.processType && video.processType === candidate.processType) score += 40;
      if (video.product?.category && candidate.product?.category && video.product.category === candidate.product.category) {
        score += 16;
      }
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.candidate);

  video.similarReels = relatedPool.slice(0, 6);
});

export type ProfileMediaEntry = {
  introVideoUrl: string | null;
  introVideoName: string;
  reels: Array<{
    id: string;
    videoUrl: string;
    thumbnail: string;
    title: string;
    isIntro: boolean;
  }>;
};

export const profileMediaByUsername: Record<string, ProfileMediaEntry> = Object.fromEntries(
  generatedProfileMedia.map((entry) => [
    entry.username,
    {
      introVideoUrl: entry.introVideoUrl ? staticAsset(entry.introVideoUrl) : null,
      introVideoName: entry.introVideoName,
      reels: entry.reels.map((reel) => ({
        ...reel,
        videoUrl: staticAsset(reel.videoUrl),
        thumbnail: reel.thumbnail.startsWith('http') ? reel.thumbnail : staticAsset(reel.thumbnail),
      })),
    },
  ])
);

const baseReelCommentsFa: Record<string, string[]> = {
  v1: ['خیلی قشنگه 😍', 'کارِ دست؟ فوق‌العاده‌ست 👏'],
  v2: ['نورش خیلی تمیزه، برای کار حرفه‌ای عالیه.', 'گارانتی رسمی هم داره؟'],
  v3: ['این پازل فکری خیلی جذابه 🧩', 'برای جمع خانوادگی واقعاً انتخاب خوبیه.'],
  v4: ['بافتش سبک به نظر میاد، روی مو چرب نمی‌کنه؟', 'برای موهای رنگ‌شده هم مناسبه؟'],
  v5: ['تنخورش خیلی شیکه ✨', 'سایز بزرگ‌تر هم موجود دارید؟'],
  v6: ['طراحی کیف خیلی خاصه 👜', 'داخلش جای موبایل و کیف پول کامل هست؟'],
  v7: ['نتیجه روی پوست خیلی خوبه 💙', 'برای پوست حساس هم جواب می‌ده؟'],
  v8: ['ظاهرش خیلی مدرنه ⌚', 'عمر باتریش در استفاده روزمره چقدره؟'],
  v9: ['این ماگ‌ها خیلی دلبرن ☕', 'بعد از شست‌وشو رنگشون نمی‌پره؟'],
  v10: ['برای باشگاه عالیه 💪', 'دربش کامل ضدنشتیه؟'],
  v11: ['این هودی خیلی خوش‌فرمه 🔥', 'رنگ‌بندی دیگه‌ای هم دارید؟'],
  v12: ['خیلی سرگرم‌کننده بود! 🧩', 'طراحی نهایی‌ش واقعاً شیکه، برای هدیه عالیه.'],
  v13: ['جزئیاتش فوق‌العاده‌ست 🌟', 'مونتاژش سخته یا با دفترچه راحت جمع میشه؟'],
  v14: ['من این مدل رو خیلی دوست داشتم 😍', 'موجودی رنگ یا طرح دیگه هم دارید؟'],
  v16: ['خیلی آرامش‌بخش بود 🌟', 'برای گرفتگی گردن واقعاً جواب می‌ده؟'],
  v17: ['کیفیت عالی داره، حتما توصیه می‌کنم!', 'برای استفاده روزانه صداش اذیت نمی‌کنه؟'],
  v18: ['بعد از کار با لپ‌تاپ واقعاً لازمم بود 😍', 'قابلیت گرمایشی هم داره یا فقط ویبره؟'],
  v19: ['ماساژش عمیقه و حس خوبی میده 💆‍♂️', 'برای هدیه هم انتخاب خیلی خوبیه 🎁'],
  v21: ['این مقایسه خیلی کاربردی بود 👌', 'بین خرچنگی و شیاتسو کدوم برای گردن درد بهتره؟'],
  v20: ['این دوربین پرنده خیلی خوش‌دسته 📸', 'کیفیت تصویرش برای ولاگ عالیه، موجود دارید؟'],
  '15': ['ویدئوی معرفی خیلی حس خوب داشت 🌿', 'برای سفارش طرح کافه موجودی دارید؟'],
};

export const reelCommentsFa: Record<string, string[]> = {
  ...Object.fromEntries(
    localStaticVideoSeeds.map((video) => {
      const localCommentsByProductId: Record<string, string[]> = {
        'local-row-product-1': [
          'برای موهای نازک هم خوب فرم میده یا بیشتر برای مو پرحجم مناسبه؟',
          'بیگودی فومی بدون حرارت خیلی بهتره برای سلامت مو 👌',
          'قیمتش نسبت به مدل‌های مشابه بازار منطقیه، موجودی کامل دارید؟',
          'برای موج درشت چه سایزی پیشنهاد می‌دید؟',
          'ارسال فوری تهران هم دارید؟',
        ],
        'local-row-product-2': [
          'این ماکت کاملا فلزیه یا بخشی پلاستیکه؟',
          'برای کلکسیونرها عالیه، مقیاس دقیقش چند به چنده؟',
          'جزئیات بدنه و کابین خیلی حرفه‌ایه 😍',
          'با جعبه سالم و پلمپ ارسال می‌شه؟',
          'قیمتش برای ماکت کلکسیونی خوبه، تخفیف هم می‌خوره؟',
        ],
        'local-row-product-3': [
          'این کار کاملا دست‌سازه؟ واقعا خاصه ✨',
          'برای پوست حساس مشکلی ایجاد نمی‌کنه؟',
          'رنگ و آبکاریش با استفاده روزمره ثابت می‌مونه؟',
          'برای هدیه خیلی یونیکه، بسته‌بندی کادویی دارید؟',
          'سفارشی‌سازی طرح هم انجام می‌دید؟',
        ],
        'local-row-product-4': [
          'این دسته گل برای هدیه تولد و سالگرد خیلی شیکه 💐',
          'امکان انتخاب رنگ‌بندی سفارشی هم دارید؟',
          'برای دکور طولانی‌مدت ماندگاریش چقدره؟',
          'برای مناسبت رسمی هم مدل مشابه دارید؟',
          'ارسال به شهرستان هم انجام می‌دید؟',
        ],
      };

      return [video.id, localCommentsByProductId[video.productId] ?? localStaticReelCommentsFa[video.id] ?? []];
    })
  ),
  ...baseReelCommentsFa,
};




