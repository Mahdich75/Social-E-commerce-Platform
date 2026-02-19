import { useEffect, useRef, useState } from 'react';
import { Home, Search, Plus, ShoppingBag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useBasketStore } from '../store/useBasketStore';
import { toast } from 'sonner';

export function BottomNav() {
  const ICON_CONTAINER_SIZE = 30;
  const NAV_ICON_SIZE = 24;
  const CENTER_ICON_SIZE = 26;
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
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[1px] transition-opacity duration-200"
          aria-hidden="true"
        />
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
            onClick={() => handleCreateAction('review')}
            className="w-full text-left px-3 py-3 rounded-xl hover:bg-accent transition-colors ui-pressable ui-focus-ring"
          >
            <p className="text-sm font-semibold">Upload Product Review</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Share your experience with a product</p>
          </button>
          <button
            type="button"
            onClick={() => handleCreateAction('showcase')}
            className="w-full text-left px-3 py-3 rounded-xl hover:bg-accent transition-colors ui-pressable ui-focus-ring"
          >
            <p className="text-sm font-semibold">Upload Product Showcase Video</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Post a short product presentation reel</p>
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
