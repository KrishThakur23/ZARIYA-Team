'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/logo';
import BottomNav from '@/components/buyer/BottomNav';
import HomeFeed from '@/components/buyer/HomeFeed';
import CategoryPath from '@/components/buyer/CategoryPath';
import Discover from '@/components/buyer/Discover';
import ProductDetail from '@/components/buyer/ProductDetail';
import Profile from '@/components/buyer/Profile';
import { Search, Bell, User, Sparkles, ArrowRight, ShoppingCart, Heart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { cart } from '@/lib/cart';
import { favorites } from '@/lib/favorites';
import { notifications } from '@/lib/notifications';

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

export default function UnifiedStorefrontPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'discover' | 'profile'>('home');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Load counts from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateCounts = () => {
        setCartCount(cart.getItemCount());
        setWishlistCount(favorites.getCount());
        setNotificationCount(notifications.getUnreadCount());
      };

      updateCounts();

      // Update counts periodically
      const interval = setInterval(updateCounts, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleTabChange = (tab: 'home' | 'categories' | 'discover' | 'profile') => {
    setActiveTab(tab);
  };

  const handleProductClick = (product: Product | string) => {
    if (typeof product === 'string') {
      router.push(`/product/${product}`);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleArtisanClick = (artisanId: string) => {
    router.push(`/artisan/${artisanId}`);
  };

  const handleCategoryClick = (category: any) => {
    // Navigate to category products
  };

  const handleAddToCart = (product: Product) => {
    cart.addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      artisan: product.artisan
    });
    setCartCount(cart.getItemCount());
  };

  const handleAddToWishlist = (product: Product) => {
    favorites.addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      artisan: product.artisan
    });
    setWishlistCount(favorites.getCount());
  };

  const handleBackFromProduct = () => {
    setSelectedProduct(null);
  };

  const handleStartSelling = () => {
    router.push('/artisan/profile-setup');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeed onProductClick={handleProductClick} onArtisanClick={handleArtisanClick} userName={user?.name || 'User'} />;
      case 'categories':
        return <CategoryPath onCategoryClick={handleCategoryClick} />;
      case 'discover':
        return <Discover onProductClick={handleProductClick} />;
      case 'profile':
        return <Profile userName={user?.name || 'User'} userEmail={user?.email || ''} onLogout={() => router.push('/profile')} />;
      default:
        return <HomeFeed onProductClick={handleProductClick} onArtisanClick={handleArtisanClick} userName={user?.name || 'User'} />;
    }
  };

  // Show loading if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-orange-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-orange-50/50">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Logo className="h-8 w-auto" />
            </motion.div>
          </Link>

          <div className="relative flex-1 max-w-md mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for authentic art..."
              className="pl-10 bg-white/60 border-gray-200 focus:bg-white transition-colors rounded-full"
            />
          </div>

          <div className="hidden md:flex items-center gap-6 mx-4">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors">Home</Link>
            <Link href="/favorites" className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors">Favorites</Link>
            <Link href="/orders" className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors">Orders</Link>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push('/cart')}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-white text-xs text-white flex items-center justify-center font-bold shadow-sm">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push('/notifications')}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-xs text-white flex items-center justify-center font-medium">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push('/profile')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <User className="h-5 w-5 text-gray-600" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

        {/* Artisan Call To Action Banner */}
        {activeTab === 'home' && user?.role !== 'artisan' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 relative overflow-hidden rounded-3xl group shadow-2xl cursor-pointer"
            onClick={handleStartSelling}
          >
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 opacity-95 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Decorative Orbs */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-400/30 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white space-y-3 max-w-2xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-2 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-amber-200" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-amber-100">For Creators</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
                  Are you a skilled Artisan?
                </h2>
                <p className="text-orange-50 text-lg md:text-xl font-medium max-w-xl opacity-90 leading-relaxed">
                  Join our community and sell your craft globally. We make it easy with AI-powered listings, intelligent tagging, & voice stories.
                </p>
              </div>
              <div className="flex-shrink-0 mt-4 md:mt-0">
                <Button
                  size="lg"
                  onClick={handleStartSelling}
                  className="bg-white text-orange-600 hover:bg-orange-50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-full px-8 py-7 text-lg font-bold group/btn"
                >
                  Start Selling Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="min-h-[60vh]"
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
