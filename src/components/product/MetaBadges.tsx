'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Truck, Clock, MapPin } from 'lucide-react';

interface MetaBadgesProps {
  isAuthenticated?: boolean;
  isHandmade?: boolean;
  isHeritage?: boolean;
  shippingEta?: string;
  location?: string;
  artisanName?: string;
}

export default function MetaBadges({
  isAuthenticated = true,
  isHandmade = true,
  isHeritage = true,
  shippingEta = '3-5 days',
  location = 'India',
  artisanName = 'Priya'
}: MetaBadgesProps) {
  const badges = [
    {
      icon: Shield,
      label: 'Authenticated',
      description: 'Verified by Zariya',
      color: 'bg-green-100 text-green-800 border-green-200',
      iconColor: 'text-green-600',
      show: isAuthenticated
    },
    {
      icon: Award,
      label: 'Handmade',
      description: 'Crafted by skilled hands',
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      iconColor: 'text-amber-600',
      show: isHandmade
    },
    {
      icon: Award,
      label: 'Heritage',
      description: 'Cultural legacy preserved',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      iconColor: 'text-orange-600',
      show: isHeritage
    }
  ];

  const infoItems = [
    {
      icon: Truck,
      label: 'Shipping',
      value: shippingEta,
      color: 'text-blue-600'
    },
    {
      icon: MapPin,
      label: 'From',
      value: location,
      color: 'text-purple-600'
    },
    {
      icon: Clock,
      label: 'Artisan',
      value: artisanName,
      color: 'text-indigo-600'
    }
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Authentication Badges */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Verification Status</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {badges.filter(badge => badge.show).map((badge, index) => (
            <motion.div
              key={badge.label}
              className={`p-3 rounded-xl border ${badge.color} transition-all duration-200 hover:shadow-md`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white ${badge.iconColor}`}>
                  <badge.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{badge.label}</p>
                  <p className="text-xs opacity-75">{badge.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Product Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {infoItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <div className={`p-2 rounded-lg bg-white ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gallery Ready Badge */}
      <motion.div
        className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Gallery Ready</p>
            <p className="text-sm text-gray-600">This masterpiece is ready for public display</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
