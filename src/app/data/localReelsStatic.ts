import { Product, VideoFeed } from '../types';

export type LocalStaticVideoSeed = Omit<VideoFeed, 'similarReels' | 'product'> & {
  productId: string;
};

export const localStaticProducts: Product[] = [
  {
    "id": "local-row-product-1",
    "category": "local/reels",
    "name": "Local Collection 1",
    "price": 2550000,
    "image": "/images/reel-first-frames/ldr-4ca7d53abadb.jpg",
    "description": "Product card for Local Collection 1",
    "sizes": [
      "One Size"
    ],
    "creatorId": "creator_local_1",
    "creatorUsername": "local_seller_1",
    "creatorAvatar": "/pics/avatars/avatar1.jpg",
    "rating": 4.5,
    "reviews": 140
  },
  {
    "id": "local-row-product-2",
    "category": "local/reels",
    "name": "Local Collection 2",
    "price": 2900000,
    "image": "/images/reel-first-frames/ldr-025e471a1a2a.jpg",
    "description": "Product card for Local Collection 2",
    "sizes": [
      "One Size"
    ],
    "creatorId": "creator_local_2",
    "creatorUsername": "local_seller_2",
    "creatorAvatar": "/pics/avatars/avatar1.jpg",
    "rating": 4.5,
    "reviews": 160
  },
  {
    "id": "local-row-product-3",
    "category": "local/reels",
    "name": "Local Collection 3",
    "price": 3250000,
    "image": "/images/reel-first-frames/ldr-01eab02d15a1.jpg",
    "description": "Product card for Local Collection 3",
    "sizes": [
      "One Size"
    ],
    "creatorId": "creator_local_3",
    "creatorUsername": "local_seller_3",
    "creatorAvatar": "/pics/avatars/avatar1.jpg",
    "rating": 4.5,
    "reviews": 180
  },
  {
    "id": "local-row-product-4",
    "category": "local/reels",
    "name": "Local Collection 4",
    "price": 3600000,
    "image": "/images/reel-first-frames/ldr-0bb73798d396.jpg",
    "description": "Product card for Local Collection 4",
    "sizes": [
      "One Size"
    ],
    "creatorId": "creator_local_4",
    "creatorUsername": "local_seller_4",
    "creatorAvatar": "/pics/avatars/avatar1.jpg",
    "rating": 4.5,
    "reviews": 200
  }
];

