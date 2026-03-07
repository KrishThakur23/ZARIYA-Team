'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Package, Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock orders fetching
        setTimeout(() => {
            setOrders([
                {
                    orderId: 'ORD-982374',
                    product: 'Handwoven Crimson Scarf',
                    artisan: 'Sunita Devi',
                    status: 'Shipped',
                    date: '2023-10-24',
                    price: 1250,
                    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=150&q=80',
                },
                {
                    orderId: 'ORD-239481',
                    product: 'Clay Terracotta Vase',
                    artisan: 'Ram Kumar',
                    status: 'Delivered',
                    date: '2023-09-12',
                    price: 850,
                    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=150&q=80',
                }
            ]);
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading orders...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => router.push('/')} className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Button>

                <h1 className="text-3xl font-bold font-serif mb-8 text-gray-900">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">Discover authentic handcrafted treasures today.</p>
                        <Button onClick={() => router.push('/')} className="bg-amber-600 hover:bg-amber-700">
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.orderId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center"
                            >
                                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                    <img src={order.image} alt={order.product} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{order.orderId}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-sm text-gray-500">{order.date}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{order.product}</h3>
                                    <p className="text-sm text-gray-600 mb-2">by {order.artisan}</p>
                                    <p className="font-semibold text-gray-900">₹{order.price.toLocaleString()}</p>
                                </div>

                                <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                                    <div className={`px-4 py-1.5 rounded-full text-sm font-medium
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {order.status}
                                    </div>
                                    <Link href={`/orders/track?id=${order.orderId}`}>
                                        <Button variant="outline" className="w-full md:w-auto">
                                            {order.status === 'Delivered' ? 'View Details' : 'Track Order'}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
