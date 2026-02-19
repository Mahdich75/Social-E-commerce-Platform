import { Outlet } from 'react-router';
import { BottomNav } from './components/BottomNav';
import { Toaster } from './components/ui/sonner';

/**
 * UI polish pass summary (non-invasive):
 * - Standardized motion/focus/elevation tokens in global theme for consistency.
 * - Applied subtle interaction refinements to existing controls and surfaces.
 * - Kept layout structure, routes, hierarchy, and component behavior unchanged.
 */
export default function Layout() {
  return (
    <div className="relative min-h-screen bg-white">
      <main className="max-w-[414px] mx-auto">
        <Outlet />
      </main>
      <BottomNav />
      <Toaster position="top-center" />
    </div>
  );
}
