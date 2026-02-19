import { useNavigate } from 'react-router';
import { useBasketStore } from '../store/useBasketStore';
import { Button } from '../components/ui/button';
import { ShoppingBag, BadgeCheck, Truck, MessageSquare } from 'lucide-react';
import { formatPriceToman } from '../utils/price';

const statusConfig = {
  Negotiating: { label: 'Negotiating', icon: MessageSquare, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  Paid: { label: 'Paid', icon: BadgeCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  Shipped: { label: 'Shipped', icon: Truck, color: 'text-sky-600 bg-sky-50 border-sky-200' },
} as const;

export default function Basket() {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useBasketStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pb-24 flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-20 h-20 text-zinc-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-zinc-600 text-center mb-6">Tap Buy, negotiate in chat, then wait for seller payment request.</p>
        <Button onClick={() => navigate('/')} className="bg-black text-white hover:bg-zinc-800">
          Explore Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 bg-white border-b border-zinc-200 z-10 px-4 pt-12 pb-4">
        <h1 className="text-2xl font-bold">Basket</h1>
        <p className="text-sm text-zinc-600 mt-1">{items.length} {items.length === 1 ? 'order' : 'orders'}</p>
      </div>

      <div className="px-4 py-6 space-y-4">
        {items.map((item) => {
          const meta = statusConfig[item.orderStatus];
          const StatusIcon = meta.icon;

          return (
            <div
              key={item.orderId}
              className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base mb-1 line-clamp-2">{item.product.name}</h3>
                  <p className="text-sm text-zinc-500">Order ID: {item.orderId}</p>
                  <p className="text-sm text-zinc-500">Seller: {item.sellerName}</p>
                  <p className="text-lg font-bold mt-2">{formatPriceToman(item.finalPrice)}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-200 flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" /> {meta.label}
                </span>
                {item.paymentConfirmed ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50">
                    <BadgeCheck className="w-3.5 h-3.5" /> Payment Confirmed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200 text-amber-700 bg-amber-50">
                    <MessageSquare className="w-3.5 h-3.5" /> Awaiting Seller Request
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-[var(--bottom-nav-offset)] left-0 right-0 bg-white border-t border-zinc-200 p-4 max-w-[414px] mx-auto">
        <div className="flex justify-between">
          <span className="font-semibold">Total paid</span>
          <span className="font-bold">{formatPriceToman(getTotalPrice())}</span>
        </div>
      </div>
    </div>
  );
}
