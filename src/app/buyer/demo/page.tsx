'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Logo from '@/components/logo';
import BottomNav from '@/components/buyer/BottomNav';
import HomeFeed from '@/components/buyer/HomeFeed';
import CategoryPath from '@/components/buyer/CategoryPath';
import Discover from '@/components/buyer/Discover';
import ProductDetail from '@/components/buyer/ProductDetail';
import Profile from '@/components/buyer/Profile';
import { Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  artisan: string;
  location: string;
  rating?: number;
}

export default function BuyerDemoPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'discover' | 'profile'>('home');
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(7);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleTabChange = (tab: 'home' | 'categories' | 'discover' | 'profile') => {
    console.log('Tab changed to:', tab);
    setActiveTab(tab);
  };

  const handleProductClick = (product: Product | string) => {
    if (typeof product === 'string') {
      console.log('Product clicked (string):', product);
      // Legacy handler for ID-based clicks
    } else {
      console.log('Product clicked (object):', product.title, '- Opening ProductDetail');
      setSelectedProduct(product);
    }
  };

  const handleArtisanClick = (artisanId: string) => {
    console.log('Artisan clicked:', artisanId);
    // In real app, this would navigate to artisan profile
  };

  const handleCategoryClick = (category: any) => {
    console.log('Category clicked:', category);
    // In real app, this would navigate to category products
  };

  const handleAddToCart = (product: Product) => {
    console.log('Added to cart:', product.title);
    setCartCount(prev => prev + 1);
  };

  const handleAddToWishlist = (product: Product) => {
    console.log('Added to wishlist:', product.title);
    setWishlistCount(prev => prev + 1);
  };

  const handleBackFromProduct = () => {
    setSelectedProduct(null);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeed onProductClick={handleProductClick} onArtisanClick={handleArtisanClick} userName="Pashin" />;
      case 'categories':
        return <CategoryPath onCategoryClick={handleCategoryClick} />;
      case 'discover':
        return <Discover onProductClick={handleProductClick} />;
      case 'profile':
        return <Profile userName="Pashin" userEmail="pashin@zariya.com" onLogout={() => console.log('Logout clicked')} />;
      default:
        return <HomeFeed onProductClick={handleProductClick} onArtisanClick={handleArtisanClick} userName="Pashin" />;
    }
  };

  // Show ProductDetail if a product is selected
  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={handleBackFromProduct}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Logo className="h-8 w-auto" />
          </motion.div>
          
          <div className="relative flex-1 max-w-md mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search for art, artisans, or materials..." 
              className="pl-10 bg-white/60 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <User className="h-5 w-5 text-gray-600" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveTab()}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />
    </div>
  );
}
