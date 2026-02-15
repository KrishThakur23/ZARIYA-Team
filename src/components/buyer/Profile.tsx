'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Heart, 
  ShoppingBag, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Edit, 
  Settings, 
  Bell, 
  CreditCard, 
  Truck, 
  Shield, 
  HelpCircle, 
  LogOut,
  Camera,
  Check,
  ArrowRight,
  Palette,
  Users,
  Award,
  Clock,
  Gift
} from 'lucide-react';
import Image from 'next/image';

interface ProfileProps {
  userName?: string;
  userEmail?: string;
  onEditProfile?: () => void;
  onLogout?: () => void;
}

interface UserStats {
  orders: number;
  wishlist: number;
  following: number;
  reviews: number;
}

interface RecentOrder {
  id: string;
  title: string;
  artisan: string;
  image: string;
  price: number;
  status: 'delivered' | 'shipped' | 'processing';
  date: string;
}

interface FavoriteArtisan {
  id: string;
  name: string;
  location: string;
  avatar: string;
  crafts: string;
  products: number;
}

export default function Profile({ 
  userName = 'Pashin', 
  userEmail = 'pashin@zariya.com',
  onEditProfile,
  onLogout 
}: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Sample user data
  const userStats: UserStats = {
    orders: 12,
    wishlist: 27,
    following: 8,
    reviews: 15
  };

  const recentOrders: RecentOrder[] = [
    {
      id: '1',
      title: 'Handwoven Kanjeevaram Silk Saree',
      artisan: 'Meera Patel',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop',
      price: 25000,
      status: 'delivered',
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Ceramic Teapot with Traditional Motifs',
      artisan: 'Rajesh Kumar',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop',
      price: 3500,
      status: 'shipped',
      date: '2024-01-20'
    },
    {
      id: '3',
      title: 'Wooden Sculpture - Dancing Peacock',
      artisan: 'Vikram Singh',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      price: 12000,
      status: 'processing',
      date: '2024-01-22'
    }
  ];

  const favoriteArtisans: FavoriteArtisan[] = [
    {
      id: '1',
      name: 'Meera Patel',
      location: 'Kanchipuram, India',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      crafts: 'Silk Weaving',
      products: 24
    },
    {
      id: '2',
      name: 'Rajesh Kumar',
      location: 'Jaipur, India',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      crafts: 'Pottery & Ceramics',
      products: 18
    },
    {
      id: '3',
      name: 'Anita Sharma',
      location: 'Udaipur, India',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      crafts: 'Miniature Painting',
      products: 32
    }
  ];

  const craftPreferences = [
    { name: 'Traditional Textiles', selected: true },
    { name: 'Pottery & Ceramics', selected: true },
    { name: 'Wooden Crafts', selected: false },
    { name: 'Metal Work', selected: true },
    { name: 'Jewelry', selected: false },
    { name: 'Paintings', selected: true }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'processing': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <Check className="w-3 h-3" />;
      case 'shipped': return <Truck className="w-3 h-3" />;
      case 'processing': return <Clock className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const settingsItems = [
    { icon: Bell, label: 'Notifications', desc: 'Manage your notification preferences' },
    { icon: CreditCard, label: 'Payment Methods', desc: 'Manage cards and payment options' },
    { icon: Truck, label: 'Shipping Addresses', desc: 'Manage delivery addresses' },
    { icon: Shield, label: 'Privacy & Security', desc: 'Account security settings' },
    { icon: Palette, label: 'Craft Preferences', desc: 'Customize your discovery feed' },
    { icon: HelpCircle, label: 'Help & Support', desc: 'Get help and contact support' }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* User Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Orders</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{userStats.orders}</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-6 border border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-6 h-6 text-red-600" />
            <span className="text-sm font-medium text-red-800">Wishlist</span>
          </div>
          <p className="text-2xl font-bold text-red-900">{userStats.wishlist}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-green-800">Following</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{userStats.following}</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-6 h-6 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Reviews</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900">{userStats.reviews}</p>
        </div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif font-bold text-gray-900">Recent Orders</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-amber-600 text-sm font-medium flex items-center gap-1 hover:text-amber-700"
          >
            View All <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="space-y-4">
          {recentOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200">
                <Image
                  src={order.image}
                  alt={order.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{order.title}</h4>
                <p className="text-sm text-gray-600">by {order.artisan}</p>
                <p className="text-sm font-medium text-amber-700">₹{order.price.toLocaleString()}</p>
              </div>
              
              <div className="text-right">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
                <p className="text-xs text-gray-500 mt-1">{new Date(order.date).toLocaleDateString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Favorite Artisans */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif font-bold text-gray-900">Following Artisans</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-amber-600 text-sm font-medium flex items-center gap-1 hover:text-amber-700"
          >
            Discover More <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favoriteArtisans.map((artisan, index) => (
            <motion.div
              key={artisan.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={artisan.avatar}
                    alt={artisan.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{artisan.name}</h4>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {artisan.location}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-amber-800 font-medium">{artisan.crafts}</p>
                <p className="text-xs text-gray-600">{artisan.products} products</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {settingsItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center group-hover:from-amber-200 group-hover:to-orange-200 transition-colors">
              <item.icon className="w-6 h-6 text-amber-700" />
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{item.label}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
            
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
          </div>
        </motion.div>
      ))}
      
      {/* Logout Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onLogout}
        className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg border border-red-200 group"
      >
        <div className="flex items-center justify-center gap-3">
          <LogOut className="w-6 h-6" />
          <span className="font-semibold">Sign Out</span>
        </div>
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pb-24">
      {/* Profile Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-lg border-b border-gray-100"
      >
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-6">
            {/* Profile Photo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {userName.charAt(0).toUpperCase()}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-100 flex items-center justify-center text-gray-600 hover:text-amber-600"
              >
                <Camera className="w-4 h-4" />
              </motion.button>
            </motion.div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-serif font-bold text-gray-900">{userName}</h1>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{userEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Mumbai, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">Premium Collector</span>
                  <div className="px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-xs rounded-full font-medium">
                    Level 3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 bg-white rounded-2xl p-2 shadow-lg border border-gray-100 mb-8"
        >
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'wishlist', label: 'Wishlist', icon: Heart },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Order History</h3>
                  <p className="text-gray-600 mb-6">View and track all your craft orders</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium"
                  >
                    Coming Soon
                  </motion.button>
                </div>
              )}
              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Your Wishlist</h3>
                  <p className="text-gray-600 mb-6">Save and organize your favorite crafts</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium"
                  >
                    Coming Soon
                  </motion.button>
                </div>
              )}
              {activeTab === 'settings' && renderSettings()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
