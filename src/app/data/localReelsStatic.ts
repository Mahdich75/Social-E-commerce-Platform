import { Product, VideoFeed } from '../types';

export type LocalStaticVideoSeed = Omit<VideoFeed, 'similarReels' | 'product'> & {
  productId: string;
};

export const localStaticProducts: Product[] = [
  {
    "id": "local-row-product-1",
    "category": "local/reels",
    "name": "Local Collection 1",
    "price": 3220886,
    "image": "https://picsum.photos/seed/ldr-34dfe527ec64/414/736",
    "description": "Product card for Local Collection 1",
    "sizes": [
      "One Size"
    ],
    "creatorId": "creator_local_1",
    "creatorUsername": "local_seller_1",
    "creatorAvatar": "/pics/avatars/avatar1.jpg",
    "rating": 4.8,
    "reviews": 172
  },
  {
    "id": "local-row-product-2",
    "category": "local/reels",
    "name": "Local Collection 2",
    "price": 2188318,
    "image": "https://picsum.photos/seed/ldr-70e033508449/414/736",
    "description": "Product card for Local Collection 2",
    "sizes": [
      "One Size"
    ],
    "creatorId": "creator_local_2",
    "creatorUsername": "local_seller_2",
    "creatorAvatar": "/pics/avatars/avatar1.jpg",
    "rating": 4.2,
    "reviews": 116
  },
  {
    "id": "local-row-product-3",
    "category": "local/reels",
    "name": "Local Collection 3",
    "price": 4240929,
    "image": "https://picsum.photos/seed/ldr-737d42a0d4bf/414/736",
    "description": "Product card for Local Collection 3",
    "sizes": [
      "One Size"
    ],
    "creatorId": "creator_local_3",
    "creatorUsername": "local_seller_3",
    "creatorAvatar": "/pics/avatars/avatar1.jpg",
    "rating": 4.3,
    "reviews": 119
  },
  {
    "id": "local-row-product-4",
    "category": "local/reels",
    "name": "Local Collection 4",
    "price": 2220893,
    "image": "https://picsum.photos/seed/ldr-272bc62375b2/414/736",
    "description": "Product card for Local Collection 4",
    "sizes": [
      "One Size"
    ],
    "creatorId": "creator_local_4",
    "creatorUsername": "local_seller_4",
    "creatorAvatar": "/pics/avatars/avatar1.jpg",
    "rating": 4.1,
    "reviews": 307
  }
];

