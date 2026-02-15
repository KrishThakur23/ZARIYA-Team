'use client';

import { useState } from 'react';
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

// Beautiful craft products with working demo images
const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'Handwoven Kanjeevaram Silk Saree',
    price: 25000,
    image: 'https://picsum.photos/400/600?random=1',
    description: 'Traditional South Indian silk with intricate gold zari work',
    artisan: 'Meera Patel',
    location: 'Kanchipuram, India',
    rating: 4.8
  },
  {
    id: '2',
    title: 'Ceramic Teapot with Traditional Motifs',
    price: 3500,
    image: 'https://picsum.photos/400/600?random=2',
    description: 'Hand-thrown pottery with beautiful blue and white patterns',
    artisan: 'Rajesh Kumar',
    location: 'Jaipur, India',
    rating: 4.6
  },
  {
    id: '3',
    title: 'Wooden Sculpture - Dancing Peacock',
    price: 12000,
    image: 'https://picsum.photos/400/600?random=3',
    description: 'Intricately carved sandalwood sculpture',
    artisan: 'Vikram Singh',
    location: 'Mysore, India',
    rating: 4.9
  },
  {
    id: '4',
    title: 'Hand-Embroidered Cushion Covers',
    price: 2800,
    image: 'https://picsum.photos/400/600?random=4',
    description: 'Traditional chikankari embroidery on cotton',
    artisan: 'Fatima Khan',
    location: 'Lucknow, India',
    rating: 4.7
  },
  {
    id: '5',
    title: 'Brass Wind Chimes',
    price: 4500,
    image: 'https://picsum.photos/400/600?random=5',
    description: 'Musical chimes with traditional Indian patterns',
    artisan: 'Arjun Mehta',
    location: 'Moradabad, India',
    rating: 4.5
  },
  {
    id: '6',
    title: 'Hand-Painted Ceramic Bowl Set',
    price: 3200,
    image: 'https://picsum.photos/400/600?random=6',
    description: 'Set of 4 bowls with traditional Rajasthani motifs',
    artisan: 'Priya Sharma',
    location: 'Udaipur, India',
    rating: 4.8
  },
  {
    id: '7',
    title: 'Silk Wall Hanging',
    price: 8500,
    image: 'https://picsum.photos/400/600?random=7',
    description: 'Beautiful silk tapestry with nature motifs',
    artisan: 'Sunita Devi',
    location: 'Varanasi, India',
    rating: 4.9
  },
  {
    id: '8',
    title: 'Handcrafted Jewelry Box',
    price: 6800,
    image: 'https://picsum.photos/400/600?random=8',
    description: 'Intricately carved wooden jewelry box',
    artisan: 'Kiran Patel',
    location: 'Ahmedabad, India',
    rating: 4.6
  }
];

export default function Discover({ onProductClick }: DiscoverProps) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [appreciatedCount, setAppreciatedCount] = useState(0);
  const { toast } = useToast();

  // Load initial counts
  useState(() => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('zariya_cart') || '[]');
      const wishlist = JSON.parse(localStorage.getItem('zariya_wishlist') || '[]');
      setCartCount(cart.length);
      setWishlistCount(wishlist.length);
    }
  });

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
          <SwipeDeck
            products={sampleProducts}
            onProductTap={handleProductTap}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onAppreciateArtist={handleAppreciateArtist}
            onDismissProduct={handleDismissProduct}
          />
        </div>
      </div>
    </div>
  );
}
