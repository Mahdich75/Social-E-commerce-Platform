import { useEffect, useMemo, useRef, useState } from 'react';
import { Home, Search, Plus, ShoppingBag, User, Store, BadgeCheck, Video, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useBasketStore } from '../store/useBasketStore';
import { toast } from 'sonner';
import { mockProducts } from '../data/mockData';
import { useCreatorFlowStore, type VendorListing } from '../store/useCreatorFlowStore';
import type { Product } from '../types';

type CreateMode = 'vendor' | 'showcase' | 'review' | null;
type VendorProductMode = 'existing' | 'new';

const buildCustomVendorProduct = (listing: VendorListing): Product | null => {
  if (!listing.customProductName?.trim()) return null;
  const fallbackImage = mockProducts[0]?.image ?? `${import.meta.env.BASE_URL}pics/avatars/avatar1.jpg`;
  const creatorUsername = listing.vendorUsername || 'vendor';

  return {
    id: listing.productId,
    category: listing.customProductCategory?.trim() || 'vendor/custom',
    name: listing.customProductName.trim(),
    price: listing.customProductPrice ?? 0,
    image: fallbackImage,
    description: listing.productDescription?.trim() || 'Vendor-added product',
    sizes: ['One Size'],
    creatorId: creatorUsername,
    creatorUsername,
    creatorAvatar: `${import.meta.env.BASE_URL}pics/avatars/avatar1.jpg`,
    rating: 4.5,
    reviews: 0,
  };
};

