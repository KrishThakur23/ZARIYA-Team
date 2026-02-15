'use client';

import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';

interface TagListProps {
  tags: string[];
  category: string;
  onTagClick?: (tag: string) => void;
  onCategoryClick?: (category: string) => void;
}

export default function TagList({ 
  tags, 
  category, 
  onTagClick, 
  onCategoryClick 
}: TagListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Category Pill */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
        <motion.button
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-full text-sm font-medium hover:bg-amber-700 transition-colors shadow-sm"
          variants={tagVariants}
          onClick={() => onCategoryClick?.(category)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{category}</span>
        </motion.button>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Tags</h4>
          <motion.div
            className="flex flex-wrap gap-2"
            variants={containerVariants}
          >
            {tags.map((tag, index) => (
              <motion.button
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors border border-gray-200 hover:border-gray-300"
                variants={tagVariants}
                onClick={() => onTagClick?.(tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                custom={index}
              >
                <Hash className="w-3 h-3" />
                <span>{tag}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}

      {/* Add Tag Button */}
      <motion.button
        className="inline-flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-gray-400 hover:text-gray-600 transition-colors"
        variants={tagVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="w-4 h-4 border border-current rounded-full flex items-center justify-center">
          <span className="text-xs">+</span>
        </span>
        <span>Add tag</span>
      </motion.button>
    </motion.div>
  );
}
