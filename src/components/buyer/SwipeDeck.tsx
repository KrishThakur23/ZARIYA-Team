'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import ProductCard from './ProductCard';
import ActionToast from './ActionToast';
import { Heart, ShoppingCart, Star, X } from 'lucide-react';

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

interface SwipeDeckProps {
  products: Product[];
  onProductTap?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onAppreciateArtist?: (product: Product) => void;
  onDismissProduct?: (product: Product) => void;
}

export default function SwipeDeck({
  products: initialProducts,
  onProductTap,
  onAddToCart,
  onAddToWishlist,
  onAppreciateArtist,
  onDismissProduct
}: SwipeDeckProps) {
  const [products, setProducts] = useState(initialProducts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<{
    action: 'cart' | 'wishlist' | 'appreciate' | 'dismiss';
    product: Product;
  } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const undoTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const remoteProducts = await res.json();

          if (remoteProducts.length > 0) {
            const validProducts = remoteProducts.filter((p: any) =>
              p.status === 'published' && p.originalImage && typeof p.originalImage === 'string' && p.originalImage.trim() !== ''
            );

            // Transform to match SwipeDeck format
            const transformedProducts = validProducts.map((p: any) => ({
              id: p.id,
              title: p.title,
              artisan: p.artisan || 'You',
              price: p.price || 0,
              image: p.originalImage,
              description: p.story || p.description || 'Beautiful handcrafted item',
              rating: p.rating || 5.0,
              location: p.location || 'India',
            }));

            // Only use remote AWS products securely downloaded over API
            setProducts(transformedProducts);
            console.log('SwipeDeck Rendered published products:', transformedProducts.length);
          }
        }
      } catch (error) {
        console.error('SwipeDeck: Failed to load products:', error);
      }
    };
    fetchProducts();
  }, [initialProducts]);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (showToast) {
      undoTimeoutRef.current = setTimeout(() => {
        setShowToast(false);
        setLastAction(null);
      }, 5000);
    }

    return () => {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
    };
  }, [showToast]);

  const handleSwipe = (direction: 'left' | 'right' | 'up', product: Product) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSwipeDirection(direction);

    switch (direction) {
      case 'left':
        setLastAction({ action: 'dismiss', product });
        onDismissProduct?.(product);
        break;
      case 'right':
        setLastAction({ action: 'cart', product });
        onAddToCart?.(product);
        break;
      case 'up':
        setLastAction({ action: 'wishlist', product });
        onAddToWishlist?.(product);
        break;
    }

    setShowToast(true);
    setCurrentIndex(prev => prev + 1);

    setTimeout(() => {
      setIsAnimating(false);
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
    }, 400);
  };

  const handleUndo = () => {
    if (!lastAction) return;

    setCurrentIndex(prev => Math.max(0, prev - 1));
    setShowToast(false);
    setLastAction(null);

    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }
  };

  const handleLongPress = useCallback((product: Product) => {
    setLastAction({ action: 'appreciate', product });
    onAppreciateArtist?.(product);
    setShowToast(true);
  }, [onAppreciateArtist]);

  const handleProductTap = (product: Product) => {
    console.log('SwipeDeck handleProductTap called:', product.title);
    onProductTap?.(product);
  };

  // Get visible products (current + next 2)
  const visibleProducts = products.slice(currentIndex, currentIndex + 3);
  const hasMoreProducts = currentIndex < products.length - 1;


  if (currentIndex >= products.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600 text-lg font-medium mb-4"
          >
            No more products to discover
          </motion.div>
          <motion.button
            onClick={() => setCurrentIndex(0)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Over
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Card Stack Container */}
      <div className="flex-1 relative overflow-hidden">
        <div ref={containerRef} className="relative w-full h-full">
          <AnimatePresence>
            {visibleProducts.length > 0 ? visibleProducts.map((product, index) => {
              const isActive = index === 0;
              const zIndex = 10 - index;
              const scale = 1 - index * 0.05;
              const yOffset = index * 8;
              const rotation = index * 1.5;

              return (
                <motion.div
                  key={`${product.id}-${currentIndex + index}`}
                  className="absolute inset-0"
                  style={{
                    zIndex,
                    scale,
                    y: yOffset,
                    rotate: rotation,
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    y: 50,
                    rotate: 5,
                  }}
                  animate={{
                    opacity: isActive ? 1 : 0.9,
                    scale,
                    y: yOffset,
                    rotate: rotation,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    rotate: index === 0 ? (isAnimating ? -15 : 0) : 0,
                    x: index === 0 && isAnimating ? -500 : 0,
                    transition: { duration: 0.3, ease: "easeInOut" }
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                >
                  <ProductCard
                    product={product}
                    isActive={isActive}
                    onTap={() => handleProductTap(product)}
                    onSwipeLeft={() => handleSwipe('left', product)}
                    onSwipeRight={() => handleSwipe('right', product)}
                    onSwipeUp={() => handleSwipe('up', product)}
                    onLongPress={() => handleLongPress(product)}
                  />
                </motion.div>
              );
            }) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-500 text-lg">No products available</div>
              </div>
            )}
          </AnimatePresence>

          {/* Swipe Direction Overlays */}
          {swipeDirection && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className={`w-40 h-40 rounded-full flex items-center justify-center shadow-2xl ${swipeDirection === 'left' ? 'bg-red-500' :
                  swipeDirection === 'right' ? 'bg-green-500' :
                    swipeDirection === 'up' ? 'bg-yellow-500' : ''
                  }`}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: swipeDirection === 'left' ? [-5, 5, -5] : 0
                }}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 0.5 }}
              >
                {swipeDirection === 'left' && <X className="w-20 h-20 text-white" />}
                {swipeDirection === 'right' && <ShoppingCart className="w-20 h-20 text-white" />}
                {swipeDirection === 'up' && <Star className="w-20 h-20 text-white fill-current" />}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Action Buttons Below Card */}
      <div className="flex-shrink-0 flex justify-center py-4">
        <div className="flex items-center gap-4 bg-gray-800 rounded-full px-4 py-3 shadow-lg">
          {/* Dismiss */}
          <motion.button
            className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => visibleProducts[0] && handleSwipe('left', visibleProducts[0])}
          >
            <X className="w-6 h-6 text-white" />
          </motion.button>

          {/* Appreciate */}
          <motion.button
            className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onPointerDown={(event) => {
              const timer = setTimeout(() => {
                if (visibleProducts[0]) {
                  handleLongPress(visibleProducts[0]);
                }
              }, 500);
              (event.currentTarget as any).longPressTimer = timer;
            }}
            onPointerUp={(event) => {
              const timer = (event.currentTarget as any).longPressTimer;
              if (timer) {
                clearTimeout(timer);
              }
            }}
          >
            <Heart className="w-6 h-6 text-white" />
          </motion.button>

          {/* Wishlist */}
          <motion.button
            className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => visibleProducts[0] && handleSwipe('up', visibleProducts[0])}
          >
            <Star className="w-6 h-6 text-white" />
          </motion.button>

          {/* Add to Cart */}
          <motion.button
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => visibleProducts[0] && handleSwipe('right', visibleProducts[0])}
          >
            <ShoppingCart className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Action Toast */}
      <ActionToast
        action={lastAction?.action || null}
        onUndo={handleUndo}
        showUndo={!!lastAction}
      />
    </div>
  );
}
