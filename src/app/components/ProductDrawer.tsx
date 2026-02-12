import { useState } from 'react';
import { Product } from '../types';
import { useBasketStore } from '../store/useBasketStore';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer';
import { Button } from './ui/button';
import { Star, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ProductDrawerProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDrawer({ product, open, onOpenChange }: ProductDrawerProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const addToBasket = useBasketStore(state => state.addToBasket);

  if (!product) return null;

  const handleAddToBasket = () => {
    if (product.sizes && product.sizes.length > 1 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    const size = selectedSize || product.sizes?.[0];
    const color = selectedColor || product.colors?.[0];
    
    addToBasket(product, size, color);
    toast.success('Added to basket!');
    onOpenChange(false);
    
    // Reset selections
    setSelectedSize('');
    setSelectedColor('');
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white max-w-[414px] mx-auto">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl font-bold">{product.name}</DrawerTitle>
          <DrawerDescription className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{product.rating}</span>
            </div>
            <span className="text-sm text-zinc-500">({product.reviews} reviews)</span>
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-8 space-y-6">
          {/* Product Image */}
          <div className="w-full aspect-square rounded-lg overflow-hidden bg-zinc-100">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">${product.price}</span>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-zinc-600">{product.description}</p>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 1 && (
            <div>
              <h3 className="font-semibold mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-zinc-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Select Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors relative ${
                      selectedColor === color
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-zinc-300 hover:border-black'
                    }`}
                  >
                    {color}
                    {selectedColor === color && (
                      <Check className="w-4 h-4 absolute top-1 right-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Basket Button */}
          <Button 
            onClick={handleAddToBasket}
            className="w-full bg-black text-white hover:bg-zinc-800 h-12 text-base font-semibold rounded-xl"
          >
            Add to Basket
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