export const localStaticVideoSeeds: LocalStaticVideoSeed[] = [
  {
    "id": "ldr-34dfe527ec64",
    "videoUrl": "/videos/reels1/بیگودی/________مرسی که همراه موآرا هستین 🎀🫠اگه تو ام دوس داری این محصول و داشته باشی کافیه کلمه (قیمت.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-34dfe527ec64/414/736",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 27334,
    "comments": 144,
    "shares": 146,
    "description": "Local Collection 1 - Reel 1",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "intro",
    "productId": "local-row-product-1",
    "isLive": false
  },
  {
    "id": "ldr-fa9721d0dd66",
    "videoUrl": "/videos/reels1/بیگودی/😍😍😍 فروش ویژه 😍😍😍بیگودی فومی فر کننده موبدون حرارت موها رو فر کنبدون آسیب رساندن به مواستف.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-fa9721d0dd66/414/736",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 10555,
    "comments": 485,
    "shares": 67,
    "description": "Local Collection 1 - Reel 2",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-1",
    "isLive": false
  },
  {
    "id": "ldr-044607087d19",
    "videoUrl": "/videos/reels1/بیگودی/به نظرم سومی خیلی خاص و جذابه😍🔥تو کدوم رو دوست داری؟؟سیوش کن هر سه تاشو بلد باشی😎..ثبت سفارش .mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-044607087d19/414/736",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 11864,
    "comments": 34,
    "shares": 76,
    "description": "Local Collection 1 - Reel 3",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-1",
    "isLive": false
  },
  {
    "id": "ldr-ff69035e035a",
    "videoUrl": "/videos/reels1/بیگودی/بیگودی فومی فر کننده موبدون حرارت موها رو فر کنبدون آسیب رساندن به مواستفاده بسیار راحت قیمت - ۳ (1).mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-ff69035e035a/414/736",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 14699,
    "comments": 389,
    "shares": 211,
    "description": "Local Collection 1 - Reel 4",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-1",
    "isLive": false
  },
  {
    "id": "ldr-0bb73798d396",
    "videoUrl": "/videos/reels1/بیگودی/بیگودی فومی فر کننده موبدون حرارت موها رو فر کنبدون آسیب رساندن به مواستفاده بسیار راحت قیمت - ۳.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-0bb73798d396/414/736",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2458,
    "comments": 628,
    "shares": 170,
    "description": "Local Collection 1 - Reel 5",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-1",
    "isLive": false
  },
  {
    "id": "ldr-e88e0a2b9765",
    "videoUrl": "/videos/reels1/بیگودی/بیگودی کلیپسی🎀🍥جزو کم دردسر ترین بیگودیاس😁با حرارت(طبق ویدیو) و_بدون حرارت(با موی نم دار و کر.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-e88e0a2b9765/414/736",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 25186,
    "comments": 156,
    "shares": 198,
    "description": "Local Collection 1 - Reel 6",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-1",
    "isLive": false
  },
  {
    "id": "ldr-cd83c97743b8",
    "videoUrl": "/videos/reels1/بیگودی/پک بیگودی فومی (بدون حرارت)💗 فر کننده موپک ۱۸ عددیبدون نیاز به حرارت یا آسیبجنس فومی و سبک🌈قیم.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-cd83c97743b8/414/736",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 19035,
    "comments": 725,
    "shares": 147,
    "description": "Local Collection 1 - Reel 7",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-1",
    "isLive": false
  },
  {
    "id": "ldr-9b05b69c2b0b",
    "videoUrl": "/videos/reels1/بیگودی/پیچیدنش رو دقت کن قلق داره😗فقط با بیگودی فومی و اسپری تخصصی فر نازمو که تو ویدیو هم_بهش اشاره ش.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-9b05b69c2b0b/414/736",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 13618,
    "comments": 428,
    "shares": 230,
    "description": "Local Collection 1 - Reel 8",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-1",
    "isLive": false
  },
  {
    "id": "ldr-6be5f9d00b59",
    "videoUrl": "/videos/reels1/بیگودی/تعداد بسته بیگودی مورد نیازت👇🏼👇🏼موهای قد تا گردن حجم معمولی یک بستهموهای قد تا وسط پشت حجم م.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-6be5f9d00b59/414/736",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 22444,
    "comments": 614,
    "shares": 156,
    "description": "Local Collection 1 - Reel 9",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-1",
    "isLive": false
  },
  {
    "id": "ldr-d8e480656494",
    "videoUrl": "/videos/reels1/بیگودی/قیمت محصولات داخل کپشن👇🏼👇🏼📌 چند بسته بیگودی فومی برای این حجم فر لازمه؟• مو تا گردن → یک بس.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-d8e480656494/414/736",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 12112,
    "comments": 762,
    "shares": 24,
    "description": "Local Collection 1 - Reel 10",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "result",
    "productId": "local-row-product-1",
    "isLive": false
  },
  {
    "id": "ldr-70e033508449",
    "videoUrl": "/videos/reels1/چنگال/انگشتر ( رز سیاه ) ساخته شده از نوستالژیک ترین قاشقی که در خانه تمام مادر بزرگ ها پیدا میشد .و ا.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-70e033508449/414/736",
    "username": "local_seller_2",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 18224,
    "comments": 794,
    "shares": 236,
    "description": "Local Collection 2 - Reel 1",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "intro",
    "productId": "local-row-product-2",
    "isLive": false
  },
  {
    "id": "ldr-9cd63bc5f644",
    "videoUrl": "/videos/reels1/چنگال/این ست کامل به سفارش و با قاشق چنگال های ارسالی یکی از مشتری های عزیزمون ساخته شده 🤍ما جواهرات .mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-9cd63bc5f644/414/736",
    "username": "local_seller_2",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 16264,
    "comments": 754,
    "shares": 276,
    "description": "Local Collection 2 - Reel 2",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-2",
    "isLive": false
  },
  {
    "id": "ldr-8ca58ea77b3b",
    "videoUrl": "/videos/reels1/چنگال/این گردنی جناقی ، از یک کفگیر قدیمی ، به سفارش مشتری ساخته شده .نظرتون رو در کا منت برای ما بنوی.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-8ca58ea77b3b/414/736",
    "username": "local_seller_2",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 27423,
    "comments": 633,
    "shares": 35,
    "description": "Local Collection 2 - Reel 3",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-2",
    "isLive": false
  },
  {
    "id": "ldr-57bfd21879ed",
    "videoUrl": "/videos/reels1/چنگال/خلاصه که مینا خانم ، قاشقی رو که در طول صعود به کوه دماوند ، همراهیش کرده بود رو به دست های من س.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-57bfd21879ed/414/736",
    "username": "local_seller_2",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 24753,
    "comments": 43,
    "shares": 165,
    "description": "Local Collection 2 - Reel 4",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-2",
    "isLive": false
  },
  {
    "id": "ldr-eecc1d380143",
    "videoUrl": "/videos/reels1/چنگال/دومین جم سیزن tehran underground به پایان رسید و اینها جواهراتی هستند که برای نسل زد ایرانی ، طر.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-eecc1d380143/414/736",
    "username": "local_seller_2",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 17527,
    "comments": 657,
    "shares": 139,
    "description": "Local Collection 2 - Reel 5",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-2",
    "isLive": false
  },
  {
    "id": "ldr-a775388c9758",
    "videoUrl": "/videos/reels1/چنگال/ما ، جواهرات چنگالی زاهدی هستیم 🎩😎🦋🤍#جواهرات_چنگالی_زاهدی @hemad_zahedi @shahara_200 @azhou_.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-a775388c9758/414/736",
    "username": "local_seller_2",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 22110,
    "comments": 760,
    "shares": 22,
    "description": "Local Collection 2 - Reel 6",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "result",
    "productId": "local-row-product-2",
    "isLive": false
  },
  {
    "id": "ldr-737d42a0d4bf",
    "videoUrl": "/videos/reels1/گل/______لگوی گل اورجینال🌷✨ارسال به سراسر کشور🚗امکان خرید حضوری🛒🛍️برای اطلاع از قیمت هر 3 مدل ل.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-737d42a0d4bf/414/736",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 9249,
    "comments": 299,
    "shares": 161,
    "description": "Local Collection 3 - Reel 1",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "intro",
    "productId": "local-row-product-3",
    "isLive": false
  },
  {
    "id": "ldr-4ca7d53abadb",
    "videoUrl": "/videos/reels1/گل/_____فان🐟_کلمه “ ناز “ رو کامنت کن که اطلاعاتش برات بیاره🍓اگه انتخابت نازِ که باید بگم تو عاشق.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-4ca7d53abadb/414/736",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 25689,
    "comments": 99,
    "shares": 101,
    "description": "Local Collection 3 - Reel 2",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-3",
    "isLive": false
  },
  {
    "id": "ldr-4394401754c4",
    "videoUrl": "/videos/reels1/گل/____ولی خرسه…🧸🫠دختری هست که با این دسته گل خوشحال نشه؟؟! 🐻🌻اطلاعات و سفارش از طریق دایرکت💌#.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-4394401754c4/414/736",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 12580,
    "comments": 190,
    "shares": 92,
    "description": "Local Collection 3 - Reel 3",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-3",
    "isLive": false
  },
  {
    "id": "ldr-8f7739ec01b4",
    "videoUrl": "/videos/reels1/گل/__ترکیب هردوشونم اوکیه حالا💅🏻🤣هرتغییری بخوای میتونیم اعمال کنیم🎎برا اطلاع از قیمت و سفارش بد.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-8f7739ec01b4/414/736",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 16344,
    "comments": 434,
    "shares": 256,
    "description": "Local Collection 3 - Reel 4",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-3",
    "isLive": false
  },
  {
    "id": "ldr-8718170b0cf2",
    "videoUrl": "/videos/reels1/گل/__روزی که این دسته گل رو درست کردم گفتم شبیه بهشته🥹🤍به یاد همه مادرانی که امروز دل_شان در آسما.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-8718170b0cf2/414/736",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 8813,
    "comments": 583,
    "shares": 25,
    "description": "Local Collection 3 - Reel 5",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-3",
    "isLive": false
  },
  {
    "id": "ldr-a50477c993c9",
    "videoUrl": "/videos/reels1/گل/😇تو کدومو بیشتر دوس داشتی؟ خودم نارنجیه🔥چندتا از دسته گلای بزرگ و پرکار از سفارشای محبوب شما✨⭐.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-a50477c993c9/414/736",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 20424,
    "comments": 754,
    "shares": 36,
    "description": "Local Collection 3 - Reel 6",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-3",
    "isLive": false
  },
  {
    "id": "ldr-3a0bce612620",
    "videoUrl": "/videos/reels1/گل/ارسال فوری✅بدون انتظار تایم اماده سازی🥹برا اطلاع از قیمت بدویین دایرکت🫐ارسال به سراسر کشور📦#گ.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-3a0bce612620/414/736",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 16128,
    "comments": 378,
    "shares": 140,
    "description": "Local Collection 3 - Reel 7",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-3",
    "isLive": false
  },
  {
    "id": "ldr-1e717a231eee",
    "videoUrl": "/videos/reels1/گل/تک تک این گلهارو خود مشتری انتخاب کرده و من لذت میبرم از ساخت و چیدن این گلها کنار هم🥹🫶🏻شماهم.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-1e717a231eee/414/736",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 14062,
    "comments": 712,
    "shares": 174,
    "description": "Local Collection 3 - Reel 8",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-3",
    "isLive": false
  },
  {
    "id": "ldr-01eab02d15a1",
    "videoUrl": "/videos/reels1/گل/رنگ آبی مورد علاقم نیست…ولی این دسته گل🤌🏼🙂_↔️اینجا هر رنگ گلی که تصور کنی برات میسازم!سقارش و.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-01eab02d15a1/414/736",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 16688,
    "comments": 378,
    "shares": 300,
    "description": "Local Collection 3 - Reel 9",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-3",
    "isLive": false
  },
  {
    "id": "ldr-a8c06cc347f1",
    "videoUrl": "/videos/reels1/گل/شاخه گل هایی که با عشق ساخته میشه🥰🌼نظرتو برام بنویس👇🏼پیجمو داشته باش تا هر روز یک گل جاودان .mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-a8c06cc347f1/414/736",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 5682,
    "comments": 332,
    "shares": 294,
    "description": "Local Collection 3 - Reel 10",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-3",
    "isLive": false
  },
  {
    "id": "ldr-9543c5de830f",
    "videoUrl": "/videos/reels1/گل/لیلیوم نماد پاکی و زیبایی 💓نمونه دسته گلهاشو توی هایلایت “لیلیوم” ببینسفیدشو برای مراسم های خاص.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-9543c5de830f/414/736",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 23089,
    "comments": 779,
    "shares": 301,
    "description": "Local Collection 3 - Reel 11",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "result",
    "productId": "local-row-product-3",
    "isLive": false
  },
  {
    "id": "ldr-272bc62375b2",
    "videoUrl": "/videos/reels1/ماکت ماشین/______خیلی خوشحالیم که تونستیم برای اولین بار در ایران محصولی تولید کنیم که حتی توجه بهترینا هم .mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-272bc62375b2/414/736",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 16639,
    "comments": 489,
    "shares": 51,
    "description": "Local Collection 4 - Reel 1",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "intro",
    "productId": "local-row-product-4",
    "isLive": false
  },
  {
    "id": "ldr-025e471a1a2a",
    "videoUrl": "/videos/reels1/ماکت ماشین/____سه تا فکت که شرط میبندم راجب تیم آلفا نمیدونی ❗️❗️❗️کالکشن فرمول ۱ تابلوهای ماشینی مومِنتو ⚡.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-025e471a1a2a/414/736",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 8220,
    "comments": 790,
    "shares": 132,
    "description": "Local Collection 4 - Reel 2",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-4",
    "isLive": false
  },
  {
    "id": "ldr-d07c34f8b9c3",
    "videoUrl": "/videos/reels1/ماکت ماشین/__یه چیزی ساختیم که نه فقط دکوره، نه فقط کلکسیونه… هر دو باهمه!تابلویی که روش ماکت ماشین کار شده.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-d07c34f8b9c3/414/736",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 26444,
    "comments": 374,
    "shares": 56,
    "description": "Local Collection 4 - Reel 3",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-4",
    "isLive": false
  },
  {
    "id": "ldr-a3fe9f0c93dd",
    "videoUrl": "/videos/reels1/ماکت ماشین/@momento.artshop ❤️این یکی دیگه مخصوص لایی بازیهتابلو 206 Rc مخصوص اون لوازمی بازا ❤️برای دریافت.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-a3fe9f0c93dd/414/736",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 24958,
    "comments": 488,
    "shares": 270,
    "description": "Local Collection 4 - Reel 4",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-4",
    "isLive": false
  },
  {
    "id": "ldr-315df22a5338",
    "videoUrl": "/videos/reels1/ماکت ماشین/اسمبل ماکت آکتروس مدل ۱۸۵۱ دو کانتینر تمام فلزی در مقیاس۱-۳۶ساخت کشور چین بسیار باکیفیت  به نظرت.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-315df22a5338/414/736",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 20881,
    "comments": 251,
    "shares": 93,
    "description": "Local Collection 4 - Reel 5",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-4",
    "isLive": false
  },
  {
    "id": "ldr-84616463d49f",
    "videoUrl": "/videos/reels1/ماکت ماشین/پسرا بگید ببینم ماشین یا موتور 👀 ؟مطمئن باش این بهترین هدیه ای هستکه میتونی به پارتنرت بدی🫣تا .mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-84616463d49f/414/736",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 24779,
    "comments": 389,
    "shares": 91,
    "description": "Local Collection 4 - Reel 6",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-4",
    "isLive": false
  },
  {
    "id": "ldr-2c893e2d3c8d",
    "videoUrl": "/videos/reels1/ماکت ماشین/قبول دارید امریکایی بازا تو هرجمعی باشن متفاوت تر از بقین ؟ 🫡ما براتون خاص ترینارو موجود کردیم .mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-2c893e2d3c8d/414/736",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 4852,
    "comments": 142,
    "shares": 64,
    "description": "Local Collection 4 - Reel 7",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-4",
    "isLive": false
  },
  {
    "id": "ldr-9066b18f48f2",
    "videoUrl": "/videos/reels1/ماکت ماشین/ماکت bmw m3مقیاس۱-۲۴ طول ۲۱سانتیمتر جنس فلزیدربها و کاپوت بازشو درب باک بازشو فرمانپذیر در سه رن.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-9066b18f48f2/414/736",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 26076,
    "comments": 86,
    "shares": 288,
    "description": "Local Collection 4 - Reel 8",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "build",
    "productId": "local-row-product-4",
    "isLive": false
  },
  {
    "id": "ldr-bbe4618b4cd2",
    "videoUrl": "/videos/reels1/ماکت ماشین/ماکت بختیاری عرضه کننده انواع ماکت خودرو سبک سنگین ماکتهای راهسازی موتور دوچرخه قطار هواپیما انو.mp4",
    "thumbnail": "https://picsum.photos/seed/ldr-bbe4618b4cd2/414/736",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 20973,
    "comments": 343,
    "shares": 85,
    "description": "Local Collection 4 - Reel 9",
    "hashtags": [
      "#local",
      "#reels",
      "#collection"
    ],
    "musicTitle": "",
    "processType": "result",
    "productId": "local-row-product-4",
    "isLive": false
  }
];

