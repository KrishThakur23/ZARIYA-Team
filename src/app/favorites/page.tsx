'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { favorites, FavoriteItem } from '@/lib/favorites';
import { cart } from '@/lib/cart';

export default function FavoritesPage() {
  const router = useRouter();
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load favorite items from localStorage
    const items = favorites.getItems();
    setFavoriteItems(items);
    setLoading(false);
  }, []);

  const removeFromFavorites = (productId: string) => {
    favorites.removeItem(productId);
    setFavoriteItems(favorites.getItems());
  };

  const addToCart = (item: FavoriteItem) => {
    cart.addItem({
      productId: item.productId,
      title: item.title,
      price: item.price,
      image: item.image,
      artisan: item.artisan
    });
  };

  const clearAllFavorites = () => {
    favoriteItems.forEach(item => favorites.removeItem(item.productId));
    setFavoriteItems([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">My Favorites</h1>
          {favoriteItems.length > 0 && (
            <Button
              variant="ghost"
              onClick={clearAllFavorites}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {favoriteItems.length === 0 ? (
          // Empty Favorites State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-pink-500" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring and save the handcrafted items you love. Your favorites will appear here.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Discover Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          // Favorites Grid
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                My Favorites
              </h1>
              <p className="text-gray-600">
                {favoriteItems.length} {favoriteItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {favoriteItems.map((item, index) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white/95 backdrop-blur-sm">
                      <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                        {item.image && (
                          <Link href={`/product/${item.productId}`}>
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                            />
                          </Link>
                        )}

                        {/* Action buttons */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <motion.button
                            onClick={() => removeFromFavorites(item.productId)}
                            className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          </motion.button>
                          <motion.button
                            onClick={() => addToCart(item)}
                            className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ShoppingCart className="h-4 w-4 text-gray-600 hover:text-green-500" />
                          </motion.button>
                        </div>

                        {/* Added date */}
                        <div className="absolute bottom-3 left-3">
                          <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                            {new Date(item.addedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <Link href={`/product/${item.productId}`}>
                          <h3 className="font-serif font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight hover:text-amber-600 transition-colors cursor-pointer">
                            {item.title}
                          </h3>
                        </Link>

                        {item.artisan && (
                          <p className="text-xs text-gray-600 mb-3">
                            by {item.artisan}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                            <span className="text-xs text-gray-500 ml-1">INR</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromFavorites(item.productId)}
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 p-2"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => addToCart(item)}
                              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-1 text-xs"
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => {
                    favoriteItems.forEach(item => addToCart(item));
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add All to Cart
                </Button>
                <Link href="/">
                  <Button variant="outline" className="border-gray-200 hover:border-amber-400 text-gray-700 hover:text-amber-700 px-8 py-3 rounded-xl">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}