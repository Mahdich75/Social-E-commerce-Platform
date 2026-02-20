import { useEffect, useMemo, useRef, useState } from 'react';
import { Settings, Grid, Package, Heart, Video, Upload, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useWishlistStore } from '../store/useWishlistStore';
import { ProductDrawer } from '../components/ProductDrawer';
import { Product } from '../types';
import { mockCreators, mockProducts, mockVideos, profileMediaByUsername } from '../data/mockData';
import { formatPriceToman } from '../utils/price';
import { useNavigate, useSearchParams } from 'react-router';
import { useFollowStore } from '../store/useFollowStore';

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawProfileUser = searchParams.get('user') ?? 'shirinbuttons';
  const profileUsername = rawProfileUser.replace(/^@/, '');
  const toggleFollow = useFollowStore((state) => state.toggleFollow);
  const isFollowing = useFollowStore((state) => state.isFollowing);
  const followedUsernames = useFollowStore((state) => state.followedUsernames);
  const { items: wishlistItems } = useWishlistStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [peopleSheet, setPeopleSheet] = useState<'followers' | 'following' | null>(null);
  const profileMedia = profileMediaByUsername[profileUsername];
  const isFolderGeneratedProfile = Boolean(profileMedia);
  const defaultIntroReel = mockVideos.find((video) => video.id === '15');
  const [introVideoUrl, setIntroVideoUrl] = useState<string | null>(null);
  const [introVideoName, setIntroVideoName] = useState('');
  const introFileInputRef = useRef<HTMLInputElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const profileCreator = mockCreators.find((creator) => creator.username === profileUsername);
  const profileAvatar = profileCreator?.avatar ?? `${import.meta.env.BASE_URL}pics/profile/avatar.jpg`;
  const isOwnProfile = profileUsername === 'shirinbuttons';

  const followersList = useMemo(() => {
    const baseFollowers = [
      { username: 'golsare_nazi', avatar: `${import.meta.env.BASE_URL}pics/avatars/avatar1.jpg` },
      { username: 'style_guru', avatar: `${import.meta.env.BASE_URL}pics/avatars/avatar3.jpg` },
      { username: 'beauty_daily', avatar: `${import.meta.env.BASE_URL}pics/avatars/avatar3.jpg` },
      { username: 'tech_hub', avatar: `${import.meta.env.BASE_URL}pics/avatars/avatar1.jpg` },
    ];

    const folderCreators = mockCreators
      .filter((creator) => creator.username !== profileUsername && profileMediaByUsername[creator.username])
      .map((creator) => ({ username: creator.username, avatar: creator.avatar }));

    const followed = followedUsernames
      .filter((username) => username !== profileUsername)
      .slice(0, 8)
      .map((username) => ({
        username,
        avatar:
          mockCreators.find((creator) => creator.username === username)?.avatar ??
          `${import.meta.env.BASE_URL}pics/avatars/avatar2.jpg`,
      }));

    return [...folderCreators, ...followed, ...baseFollowers].filter(
      (person, index, all) => all.findIndex((item) => item.username === person.username) === index
    );
  }, [followedUsernames, profileUsername]);

  const followingList = useMemo(() => {
    const baseFollowing = [
      { username: 'puzzle_gallery', avatar: `${import.meta.env.BASE_URL}pics/avatars/avatar1.jpg` },
      { username: 'massage_corner', avatar: `${import.meta.env.BASE_URL}pics/avatars/avatar2.jpg` },
      { username: 'olenz_ir', avatar: `${import.meta.env.BASE_URL}pics/avatars/avatar2.jpg` },
      { username: 'niloofar_daily', avatar: `${import.meta.env.BASE_URL}pics/avatars/avatar4.jpg` },
    ];

    const folderCreators = mockCreators
      .filter((creator) => creator.username !== profileUsername && profileMediaByUsername[creator.username])
      .map((creator) => ({ username: creator.username, avatar: creator.avatar }));

    const followed = followedUsernames.slice(0, 8).map((username) => ({
      username,
      avatar:
        mockCreators.find((creator) => creator.username === username)?.avatar ??
        `${import.meta.env.BASE_URL}pics/avatars/avatar2.jpg`,
    }));

    return [...folderCreators, ...followed, ...baseFollowing].filter(
      (person, index, all) => all.findIndex((item) => item.username === person.username) === index
    );
  }, [followedUsernames, profileUsername]);

  const profileReels = useMemo(() => {
    if (isFolderGeneratedProfile && profileMedia?.reels?.length) {
      return profileMedia.reels.map((reel) => ({
        id: reel.id,
        videoUrl: reel.videoUrl,
        thumbnail: reel.thumbnail,
      }));
    }

    return mockVideos.slice(0, 11).map((video) => ({ id: video.id, videoUrl: video.videoUrl, thumbnail: video.thumbnail }));
  }, [isFolderGeneratedProfile, profileMedia?.reels]);

  const followersCount = useMemo(() => {
    const base = profileUsername === 'shirinbuttons' ? 2400000 : 18600;
    return base + (followedUsernames.includes(profileUsername) ? 1 : 0);
  }, [followedUsernames, profileUsername]);

  const followingCount = useMemo(() => {
    const base = profileUsername === 'shirinbuttons' ? 382 : 146;
    return base + (isOwnProfile ? followedUsernames.length : 0);
  }, [followedUsernames.length, isOwnProfile, profileUsername]);

  useEffect(() => {
    if (isFolderGeneratedProfile) {
      setIntroVideoUrl(profileMedia?.introVideoUrl ?? null);
      setIntroVideoName(profileMedia?.introVideoName ?? 'intro_video.mp4');
      return;
    }

    setIntroVideoUrl(defaultIntroReel?.videoUrl ?? null);
    setIntroVideoName(defaultIntroReel?.product?.name ?? 'intro_video.mp4');
  }, [defaultIntroReel?.product?.name, defaultIntroReel?.videoUrl, isFolderGeneratedProfile, profileMedia?.introVideoName, profileMedia?.introVideoUrl]);

  useEffect(() => {
    return () => {
      if (introVideoUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(introVideoUrl);
      }
    };
  }, [introVideoUrl]);

  useEffect(() => {
    const video = introVideoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1;
    video.play().catch(() => undefined);
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
        <div className="px-4 pt-12 pb-6 border-b border-zinc-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Profile</h1>
            <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors ui-pressable ui-focus-ring">
              <Settings className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Video className="w-4 h-4" />
                Intro Video
              </h2>
              <input ref={introFileInputRef} type="file" accept="video/*" className="hidden" onChange={handleUploadIntroVideo} />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenVideoPicker}
                  className="text-xs font-semibold px-3 py-1.5 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors ui-pressable ui-focus-ring"
                >
                  {introVideoUrl ? 'Replace' : 'Upload'}
                </button>
                {introVideoUrl && (
                  <button
                    onClick={handleRemoveIntroVideo}
                    className="text-xs font-semibold px-3 py-1.5 border border-zinc-300 rounded-full hover:bg-zinc-50 transition-colors ui-pressable ui-focus-ring"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {introVideoUrl ? (
              <div className="w-full rounded-3xl overflow-hidden border border-white/20 bg-black shadow-[0_18px_40px_rgba(0,0,0,0.22)] animate-in fade-in duration-500">
                <div className="relative w-full aspect-video bg-black">
                  <video
                    ref={introVideoRef}
                    src={introVideoUrl}
                    className="absolute inset-0 w-full h-full object-cover object-[50%_35%]"
                    controls
                    autoPlay
                    muted={false}
                    playsInline
                    loop
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/65" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/35 text-white/90 text-xs backdrop-blur-sm border border-white/20">
                    Introduction
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                    <div className="flex items-end justify-center sm:justify-start gap-3">
                      <img
                        src={profileAvatar}
                        alt={profileUsername}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/80 shadow-[0_0_0_6px_rgba(255,255,255,0.12)] object-cover"
                      />
                      <div className="px-3 py-2 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 max-w-[85%]">
                        <p className="text-white text-lg sm:text-2xl font-semibold leading-tight">@{profileUsername}</p>
                        <p className="text-white/80 text-xs sm:text-sm line-clamp-1">{introVideoName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleOpenVideoPicker}
                className="w-full rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 py-8 px-4 text-center hover:border-zinc-500 transition-colors ui-pressable ui-focus-ring"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                <p className="text-sm font-semibold text-zinc-700">Add your introduction video</p>
                <p className="text-xs text-zinc-500 mt-1">Show visitors who you are in one short clip</p>
              </button>
            )}
          </div>

          <div className="flex items-center justify-around py-4 bg-zinc-50 rounded-xl">
            <button type="button" onClick={() => setPeopleSheet('followers')} className="text-center ui-pressable ui-focus-ring">
              <p className="text-2xl font-bold">{Intl.NumberFormat('en-US').format(followersCount)}</p>
              <p className="text-xs text-zinc-600">Followers</p>
            </button>
            <div className="w-px h-10 bg-zinc-200" />
            <button type="button" onClick={() => setPeopleSheet('following')} className="text-center ui-pressable ui-focus-ring">
              <p className="text-2xl font-bold">{Intl.NumberFormat('en-US').format(followingCount)}</p>
              <p className="text-xs text-zinc-600">Following</p>
            </button>
            {!isOwnProfile && (
              <>
                <div className="w-px h-10 bg-zinc-200" />
                <button
                  type="button"
                  onClick={() => toggleFollow(profileUsername)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    isFollowing(profileUsername) ? 'bg-zinc-200 text-zinc-800' : 'bg-black text-white'
                  } ui-pressable ui-focus-ring`}
                >
                  {isFollowing(profileUsername) ? 'Following' : 'Follow'}
                </button>
              </>
            )}
          </div>
        </div>

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
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Wishlist</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reels" className="mt-0 p-0">
            <div className="grid grid-cols-3 gap-1 p-1">
              {profileReels.map((reel) => (
                <div key={reel.id} className="aspect-[9/16] bg-zinc-100 relative overflow-hidden">
                  {isFolderGeneratedProfile ? (
                    <video
                      src={reel.videoUrl}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img src={reel.thumbnail} alt="Video" className="w-full h-full object-cover" />
                  )}
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
                  className="bg-white/30 backdrop-blur-md rounded-xl overflow-hidden border border-white/35 shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:bg-white/40 transition-colors text-left ui-surface ui-pressable ui-focus-ring"
                >
                  <div className="aspect-square bg-zinc-100 relative overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">{product.name}</h3>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile?user=${encodeURIComponent(product.creatorUsername)}`);
                      }}
                      className="mb-1 inline-flex items-center gap-1.5"
                    >
                      <img src={product.creatorAvatar} alt={product.creatorUsername} className="w-4 h-4 rounded-full object-cover" />
                      <span className="text-[11px] text-zinc-600">@{product.creatorUsername}</span>
                    </button>
                    <p className="text-base font-bold">{formatPriceToman(product.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wishlist" className="mt-0 p-4">
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
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full">
                        <Heart className="w-3 h-3 fill-white" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">{item.product.name}</h3>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/profile?user=${encodeURIComponent(item.product.creatorUsername)}`);
                        }}
                        className="mb-1 inline-flex items-center gap-1.5"
                      >
                        <img src={item.product.creatorAvatar} alt={item.product.creatorUsername} className="w-4 h-4 rounded-full object-cover" />
                        <span className="text-[11px] text-zinc-600">@{item.product.creatorUsername}</span>
                      </button>
                      <p className="text-base font-bold">{formatPriceToman(item.product.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ProductDrawer product={selectedProduct} open={isProductDrawerOpen} onOpenChange={setIsProductDrawerOpen} />

      {peopleSheet && (
        <div className="fixed inset-0 z-30 bg-black/35" onClick={() => setPeopleSheet(null)}>
          <div
            className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[414px] bg-white rounded-t-2xl border border-zinc-200 max-h-[68vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
              <p className="font-bold">{peopleSheet === 'followers' ? 'Followers' : 'Following'}</p>
              <button
                type="button"
                onClick={() => setPeopleSheet(null)}
                className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center ui-pressable ui-focus-ring"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(68vh-3.5rem)] divide-y divide-zinc-100">
              {(peopleSheet === 'followers' ? followersList : followingList).map((person) => (
                <button
                  key={`${peopleSheet}-${person.username}`}
                  type="button"
                  onClick={() => {
                    setPeopleSheet(null);
                    navigate(`/profile?user=${encodeURIComponent(person.username)}`);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-50 ui-pressable ui-focus-ring"
                >
                  <img src={person.avatar} alt={person.username} className="w-10 h-10 rounded-full object-cover" />
                  <p className="font-semibold text-sm">@{person.username}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
