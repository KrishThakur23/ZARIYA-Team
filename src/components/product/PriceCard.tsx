'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp, Edit3, TrendingUp } from 'lucide-react';

interface PriceCardProps {
  price: number;
  suggestedPrice?: number;
  rationale?: string;
  onPriceChange?: (newPrice: number) => void;
  editable?: boolean;
}

export default function PriceCard({ 
  price, 
  suggestedPrice, 
  rationale, 
  onPriceChange, 
  editable = true 
}: PriceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(price.toString());

  const handlePriceSubmit = () => {
    const newPrice = parseFloat(editPrice);
    if (!isNaN(newPrice) && newPrice > 0) {
      onPriceChange?.(newPrice);
      setIsEditing(false);
    }
  };

  const hasAI = suggestedPrice && rationale;

  return (
    <motion.div
      className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-serif font-semibold text-gray-800">Estimated Value</h3>
        {hasAI && (
          <motion.button
            className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">AI Suggested</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </motion.button>
        )}
      </div>

      {/* Price Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif text-gray-600">$</span>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="text-4xl font-serif font-bold text-amber-800 bg-transparent border-b-2 border-amber-300 focus:border-amber-600 outline-none w-32"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePriceSubmit}
                  className="px-3 py-1 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditPrice(price.toString());
                    setIsEditing(false);
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif text-gray-600">$</span>
                <span className="text-5xl font-serif font-bold text-amber-800">
                  {price.toFixed(2)}
                </span>
              </div>
              {editable && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:text-amber-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>Market Ready</span>
          </div>
          <p className="text-gray-600 text-xs font-serif">Gallery Authenticated</p>
        </div>
      </div>

      {/* AI Rationale */}
      <AnimatePresence>
        {isExpanded && hasAI && (
          <motion.div
            className="bg-white/60 rounded-xl p-4 border border-amber-200"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-700 font-medium">
                <Sparkles className="w-4 h-4" />
                <span>AI Analysis</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-gray-800">Labor</p>
                  <p className="text-gray-600">8 hours</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800">Materials</p>
                  <p className="text-gray-600">Premium</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800">Market</p>
                  <p className="text-gray-600">Similar: ${suggestedPrice}</p>
                </div>
              </div>

              <div className="bg-amber-100 rounded-lg p-3">
                <p className="text-sm text-gray-700 italic">
                  "{rationale}"
                </p>
              </div>

              {suggestedPrice && suggestedPrice !== price && (
                <button
                  onClick={() => onPriceChange?.(suggestedPrice)}
                  className="w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  Apply AI Suggestion (${suggestedPrice})
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price Range Slider */}
      {isEditing && (
        <motion.div
          className="mt-4 pt-4 border-t border-amber-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Suggested Range</label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">${(price * 0.7).toFixed(0)}</span>
              <input
                type="range"
                min={price * 0.7}
                max={price * 1.5}
                value={parseFloat(editPrice) || price}
                onChange={(e) => setEditPrice(e.target.value)}
                className="flex-1 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600">${(price * 1.5).toFixed(0)}</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
