'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  MapPin,
  Clock,
  Sparkles,
  Award,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample data - in real app this would come from props/API
const trendingProducts = [
  {
    id: 'trending-1',
    title: 'Ornate Porcelain Teapot - Floral Gold',
    artisan: 'Priya Sharma',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=center',
    badge: 'Trending',
    rating: 4.9,
    location: 'Jaipur, India',
    artisanAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    craftType: 'Ceramic Art',
    description: 'Hand-painted porcelain with intricate gold floral motifs'
  },
  {
    id: 'trending-2',
    title: 'Hand-Carved Rosewood Buddha Statue',
    artisan: 'Rajesh Kumar',
    price: 156.00,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop&crop=center',
    badge: 'New',
    rating: 4.8,
    location: 'Varanasi, India',
    artisanAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    craftType: 'Wood Carving',
    description: 'Sacred rosewood carving with traditional craftsmanship'
  },
  {
    id: 'trending-3',
    title: 'Banarasi Silk Saree - Royal Blue',
    artisan: 'Meera Patel',
    price: 234.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=center',
    badge: 'Featured',
    rating: 4.9,
    location: 'Varanasi, India',
    artisanAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    craftType: 'Silk Weaving',
    description: 'Luxurious handwoven silk with traditional patterns'
  }
];

const curatedFeed = [
  {
    id: 'feed-1',
    title: 'Handwoven Kanjeevaram Silk Saree',
    artisan: 'Sunita Singh',
    price: 189.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
    category: 'Silk Weaving',
    artisanAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    timeAgo: '2 hours ago',
    location: 'Kanchipuram, India'
  },
  {
    id: 'feed-2',
    title: 'Teak Wood Hand-Carved Jewelry Box',
    artisan: 'Lakshmi Reddy',
    price: 67.00,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop&crop=center',
    category: 'Wood Carving',
    artisanAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
    timeAgo: '4 hours ago',
    location: 'Kerala, India'
  },
  {
    id: 'feed-3',
    title: 'Brass Hand-Hammered Water Pot',
    artisan: 'Arun Gupta',
    price: 78.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
    category: 'Metalwork',
    artisanAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    timeAgo: '6 hours ago',
    location: 'Moradabad, India'
  },
  {
    id: 'feed-4',
    title: 'Hand-Embroidered Cushion Covers',
    artisan: 'Sita Devi',
    price: 34.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
    category: 'Embroidery',
    artisanAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    timeAgo: '8 hours ago',
    location: 'Lucknow, India'
  }
];

const famousArtisans = [
  {
    id: 'artisan-1',
    name: 'Priya Sharma',
    specialty: 'Porcelain Art',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    followers: '12.5k',
    verified: true
  },
  {
    id: 'artisan-2',
    name: 'Rajesh Kumar',
    specialty: 'Wood Carving',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    followers: '8.9k',
    verified: true
  },
  {
    id: 'artisan-3',
    name: 'Meera Patel',
    specialty: 'Silk Weaving',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    followers: '15.2k',
    verified: true
  },
  {
    id: 'artisan-4',
    name: 'Sunita Singh',
    specialty: 'Embroidery',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    followers: '6.7k',
    verified: false
  }
];

interface HomeFeedProps {
  onProductClick?: (productId: string) => void;
  onArtisanClick?: (artisanId: string) => void;
  userName?: string;
}