export const localStaticReelCommentsFa: Record<string, string[]> = {
  "ldr-34dfe527ec64": [
    "Nice item from collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-fa9721d0dd66": [
    "Nice item from collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-044607087d19": [
    "Nice item from collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-ff69035e035a": [
    "Nice item from collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-0bb73798d396": [
    "Nice item from collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-e88e0a2b9765": [
    "Nice item from collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-cd83c97743b8": [
    "Nice item from collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-9b05b69c2b0b": [
    "Nice item from collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-6be5f9d00b59": [
    "Nice item from collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-d8e480656494": [
    "Nice item from collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-70e033508449": [
    "Nice item from collection 2.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-9cd63bc5f644": [
    "Nice item from collection 2.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-8ca58ea77b3b": [
    "Nice item from collection 2.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-57bfd21879ed": [
    "Nice item from collection 2.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-eecc1d380143": [
    "Nice item from collection 2.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-a775388c9758": [
    "Nice item from collection 2.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-737d42a0d4bf": [
    "Nice item from collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-4ca7d53abadb": [
    "Nice item from collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-4394401754c4": [
    "Nice item from collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-8f7739ec01b4": [
    "Nice item from collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-8718170b0cf2": [
    "Nice item from collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-a50477c993c9": [
    "Nice item from collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-3a0bce612620": [
    "Nice item from collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-1e717a231eee": [
    "Nice item from collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-01eab02d15a1": [
    "Nice item from collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-a8c06cc347f1": [
    "Nice item from collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-9543c5de830f": [
    "Nice item from collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-272bc62375b2": [
    "Nice item from collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-025e471a1a2a": [
    "Nice item from collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-d07c34f8b9c3": [
    "Nice item from collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-a3fe9f0c93dd": [
    "Nice item from collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-315df22a5338": [
    "Nice item from collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-84616463d49f": [
    "Nice item from collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-2c893e2d3c8d": [
    "Nice item from collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-9066b18f48f2": [
    "Nice item from collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-bbe4618b4cd2": [
    "Nice item from collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ]
};
