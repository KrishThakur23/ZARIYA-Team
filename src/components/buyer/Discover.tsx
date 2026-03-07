'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SwipeDeck from './SwipeDeck';

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

interface DiscoverProps {
  onProductClick?: (product: Product) => void;
}

// Products will be loaded from API

export default function Discover({ onProductClick }: DiscoverProps) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [appreciatedCount, setAppreciatedCount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          const remoteProducts = data.products || [];
          
          // Transform to match SwipeDeck format
          const transformedProducts = remoteProducts
            .filter((p: any) => p.status === 'published' && p.originalImage)
            .map((p: any) => ({
              id: p.id,
              title: p.title,
              artisan: p.artisan || 'Unknown Artisan',
              price: p.price || 0,
              image: p.originalImage,
              description: p.story || p.description || 'Beautiful handcrafted item',
              rating: p.rating || 5.0,
              location: p.location || 'India',
            }));

          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Load initial counts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('zariya_cart') || '[]');
      const wishlist = JSON.parse(localStorage.getItem('zariya_wishlist') || '[]');
      setCartCount(cart.length);
      setWishlistCount(wishlist.length);
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('zariya_cart') || '[]');
      const exists = cart.find((p: any) => p.id === product.id);

      if (!exists) {
        cart.push({ ...product, quantity: 1 });
        localStorage.setItem('zariya_cart', JSON.stringify(cart));
        setCartCount(prev => prev + 1);
        toast({ title: 'Added to Cart!', description: `${product.title} added to cart`, duration: 2000 });
      } else {
        toast({ title: 'Already in cart', description: 'You can update quantity in cart', duration: 2000 });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToWishlist = (product: Product) => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('zariya_wishlist') || '[]');
      const exists = wishlist.find((p: any) => p.id === product.id);

      if (!exists) {
        wishlist.push(product);
        localStorage.setItem('zariya_wishlist', JSON.stringify(wishlist));
        setWishlistCount(prev => prev + 1);
        toast({ title: 'Added to Wishlist!', description: `${product.title} saved for later`, duration: 2000 });
      } else {
        toast({ title: 'Already in wishlist', duration: 2000 });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAppreciateArtist = (product: Product) => {
    console.log('Appreciated artist:', product.artisan);
    setAppreciatedCount(prev => prev + 1);
    // In real app, this would call the backend API
  };

  const handleDismissProduct = (product: Product) => {
    console.log('Dismissed product:', product.title);
    // In real app, this would mark as not interested
  };

  const handleProductTap = (product: Product) => {
    console.log('Discover handleProductTap called:', product.title);
    onProductClick?.(product);
  };

  return (
    <div className="fixed inset-0 bg-slate-50 overflow-hidden">
      {/* Clean Header - Like Reference */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h1 className="text-lg font-medium text-gray-700">
                Find your perfect handmade treasure
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <ShoppingCart className="w-4 h-4" />
                <span>{cartCount}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Star className="w-4 h-4" />
                <span>{wishlistCount}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Heart className="w-4 h-4" />
                <span>{appreciatedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card Container - Centered Like Reference */}
      <div className="absolute inset-0 pt-12 pb-4 flex items-center justify-center px-6">
        <div className="w-full max-w-md mx-auto h-[750px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : products.length > 0 ? (
            <SwipeDeck
              products={products}
              onProductTap={handleProductTap}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              onAppreciateArtist={handleAppreciateArtist}
              onDismissProduct={handleDismissProduct}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-4">No products available</p>
                <p className="text-gray-500 text-sm">Check back later for new items</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
