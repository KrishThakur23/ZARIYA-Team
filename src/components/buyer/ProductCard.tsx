'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, X } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    description: string;
    artisan: string;
    location: string;
    rating?: number;
  };
  onTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onLongPress?: () => void;
  isActive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function ProductCard({
  product,
  onTap,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onLongPress,
  isActive = true,
  style,
  className = ''
}: ProductCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [showAppreciation, setShowAppreciation] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const [dragStarted, setDragStarted] = useState(false);

  const handleLongPress = () => {
    if (!isActive) return;
    setShowAppreciation(true);
    onLongPress?.();
    setTimeout(() => setShowAppreciation(false), 1000);
  };

  const handlePointerDown = () => {
    if (!isActive) return;
    setIsPressed(true);
    setDragStarted(false);
    longPressTimer.current = setTimeout(handleLongPress, 500);
  };

  const handlePointerUp = () => {
    if (!isActive) return;
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleTap = () => {
    if (!isActive || dragStarted) return;
    console.log('ProductCard tapped:', product.title);
    onTap?.();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isActive || dragStarted) return;
    console.log('ProductCard clicked:', product.title);
    onTap?.();
  };

  return (
    <motion.div
      className={`absolute inset-0 cursor-pointer select-none ${className}`}
      style={style}
      drag={isActive}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragStart={() => {
        setDragStarted(true);
      }}
      onDragEnd={(_, info) => {
        if (!isActive) return;
        
        const { x, y } = info.offset;
        const threshold = 100;
        
        if (Math.abs(x) > Math.abs(y)) {
          if (x > threshold) {
            onSwipeRight?.();
          } else if (x < -threshold) {
            onSwipeLeft?.();
          }
        } else if (y < -threshold) {
          onSwipeUp?.();
        }
        
        // Reset drag started after a short delay to allow for tap detection
        setTimeout(() => setDragStarted(false), 100);
      }}
      onTap={handleTap}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      whileTap={{ scale: isActive ? 0.95 : 1 }}
      whileHover={{ scale: isActive ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Clean Card Like Reference - Stretched */}
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lg bg-white border border-gray-200">
        {/* Product Image */}
        <div className="relative h-full w-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            priority={isActive}
            sizes="(max-width: 768px) 100vw, 400px"
          />
          
          {/* Clean Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Appreciation Overlay */}
          {showAppreciation && (
            <motion.div
              className="absolute inset-0 bg-pink-500/20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="bg-pink-500 text-white p-8 rounded-full shadow-xl"
              >
                <Heart className="w-20 h-20 fill-current" />
              </motion.div>
            </motion.div>
          )}
          
          {/* Top Section - Clean Title */}
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                {product.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 text-xs font-medium uppercase tracking-wider">Handcrafted</span>
              </div>
            </div>
          </div>
          
          {/* Rating Badge */}
          {product.rating && (
            <div className="absolute top-4 right-4">
              <div className="bg-orange-500 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                <Star className="w-3 h-3 text-white fill-current" />
                <span className="text-sm font-bold text-white">
                  {product.rating}
                </span>
              </div>
            </div>
          )}
          
          {/* Bottom Section - Clean Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <p className="text-gray-700 mb-3 text-sm line-clamp-2">
                {product.description}
              </p>
              
              {/* Price and Artisan Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {product.artisan.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{product.artisan}</p>
                    <p className="text-xs text-gray-500">{product.location}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Press Effect */}
        {isPressed && isActive && (
          <motion.div
            className="absolute inset-0 bg-black/5 rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>
    </motion.div>
  );
}
