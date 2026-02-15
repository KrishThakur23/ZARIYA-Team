'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import HeroImage from './HeroImage';
import PriceCard from './PriceCard';
import StoryCard from './StoryCard';
import MetaBadges from './MetaBadges';
import TagList from './TagList';
import StickyActions from './StickyActions';

interface ProductPreviewProps {
  product: {
    title: string;
    category: string;
    dimensions: string;
    price: number;
    story: string;
    description?: string;
    transcript?: string;
    tags: string[];
    images: {
      original?: string;
      enhanced?: string;
      cartoon?: string;
    };
    suggestedPrice?: number;
    priceRationale?: string;
    artisanName?: string;
    location?: string;
    shippingEta?: string;
  };
  userType?: 'artisan' | 'buyer';
  onPublish?: () => void;
  onAddToCart?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onFavorite?: () => void;
  onPriceChange?: (newPrice: number) => void;
  onStoryEdit?: (newStory: string) => void;
  onTagClick?: (tag: string) => void;
  onCategoryClick?: (category: string) => void;
}

export default function ProductPreview({
  product,
  userType = 'artisan',
  onPublish,
  onAddToCart,
  onEdit,
  onShare,
  onReport,
  onFavorite,
  onPriceChange,
  onStoryEdit,
  onTagClick,
  onCategoryClick
}: ProductPreviewProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish?.();
    } finally {
      setIsPublishing(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavorite?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <motion.div
        className="bg-white border-b border-gray-200 sticky top-0 z-30"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-800">{product.title}</h1>
              <p className="text-gray-600">{product.category} • {product.dimensions}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-serif font-bold text-amber-800">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Hero Image */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HeroImage images={product.images} title={product.title} />
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Title & Category */}
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{product.dimensions}</span>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <PriceCard
              price={product.price}
              suggestedPrice={product.suggestedPrice}
              rationale={product.priceRationale}
              onPriceChange={onPriceChange}
              editable={userType === 'artisan'}
            />

            {/* Meta Badges */}
            <MetaBadges
              artisanName={product.artisanName}
              location={product.location}
              shippingEta={product.shippingEta}
            />

            {/* Story Card */}
            <StoryCard
              story={product.story}
              transcript={product.transcript}
              onStoryEdit={onStoryEdit}
              editable={userType === 'artisan'}
            />

            {/* Tags */}
            <TagList
              tags={product.tags}
              category={product.category}
              onTagClick={onTagClick}
              onCategoryClick={onCategoryClick}
            />
          </motion.div>
        </div>
      </div>

      {/* Sticky Actions */}
      <StickyActions
        price={product.price}
        onPublish={userType === 'artisan' ? handlePublish : undefined}
        onAddToCart={userType === 'buyer' ? onAddToCart : undefined}
        onEdit={onEdit}
        onShare={onShare}
        onReport={onReport}
        onFavorite={handleFavorite}
        isFavorite={isFavorite}
        isPublishing={isPublishing}
        userType={userType}
      />

      {/* Bottom Spacing for Sticky Actions */}
      <div className="h-24" />
    </div>
  );
}
