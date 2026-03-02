'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { User, MapPin, Palette, FileText, ArrowRight, SkipForward } from 'lucide-react';
import Logo from '@/components/logo';

export default function ArtisanProfileSetup() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        craftType: '',
        bio: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate a network request
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Save to local storage for the demo
        localStorage.setItem('zariya_artisan_profile', JSON.stringify(formData));

        // Proceed to creating a new product
        router.push('/artisan/new-product');
    };

    const handleSkip = () => {
        router.push('/artisan/new-product');
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4">
            <div className="w-full max-w-xl">
                <div className="text-center mb-10">
                    <Logo className="h-16 w-auto mx-auto mb-6" />
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            Set Up Your Profile
                        </h1>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-md mx-auto">
                            Tell buyers about yourself and the incredible art you create. A rich profile builds trust and helps you sell!
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl mb-6 overflow-hidden relative">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full -translate-y-16 translate-x-16"></div>

                        <CardContent className="p-8 md:p-10 relative z-10">
                            <form onSubmit={handleSave} className="space-y-6">

                                {/* Full Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-700 font-semibold flex items-center gap-2">
                                        <User className="w-4 h-4 text-orange-500" />
                                        Full Name or Studio Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="e.g. Anaya Crafts"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="border-gray-200 focus-visible:ring-orange-500 bg-white/60 shadow-inner"
                                    />
                                </div>

                                {/* Craft Type & Location Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="craftType" className="text-gray-700 font-semibold flex items-center gap-2">
                                            <Palette className="w-4 h-4 text-orange-500" />
                                            Primary Craft
                                        </Label>
                                        <Input
                                            id="craftType"
                                            name="craftType"
                                            placeholder="e.g. Pottery, Weaving"
                                            required
                                            value={formData.craftType}
                                            onChange={handleChange}
                                            className="border-gray-200 focus-visible:ring-orange-500 bg-white/60 shadow-inner"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-gray-700 font-semibold flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-orange-500" />
                                            Location
                                        </Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            placeholder="e.g. Jaipur, Rajasthan"
                                            required
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="border-gray-200 focus-visible:ring-orange-500 bg-white/60 shadow-inner"
                                        />
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="text-gray-700 font-semibold flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-orange-500" />
                                        Your Story
                                    </Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        placeholder="Share the story of your craft and your heritage..."
                                        rows={4}
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="border-gray-200 focus-visible:ring-orange-500 bg-white/60 shadow-inner resize-none"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
                                    <Button
                                        type="submit"
                                        className="w-full md:w-2/3 py-6 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-xl transition-all group"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save & Continue'}
                                        {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full md:w-1/3 text-gray-500 hover:text-gray-800 hover:bg-orange-50 py-6 text-base group"
                                        onClick={handleSkip}
                                    >
                                        Skip for now
                                        <SkipForward className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform opacity-70" />
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    You can always update your profile later securely.
                </p>
            </div>
        </div>
    );
}
