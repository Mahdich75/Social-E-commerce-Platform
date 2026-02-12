import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, MapPin, CreditCard, Check } from 'lucide-react';
import { useBasketStore } from '../store/useBasketStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearBasket } = useBasketStore();
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [selectedPayment, setSelectedPayment] = useState('card');

  const addresses = [
    {
      id: 'home',
      label: 'Home',
      address: '123 Main Street, Apt 4B',
      city: 'New York, NY 10001',
    },
    {
      id: 'work',
      label: 'Work',
      address: '456 Business Ave, Suite 200',
      city: 'New York, NY 10002',
    },
  ];

  const paymentMethods = [
    {
      id: 'card',
      label: 'Credit Card',
      details: '**** **** **** 4242',
      icon: CreditCard,
    },
    {
      id: 'card2',
      label: 'Debit Card',
      details: '**** **** **** 5555',
      icon: CreditCard,
    },
  ];

  const handlePlaceOrder = () => {
    toast.success('Order placed successfully!');
    clearBasket();
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  if (items.length === 0) {
    navigate('/basket');
    return null;
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-zinc-200 z-10 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/basket')}
            className="p-2 -ml-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-8">
        {/* Order Summary */}
        <div>
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="bg-zinc-50 rounded-xl p-4 space-y-3">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-zinc-600">
                    Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}
                  </p>
                  <p className="font-semibold text-sm mt-1">${item.product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Delivery Address
          </h2>
          <div className="space-y-3">
            {addresses.map((address) => (
              <button
                key={address.id}
                onClick={() => setSelectedAddress(address.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                  selectedAddress === address.id
                    ? 'border-black bg-zinc-50'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold mb-1">{address.label}</p>
                    <p className="text-sm text-zinc-600">{address.address}</p>
                    <p className="text-sm text-zinc-600">{address.city}</p>
                  </div>
                  {selectedAddress === address.id && (
                    <div className="bg-black text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>
            ))}
            <button className="w-full p-4 border-2 border-dashed border-zinc-300 rounded-xl text-sm font-semibold text-zinc-600 hover:border-zinc-400 transition-colors">
              + Add New Address
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                    selectedPayment === method.id
                      ? 'border-black bg-zinc-50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-black text-white p-2 rounded-lg">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{method.label}</p>
                        <p className="text-sm text-zinc-600">{method.details}</p>
                      </div>
                    </div>
                    {selectedPayment === method.id && (
                      <div className="bg-black text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
            <button className="w-full p-4 border-2 border-dashed border-zinc-300 rounded-xl text-sm font-semibold text-zinc-600 hover:border-zinc-400 transition-colors">
              + Add New Payment Method
            </button>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-zinc-50 rounded-xl p-4 space-y-3">
          <h2 className="text-lg font-bold mb-3">Price Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-600">Subtotal</span>
              <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">Delivery Fee</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">Tax</span>
              <span className="font-semibold">${(getTotalPrice() * 0.08).toFixed(2)}</span>
            </div>
            <div className="border-t border-zinc-200 pt-3 flex justify-between text-base">
              <span className="font-bold">Total</span>
              <span className="font-bold">${(getTotalPrice() * 1.08).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Place Order Button */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-zinc-200 p-4 max-w-[414px] mx-auto">
        <Button
          onClick={handlePlaceOrder}
          className="w-full bg-black text-white hover:bg-zinc-800 h-12 text-base font-semibold rounded-xl"
        >
          Place Order • ${(getTotalPrice() * 1.08).toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
