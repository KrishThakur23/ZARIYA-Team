'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Star, CheckCircle, Truck, MapPin, Clock, ShoppingCart, Plus, Minus, Volume2, Square } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  artisan: string;
  location: string;
  rating?: number;
  category?: string;
  tags?: string[];
  story?: string;
  shipping?: {
    days: string;
    cost: number;
  };
  specifications?: {
    material?: string;
    dimensions?: string;
    weight?: string;
    care?: string;
  };
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export default function ProductDetail({ product, onBack, onAddToCart, onAddToWishlist }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'details' | 'story' | 'shipping'>('details');
  const [isPlayingStory, setIsPlayingStory] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Check wishlist status on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const wishlist = JSON.parse(localStorage.getItem('zariya_wishlist') || '[]');
      setIsWishlisted(wishlist.some((p: any) => p.id === product.id));
    }
  });

  // Generate multiple images for gallery (using same base with different params)
  const galleryImages = [
    product.image,
    product.image.replace('random=', 'random=alt1-'),
    product.image.replace('random=', 'random=alt2-'),
  ];

  const handleAddToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('zariya_cart') || '[]');
      const exists = cart.find((p: any) => p.id === product.id);

      if (!exists) {
        cart.push({ ...product, quantity: quantity });
        localStorage.setItem('zariya_cart', JSON.stringify(cart));
        toast({ title: 'Added to Cart!', description: `${product.title} added to cart`, duration: 2000 });
        onAddToCart?.({ ...product, ...{ quantity } } as any);
      } else {
        toast({ title: 'Already in cart', description: 'Item quantity updated', duration: 2000 });
        // Optional: Update quantity if exists
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleWishlist = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('zariya_wishlist') || '[]');
      const existsIndex = wishlist.findIndex((p: any) => p.id === product.id);

      let newWishlist;
      if (existsIndex >= 0) {
        newWishlist = wishlist.filter((p: any) => p.id !== product.id);
        setIsWishlisted(false);
        toast({ title: 'Removed from Wishlist', duration: 1500 });
      } else {
        newWishlist = [...wishlist, product];
        setIsWishlisted(true);
        toast({ title: 'Added to Wishlist', duration: 1500 });
        onAddToWishlist?.(product);
      }
      localStorage.setItem('zariya_wishlist', JSON.stringify(newWishlist));
    } catch (e) {
      console.error(e);
    }
  };

  const playStoryAudio = async (text: string) => {
    if (isPlayingStory && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingStory(false);
      return;
    }

    try {
      setIsPlayingStory(true);
      toast({ title: 'Generating audio...', description: 'Loading artisan story' });

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) throw new Error('Failed to fetch audio');

      const { audio } = await res.json();

      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = () => setIsPlayingStory(false);
      }

      audioRef.current.src = audio;
      await audioRef.current.play();
    } catch (e) {
      console.error('Audio playback failed', e);
      setIsPlayingStory(false);
      toast({ variant: 'destructive', title: 'Audio playback failed' });
    }
  };

  // Enhanced product data for demo
  const enhancedProduct = {
    ...product,
    category: product.category || 'other',
    tags: product.tags || ['handmade', 'artisan', 'traditional'],
    story: product.story || `Crafted with love by ${product.artisan} in ${product.location}. Each piece is unique and represents centuries of traditional craftsmanship passed down through generations.`,
    shipping: product.shipping || { days: '3-5', cost: 0 },
    specifications: product.specifications || {
      material: 'Premium quality materials',
      dimensions: '10" x 12"',
      weight: '500g',
      care: 'Handle with care, gentle cleaning recommended'
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-white z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="flex items-center justify-between p-4">
          <motion.button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </motion.button>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleToggleWishlist}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isWishlisted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.button>

            <motion.button
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="pt-20 pb-24 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-12 md:p-8">
            {/* Left Column - Image Gallery */}
            <motion.div
              className="space-y-6"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {/* Main Image */}
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-2xl">
                <Image
                  src={galleryImages[selectedImageIndex]}
                  alt={enhancedProduct.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-4 justify-center">
                {galleryImages.map((img, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === index
                      ? 'border-amber-500 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                    whileHover={{ scale: selectedImageIndex === index ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image
                      src={img}
                      alt={`${enhancedProduct.title} view ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Product Details */}
            <motion.div
              className="space-y-8"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* Product Header */}
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                    {enhancedProduct.category}
                  </span>
                </div>

                <h1 className="text-4xl font-serif text-gray-900 leading-tight">
                  {enhancedProduct.title}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(enhancedProduct.rating || 4.5)
                          ? 'text-amber-400 fill-current'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                    <span className="text-gray-600 ml-2">({enhancedProduct.rating || 4.5})</span>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <motion.div
                className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estimated Value</p>
                    <p className="text-3xl font-bold text-amber-700">
                      ₹{enhancedProduct.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      <span>Gallery Authenticated</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Verification Status */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">Authenticated</p>
                  <p className="text-xs text-green-600">Verified by Zariya</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100">
                  <Star className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-orange-800">Handmade</p>
                  <p className="text-xs text-orange-600">Crafted by skilled hands</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                  <Heart className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-800">Heritage</p>
                  <p className="text-xs text-purple-600">Cultural legacy preserved</p>
                </div>
              </div>

              {/* Product Info Tabs */}
              <div className="space-y-6">
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                  {['details', 'story', 'shipping'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab as any)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${selectedTab === tab
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[200px]"
                  >
                    {selectedTab === 'details' && (
                      <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                          {enhancedProduct.description}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-900">Material</p>
                            <p className="text-gray-600">{enhancedProduct.specifications.material}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Dimensions</p>
                            <p className="text-gray-600">{enhancedProduct.specifications.dimensions}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Weight</p>
                            <p className="text-gray-600">{enhancedProduct.specifications.weight}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Care</p>
                            <p className="text-gray-600">{enhancedProduct.specifications.care}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedTab === 'story' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                            {enhancedProduct.artisan.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">The Artisan's Story</p>
                            <p className="text-sm text-gray-600">by {enhancedProduct.artisan}</p>
                          </div>
                          <button
                            onClick={() => playStoryAudio(enhancedProduct.story)}
                            className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors"
                          >
                            {isPlayingStory ? (
                              <Square className="w-5 h-5 text-amber-700 fill-amber-700" />
                            ) : (
                              <Volume2 className="w-5 h-5 text-amber-700" />
                            )}
                          </button>
                        </div>
                        <p className="text-gray-700 leading-relaxed italic">
                          "{enhancedProduct.story}"
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{enhancedProduct.location}</span>
                        </div>
                      </div>
                    )}

                    {selectedTab === 'shipping' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <Truck className="w-6 h-6 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-900">Free Shipping</p>
                            <p className="text-sm text-blue-700">Estimated delivery: {enhancedProduct.shipping.days} days</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Processing: 1-2 days</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Ships from: {enhancedProduct.location}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {enhancedProduct.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-6 p-4">
            {/* Image Gallery */}
            <motion.div
              className="space-y-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-xl">
                <Image
                  src={galleryImages[selectedImageIndex]}
                  alt={enhancedProduct.title}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-3 justify-center">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                      ? 'border-amber-500 shadow-md'
                      : 'border-gray-200'
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`View ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Mobile Product Info */}
            <motion.div
              className="space-y-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                  {enhancedProduct.category}
                </span>

                <h1 className="text-2xl font-serif text-gray-900 leading-tight">
                  {enhancedProduct.title}
                </h1>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(enhancedProduct.rating || 4.5)
                          ? 'text-amber-400 fill-current'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                    <span className="text-gray-600 text-sm ml-1">({enhancedProduct.rating || 4.5})</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                <p className="text-sm text-gray-600 mb-1">Estimated Value</p>
                <p className="text-2xl font-bold text-amber-700">
                  ₹{enhancedProduct.price.toLocaleString()}
                </p>
              </div>

              {/* Verification Badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-green-800">Authenticated</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-100">
                  <Star className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-orange-800">Handmade</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
                  <Heart className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-purple-800">Heritage</p>
                </div>
              </div>

              {/* Mobile Tabs */}
              <div className="space-y-4">
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  {['details', 'story', 'shipping'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab as any)}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${selectedTab === tab
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600'
                        }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="min-h-[150px]">
                  {selectedTab === 'details' && (
                    <div className="space-y-3">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {enhancedProduct.description}
                      </p>
                    </div>
                  )}

                  {selectedTab === 'story' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                          {enhancedProduct.artisan.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">by {enhancedProduct.artisan}</p>
                          <p className="text-xs text-gray-600">{enhancedProduct.location}</p>
                        </div>
                        <button
                          onClick={() => playStoryAudio(enhancedProduct.story)}
                          className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors"
                        >
                          {isPlayingStory ? (
                            <Square className="w-4 h-4 text-amber-700 fill-amber-700" />
                          ) : (
                            <Volume2 className="w-4 h-4 text-amber-700" />
                          )}
                        </button>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed italic">
                        "{enhancedProduct.story}"
                      </p>
                    </div>
                  )}

                  {selectedTab === 'shipping' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <Truck className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Free Shipping</p>
                          <p className="text-xs text-blue-700">Delivery: {enhancedProduct.shipping.days} days</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {enhancedProduct.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart • ₹{(enhancedProduct.price * quantity).toLocaleString()}</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
