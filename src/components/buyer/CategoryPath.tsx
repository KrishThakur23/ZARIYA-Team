'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Home, 
  Shirt, 
  Footprints, 
  Scissors, 
  Sparkles, 
  Gem, 
  FileText, 
  Mountain, 
  Crown, 
  Shield, 
  Wrench, 
  Cross, 
  Paintbrush, 
  Square, 
  Zap, 
  TreePine, 
  Circle,
  Star,
  Lock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface CategoryNode {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  level: number;
  isLocked: boolean;
  isCompleted: boolean;
  isTrending: boolean;
  description: string;
  artisanCount: number;
  productCount: number;
  position: 'left' | 'right';
}

const categoryNodes: CategoryNode[] = [
  {
    id: 'home-decor',
    name: 'Home Decor',
    icon: Home,
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-pink-100',
    level: 1,
    isLocked: false,
    isCompleted: true,
    isTrending: true,
    description: 'Decorative home items',
    artisanCount: 45,
    productCount: 120,
    position: 'left'
  },
  {
    id: 'traditional-clothing',
    name: 'Traditional Clothing',
    icon: Shirt,
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-100 to-cyan-100',
    level: 2,
    isLocked: false,
    isCompleted: true,
    isTrending: false,
    description: 'Traditional wear & textiles',
    artisanCount: 67,
    productCount: 189,
    position: 'right'
  },
  {
    id: 'footwear',
    name: 'Footwear',
    icon: Footprints,
    color: 'from-orange-500 to-red-500',
    gradient: 'bg-gradient-to-br from-orange-100 to-red-100',
    level: 3,
    isLocked: false,
    isCompleted: false,
    isTrending: true,
    description: 'Handcrafted shoes & sandals',
    artisanCount: 28,
    productCount: 89,
    position: 'left'
  },
  {
    id: 'kitchen-teapot',
    name: 'Kitchen & Teapot',
    icon: Scissors,
    color: 'from-amber-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    level: 4,
    isLocked: false,
    isCompleted: false,
    isTrending: false,
    description: 'Ceramic kitchenware & teapots',
    artisanCount: 54,
    productCount: 156,
    position: 'right'
  },
  {
    id: 'assorted-craft',
    name: 'Assorted Craft',
    icon: Sparkles,
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-100 to-emerald-100',
    level: 5,
    isLocked: false,
    isCompleted: false,
    isTrending: false,
    description: 'Mixed traditional crafts',
    artisanCount: 41,
    productCount: 134,
    position: 'left'
  },
  {
    id: 'bead-craft',
    name: 'Bead Craft',
    icon: Gem,
    color: 'from-cyan-500 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    level: 6,
    isLocked: false,
    isCompleted: false,
    isTrending: true,
    description: 'Intricate beadwork & jewelry',
    artisanCount: 32,
    productCount: 89,
    position: 'right'
  },
  {
    id: 'block-printing',
    name: 'Block Printing',
    icon: FileText,
    color: 'from-pink-500 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-rose-100',
    level: 7,
    isLocked: false,
    isCompleted: false,
    isTrending: false,
    description: 'Traditional textile printing',
    artisanCount: 28,
    productCount: 156,
    position: 'left'
  },
  {
    id: 'marble-stone',
    name: 'Marble & Stone',
    icon: Mountain,
    color: 'from-gray-600 to-slate-500',
    gradient: 'bg-gradient-to-br from-gray-100 to-slate-100',
    level: 8,
    isLocked: false,
    isCompleted: false,
    isTrending: false,
    description: 'Stone carving & sculpture',
    artisanCount: 19,
    productCount: 56,
    position: 'right'
  },
  {
    id: 'jewelry-craft',
    name: 'Jewelry Craft',
    icon: Crown,
    color: 'from-yellow-500 to-amber-500',
    gradient: 'bg-gradient-to-br from-yellow-100 to-amber-100',
    level: 9,
    isLocked: false,
    isCompleted: false,
    isTrending: true,
    description: 'Handcrafted jewelry',
    artisanCount: 78,
    productCount: 245,
    position: 'left'
  },
  {
    id: 'leather-craft',
    name: 'Leather Craft',
    icon: Shield,
    color: 'from-amber-600 to-orange-600',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    level: 10,
    isLocked: false,
    isCompleted: false,
    isTrending: false,
    description: 'Traditional leatherwork',
    artisanCount: 29,
    productCount: 87,
    position: 'right'
  },
  {
    id: 'metal-craft',
    name: 'Metal Craft',
    icon: Wrench,
    color: 'from-gray-500 to-zinc-500',
    gradient: 'bg-gradient-to-br from-gray-100 to-zinc-100',
    level: 11,
    isLocked: false,
    isCompleted: false,
    isTrending: false,
    description: 'Metalworking & forging',
    artisanCount: 34,
    productCount: 112,
    position: 'left'
  },
  {
    id: 'needlework',
    name: 'Needlework & Embroidery',
    icon: Cross,
    color: 'from-red-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-red-100 to-pink-100',
    level: 12,
    isLocked: false,
    isCompleted: false,
    isTrending: false,
    description: 'Traditional embroidery',
    artisanCount: 62,
    productCount: 189,
    position: 'right'
  },
  {
    id: 'painting-art',
    name: 'Painting & Art',
    icon: Paintbrush,
    color: 'from-indigo-500 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-purple-100',
    level: 13,
    isLocked: false,
    isCompleted: false,
    isTrending: true,
    description: 'Traditional & modern art',
    artisanCount: 85,
    productCount: 267,
    position: 'left'
  },
  {
    id: 'rug-weaving',
    name: 'Rug Weaving',
    icon: Square,
    color: 'from-teal-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
    level: 14,
    isLocked: false,
    isCompleted: false,
    isTrending: false,
    description: 'Traditional rug making',
    artisanCount: 27,
    productCount: 78,
    position: 'right'
  },
  {
    id: 'tie-dye',
    name: 'Tie & Dye',
    icon: Zap,
    color: 'from-violet-500 to-purple-500',
    gradient: 'bg-gradient-to-br from-violet-100 to-purple-100',
    level: 15,
    isLocked: false,
    isCompleted: false,
    isTrending: false,
    description: 'Traditional dyeing techniques',
    artisanCount: 38,
    productCount: 143,
    position: 'left'
  },
  {
    id: 'wood-craft',
    name: 'Wood Craft',
    icon: TreePine,
    color: 'from-emerald-600 to-green-600',
    gradient: 'bg-gradient-to-br from-emerald-100 to-green-100',
    level: 16,
    isLocked: false,
    isCompleted: false,
    isTrending: false,
    description: 'Wood carving & furniture',
    artisanCount: 71,
    productCount: 198,
    position: 'right'
  },
  {
    id: 'wool-weaving',
    name: 'Wool Weaving',
    icon: Circle,
    color: 'from-rose-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
    level: 17,
    isLocked: true,
    isCompleted: false,
    isTrending: false,
    description: 'Wool textiles & embroidery',
    artisanCount: 46,
    productCount: 167,
    position: 'left'
  }
];

