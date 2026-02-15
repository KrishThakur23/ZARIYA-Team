'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Share2, Heart, Flag, Edit3 } from 'lucide-react';

interface StickyActionsProps {
  price: number;
  onPublish?: () => void;
  onAddToCart?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  isPublishing?: boolean;
  userType?: 'artisan' | 'buyer';
}

export default function StickyActions({
  price,
  onPublish,
  onAddToCart,
  onEdit,
  onShare,
  onReport,
  onFavorite,
  isFavorite = false,
  isPublishing = false,
  userType = 'artisan'
}: StickyActionsProps) {
  const [showSecondary, setShowSecondary] = useState(false);

  const primaryAction = userType === 'artisan' ? onPublish : onAddToCart;
  const primaryLabel = userType === 'artisan' ? 'Publish Listing' : 'Add to Cart';

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Price Summary */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-serif font-bold text-gray-800">
                ${price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Secondary Actions */}
            <AnimatePresence>
              {showSecondary && (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={onEdit}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onShare}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onFavorite}
                    className={`p-2 transition-colors ${
                      isFavorite 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={onReport}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Flag className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Secondary Actions */}
            <button
              onClick={() => setShowSecondary(!showSecondary)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <motion.div
                animate={{ rotate: showSecondary ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </motion.div>
            </button>

            {/* Primary Action */}
            <motion.button
              onClick={primaryAction}
              disabled={isPublishing}
              className="px-8 py-3 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isPublishing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </div>
              ) : (
                primaryLabel
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Voice Assistant Indicator */}
      <AnimatePresence>
        {false && ( // This would be controlled by voice assistant state
          <motion.div
            className="absolute -top-12 right-4 bg-amber-600 text-white px-3 py-2 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-4 bg-white rounded-full"
                    animate={{
                      scaleY: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">Assistant speaking...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
