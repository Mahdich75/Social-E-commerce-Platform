import { Home, Search, Plus, ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useBasketStore } from '../store/useBasketStore';

export function BottomNav() {
  const location = useLocation();
  const totalItems = useBasketStore(state => state.getTotalItems());

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/discover', icon: Search, label: 'Discover' },
    { path: '/create', icon: Plus, label: 'Create', isSpecial: true },
    { path: '/basket', icon: ShoppingCart, label: 'Basket', badge: totalItems },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 pb-safe z-50">
      <div className="grid grid-cols-5 h-20 max-w-[414px] mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.isSpecial) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="h-full w-full flex items-center justify-center"
              >
                <div className="relative -translate-y-1.5">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-cyan-400 rounded-lg blur-sm opacity-75" />
                  <div className="relative bg-white rounded-lg w-9 h-9 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-black" strokeWidth={2.25} />
                  </div>
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className="h-full w-full flex flex-col items-center justify-center gap-1.5"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <Icon 
                  className={`w-6 h-6 ${isActive ? 'text-white' : 'text-zinc-400'}`}
                  strokeWidth={2.25}
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
