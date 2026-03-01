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

// Removed hardcoded mock data to enforce strict AWS environment rendering

interface HomeFeedProps {
  onProductClick?: (productId: string) => void;
  onArtisanClick?: (artisanId: string) => void;
  userName?: string;
}

export default function HomeFeed({ onProductClick, onArtisanClick, userName = 'Pashin' }: HomeFeedProps) {
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [mergedTrendingProducts, setMergedTrendingProducts] = useState<any[]>([]);
  const [mergedCuratedFeed, setMergedCuratedFeed] = useState<any[]>([]);
  const trendingRef = useRef<HTMLDivElement>(null);

  // Helper function to get time ago string - HOISTED
  const getTimeAgo = (isoString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Load products and wishlist on mount
  useEffect(() => {
    const fetchRemoteProducts = async () => {
      try {
        // Load Wishlist
        const wishlist = JSON.parse(localStorage.getItem('zariya_wishlist') || '[]');
        const wishlistIds = new Set(wishlist.map((p: any) => p.id)) as Set<string>;
        setLikedProducts(wishlistIds);

        // Fetch Products from AWS
        const res = await fetch('/api/products');
        if (res.ok) {
          const remoteProducts = await res.json();
          if (remoteProducts.length > 0) {
            console.log('📦 Loaded from API:', remoteProducts.length, 'products');

            // Filter strictly for published products with valid image URLs
            const validProducts = remoteProducts.filter((p: any) =>
              p.status === 'published' && p.originalImage && typeof p.originalImage === 'string' && p.originalImage.trim() !== ''
            );

            console.log('📦 Rendered valid API products:', validProducts.length);

            // Transform remote products to match UI format
            const transformedProducts = validProducts.map((p: any) => {
              const pDate = p.createdAt ? new Date(p.createdAt).getTime() : new Date().getTime();
              const isNew = (new Date().getTime() - pDate) < 5 * 60 * 1000;

              return {
                id: p.id,
                title: p.title,
                artisan: p.artisan || 'You',
                price: p.price || 0,
                image: p.originalImage,
                badge: isNew ? 'Just Listed' : 'New',
                rating: p.rating || 5.0,
                location: p.location || 'India',
                artisanAvatar: p.artisanAvatar || '',
                craftType: p.category || 'Handmade',
                description: p.description || p.story || 'Beautiful handcrafted item',
                category: p.category || 'Handmade',
                timeAgo: p.createdAt ? getTimeAgo(p.createdAt) : 'Recently',
                createdAt: p.createdAt
              };
            });

            // Sort by newest first
            transformedProducts.sort((a: any, b: any) =>
              new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            );

            // Directly inject AWS API data
            setMergedTrendingProducts(transformedProducts);
            setMergedCuratedFeed(transformedProducts);
          }
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    fetchRemoteProducts();
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
    setCurrentTrendingIndex((prev) => (prev + 1) % mergedTrendingProducts.length);
  };

  const prevTrending = () => {
    setCurrentTrendingIndex((prev) => (prev - 1 + mergedTrendingProducts.length) % mergedTrendingProducts.length);
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
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        )}

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
                          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-amber-200 shadow-md flex items-center justify-center bg-amber-100 text-amber-700 font-bold">
                            {product.artisanAvatar ? (
                              <Image
                                src={product.artisanAvatar}
                                alt={product.artisan}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            ) : (
                              product.artisan.charAt(0).toUpperCase()
                            )}
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
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}

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
                            <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-amber-200 flex items-center justify-center bg-amber-100 text-amber-700 font-bold text-xs">
                              {product.artisanAvatar ? (
                                <Image
                                  src={product.artisanAvatar}
                                  alt={product.artisan}
                                  width={24}
                                  height={24}
                                  className="object-cover"
                                />
                              ) : (
                                product.artisan.charAt(0).toUpperCase()
                              )}
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
