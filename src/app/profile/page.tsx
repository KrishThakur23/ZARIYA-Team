'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  MapPin, 
  Calendar,
  Heart,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  Edit,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { favorites } from '@/lib/favorites';
import { cart } from '@/lib/cart';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample order data for demo
  const sampleOrders = [
    {
      id: 'ORD-001',
      date: '2026-03-05',
      status: 'delivered',
      total: 4500,
      items: [
        {
          title: 'Handwoven Silk Scarf',
          artisan: 'Meera Patel',
          price: 2500,
          image: 'https://picsum.photos/400/400?random=1'
        },
        {
          title: 'Ceramic Tea Set',
          artisan: 'Rajesh Kumar',
          price: 2000,
          image: 'https://picsum.photos/400/400?random=2'
        }
      ]
    },
    {
      id: 'ORD-002',
      date: '2026-03-01',
      status: 'shipped',
      total: 3200,
      items: [
        {
          title: 'Wooden Jewelry Box',
          artisan: 'Anita Sharma',
          price: 3200,
          image: 'https://picsum.photos/400/400?random=3'
        }
      ]
    },
    {
      id: 'ORD-003',
      date: '2026-02-28',
      status: 'processing',
      total: 1800,
      items: [
        {
          title: 'Brass Decorative Bowl',
          artisan: 'Vikram Singh',
          price: 1800,
          image: 'https://picsum.photos/400/400?random=4'
        }
      ]
    }
  ];

  useEffect(() => {
    // Load user data
    const favItems = favorites.getItems();
    const cartData = cart.getItems();
    
    setFavoriteItems(favItems);
    setCartItems(cartData);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">My Profile</h1>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl">
                    <User className="w-12 h-12 text-white" />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <h1 className="text-2xl font-serif font-bold text-gray-900">
                        {user.name}
                      </h1>
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white w-fit mx-auto md:mx-0">
                        {user.role === 'artisan' ? 'Artisan' : 'Buyer'}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-6 justify-center md:justify-start">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-amber-600">{favoriteItems.length}</p>
                        <p className="text-sm text-gray-600">Favorites</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{sampleOrders.length}</p>
                        <p className="text-sm text-gray-600">Orders</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">4.9</p>
                        <p className="text-sm text-gray-600">Rating</p>
                      </div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <Button variant="outline" className="border-gray-200 hover:border-amber-400">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-1">
                <TabsTrigger value="overview" className="flex items-center gap-2 rounded-lg">
                  <User className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2 rounded-lg">
                  <Package className="w-4 h-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="flex items-center gap-2 rounded-lg">
                  <Heart className="w-4 h-4" />
                  Wishlist
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 rounded-lg">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-amber-600" />
                        Recent Activity
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Added 2 items to favorites</span>
                          <span className="text-xs text-gray-500 ml-auto">2h ago</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Order delivered successfully</span>
                          <span className="text-xs text-gray-500 ml-auto">1d ago</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Reviewed a product</span>
                          <span className="text-xs text-gray-500 ml-auto">3d ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Quick Stats
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Spent</span>
                          <span className="font-semibold text-gray-900">₹9,500</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Items Purchased</span>
                          <span className="font-semibold text-gray-900">6</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Favorite Artisans</span>
                          <span className="font-semibold text-gray-900">4</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Reviews Given</span>
                          <span className="font-semibold text-gray-900">3</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="mt-6">
                <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Order History</h3>
                    <div className="space-y-4">
                      {sampleOrders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">Order {order.id}</h4>
                              <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <p className="text-lg font-bold text-gray-900 mt-1">₹{order.total.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-3 overflow-x-auto">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex-shrink-0 flex items-center gap-3 bg-gray-50 rounded-lg p-3 min-w-[200px]">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                                  <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                  <p className="text-xs text-gray-600">by {item.artisan}</p>
                                  <p className="text-sm font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist" className="mt-6">
                <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">My Wishlist</h3>
                      <Link href="/favorites">
                        <Button variant="outline" className="border-gray-200 hover:border-amber-400">
                          View All
                        </Button>
                      </Link>
                    </div>
                    {favoriteItems.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favoriteItems.slice(0, 6).map((item) => (
                          <Link key={item.productId} href={`/product/${item.productId}`}>
                            <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                                {item.image && (
                                  <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <h4 className="font-medium text-gray-900 line-clamp-2 text-sm mb-1">
                                {item.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">by {item.artisan}</p>
                              <p className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No items in your wishlist yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-6">
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="text-gray-700">Email Notifications</span>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="text-gray-700">Privacy Settings</span>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="text-gray-700">Payment Methods</span>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <span className="text-gray-700">Shipping Addresses</span>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-red-200">
                          <div>
                            <span className="text-red-700 font-medium">Delete Account</span>
                            <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                          </div>
                          <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}