'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Truck, CheckCircle2, Home, Package, ArrowLeft, MoreHorizontal } from 'lucide-react';

export default function OrderTrackingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('id') || 'ORD-982374';

    const steps = [
        { title: 'Order Confirmed', desc: 'We have received your order.', icon: CheckCircle2, status: 'completed' },
        { title: 'Processing', desc: 'Artisan is preparing your items.', icon: Package, status: 'completed' },
        { title: 'Shipped', desc: 'Order is on the way.', icon: Truck, status: 'current' },
        { title: 'Out for Delivery', desc: 'Arriving soon.', icon: MapPin, status: 'upcoming' },
        { title: 'Delivered', desc: 'Enjoy your handcrafted goods.', icon: Home, status: 'upcoming' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Button variant="ghost" onClick={() => router.push('/')} className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Button>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 shadow-lg">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold font-serif text-gray-900 mb-2">Track Your Order</h1>
                        <p className="text-gray-500 font-medium tracking-wide">Order #{orderId}</p>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-6 mb-10 flex items-center justify-between shadow-inner">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                            <p className="text-xl font-bold text-amber-700">Oct 24 - Oct 27</p>
                        </div>
                        <Truck className="w-10 h-10 text-amber-600 opacity-50" />
                    </div>

                    <div className="relative pl-4 max-w-sm mx-auto">
                        {/* Timeline Line */}
                        <div className="absolute left-9 top-4 bottom-8 w-0.5 bg-gray-200"></div>

                        <div className="space-y-8">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isCompleted = step.status === 'completed';
                                const isCurrent = step.status === 'current';

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative flex items-start gap-6"
                                    >
                                        <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white transition-colors duration-500
                      ${isCompleted ? 'border-green-500 text-green-500' : isCurrent ? 'border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'border-gray-200 text-gray-300'}
                    `}>
                                            {isCurrent && <span className="absolute inset-0 rounded-full animate-ping bg-amber-400 opacity-20"></span>}
                                            <Icon className="w-5 h-5" />
                                        </div>

                                        <div className="flex-1 pt-2">
                                            <h3 className={`font-bold text-lg ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.title}
                                            </h3>
                                            <p className={`text-sm ${isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-300'}`}>
                                                {step.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-12 text-center border-t pt-8 border-gray-100 flex gap-4 justify-center">
                        <Button variant="outline" className="w-[200px]" onClick={() => alert("Mock receipt details printed")}>
                            View Receipt
                        </Button>
                        <Button variant="outline" className="w-[200px]">
                            Contact Support
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
