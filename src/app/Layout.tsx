import { Outlet } from 'react-router';
import { BottomNav } from './components/BottomNav';
import { Toaster } from './components/ui/sonner';

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
