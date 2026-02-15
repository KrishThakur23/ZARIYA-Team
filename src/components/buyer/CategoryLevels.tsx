'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Palette, 
  Gem, 
  Hammer, 
  Scissors, 
  Paintbrush, 
  Sparkles, 
  Flower, 
  Leaf, 
  Crown, 
  Shield, 
  Mountain, 
  Wrench, 
  Cross, 
  Brush, 
  Square, 
  FileText, 
  Zap, 
  TreePine, 
  Circle,
  Star,
  Lock,
  CheckCircle
} from 'lucide-react';

interface CraftCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  level: number;
  isLocked: boolean;
  isCompleted: boolean;
  description: string;
  artisanCount: number;
  productCount: number;
}

const craftCategories: CraftCategory[] = [
  {
    id: 'assorted',
    name: 'Assorted Craft',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-pink-100',
    level: 1,
    isLocked: false,
    isCompleted: true,
    description: 'Mixed traditional crafts',
    artisanCount: 45,
    productCount: 120
  },
  {
    id: 'bead',
    name: 'Bead Craft',
    icon: Gem,
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-100 to-cyan-100',
    level: 2,
    isLocked: false,
    isCompleted: true,
    description: 'Intricate beadwork & jewelry',
    artisanCount: 32,
    productCount: 89
  },
  {
    id: 'block-printing',
    name: 'Block Printing',
    icon: FileText,
    color: 'from-orange-500 to-red-500',
    gradient: 'bg-gradient-to-br from-orange-100 to-red-100',
    level: 3,
    isLocked: false,
    isCompleted: false,
    description: 'Traditional textile printing',
    artisanCount: 28,
    productCount: 156
  },
  {
    id: 'ceramic',
    name: 'Ceramic & Pottery',
    icon: Scissors,
    color: 'from-amber-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    level: 4,
    isLocked: false,
    isCompleted: false,
    description: 'Clay & ceramic artistry',
    artisanCount: 67,
    productCount: 203
  },
  {
    id: 'cloth-weaving',
    name: 'Cloth Weaving',
    icon: Circle,
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-100 to-emerald-100',
    level: 5,
    isLocked: false,
    isCompleted: false,
    description: 'Traditional textile weaving',
    artisanCount: 54,
    productCount: 178
  },
  {
    id: 'glass',
    name: 'Glass Craft',
    icon: Sparkles,
    color: 'from-cyan-500 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    level: 6,
    isLocked: false,
    isCompleted: false,
    description: 'Blown & crafted glass',
    artisanCount: 23,
    productCount: 67
  },
  {
    id: 'grass-nature',
    name: 'Grass & Nature Craft',
    icon: Leaf,
    color: 'from-green-600 to-lime-500',
    gradient: 'bg-gradient-to-br from-green-100 to-lime-100',
    level: 7,
    isLocked: false,
    isCompleted: false,
    description: 'Natural fiber crafts',
    artisanCount: 41,
    productCount: 134
  },
  {
    id: 'herbs',
    name: 'Herbs & Consumables',
    icon: Flower,
    color: 'from-pink-500 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-rose-100',
    level: 8,
    isLocked: false,
    isCompleted: false,
    description: 'Natural herb products',
    artisanCount: 36,
    productCount: 98
  },
  {
    id: 'jewelry',
    name: 'Jewelry Craft',
    icon: Crown,
    color: 'from-yellow-500 to-amber-500',
    gradient: 'bg-gradient-to-br from-yellow-100 to-amber-100',
    level: 9,
    isLocked: false,
    isCompleted: false,
    description: 'Handcrafted jewelry',
    artisanCount: 78,
    productCount: 245
  },
  {
    id: 'leather',
    name: 'Leather Craft',
    icon: Shield,
    color: 'from-brown-500 to-amber-600',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    level: 10,
    isLocked: false,
    isCompleted: false,
    description: 'Traditional leatherwork',
    artisanCount: 29,
    productCount: 87
  },
  {
    id: 'marble-stone',
    name: 'Marble & Stone Craft',
    icon: Mountain,
    color: 'from-gray-600 to-slate-500',
    gradient: 'bg-gradient-to-br from-gray-100 to-slate-100',
    level: 11,
    isLocked: false,
    isCompleted: false,
    description: 'Stone carving & sculpture',
    artisanCount: 19,
    productCount: 56
  },
  {
    id: 'metal',
    name: 'Metal Craft',
    icon: Wrench,
    color: 'from-gray-500 to-zinc-500',
    gradient: 'bg-gradient-to-br from-gray-100 to-zinc-100',
    level: 12,
    isLocked: false,
    isCompleted: false,
    description: 'Metalworking & forging',
    artisanCount: 34,
    productCount: 112
  },
  {
    id: 'needlework',
    name: 'Needlework & Embroidery',
    icon: Cross,
    color: 'from-red-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-red-100 to-pink-100',
    level: 13,
    isLocked: false,
    isCompleted: false,
    description: 'Traditional embroidery',
    artisanCount: 62,
    productCount: 189
  },
  {
    id: 'painting',
    name: 'Painting & Art',
    icon: Paintbrush,
    color: 'from-indigo-500 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-purple-100',
    level: 14,
    isLocked: false,
    isCompleted: false,
    description: 'Traditional & modern art',
    artisanCount: 85,
    productCount: 267
  },
  {
    id: 'rug',
    name: 'Rug Weaving',
    icon: Square,
    color: 'from-amber-600 to-orange-600',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    level: 15,
    isLocked: false,
    isCompleted: false,
    description: 'Traditional rug making',
    artisanCount: 27,
    productCount: 78
  },
  {
    id: 'stationery',
    name: 'Stationery & Paper Craft',
    icon: FileText,
    color: 'from-teal-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
    level: 16,
    isLocked: false,
    isCompleted: false,
    description: 'Paper & stationery crafts',
    artisanCount: 43,
    productCount: 125
  },
  {
    id: 'tie-dye',
    name: 'Tie & Dye / Resist Dyeing',
    icon: Zap,
    color: 'from-violet-500 to-purple-500',
    gradient: 'bg-gradient-to-br from-violet-100 to-purple-100',
    level: 17,
    isLocked: false,
    isCompleted: false,
    description: 'Traditional dyeing techniques',
    artisanCount: 38,
    productCount: 143
  },
  {
    id: 'wood',
    name: 'Wood Craft',
    icon: TreePine,
    color: 'from-emerald-600 to-green-600',
    gradient: 'bg-gradient-to-br from-emerald-100 to-green-100',
    level: 18,
    isLocked: false,
    isCompleted: false,
    description: 'Wood carving & furniture',
    artisanCount: 71,
    productCount: 198
  },
  {
    id: 'wool-weaving',
    name: 'Wool Weaving & Embroidery',
    icon: Circle,
    color: 'from-rose-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
    level: 19,
    isLocked: true,
    isCompleted: false,
    description: 'Wool textiles & embroidery',
    artisanCount: 46,
    productCount: 167
  }
];

