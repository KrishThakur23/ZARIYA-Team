'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, X, Undo } from 'lucide-react';

interface ActionToastProps {
  action: 'cart' | 'wishlist' | 'appreciate' | 'dismiss' | null;
  onUndo?: () => void;
  onDismiss?: () => void;
  showUndo?: boolean;
}

export default function ActionToast({ 
  action, 
  onUndo, 
  onDismiss, 
  showUndo = true 
}: ActionToastProps) {
  if (!action) return null;

  const getActionConfig = () => {
    switch (action) {
      case 'cart':
        return {
          icon: ShoppingCart,
          message: 'Added to cart',
          bgColor: 'bg-green-500',
          iconColor: 'text-white',
          textColor: 'text-white'
        };
      case 'wishlist':
        return {
          icon: Star,
          message: 'Added to wishlist',
          bgColor: 'bg-yellow-500',
          iconColor: 'text-white',
          textColor: 'text-white'
        };
      case 'appreciate':
        return {
          icon: Heart,
          message: 'Appreciated artist',
          bgColor: 'bg-red-500',
          iconColor: 'text-white',
          textColor: 'text-white'
        };
      case 'dismiss':
        return {
          icon: X,
          message: 'Not interested',
          bgColor: 'bg-gray-500',
          iconColor: 'text-white',
          textColor: 'text-white'
        };
      default:
        return null;
    }
  };

  const config = getActionConfig();
  if (!config) return null;

  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.8 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className={`${config.bgColor} rounded-3xl shadow-2xl px-8 py-5 flex items-center gap-4 min-w-[250px] border border-white/20 backdrop-blur-sm`}>
          <IconComponent className={`w-8 h-8 ${config.iconColor} drop-shadow-lg`} />
          <span className={`font-bold text-lg ${config.textColor} font-serif`}>
            {config.message}
          </span>
          
          {showUndo && onUndo && (
            <motion.button
              onClick={onUndo}
              className="ml-2 p-2 rounded-full bg-white/25 hover:bg-white/35 transition-all duration-300 border border-white/30"
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Undo className="w-5 h-5 text-white drop-shadow-md" />
            </motion.button>
          )}
          
          {onDismiss && (
            <motion.button
              onClick={onDismiss}
              className="ml-2 p-2 rounded-full bg-white/25 hover:bg-white/35 transition-all duration-300 border border-white/30"
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-white drop-shadow-md" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
