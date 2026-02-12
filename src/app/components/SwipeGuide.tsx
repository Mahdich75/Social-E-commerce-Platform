import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';

export function SwipeGuide() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);

  useEffect(() => {
    // Check if user has seen the guide before
    const seen = localStorage.getItem('swipeGuideSeen');
    if (!seen) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setHasSeenGuide(true);
    localStorage.setItem('swipeGuideSeen', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && !hasSeenGuide && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">
              How to Navigate
            </h2>

            <div className="space-y-6">
              {/* Vertical Swipe */}
              <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl">
                <div className="flex flex-col items-center">
                  <ChevronUp className="w-6 h-6 text-zinc-400" />
                  <div className="w-px h-8 bg-zinc-300" />
                  <ChevronDown className="w-6 h-6 text-zinc-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Vertical Swipe</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Swipe up or down to browse different videos
                  </p>
                </div>
              </div>

              {/* Horizontal Swipe */}
              <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl">
                <div className="flex items-center">
                  <ChevronLeft className="w-6 h-6 text-zinc-400" />
                  <div className="h-px w-8 bg-zinc-300" />
                  <ChevronRight className="w-6 h-6 text-zinc-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Horizontal Swipe</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Swipe left or right to see similar products
                  </p>
                </div>
              </div>

              {/* Cart Button */}
              <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-5 h-5 bg-white rounded" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Quick Add to Cart</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Tap the cart button to add instantly
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full mt-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-zinc-800 transition-colors"
            >
              Got it!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