export default function HomeFeed({ onProductClick, onArtisanClick, userName = 'Pashin' }: HomeFeedProps) {
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [mergedTrendingProducts, setMergedTrendingProducts] = useState(trendingProducts);
  const [mergedCuratedFeed, setMergedCuratedFeed] = useState(curatedFeed);
  const trendingRef = useRef<HTMLDivElement>(null);

  // Helper function to get time ago string - HOISTED
  const getTimeAgo = (isoString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Load products and wishlist from localStorage on mount
  useEffect(() => {
    try {
      // Load Wishlist
      const wishlist = JSON.parse(localStorage.getItem('zariya_wishlist') || '[]');
      const wishlistIds = new Set(wishlist.map((p: any) => p.id)) as Set<string>;
      setLikedProducts(wishlistIds);

      // Load Products
      const localProducts = JSON.parse(localStorage.getItem('zariya_products') || '[]');

      if (localProducts.length > 0) {
        // ... (existing product loading logic) ...
        // Note: I will keep the existing product loading logic here, just injecting the wishlist part
        console.log('📦 Loaded from localStorage:', localProducts.length, 'products');

        // Transform localStorage products to match UI format
        const transformedProducts = localProducts.map((p: any) => {
          const isNew = (new Date().getTime() - new Date(p.createdAt).getTime()) < 5 * 60 * 1000; // 5 minutes

          return {
            id: p.id,
            title: p.title,
            artisan: p.artisan || 'You',
            price: p.price || 0,
            image: p.images?.enhanced || p.images?.original || p.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop',
            badge: isNew ? 'Just Listed' : 'New',
            rating: p.rating || 5.0,
            location: p.location || 'India',
            artisanAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
            craftType: p.category || 'Handmade',
            description: p.description || p.story || 'Beautiful handcrafted item',
            category: p.category || 'Handmade',
            timeAgo: getTimeAgo(p.createdAt),
            createdAt: p.createdAt
          };
        });

        // Sort by newest first
        transformedProducts.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Merge with mock data (localStorage products first)
        setMergedTrendingProducts([...transformedProducts.slice(0, 3), ...trendingProducts]);
        setMergedCuratedFeed([...transformedProducts, ...curatedFeed]);
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }, []);

  // ... existing getTimeAgo ...

  const handleLike = (productId: string) => {
    try {
      // Find the product details (search in both feeds)
      const product = [...mergedTrendingProducts, ...mergedCuratedFeed].find(p => p.id === productId);
      if (!product) return;

      const wishlist = JSON.parse(localStorage.getItem('zariya_wishlist') || '[]');
      const existsIndex = wishlist.findIndex((p: any) => p.id === productId);

      let newWishlist;
      if (existsIndex >= 0) {
        // Remove
        newWishlist = wishlist.filter((p: any) => p.id !== productId);
      } else {
        // Add
        newWishlist = [...wishlist, product];
      }

      localStorage.setItem('zariya_wishlist', JSON.stringify(newWishlist));

      // Update state
      setLikedProducts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(productId)) {
          newSet.delete(productId);
        } else {
          newSet.add(productId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const scrollTrending = (direction: 'left' | 'right') => {
    if (!trendingRef.current) return;

    const scrollAmount = 320; // Width of one card + gap
    trendingRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const nextTrending = () => {
    setCurrentTrendingIndex((prev) => (prev + 1) % trendingProducts.length);
  };

  const prevTrending = () => {
    setCurrentTrendingIndex((prev) => (prev - 1 + trendingProducts.length) % trendingProducts.length);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Personalized Greeting Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-1">
              {getGreeting()}, {userName}! ✨
            </h1>
            <p className="text-gray-600 text-sm font-medium">
              Discover extraordinary handcrafted treasures from master artisans
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Your Activity</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>🎯 3 saved</span>
                <span>❤️ 12 liked</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-amber-200">
          <div className="text-center">
            <p className="text-lg font-bold text-amber-600">24</p>
            <p className="text-xs text-gray-600">New Items</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-orange-600">8</p>
            <p className="text-xs text-gray-600">Trending</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-600">156</p>
            <p className="text-xs text-gray-600">Artisans</p>
          </div>
        </div>
      </motion.section>

      {/* Trending Carousel */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900">Where the heart resides</h2>
              <p className="text-sm text-gray-600">Discover trending handcrafted treasures</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-2 border-gray-300 hover:border-amber-400 text-gray-700 hover:text-amber-700 font-medium">
            See All
          </Button>
        </div>

        <div className="relative">
          <motion.div
            ref={trendingRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {mergedTrendingProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="flex-shrink-0 w-80"
                style={{ scrollSnapAlign: 'start' }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/buyer/product/${product.id}`}>
                  <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer bg-white/95 backdrop-blur-sm">
                    <CardHeader className="p-0 relative">
                      <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />

                        {/* Sophisticated overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Craft type badge */}
                        <div className="absolute top-3 left-3">
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 shadow-lg font-medium text-xs px-3 py-1"
                          >
                            {product.craftType || product.badge}
                          </Badge>
                        </div>

                        {/* Like button with enhanced styling */}
                        <motion.button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLike(product.id);
                          }}
                          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4 transition-all duration-300",
                              likedProducts.has(product.id)
                                ? "fill-red-500 text-red-500 scale-110"
                                : "text-gray-600 hover:text-red-400"
                            )}
                          />
                        </motion.button>
                      </div>
                    </CardHeader>

                    <CardContent className="p-5 bg-gradient-to-br from-white to-amber-50/30">
                      {/* Artisan info with enhanced styling */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-amber-200 shadow-md">
                            <Image
                              src={product.artisanAvatar}
                              alt={product.artisan}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-800">{product.artisan}</span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" />
                              <span>{product.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                        </div>
                      </div>

                      {/* Product title with sophisticated typography */}
                      <h3 className="font-serif font-semibold text-gray-900 mb-2 line-clamp-2 text-base leading-tight">
                        {product.title}
                      </h3>

                      {/* Description if available */}
                      {product.description && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2 italic">
                          {product.description}
                        </p>
                      )}

                      {/* Price and CTA with enhanced styling */}
                      <div className="flex items-center justify-between pt-2 border-t border-amber-100">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                          <span className="text-xs text-gray-500">INR</span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium px-4 py-2"
                          onClick={() => onProductClick?.(product.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
            onClick={prevTrending}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
            onClick={nextTrending}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Famous Artisans Strip */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900">Featured Artisans</h2>
              <p className="text-sm text-gray-600">Meet our talented craft masters</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-2 border-purple-200 hover:border-purple-400 text-purple-700 hover:text-purple-800 font-medium">
            Follow All
          </Button>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {famousArtisans.map((artisan) => (
            <motion.div
              key={artisan.id}
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className="w-36 p-5 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer bg-gradient-to-br from-white to-amber-50/30 backdrop-blur-sm group"
                onClick={() => onArtisanClick?.(artisan.id)}
              >
                <div className="relative mx-auto mb-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src={artisan.avatar}
                      alt={artisan.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  {artisan.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                      <Award className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                <h4 className="font-serif font-semibold text-sm text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">{artisan.name}</h4>
                <p className="text-xs text-gray-600 mb-2 font-medium">{artisan.specialty}</p>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-full px-3 py-1">
                  <p className="text-xs text-amber-700 font-semibold">{artisan.followers} followers</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Curated Feed */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100">
              <Sparkles className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900">Curated for You</h2>
              <p className="text-sm text-gray-600">Handpicked treasures just for you</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-2 border-green-200 hover:border-green-400 text-green-700 hover:text-green-800 font-medium">
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {mergedCuratedFeed.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Link href={`/buyer/product/${product.id}`}>
                  <Card
                    className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 group cursor-pointer bg-white/95 backdrop-blur-sm"
                    onClick={() => onProductClick?.(product.id)}
                  >
                    <div className="flex">
                      <div className="relative w-28 h-28 flex-shrink-0 bg-gradient-to-br from-amber-50 to-orange-50">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Like button overlay */}
                        <motion.button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLike(product.id);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-md"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart
                            className={cn(
                              "h-3 w-3 transition-all duration-300",
                              likedProducts.has(product.id)
                                ? "fill-red-500 text-red-500 scale-110"
                                : "text-gray-500 hover:text-red-400"
                            )}
                          />
                        </motion.button>
                      </div>

                      <CardContent className="p-4 flex-1 bg-gradient-to-br from-white to-amber-50/20">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-amber-200">
                              <Image
                                src={product.artisanAvatar}
                                alt={product.artisan}
                                width={24}
                                height={24}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-gray-800">{product.artisan}</span>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-2.5 w-2.5" />
                                <span>{product.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <h3 className="font-serif font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">{product.title}</h3>

                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs bg-amber-50 border-amber-200 text-amber-700">
                            {product.category}
                          </Badge>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                            <span className="text-xs text-gray-500">INR</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500 pt-2 border-t border-amber-100">
                          <Clock className="h-3 w-3" />
                          <span>{product.timeAgo}</span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