export const localStaticVideoSeeds: LocalStaticVideoSeed[] = [
  {
    "id": "ldr-4ca7d53abadb",
    "videoUrl": "/videos/reels1_safe/ldr-4ca7d53abadb.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-4ca7d53abadb.jpg",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 1637,
    "comments": 89,
    "shares": 23,
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
    "id": "ldr-6be5f9d00b59",
    "videoUrl": "/videos/reels1_safe/ldr-6be5f9d00b59.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-6be5f9d00b59.jpg",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 1774,
    "comments": 98,
    "shares": 26,
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
    "id": "ldr-84616463d49f",
    "videoUrl": "/videos/reels1_safe/ldr-84616463d49f.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-84616463d49f.jpg",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 1911,
    "comments": 107,
    "shares": 29,
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
    "id": "ldr-8718170b0cf2",
    "videoUrl": "/videos/reels1_safe/ldr-8718170b0cf2.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-8718170b0cf2.jpg",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2048,
    "comments": 116,
    "shares": 32,
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
    "id": "ldr-a3fe9f0c93dd",
    "videoUrl": "/videos/reels1_safe/ldr-a3fe9f0c93dd.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-a3fe9f0c93dd.jpg",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2185,
    "comments": 125,
    "shares": 35,
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
    "id": "ldr-a8c06cc347f1",
    "videoUrl": "/videos/reels1_safe/ldr-a8c06cc347f1.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-a8c06cc347f1.jpg",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2322,
    "comments": 134,
    "shares": 38,
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
    "videoUrl": "/videos/reels1_safe/ldr-cd83c97743b8.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-cd83c97743b8.jpg",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2459,
    "comments": 143,
    "shares": 41,
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
    "id": "ldr-ff69035e035a",
    "videoUrl": "/videos/reels1_safe/ldr-ff69035e035a.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-ff69035e035a.jpg",
    "username": "local_seller_1",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2596,
    "comments": 152,
    "shares": 44,
    "description": "Local Collection 1 - Reel 8",
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
    "id": "ldr-025e471a1a2a",
    "videoUrl": "/videos/reels1_safe/ldr-025e471a1a2a.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-025e471a1a2a.jpg",
    "username": "local_seller_2",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 1637,
    "comments": 89,
    "shares": 23,
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
    "id": "ldr-044607087d19",
    "videoUrl": "/videos/reels1_safe/ldr-044607087d19.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-044607087d19.jpg",
    "username": "local_seller_2",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 1774,
    "comments": 98,
    "shares": 26,
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
    "id": "ldr-2c893e2d3c8d",
    "videoUrl": "/videos/reels1_safe/ldr-2c893e2d3c8d.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-2c893e2d3c8d.jpg",
    "username": "local_seller_2",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 1911,
    "comments": 107,
    "shares": 29,
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
    "id": "ldr-34dfe527ec64",
    "videoUrl": "/videos/reels1_safe/ldr-34dfe527ec64.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-34dfe527ec64.jpg",
    "username": "local_seller_2",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2048,
    "comments": 116,
    "shares": 32,
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
    "id": "ldr-9066b18f48f2",
    "videoUrl": "/videos/reels1_safe/ldr-9066b18f48f2.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-9066b18f48f2.jpg",
    "username": "local_seller_2",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2185,
    "comments": 125,
    "shares": 35,
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
    "id": "ldr-9b05b69c2b0b",
    "videoUrl": "/videos/reels1_safe/ldr-9b05b69c2b0b.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-9b05b69c2b0b.jpg",
    "username": "local_seller_2",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2322,
    "comments": 134,
    "shares": 38,
    "description": "Local Collection 2 - Reel 6",
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
    "id": "ldr-e88e0a2b9765",
    "videoUrl": "/videos/reels1_safe/ldr-e88e0a2b9765.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-e88e0a2b9765.jpg",
    "username": "local_seller_2",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2459,
    "comments": 143,
    "shares": 41,
    "description": "Local Collection 2 - Reel 7",
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
    "id": "ldr-fa9721d0dd66",
    "videoUrl": "/videos/reels1_safe/ldr-fa9721d0dd66.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-fa9721d0dd66.jpg",
    "username": "local_seller_2",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2596,
    "comments": 152,
    "shares": 44,
    "description": "Local Collection 2 - Reel 8",
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
    "id": "ldr-01eab02d15a1",
    "videoUrl": "/videos/reels1_safe/ldr-01eab02d15a1.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-01eab02d15a1.jpg",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 1637,
    "comments": 89,
    "shares": 23,
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
    "id": "ldr-1e717a231eee",
    "videoUrl": "/videos/reels1_safe/ldr-1e717a231eee.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-1e717a231eee.jpg",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 1774,
    "comments": 98,
    "shares": 26,
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
    "id": "ldr-272bc62375b2",
    "videoUrl": "/videos/reels1_safe/ldr-272bc62375b2.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-272bc62375b2.jpg",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 1911,
    "comments": 107,
    "shares": 29,
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
    "id": "ldr-315df22a5338",
    "videoUrl": "/videos/reels1_safe/ldr-315df22a5338.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-315df22a5338.jpg",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2048,
    "comments": 116,
    "shares": 32,
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
    "id": "ldr-3a0bce612620",
    "videoUrl": "/videos/reels1_safe/ldr-3a0bce612620.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-3a0bce612620.jpg",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2185,
    "comments": 125,
    "shares": 35,
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
    "id": "ldr-8f7739ec01b4",
    "videoUrl": "/videos/reels1_safe/ldr-8f7739ec01b4.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-8f7739ec01b4.jpg",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2322,
    "comments": 134,
    "shares": 38,
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
    "id": "ldr-9543c5de830f",
    "videoUrl": "/videos/reels1_safe/ldr-9543c5de830f.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-9543c5de830f.jpg",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2459,
    "comments": 143,
    "shares": 41,
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
    "id": "ldr-9cd63bc5f644",
    "videoUrl": "/videos/reels1_safe/ldr-9cd63bc5f644.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-9cd63bc5f644.jpg",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2596,
    "comments": 152,
    "shares": 44,
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
    "id": "ldr-a775388c9758",
    "videoUrl": "/videos/reels1_safe/ldr-a775388c9758.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-a775388c9758.jpg",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2733,
    "comments": 161,
    "shares": 47,
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
    "id": "ldr-bbe4618b4cd2",
    "videoUrl": "/videos/reels1_safe/ldr-bbe4618b4cd2.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-bbe4618b4cd2.jpg",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2870,
    "comments": 170,
    "shares": 50,
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
    "id": "ldr-d8e480656494",
    "videoUrl": "/videos/reels1_safe/ldr-d8e480656494.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-d8e480656494.jpg",
    "username": "local_seller_3",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 3007,
    "comments": 179,
    "shares": 53,
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
    "id": "ldr-0bb73798d396",
    "videoUrl": "/videos/reels1_safe/ldr-0bb73798d396.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-0bb73798d396.jpg",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 1637,
    "comments": 89,
    "shares": 23,
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
    "id": "ldr-4394401754c4",
    "videoUrl": "/videos/reels1_safe/ldr-4394401754c4.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-4394401754c4.jpg",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 1774,
    "comments": 98,
    "shares": 26,
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
    "id": "ldr-57bfd21879ed",
    "videoUrl": "/videos/reels1_safe/ldr-57bfd21879ed.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-57bfd21879ed.jpg",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 1911,
    "comments": 107,
    "shares": 29,
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
    "id": "ldr-70e033508449",
    "videoUrl": "/videos/reels1_safe/ldr-70e033508449.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-70e033508449.jpg",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2048,
    "comments": 116,
    "shares": 32,
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
    "id": "ldr-737d42a0d4bf",
    "videoUrl": "/videos/reels1_safe/ldr-737d42a0d4bf.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-737d42a0d4bf.jpg",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2185,
    "comments": 125,
    "shares": 35,
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
    "id": "ldr-8ca58ea77b3b",
    "videoUrl": "/videos/reels1_safe/ldr-8ca58ea77b3b.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-8ca58ea77b3b.jpg",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2322,
    "comments": 134,
    "shares": 38,
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
    "id": "ldr-a50477c993c9",
    "videoUrl": "/videos/reels1_safe/ldr-a50477c993c9.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-a50477c993c9.jpg",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2459,
    "comments": 143,
    "shares": 41,
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
    "id": "ldr-d07c34f8b9c3",
    "videoUrl": "/videos/reels1_safe/ldr-d07c34f8b9c3.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-d07c34f8b9c3.jpg",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2596,
    "comments": 152,
    "shares": 44,
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
    "id": "ldr-eecc1d380143",
    "videoUrl": "/videos/reels1_safe/ldr-eecc1d380143.mp4",
    "thumbnail": "/images/reel-first-frames/ldr-eecc1d380143.jpg",
    "username": "local_seller_4",
    "userAvatar": "/pics/avatars/avatar1.jpg",
    "likes": 2733,
    "comments": 161,
    "shares": 47,
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
  "ldr-4ca7d53abadb": [
    "Nice reel from Local Collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-6be5f9d00b59": [
    "Nice reel from Local Collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-84616463d49f": [
    "Nice reel from Local Collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-8718170b0cf2": [
    "Nice reel from Local Collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-a3fe9f0c93dd": [
    "Nice reel from Local Collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-a8c06cc347f1": [
    "Nice reel from Local Collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-cd83c97743b8": [
    "Nice reel from Local Collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-ff69035e035a": [
    "Nice reel from Local Collection 1.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-025e471a1a2a": [
    "Nice reel from Local Collection 2.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-044607087d19": [
    "Nice reel from Local Collection 2.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-2c893e2d3c8d": [
    "Nice reel from Local Collection 2.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-34dfe527ec64": [
    "Nice reel from Local Collection 2.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-9066b18f48f2": [
    "Nice reel from Local Collection 2.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-9b05b69c2b0b": [
    "Nice reel from Local Collection 2.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-e88e0a2b9765": [
    "Nice reel from Local Collection 2.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-fa9721d0dd66": [
    "Nice reel from Local Collection 2.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-01eab02d15a1": [
    "Nice reel from Local Collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-1e717a231eee": [
    "Nice reel from Local Collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-272bc62375b2": [
    "Nice reel from Local Collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-315df22a5338": [
    "Nice reel from Local Collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-3a0bce612620": [
    "Nice reel from Local Collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-8f7739ec01b4": [
    "Nice reel from Local Collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-9543c5de830f": [
    "Nice reel from Local Collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-9cd63bc5f644": [
    "Nice reel from Local Collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-a775388c9758": [
    "Nice reel from Local Collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-bbe4618b4cd2": [
    "Nice reel from Local Collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-d8e480656494": [
    "Nice reel from Local Collection 3.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-0bb73798d396": [
    "Nice reel from Local Collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-4394401754c4": [
    "Nice reel from Local Collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-57bfd21879ed": [
    "Nice reel from Local Collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-70e033508449": [
    "Nice reel from Local Collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-737d42a0d4bf": [
    "Nice reel from Local Collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-8ca58ea77b3b": [
    "Nice reel from Local Collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-a50477c993c9": [
    "Nice reel from Local Collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-d07c34f8b9c3": [
    "Nice reel from Local Collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ],
  "ldr-eecc1d380143": [
    "Nice reel from Local Collection 4.",
    "Is this available now?",
    "Please share more details.",
    "Looks premium for gifting.",
    "Can I order this today?"
  ]
};
