'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface HeroImageProps {
  images: {
    original?: string;
    enhanced?: string;
    cartoon?: string;
  };
  title: string;
}

export default function HeroImage({ images, title }: HeroImageProps) {
  const [selectedImage, setSelectedImage] = useState<'original' | 'enhanced' | 'cartoon'>('enhanced');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const availableImages = [
    { key: 'enhanced' as const, src: images.enhanced, label: 'Enhanced' },
    { key: 'original' as const, src: images.original, label: 'Original' },
    { key: 'cartoon' as const, src: images.cartoon, label: 'Artistic' },
  ].filter(img => img.src);

  const currentImage = availableImages.find(img => img.key === selectedImage);

  return (
    <div className="space-y-6">
      {/* Main Hero Image */}
      <div className="relative group">
        <motion.div
          className="aspect-square w-full overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl shadow-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {currentImage?.src ? (
            <Image
              src={currentImage.src}
              alt={`${title} - ${currentImage.label}`}
              width={800}
              height={800}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-100 to-orange-200">
              <span className="text-gray-600 text-xl font-serif italic">Masterpiece Preview</span>
            </div>
          )}
        </motion.div>

        {/* Zoom Button */}
        {currentImage?.src && (
          <motion.button
            className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ZoomIn className="w-5 h-5" />
          </motion.button>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-serif">
          {availableImages.findIndex(img => img.key === selectedImage) + 1} / {availableImages.length}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-3 justify-center overflow-x-auto pb-2">
        {availableImages.map((image, index) => (
          <motion.div
            key={image.key}
            className={`flex-shrink-0 w-20 h-20 overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedImage === image.key
                ? 'border-amber-600 shadow-lg scale-105'
                : 'border-amber-200 hover:border-amber-400'
            }`}
            onClick={() => setSelectedImage(image.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={image.src}
              alt={`${image.label} thumbnail`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </motion.div>
        ))}
      </div>

      {/* Modal Lightbox */}
      <AnimatePresence>
        {isModalOpen && currentImage?.src && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage.src}
                alt={`${title} - ${currentImage.label}`}
                width={1200}
                height={1200}
                className="object-contain w-full h-full rounded-lg"
              />
              
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation Arrows */}
              {availableImages.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                    onClick={() => {
                      const currentIndex = availableImages.findIndex(img => img.key === selectedImage);
                      const prevIndex = currentIndex > 0 ? currentIndex - 1 : availableImages.length - 1;
                      setSelectedImage(availableImages[prevIndex].key);
                    }}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                    onClick={() => {
                      const currentIndex = availableImages.findIndex(img => img.key === selectedImage);
                      const nextIndex = currentIndex < availableImages.length - 1 ? currentIndex + 1 : 0;
                      setSelectedImage(availableImages[nextIndex].key);
                    }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
