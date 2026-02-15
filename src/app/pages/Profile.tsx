import { useState, useRef, useEffect } from 'react';
import { Settings, Grid, Package, Star, Heart, Video, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useWishlistStore } from '../store/useWishlistStore';
import { ProductDrawer } from '../components/ProductDrawer';
import { Product } from '../types';
import { mockProducts, mockVideos } from '../data/mockData';
import { formatPriceToman } from '../utils/price';

export default function Profile() {
  const profileUsername = 'shirinbuttons';
  const { items: wishlistItems } = useWishlistStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const introReel = mockVideos.find((video) => video.id === '15');
  const [introVideoUrl, setIntroVideoUrl] = useState<string | null>(introReel?.videoUrl ?? null);
  const [introVideoName, setIntroVideoName] = useState(introReel?.product?.name ?? 'intro_video.mp4');
  const introFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (introVideoUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(introVideoUrl);
      }
    };
  }, [introVideoUrl]);

  const handleWishlistItemClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDrawerOpen(true);
  };

  const handleOpenVideoPicker = () => {
    introFileInputRef.current?.click();
  };

  const handleUploadIntroVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (introVideoUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(introVideoUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setIntroVideoUrl(objectUrl);
    setIntroVideoName(file.name);
    e.target.value = '';
  };

  const handleRemoveIntroVideo = () => {
    if (introVideoUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(introVideoUrl);
    }
    setIntroVideoUrl(null);
    setIntroVideoName('');
  };

  const fantasyButtonProducts = mockProducts.filter(
    (product) =>
      product.id.startsWith('btn-') ||
      product.category === 'fantasy-buttons' ||
      product.category === 'fantasy_buttons'
  );

  return (
    <>
      <div className="min-h-screen bg-white pb-24">
        {/* Header with Stats */}
        <div className="px-4 pt-12 pb-6 border-b border-zinc-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Profile</h1>
            <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <Settings className="w-6 h-6" />
            </button>
          </div>

          {/* Intro Video */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Video className="w-4 h-4" />
                Intro Video
              </h2>
              <input
                ref={introFileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleUploadIntroVideo}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenVideoPicker}
                  className="text-xs font-semibold px-3 py-1.5 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors"
                >
                  {introVideoUrl ? 'Replace' : 'Upload'}
                </button>
                {introVideoUrl && (
                  <button
                    onClick={handleRemoveIntroVideo}
                    className="text-xs font-semibold px-3 py-1.5 border border-zinc-300 rounded-full hover:bg-zinc-50 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {introVideoUrl ? (
              <div className="w-full rounded-2xl overflow-hidden border border-zinc-200 bg-black shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                <div className="w-full aspect-video bg-black">
                  <video
                    src={introVideoUrl}
                    className="w-full h-full object-cover object-[50%_35%]"
                    controls
                    autoPlay
                    muted
                    playsInline
                    loop
                  />
                </div>
                <div className="px-3 py-2 bg-zinc-950 text-zinc-200 text-xs">
                  <p className="font-semibold truncate">{introVideoName}</p>
                  {introReel && (
                    <p className="text-zinc-400 mt-1 line-clamp-2">@{introReel.username} • {introReel.description}</p>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={handleOpenVideoPicker}
                className="w-full rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 py-8 px-4 text-center hover:border-zinc-500 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                <p className="text-sm font-semibold text-zinc-700">Add your introduction video</p>
                <p className="text-xs text-zinc-500 mt-1">Show visitors who you are in one short clip</p>
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={`${import.meta.env.BASE_URL}pics/profile/avatar.jpg`}
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold">@{profileUsername}</h2>
              <p className="text-sm text-zinc-600">Content Creator</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-around py-4 bg-zinc-50 rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold">2.4M</p>
              <p className="text-xs text-zinc-600">Followers</p>
            </div>
            <div className="w-px h-10 bg-zinc-200" />
            <div className="text-center">
              <p className="text-2xl font-bold">382</p>
              <p className="text-xs text-zinc-600">Following</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="reels" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-12 bg-white border-b border-zinc-200 rounded-none">
            <TabsTrigger value="reels" className="flex items-center gap-2">
              <Grid className="w-4 h-4" />
              <span className="text-sm">Reels</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="text-sm">Products</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span className="text-sm">Reviews</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reels" className="mt-0 p-0">
            <div className="grid grid-cols-3 gap-1 p-1">
              {mockVideos.map((video) => (
                <div key={video.id} className="aspect-[9/16] bg-zinc-100 relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt="Video"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-0 p-4">
            <div className="grid grid-cols-2 gap-4">
              {fantasyButtonProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleWishlistItemClick(product)}
                  className="bg-white/30 backdrop-blur-md rounded-xl overflow-hidden border border-white/35 shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:bg-white/40 transition-colors text-left"
                >
                  <div className="aspect-square bg-zinc-100 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-base font-bold">{formatPriceToman(product.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0 p-4">
            <div className="space-y-4" dir="rtl">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&seed=${i}`}
                      alt="Reviewer"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-right">دکمه فانتزی دست‌ساز</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 text-right">
                    خیلی قشنگه 😍 کارِ دست؟ فوق‌العاده‌ست 👏 رنگ‌بندی‌ها دلبره 💙✨
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Wishlist Section */}
        <div className="px-4 py-6 border-t-8 border-zinc-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Wishlist
            </h2>
            <span className="text-sm text-zinc-600">{wishlistItems.length} items</span>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <p className="text-zinc-600">Your wishlist is empty</p>
              <p className="text-sm text-zinc-400 mt-1">Save products you love</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {wishlistItems.map((item) => (
                <button
                  key={item.product.id}
                  onClick={() => handleWishlistItemClick(item.product)}
                  className="bg-white/30 backdrop-blur-md rounded-xl overflow-hidden border border-white/35 shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:bg-white/40 transition-colors text-left"
                >
                  <div className="aspect-square bg-zinc-100 relative overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full">
                      <Heart className="w-3 h-3 fill-white" />
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-base font-bold">{formatPriceToman(item.product.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductDrawer
        product={selectedProduct}
        open={isProductDrawerOpen}
        onOpenChange={setIsProductDrawerOpen}
      />
    </>
  );
}

