import { useNavigate } from 'react-router';
import { useBasketStore } from '../store/useBasketStore';
import { Button } from '../components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function Basket() {
  const navigate = useNavigate();
  const { items, removeFromBasket, updateQuantity, getTotalPrice } = useBasketStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pb-24 flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-20 h-20 text-zinc-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your basket is empty</h2>
        <p className="text-zinc-600 text-center mb-6">
          Add some products from the feed or discover page
        </p>
        <Button
          onClick={() => navigate('/')}
          className="bg-black text-white hover:bg-zinc-800"
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-zinc-200 z-10 px-4 pt-12 pb-4">
        <h1 className="text-2xl font-bold">Basket</h1>
        <p className="text-sm text-zinc-600 mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
      </div>

      {/* Basket Items */}
      <div className="px-4 py-6 space-y-4">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 bg-white border border-zinc-200 rounded-xl p-4">
            {/* Product Image */}
            <div className="w-24 h-24 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base mb-1 line-clamp-2">
                {item.product.name}
              </h3>
              
              {/* Size and Color */}
              <div className="flex gap-2 text-xs text-zinc-600 mb-2">
                {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                {item.selectedColor && <span>• {item.selectedColor}</span>}
              </div>

              {/* Price */}
              <p className="text-lg font-bold mb-3">${item.product.price}</p>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 bg-zinc-100 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-white rounded transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-white rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromBasket(item.product.id)}
                  className="text-red-500 hover:text-red-600 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-zinc-200 p-4 max-w-[414px] mx-auto">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">Subtotal</span>
            <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">Shipping</span>
            <span className="font-semibold">Free</span>
          </div>
          <div className="border-t border-zinc-200 pt-3 flex justify-between">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg">${getTotalPrice().toFixed(2)}</span>
          </div>
        </div>

        <Button
          onClick={() => navigate('/checkout')}
          className="w-full bg-black text-white hover:bg-zinc-800 h-12 text-base font-semibold rounded-xl"
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
