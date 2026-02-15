import { useEffect, useRef, useState } from 'react';
import { Home, Search, Plus, ShoppingBag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useBasketStore } from '../store/useBasketStore';
import { toast } from 'sonner';

export function BottomNav() {
  const ICON_CONTAINER_SIZE = 28;
  const NAV_ICON_SIZE = 24;
  const NAV_ICON_STROKE = 2.25;
  const location = useLocation();
  const totalItems = useBasketStore(state => state.getTotalItems());
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const createButtonRef = useRef<HTMLButtonElement | null>(null);
  const createMenuRef = useRef<HTMLDivElement | null>(null);
  const reviewPickerRef = useRef<HTMLInputElement | null>(null);
  const showcasePickerRef = useRef<HTMLInputElement | null>(null);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/discover', icon: Search, label: 'Discover' },
    { path: '/create', icon: Plus, label: 'Create', isSpecial: true },
    { path: '/basket', icon: ShoppingBag, label: 'Basket', badge: totalItems },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  useEffect(() => {
    if (!isCreateMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (createMenuRef.current?.contains(target)) return;
      if (createButtonRef.current?.contains(target)) return;
      setIsCreateMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCreateMenuOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isCreateMenuOpen]);

  const handleCreateAction = (mode: 'review' | 'showcase') => {
    setIsCreateMenuOpen(false);
    if (mode === 'review') {
      reviewPickerRef.current?.click();
      return;
    }
    showcasePickerRef.current?.click();
  };

  const handleReviewFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    toast.success('Review content selected');
    event.target.value = '';
  };

  const handleShowcaseFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    toast.success('Showcase video selected');
    event.target.value = '';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 pb-safe z-50">
      <input
        ref={reviewPickerRef}
        type="file"
        accept="image/*,video/*"
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

      {isCreateMenuOpen && (
        <div className="fixed inset-0 z-40" aria-hidden="true" />
      )}

      <div
        ref={createMenuRef}
        className={`absolute left-1/2 -translate-x-1/2 bottom-[4.7rem] z-50 w-[min(86vw,320px)] transition-all duration-220 ease-out ${
          isCreateMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <div className="rounded-2xl border border-white/20 bg-white/16 backdrop-blur-xl shadow-[0_20px_45px_rgba(0,0,0,0.35)] p-2">
          <button
            type="button"
            onClick={() => handleCreateAction('review')}
            className="w-full text-left px-3 py-3 rounded-xl text-white hover:bg-white/15 transition-colors"
          >
            <p className="text-sm font-semibold">Upload Product Review</p>
            <p className="text-[11px] text-zinc-300 mt-0.5">Share your experience with a product</p>
          </button>
          <button
            type="button"
            onClick={() => handleCreateAction('showcase')}
            className="w-full text-left px-3 py-3 rounded-xl text-white hover:bg-white/15 transition-colors"
          >
            <p className="text-sm font-semibold">Upload Product Showcase Video</p>
            <p className="text-[11px] text-zinc-300 mt-0.5">Post a short product presentation reel</p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 h-20 max-w-[414px] mx-auto">
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
                className="h-full w-full flex items-center justify-center"
                aria-label="Open create actions"
                aria-expanded={isCreateMenuOpen}
                aria-haspopup="menu"
              >
                <div className="relative -translate-y-1.5">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-cyan-400 rounded-lg blur-sm opacity-75" />
                  <div className="relative bg-white rounded-lg w-9 h-9 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-black" strokeWidth={NAV_ICON_STROKE} />
                  </div>
                </div>
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className="h-full w-full flex flex-col items-center justify-center gap-1.5"
            >
              <div
                className="relative flex items-center justify-center"
                style={{ width: ICON_CONTAINER_SIZE, height: ICON_CONTAINER_SIZE }}
              >
                <Icon 
                  size={NAV_ICON_SIZE}
                  className={isActive ? 'text-white' : 'text-zinc-400'}
                  style={item.path === '/basket' ? { transform: 'scale(1.14)' } : undefined}
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