export function BottomNav() {
  const ICON_CONTAINER_SIZE = 30;
  const NAV_ICON_SIZE = 24;
  const CENTER_ICON_SIZE = 26;
  const NAV_ICON_STROKE = 2.25;
  const location = useLocation();
  const totalItems = useBasketStore(state => state.getTotalItems());
  const basketItems = useBasketStore((state) => state.items);
  const vendorListings = useCreatorFlowStore((state) => state.vendorListings);
  const addVendorListing = useCreatorFlowStore((state) => state.addVendorListing);
  const submitCreatorContent = useCreatorFlowStore((state) => state.submitCreatorContent);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [activeCreateMode, setActiveCreateMode] = useState<CreateMode>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>(mockProducts[0]?.id ?? '');
  const [selectedShowcaseListingIds, setSelectedShowcaseListingIds] = useState<string[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [affiliateRate, setAffiliateRate] = useState<number>(12);
  const [vendorProductMode, setVendorProductMode] = useState<VendorProductMode>('existing');
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('vendor/custom');
  const [newProductPrice, setNewProductPrice] = useState<number>(0);
  const [caption, setCaption] = useState('');
  const [vendorDescription, setVendorDescription] = useState('');
  const [vendorImageName, setVendorImageName] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const createButtonRef = useRef<HTMLButtonElement | null>(null);
  const createMenuRef = useRef<HTMLDivElement | null>(null);
  const createSheetRef = useRef<HTMLDivElement | null>(null);
  const reviewPickerRef = useRef<HTMLInputElement | null>(null);
  const showcasePickerRef = useRef<HTMLInputElement | null>(null);
  const vendorImagePickerRef = useRef<HTMLInputElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/discover', icon: Search, label: 'Discover' },
    { path: '/create', icon: Plus, label: 'Create', isSpecial: true },
    { path: '/basket', icon: ShoppingBag, label: 'Basket', badge: totalItems },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const activeVendorListings = useMemo(
    () =>
      vendorListings
        .filter((item) => item.isActive)
        .map((listing) => ({
          ...listing,
          product: mockProducts.find((product) => product.id === listing.productId) ?? buildCustomVendorProduct(listing),
        }))
        .filter((listing) => Boolean(listing.product)),
    [vendorListings]
  );

  const mockProductAffiliateRates = useMemo(() => {
    const toRate = (productId: string) => {
      const seed = productId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      return 3 + (seed % 18);
    };
    return Object.fromEntries(mockProducts.map((product) => [product.id, toRate(product.id)])) as Record<string, number>;
  }, []);

  const showcaseListings = useMemo(() => {
    const vendorBacked = activeVendorListings.map((listing) => ({
      id: listing.id,
      productId: listing.productId,
      affiliateRate: listing.affiliateRate,
      product: listing.product,
      source: 'vendor' as const,
    }));

    const vendorBackedProductIds = new Set(vendorBacked.map((item) => item.productId));
    const mockBacked = mockProducts
      .filter((product) => !vendorBackedProductIds.has(product.id))
      .map((product) => ({
        id: `mock-${product.id}`,
        productId: product.id,
        affiliateRate: mockProductAffiliateRates[product.id] ?? 8,
        product,
        source: 'mock' as const,
      }));

    return [...vendorBacked, ...mockBacked];
  }, [activeVendorListings, mockProductAffiliateRates]);

  const basketReviewOrders = useMemo(
    () =>
      basketItems.filter((item) =>
        activeVendorListings.some((listing) => listing.productId === item.product.id)
      ),
    [activeVendorListings, basketItems]
  );

  useEffect(() => {
    if (!isCreateMenuOpen && !activeCreateMode) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (createMenuRef.current?.contains(target)) return;
      if (createButtonRef.current?.contains(target)) return;
      if (createSheetRef.current?.contains(target)) return;
      setIsCreateMenuOpen(false);
      setActiveCreateMode(null);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCreateMenuOpen(false);
        setActiveCreateMode(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeCreateMode, isCreateMenuOpen]);

  useEffect(() => {
    const applyNavHeightVar = () => {
      const navHeight = navRef.current?.offsetHeight;
      if (!navHeight) return;
      // Keep feed overlays above the real nav height across mobile Chrome/PWA viewport changes.
      document.documentElement.style.setProperty('--bottom-nav-actual-height', `${navHeight}px`);
    };

    applyNavHeightVar();
    window.addEventListener('resize', applyNavHeightVar);
    window.visualViewport?.addEventListener('resize', applyNavHeightVar);

    const observer = new ResizeObserver(() => applyNavHeightVar());
    if (navRef.current) observer.observe(navRef.current);

    return () => {
      window.removeEventListener('resize', applyNavHeightVar);
      window.visualViewport?.removeEventListener('resize', applyNavHeightVar);
      observer.disconnect();
    };
  }, []);

  const resetCreateState = () => {
    setCaption('');
    setSelectedShowcaseListingIds([]);
    setSelectedOrderId('');
    setVendorProductMode('existing');
    setNewProductName('');
    setNewProductCategory('vendor/custom');
    setNewProductPrice(0);
    setVendorDescription('');
    setVendorImageName('');
    setInstagramUrl('');
  };

  const handleCreateAction = (mode: Exclude<CreateMode, null>) => {
    setIsCreateMenuOpen(false);
    setActiveCreateMode(mode);
    resetCreateState();
  };

  const closeCreateSheet = () => {
    setActiveCreateMode(null);
    resetCreateState();
  };

  const handleVendorSubmit = () => {
    const product = mockProducts.find((item) => item.id === selectedProductId);
    const isNewProductMode = vendorProductMode === 'new';
    const normalizedName = newProductName.trim();
    const normalizedCategory = newProductCategory.trim();

    if (!isNewProductMode && !product) {
      toast.error('Select a valid product');
      return;
    }
    if (isNewProductMode && !normalizedName) {
      toast.error('Enter new product name');
      return;
    }
    if (!instagramUrl && !vendorImageName) {
      toast.error('Add product image or Instagram link');
      return;
    }
    if (!instagramUrl && !vendorDescription.trim()) {
      toast.error('Add product description or Instagram link');
      return;
    }
    const generatedCustomProductId = `vendor_custom_${Date.now()}`;
    addVendorListing({
      productId: isNewProductMode ? generatedCustomProductId : (product?.id ?? ''),
      affiliateRate,
      vendorUsername: product?.creatorUsername || 'vendor_personal',
      customProductName: isNewProductMode ? normalizedName : undefined,
      customProductCategory: isNewProductMode ? normalizedCategory || 'vendor/custom' : undefined,
      customProductPrice: isNewProductMode ? Math.max(0, Number(newProductPrice) || 0) : undefined,
      productImageName: vendorImageName || undefined,
      productDescription: vendorDescription.trim() || undefined,
      instagramUrl: instagramUrl.trim() || undefined,
    });
    toast.success('Vendor product registered');
    closeCreateSheet();
  };

  const handleShowcasePick = () => {
    if (selectedShowcaseListingIds.length === 0) {
      toast.error('Select at least one product');
      return;
    }
    if (instagramUrl.trim()) {
      selectedShowcaseListingIds.forEach((listingId) => {
        const listing = showcaseListings.find((item) => item.id === listingId);
        if (!listing) return;
        submitCreatorContent({
          listingId: listing.id,
          productId: listing.productId,
          creatorUsername: 'creator_user',
          contentType: 'showcase',
          caption: caption || `Showcase for ${listing.product?.name}`,
          mediaName: 'instagram-link',
          instagramUrl: instagramUrl.trim(),
        });
      });
      toast.success(`Showcase link submitted for ${selectedShowcaseListingIds.length} product(s)`);
      closeCreateSheet();
      return;
    }
    showcasePickerRef.current?.click();
  };

  const handleReviewPick = () => {
    if (!selectedOrderId) {
      toast.error('Select a basket product first');
      return;
    }
    if (instagramUrl.trim()) {
      const order = basketReviewOrders.find((item) => item.orderId === selectedOrderId);
      if (!order) {
        toast.error('Select a valid basket product');
        return;
      }
      const listing = activeVendorListings.find((item) => item.productId === order.product.id);
      if (!listing) {
        toast.error('No vendor listing found for this product');
        return;
      }
      submitCreatorContent({
        listingId: listing.id,
        productId: order.product.id,
        creatorUsername: 'creator_user',
        contentType: 'review',
        caption: caption || `Review for ${order.product.name}`,
        mediaName: 'instagram-link',
        instagramUrl: instagramUrl.trim(),
        sourceOrderId: order.orderId,
      });
      toast.success('Review link submitted');
      closeCreateSheet();
      return;
    }
    reviewPickerRef.current?.click();
  };

  const handleReviewFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const order = basketReviewOrders.find((item) => item.orderId === selectedOrderId);
    if (!order) {
      toast.error('Select a valid basket product');
      event.target.value = '';
      return;
    }
    const listing = activeVendorListings.find((item) => item.productId === order.product.id);
    if (!listing) {
      toast.error('No vendor listing found for this product');
      event.target.value = '';
      return;
    }

    submitCreatorContent({
      listingId: listing.id,
      productId: order.product.id,
      creatorUsername: 'creator_user',
      contentType: 'review',
      caption: caption || `Verified review for ${order.product.name}`,
      mediaName: file.name,
      sourceOrderId: order.orderId,
      instagramUrl: instagramUrl.trim() || undefined,
    });
    toast.success('Review submitted');
    closeCreateSheet();
    event.target.value = '';
  };

  const handleShowcaseFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (selectedShowcaseListingIds.length === 0) {
      toast.error('Select at least one product');
      event.target.value = '';
      return;
    }

    selectedShowcaseListingIds.forEach((listingId) => {
      const listing = showcaseListings.find((item) => item.id === listingId);
      if (!listing) return;
      submitCreatorContent({
        listingId: listing.id,
        productId: listing.productId,
        creatorUsername: 'creator_user',
        contentType: 'showcase',
        caption: caption || `Showcase for ${listing.product?.name}`,
        mediaName: file.name,
        instagramUrl: instagramUrl.trim() || undefined,
      });
    });
    toast.success(`Showcase uploaded for ${selectedShowcaseListingIds.length} product(s)`);
    closeCreateSheet();
    event.target.value = '';
  };

  const handleVendorImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setVendorImageName(file.name);
    toast.success('Product image selected');
    event.target.value = '';
  };

  useEffect(() => {
    if (activeCreateMode !== 'review') return;
    if (!selectedOrderId) return;
    if (instagramUrl.trim()) return;
    const timer = window.setTimeout(() => {
      reviewPickerRef.current?.click();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [activeCreateMode, instagramUrl, selectedOrderId]);

  return (
    <nav ref={navRef} className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 pb-safe z-50">
      <input
        ref={reviewPickerRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={handleReviewFileChange}
      />
      <input
        ref={showcasePickerRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={handleShowcaseFileChange}
      />
      <input
        ref={vendorImagePickerRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleVendorImageFileChange}
      />

      {isCreateMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[1px] transition-opacity duration-200"
          onClick={() => setIsCreateMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {activeCreateMode && (
        <div className="fixed inset-0 z-[60] bg-black/35" onClick={closeCreateSheet}>
          <div
            ref={createSheetRef}
            className="absolute inset-x-0 bottom-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom,0px))] mx-auto w-full max-w-[414px] rounded-t-2xl border border-zinc-200 bg-white p-4 shadow-[0_-12px_30px_rgba(0,0,0,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold">
                {activeCreateMode === 'vendor' && 'Vendor Product Setup'}
                {activeCreateMode === 'showcase' && 'Creator Showcase Upload'}
                {activeCreateMode === 'review' && 'Verified Purchase Review'}
              </p>
              <button
                type="button"
                onClick={closeCreateSheet}
                className="h-8 w-8 rounded-full hover:bg-zinc-100 flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {activeCreateMode === 'vendor' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVendorProductMode('existing')}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                      vendorProductMode === 'existing' ? 'border-black bg-black text-white' : 'border-zinc-300 text-zinc-700'
                    }`}
                  >
                    Existing Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setVendorProductMode('new')}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                      vendorProductMode === 'new' ? 'border-black bg-black text-white' : 'border-zinc-300 text-zinc-700'
                    }`}
                  >
                    New Product
                  </button>
                </div>
                {vendorProductMode === 'existing' ? (
                  <label className="block text-xs text-zinc-600">
                    Product
                    <select
                      value={selectedProductId}
                      onChange={(event) => setSelectedProductId(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                    >
                      {mockProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-xs text-zinc-600">
                      New Product Name
                      <input
                        value={newProductName}
                        onChange={(event) => setNewProductName(event.target.value)}
                        placeholder="Enter product name"
                        className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="block text-xs text-zinc-600">
                      Category
                      <input
                        value={newProductCategory}
                        onChange={(event) => setNewProductCategory(event.target.value)}
                        placeholder="e.g. beauty/accessory"
                        className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="block text-xs text-zinc-600">
                      Price (Toman)
                      <input
                        type="number"
                        min={0}
                        value={newProductPrice}
                        onChange={(event) => setNewProductPrice(Number(event.target.value))}
                        className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                      />
                    </label>
                  </div>
                )}
                <label className="block text-xs text-zinc-600">
                  Affiliate Rate (%)
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={affiliateRate}
                    onChange={(event) => setAffiliateRate(Number(event.target.value))}
                    className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-xs text-zinc-600">
                  Product Description
                  <textarea
                    value={vendorDescription}
                    onChange={(event) => setVendorDescription(event.target.value)}
                    rows={2}
                    placeholder="Short product description"
                    className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                  />
                </label>
                <div className="rounded-xl border border-zinc-200 p-2">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs text-zinc-600">{vendorImageName || 'No product image selected'}</p>
                    <button
                      type="button"
                      onClick={() => vendorImagePickerRef.current?.click()}
                      className="rounded-lg border border-zinc-300 px-2 py-1 text-[11px] font-medium"
                    >
                      Select Image
                    </button>
                  </div>
                  <input
                    value={instagramUrl}
                    onChange={(event) => setInstagramUrl(event.target.value)}
                    placeholder="Instagram link (optional, can replace image/description)"
                    className="w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVendorSubmit}
                  className="w-full rounded-xl bg-black px-3 py-2.5 text-sm font-semibold text-white"
                >
                  {vendorProductMode === 'new' ? 'Register New Vendor Product' : 'Register Vendor Product'}
                </button>
              </div>
            )}

                        {activeCreateMode === 'showcase' && (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-zinc-600 mb-2">Select one or multiple product cards</p>
                  <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                    {showcaseListings.map((listing) => {
                      const selected = selectedShowcaseListingIds.includes(listing.id);
                      return (
                        <button
                          key={listing.id}
                          type="button"
                          onClick={() =>
                            setSelectedShowcaseListingIds((prev) =>
                              prev.includes(listing.id) ? prev.filter((id) => id !== listing.id) : [...prev, listing.id]
                            )
                          }
                          className={`rounded-xl border p-2 text-left transition ${selected ? 'border-black bg-zinc-100' : 'border-zinc-200 bg-white'}`}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={listing.product?.image}
                              alt={listing.product?.name}
                              className="h-9 w-9 rounded-md object-cover"
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold leading-4 truncate">{listing.product?.name}</p>
                              <p className="text-[10px] text-zinc-500 leading-4">{listing.affiliateRate}% affiliate</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <textarea
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  rows={2}
                  placeholder="Short caption for creator content"
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                />
                <input
                  value={instagramUrl}
                  onChange={(event) => setInstagramUrl(event.target.value)}
                  placeholder="Instagram link (optional, can replace video upload)"
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={handleShowcasePick}
                  className="w-full rounded-xl bg-black px-3 py-2.5 text-sm font-semibold text-white"
                >
                  Select/Record Showcase Video
                </button>
              </div>
            )}

            {activeCreateMode === 'review' && (
              <div className="space-y-3">
                <label className="block text-xs text-zinc-600">
                  Basket Product
                  <select
                    value={selectedOrderId}
                    onChange={(event) => setSelectedOrderId(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                  >
                    <option value="">Select basket product</option>
                    {basketReviewOrders.map((order) => (
                      <option key={order.orderId} value={order.orderId}>
                        {order.product.name} â€¢ {order.orderId}
                      </option>
                    ))}
                  </select>
                </label>
                <textarea
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  rows={2}
                  placeholder="Write your verified review caption"
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                />
                <input
                  value={instagramUrl}
                  onChange={(event) => setInstagramUrl(event.target.value)}
                  placeholder="Instagram link (optional, can replace review media)"
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={handleReviewPick}
                  className="w-full rounded-xl bg-black px-3 py-2.5 text-sm font-semibold text-white"
                >
                  Select Review Media
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        ref={createMenuRef}
        className={`absolute left-1/2 -translate-x-1/2 bottom-[4.7rem] z-50 w-[min(86vw,320px)] transition-all duration-220 ease-out ${
          isCreateMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        {/* Root cause: labels/icons were white on a translucent light surface, so contrast collapsed on white screens.
            Fix: use tokenized popover surface + foreground text + subtle scrim for consistent WCAG-friendly readability. */}
        <div className="rounded-2xl border border-border/80 bg-popover/95 text-popover-foreground backdrop-blur-xl shadow-[0_20px_45px_rgba(0,0,0,0.28)] p-2">
          <button
            type="button"
            onClick={() => handleCreateAction('vendor')}
            className="w-full text-left px-3 py-3 rounded-xl hover:bg-accent transition-colors ui-pressable ui-focus-ring"
          >
            <p className="text-sm font-semibold flex items-center gap-1.5"><Store className="w-3.5 h-3.5" /> Register Vendor Product</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Set affiliate and publish product for creators</p>
          </button>
          <button
            type="button"
            onClick={() => handleCreateAction('showcase')}
            className="w-full text-left px-3 py-3 rounded-xl hover:bg-accent transition-colors ui-pressable ui-focus-ring"
          >
            <p className="text-sm font-semibold flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> Upload Creator Showcase</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Create content from vendor products with affiliate</p>
          </button>
          <button
            type="button"
            onClick={() => handleCreateAction('review')}
            className="w-full text-left px-3 py-3 rounded-xl hover:bg-accent transition-colors ui-pressable ui-focus-ring"
          >
            <p className="text-sm font-semibold flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5" /> Upload Verified Review</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Only for completed purchased items in basket</p>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-around h-[var(--bottom-nav-height)] max-w-[414px] mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.isSpecial) {
            return (
              <button
                key={item.path}
                ref={createButtonRef}
                type="button"
                onClick={() => setIsCreateMenuOpen((prev) => !prev)}
                className="h-full flex-1 flex items-center justify-center ui-pressable ui-focus-ring"
                aria-label="Open create actions"
                aria-expanded={isCreateMenuOpen}
                aria-haspopup="menu"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-cyan-400 rounded-lg blur-sm opacity-75" />
                  <div
                    className="relative bg-white rounded-lg flex items-center justify-center"
                    style={{ width: ICON_CONTAINER_SIZE, height: ICON_CONTAINER_SIZE, lineHeight: 1 }}
                  >
                    <Icon size={CENTER_ICON_SIZE} className="text-black" strokeWidth={NAV_ICON_STROKE} />
                  </div>
                </div>
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className="h-full flex-1 flex items-center justify-center ui-pressable ui-focus-ring"
            >
              <div
                className="relative flex items-center justify-center"
                style={{ width: ICON_CONTAINER_SIZE, height: ICON_CONTAINER_SIZE, lineHeight: 1 }}
              >
                <Icon 
                  size={NAV_ICON_SIZE}
                  className={isActive ? 'text-white' : 'text-zinc-400'}
                  strokeWidth={NAV_ICON_STROKE}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] leading-none font-bold rounded-full w-4 h-4 flex items-center justify-center pointer-events-none">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}






