import { useState } from 'react';
import { Search, Send, Star } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { Product } from '../types';
import { ProductDrawer } from '../components/ProductDrawer';
import { Input } from '../components/ui/input';

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredProducts(mockProducts);
      return;
    }

    const filtered = mockProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDrawerOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-white pb-24">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-zinc-200 z-10">
          <div className="px-4 pt-12 pb-4">
            <h1 className="text-2xl font-bold mb-4">Discover</h1>
            
            {/* Semantic Search Bar - Chat Style */}
            <form onSubmit={handleSearch} className="relative">
              <div className="bg-zinc-100 rounded-2xl p-3 flex items-center gap-3">
                <Search className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                <Input
                  type="text"
                  placeholder="Ask me anything... (e.g., 'show me wireless headphones')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-zinc-400 text-sm p-0 h-auto"
                />
                <button
                  type="submit"
                  className="bg-black text-white rounded-full p-2 hover:bg-zinc-800 transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Semantic Search powered by AI
              </p>
            </form>
          </div>
        </div>

        {/* Product Grid */}
        <div className="px-4 pt-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <p className="text-zinc-600">No products found</p>
              <p className="text-sm text-zinc-400 mt-1">Try a different search</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white rounded-xl overflow-hidden border border-zinc-200 hover:border-black transition-colors text-left"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-zinc-100 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-zinc-600">{product.rating}</span>
                        <span className="text-xs text-zinc-400">({product.reviews})</span>
                      </div>
                    )}

                    {/* Price */}
                    <p className="text-base font-bold">${product.price}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular Searches */}
        <div className="px-4 mt-8">
          <h2 className="text-lg font-bold mb-3">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {['Headphones', 'Smart Watch', 'Sunglasses', 'Backpack', 'Shoes'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  const filtered = mockProducts.filter(product =>
                    product.name.toLowerCase().includes(term.toLowerCase())
                  );
                  setFilteredProducts(filtered);
                }}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-full text-sm font-medium transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ProductDrawer
        product={selectedProduct}
        open={isProductDrawerOpen}
        onOpenChange={setIsProductDrawerOpen}
      />
    </>
  );
}
