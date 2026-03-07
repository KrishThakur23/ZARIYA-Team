'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { cart, CartItem } from '@/lib/cart';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart items from localStorage
    const items = cart.getItems();
    setCartItems(items);
    setLoading(false);
  }, []);

  const updateQuantity = (productId: string, newQuantity: number) => {
    cart.updateQuantity(productId, newQuantity);
    setCartItems(cart.getItems());
  };

  const removeItem = (productId: string) => {
    cart.removeItem(productId);
    setCartItems(cart.getItems());
  };

  const clearCart = () => {
    cart.clear();
    setCartItems([]);
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
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
          <h1 className="text-lg font-semibold text-gray-900">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Discover amazing handcrafted products from talented artisans around the world.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          // Cart Items
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 flex-shrink-0">
                              {item.image && (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-serif font-semibold text-gray-900 mb-1 line-clamp-2">
                                {item.title}
                              </h3>
                              {item.artisan && (
                                <p className="text-sm text-gray-600 mb-2">
                                  by {item.artisan}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {/* Quantity Controls */}
                                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                      className="h-8 w-8 p-0 hover:bg-gray-200"
                                      disabled={item.quantity <= 1}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center text-sm font-medium">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                      className="h-8 w-8 p-0 hover:bg-gray-200"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  {/* Remove Button */}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem(item.productId)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Price */}
                                <div className="text-right">
                                  <p className="text-lg font-bold text-gray-900">
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                  </p>
                                  {item.quantity > 1 && (
                                    <p className="text-sm text-gray-600">
                                      ₹{item.price.toLocaleString()} each
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="sticky top-24"
                >
                  <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">
                        Order Summary
                      </h3>

                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal ({itemCount} items)</span>
                          <span>₹{total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span className="text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Tax</span>
                          <span>Calculated at checkout</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between text-lg font-bold text-gray-900">
                            <span>Total</span>
                            <span>₹{total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <Link href="/checkout">
                        <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-4">
                          Proceed to Checkout
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>

                      <Link href="/">
                        <Button variant="outline" className="w-full border-gray-200 hover:border-amber-400 text-gray-700 hover:text-amber-700 py-3 rounded-xl">
                          Continue Shopping
                        </Button>
                      </Link>

                      <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                          Secure checkout • Free shipping on orders over ₹2,000
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}