interface CategoryPathProps {
  onCategoryClick: (category: CategoryNode) => void;
}

export default function CategoryPath({ onCategoryClick }: CategoryPathProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryNode | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepIndicatorRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Update current step based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((progress) => {
      const step = Math.min(Math.max(Math.round(progress * categoryNodes.length), 1), categoryNodes.length);
      setCurrentStep(step);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const handleCategoryClick = (category: CategoryNode) => {
    if (category.isLocked) return;
    setSelectedCategory(category);
    onCategoryClick(category);
  };

  // Calculate positions for the curved path with better spacing
  const getNodePosition = (index: number, position: 'left' | 'right') => {
    const baseY = index * 180 + 80; // Reduced spacing, higher start
    const xOffset = position === 'left' ? -100 : 100; // More pronounced left/right alternation
    return { x: xOffset, y: baseY };
  };

  // Generate smooth SVG path connecting all nodes
  const generateSmoothPath = () => {
    const points = categoryNodes.map((_, index) => {
      const y = index * 180 + 80;
      return { x: 0, y };
    });

    let path = `M 0 ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      const midY = (prevPoint.y + currentPoint.y) / 2;
      
      // Create smooth bezier curves
      const controlOffset = 60;
      path += ` Q 0 ${prevPoint.y + controlOffset} 0 ${currentPoint.y}`;
    }

    return path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-yellow-50 relative z-10">
      {/* Floating Step Indicator */}
      <motion.div
        ref={stepIndicatorRef}
        className="fixed top-20 right-4 z-40 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-amber-200"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
          <Star className="w-4 h-4" />
          <span>{currentStep} of {categoryNodes.length}</span>
        </div>
      </motion.div>

      {/* Header - Reduced top space */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-30"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-center">
            <motion.h1
              className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-amber-800 to-orange-800 bg-clip-text text-transparent mb-1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Craft Journey
            </motion.h1>
            <motion.p
              className="text-base text-gray-600 font-medium"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Follow the path to discover traditional crafts
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Compact Progress Stats */}
      <motion.div
        className="max-w-7xl mx-auto px-4 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md border border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">17</p>
                <p className="text-xs text-gray-600">Categories</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md border border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">2</p>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md border border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">2,847</p>
                <p className="text-xs text-gray-600">Products</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Curved Path Container */}
      <div 
        ref={containerRef}
        className="relative min-h-[3500px] overflow-hidden"
      >
        {/* Enhanced SVG Background Path */}
        <div className="absolute inset-0 flex justify-center">
          <svg 
            className="absolute top-0 w-full h-full"
            style={{ maxWidth: '800px' }}
            viewBox="0 0 400 3500"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Main connecting line with gradient and glow */}
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="25%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="75%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#fde047" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Glow effect */}
            <motion.path
              d={generateSmoothPath()}
              stroke="url(#pathGradient)"
              strokeWidth="12"
              fill="none"
              filter="url(#glow)"
              opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            
            {/* Main connecting path */}
            <motion.path
              d={generateSmoothPath()}
              stroke="url(#pathGradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.7 }}
            />
          </svg>
        </div>

        {/* Enhanced Category Nodes */}
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {categoryNodes.map((category, index) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory?.id === category.id;
            const position = getNodePosition(index, category.position);
            const ref = useRef<HTMLDivElement>(null);
            const isInView = useInView(ref, { once: true, margin: "-100px" });
            
            return (
              <motion.div
                key={category.id}
                ref={ref}
                className={`absolute cursor-pointer ${category.isLocked ? 'cursor-not-allowed' : ''}`}
                style={{
                  left: `calc(50% + ${position.x}px)`,
                  top: `${position.y}px`,
                  transform: 'translateX(-50%)'
                }}
                initial={{ opacity: 0, scale: 0, y: 50 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleCategoryClick(category)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* Node Container */}
                <div className={`relative w-36 h-36 ${category.position === 'left' ? 'mr-20' : 'ml-20'}`}>
                  {/* Selection Glow Ring */}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 opacity-40 -z-10"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.3, opacity: 0.4 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  {/* Main Node with enhanced styling */}
                  <div className={`relative w-full h-full rounded-full shadow-2xl border-4 transition-all duration-300 ${
                    category.isLocked 
                      ? 'border-gray-300 bg-gray-100' 
                      : isSelected
                      ? 'border-amber-500 bg-white shadow-3xl'
                      : 'border-amber-200 bg-white hover:border-amber-400 hover:shadow-3xl'
                  }`}>
                    {/* Enhanced gradient background */}
                    <div className={`absolute inset-2 rounded-full ${category.gradient} opacity-30`} />
                    
                    {/* Lock Overlay */}
                    {category.isLocked && (
                      <div className="absolute inset-0 bg-gray-900/30 rounded-full flex items-center justify-center z-10">
                        <Lock className="w-7 h-7 text-white" />
                      </div>
                    )}
                    
                    {/* Status Badges */}
                    <div className="absolute -top-3 -right-3 z-10">
                      {category.isCompleted && (
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg mb-1">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {category.isTrending && (
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Level Badge */}
                    <div className="absolute -top-3 -left-3 z-10">
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
                    
                    {/* Enhanced Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${
                        category.isLocked 
                          ? 'bg-gray-300' 
                          : `bg-gradient-to-br ${category.color}`
                      }`}>
                        <IconComponent className={`w-10 h-10 ${
                          category.isLocked ? 'text-gray-500' : 'text-white'
                        }`} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Category Info */}
                  <div className={`absolute top-full mt-4 w-56 ${category.position === 'left' ? 'text-right' : 'text-left'}`}>
                    <h3 className={`text-lg font-serif font-bold mb-1 ${
                      category.isLocked ? 'text-gray-500' : 'text-gray-800'
                    }`}>
                      {category.name}
                    </h3>
                    <p className={`text-sm mb-2 ${
                      category.isLocked ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {category.description}
                    </p>
                    {!category.isLocked && (
                      <div className="text-xs text-gray-500 font-medium">
                        <p>{category.artisanCount} artisans • {category.productCount} products</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Bottom Spacing for sticky nav */}
      <div className="h-40" />
    </div>
  );
}