interface CategoryLevelsProps {
  onCategoryClick: (category: CraftCategory) => void;
}

export default function CategoryLevels({ onCategoryClick }: CategoryLevelsProps) {
  const [selectedCategory, setSelectedCategory] = useState<CraftCategory | null>(null);

  const handleCategoryClick = (category: CraftCategory) => {
    if (category.isLocked) return;
    setSelectedCategory(category);
    onCategoryClick(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-30"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-amber-800 to-orange-800 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explore Craft Traditions
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 font-medium"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Discover over 100 craft forms across India
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Progress Stats */}
      <motion.div
        className="max-w-7xl mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">18</p>
                <p className="text-gray-600 font-medium">Categories</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">2</p>
                <p className="text-gray-600 font-medium">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">847</p>
                <p className="text-gray-600 font-medium">Total Products</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {craftCategories.map((category, index) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory?.id === category.id;
            
            return (
              <motion.div
                key={category.id}
                className={`relative group cursor-pointer ${category.isLocked ? 'cursor-not-allowed' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => handleCategoryClick(category)}
              >
                <div className={`relative overflow-hidden rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                  category.isLocked 
                    ? 'border-gray-200 bg-gray-50' 
                    : isSelected
                    ? 'border-amber-500 bg-white shadow-2xl scale-105'
                    : 'border-amber-200 bg-white hover:border-amber-400 hover:shadow-xl hover:scale-102'
                }`}>
                  {/* Background Pattern */}
                  <div className={`absolute inset-0 opacity-10 ${category.gradient}`} />
                  
                  {/* Lock Overlay */}
                  {category.isLocked && (
                    <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                  )}
                  
                  {/* Completion Badge */}
                  {category.isCompleted && !category.isLocked && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Level Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                      category.isCompleted 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                        : category.isLocked
                        ? 'bg-gray-400'
                        : 'bg-gradient-to-br from-amber-500 to-orange-500'
                    }`}>
                      {category.level}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative p-6 pt-16">
                    {/* Icon */}
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg ${
                      category.isLocked 
                        ? 'bg-gray-300' 
                        : `bg-gradient-to-br ${category.color}`
                    }`}>
                      <IconComponent className={`w-8 h-8 ${
                        category.isLocked ? 'text-gray-500' : 'text-white'
                      }`} />
                    </div>
                    
                    {/* Title */}
                    <h3 className={`text-lg font-serif font-bold text-center mb-2 ${
                      category.isLocked ? 'text-gray-500' : 'text-gray-800'
                    }`}>
                      {category.name}
                    </h3>
                    
                    {/* Description */}
                    <p className={`text-sm text-center mb-4 ${
                      category.isLocked ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {category.description}
                    </p>
                    
                    {/* Stats */}
                    {!category.isLocked && (
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{category.artisanCount} artisans</span>
                        <span>{category.productCount} products</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                </div>
                
                {/* Selection Glow */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 opacity-20 -z-10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.1, opacity: 0.2 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      
      {/* Bottom Spacing */}
      <div className="h-24" />
    </div>
  );
}
