'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Bell, 
  User, 
  TrendingDown, 
  Package, 
  Check, 
  CheckCheck,
  Trash2
} from 'lucide-react';
import { notifications, Notification } from '@/lib/notifications';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'artisan_joined':
      return User;
    case 'price_drop':
      return TrendingDown;
    case 'order_update':
      return Package;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'artisan_joined':
      return 'from-blue-500 to-indigo-500';
    case 'price_drop':
      return 'from-green-500 to-emerald-500';
    case 'order_update':
      return 'from-purple-500 to-violet-500';
    default:
      return 'from-gray-500 to-slate-500';
  }
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notificationItems, setNotificationItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize sample notifications if none exist
    notifications.initializeSampleNotifications();
    
    // Load notifications from localStorage
    const items = notifications.getItems();
    setNotificationItems(items);
    setLoading(false);
  }, []);

  const markAsRead = (id: string) => {
    notifications.markAsRead(id);
    setNotificationItems(notifications.getItems());
  };

  const markAllAsRead = () => {
    notifications.markAllAsRead();
    setNotificationItems(notifications.getItems());
  };

  const clearAllNotifications = () => {
    notifications.clear();
    setNotificationItems([]);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const unreadCount = notificationItems.filter(item => !item.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading notifications...</p>
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
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          {notificationItems.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={markAllAsRead}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm"
                >
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Mark All Read
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={clearAllNotifications}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {notificationItems.length === 0 ? (
          // Empty Notifications State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-6">
              <Bell className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              No notifications
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You're all caught up! We'll notify you when there's something new.
            </p>
          </motion.div>
        ) : (
          // Notifications List
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Notifications
              </h1>
              <p className="text-gray-600">
                Stay updated with the latest from Zariya
              </p>
            </motion.div>

            <div className="space-y-4">
              <AnimatePresence>
                {notificationItems.map((notification, index) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  const colorClass = getNotificationColor(notification.type);

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className={`overflow-hidden border-0 shadow-lg bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                          !notification.read ? 'ring-2 ring-blue-200 bg-blue-50/50' : ''
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-gray-900 line-clamp-1">
                                  {notification.title}
                                </h3>
                                <div className="flex items-center gap-2 ml-4">
                                  <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {formatTimeAgo(notification.timestamp)}
                                  </span>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                              </div>

                              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                {notification.message}
                              </p>

                              <div className="flex items-center justify-between">
                                <Badge 
                                  variant="outline" 
                                  className="text-xs capitalize border-gray-200 text-gray-600"
                                >
                                  {notification.type.replace('_', ' ')}
                                </Badge>

                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs"
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Mark as read
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Bottom spacing */}
            <div className="h-8"></div>
          </div>
        )}
      </div>
    </div>
  );
}