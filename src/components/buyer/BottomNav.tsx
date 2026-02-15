'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Grid3X3, 
  Compass, 
  User,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab?: 'home' | 'categories' | 'discover' | 'profile';
  onTabChange?: (tab: 'home' | 'categories' | 'discover' | 'profile') => void;
  cartCount?: number;
  wishlistCount?: number;
}

export default function BottomNav({ 
  activeTab = 'home', 
  onTabChange,
  cartCount = 0,
  wishlistCount = 0 
}: BottomNavProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'categories' as const, icon: Grid3X3, label: 'Categories' },
    { id: 'discover' as const, icon: Compass, label: 'Discover' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  const handleTabClick = (tabId: 'home' | 'categories' | 'discover' | 'profile') => {
    setCurrentTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center relative px-3 py-2 min-h-[44px] min-w-[44px] rounded-xl transition-all duration-200",
                isActive 
                  ? "text-amber-600" 
                  : "text-gray-500 hover:text-gray-700"
              )}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <Icon 
                  size={20} 
                  className={cn(
                    "transition-all duration-200",
                    isActive && "drop-shadow-sm"
                  )} 
                />
                
                {/* Badge for cart/wishlist counts */}
                {((tab.id === 'profile' && cartCount > 0) || (tab.id === 'discover' && wishlistCount > 0)) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium"
                  >
                    {tab.id === 'profile' ? cartCount : wishlistCount}
                  </motion.div>
                )}
              </div>
              
              <motion.span
                className={cn(
                  "text-xs mt-1 font-medium transition-all duration-200",
                  isActive ? "text-amber-600" : "text-gray-500"
                )}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  fontWeight: isActive ? 600 : 500
                }}
              >
                {tab.label}
              </motion.span>

              {/* Active indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Floating action buttons for quick access */}
      <div className="absolute -top-8 right-4 flex gap-2">
        <motion.button
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart size={20} />
        </motion.button>
        
        <motion.button
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ShoppingCart size={20} />
        </motion.button>
      </div>
    </motion.nav>
  );
}
