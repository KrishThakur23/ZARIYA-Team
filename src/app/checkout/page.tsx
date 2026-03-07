'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CreditCard, Lock, PackageCheck } from 'lucide-react';
import { cart, CartItem } from '@/lib/cart';

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const items = cart.getItems();
        if (items.length === 0) {
            router.push('/cart');
        } else {
            setCartItems(items);
        }
        setLoading(false);
    }, [router]);

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handlePlaceOrder = () => {
        setIsProcessing(true);
        // Simulate API delay
        setTimeout(() => {
            cart.clear();
            const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
            router.push(`/orders/track?id=${orderId}`);
        }, 2000);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
                </Button>

                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h2 className="text-xl font-bold mb-4 font-serif">Shipping Details</h2>
                            <div className="space-y-4">
                                <Input placeholder="Full Name" defaultValue="Pashin" />
                                <Input placeholder="Address" defaultValue="123 Craft Avenue" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input placeholder="City" defaultValue="Mumbai" />
                                    <Input placeholder="Postal Code" defaultValue="400001" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h2 className="text-xl font-bold mb-4 font-serif">Payment Method</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 border-2 border-amber-500 bg-amber-50 rounded-xl">
                                    <CreditCard className="text-amber-600 w-6 h-6" />
                                    <span className="font-medium">Credit / Debit Card</span>
                                </div>
                                <Input placeholder="Card Number" defaultValue="**** **** **** 1234" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input placeholder="MM/YY" defaultValue="12/26" />
                                    <Input placeholder="CVC" defaultValue="***" type="password" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-6">
                            <h2 className="text-xl font-bold mb-6 font-serif">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                                {cartItems.map((item, index) => (
                                    <div key={item.productId || `checkout-item-${index}`} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                                                <img src={item.image} alt="product" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium line-clamp-1 max-w-[150px]">{item.title}</p>
                                                <p className="text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-3">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full mt-6 py-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl shadow-lg transition-all"
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center"><PackageCheck className="w-5 h-5 mr-2 animate-bounce" /> Processing...</span>
                                ) : (
                                    <span className="flex items-center"><Lock className="w-4 h-4 mr-2" /> Pay ₹{total.toLocaleString()}</span>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
