'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { User, MapPin, Palette, FileText, ArrowRight, SkipForward } from 'lucide-react';
import Logo from '@/components/logo';

const artisanSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    village: z.string().min(2, 'Village/Location must be at least 2 characters long'),
    craftType: z.string().min(1, 'Please select your craft type'),
    bio: z.string().min(10, 'Bio must be at least 10 characters long').max(500, 'Bio must be less than 500 characters')
});

type ArtisanFormData = z.infer<typeof artisanSchema>;

const craftTypes = [
    'Pottery',
    'Woodworking',
    'Jewelry',
    'Textiles',
    'Painting',
    'Ceramics',
    'Glasswork',
    'Metalwork',
    'Leatherwork',
    'Weaving',
    'Embroidery',
    'Sculpture',
    'Other'
];

export default function ArtisanProfileSetup() {
    const router = useRouter();
    const { user, updateUserRole } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ArtisanFormData>({
        resolver: zodResolver(artisanSchema),
        defaultValues: {
            name: user?.name || '',
            village: '',
            craftType: '',
            bio: ''
        }
    });

    const handleSave = async (data: ArtisanFormData) => {
        if (!user) {
            router.push('/login');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/artisans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    userId: user.id
                }),
            });

            if (response.ok) {
                // Update user role to artisan
                updateUserRole('artisan');
                
                // Redirect to new product creation
                router.push('/artisan/new-product');
            } else {
                const error = await response.json();
                console.error('Failed to create artisan profile:', error);
            }
        } catch (error) {
            console.error('Error creating artisan profile:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        if (user) {
            updateUserRole('artisan');
        }
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
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">

                                    {/* Full Name */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                                                    <User className="w-4 h-4 text-orange-500" />
                                                    Full Name or Studio Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g. Anaya Crafts"
                                                        className="border-gray-200 focus-visible:ring-orange-500 bg-white/60 shadow-inner"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Craft Type & Location Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="craftType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                                                        <Palette className="w-4 h-4 text-orange-500" />
                                                        Primary Craft
                                                    </FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="border-gray-200 focus-visible:ring-orange-500 bg-white/60 shadow-inner">
                                                                <SelectValue placeholder="Select your craft type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {craftTypes.map((craft) => (
                                                                <SelectItem key={craft} value={craft}>
                                                                    {craft}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="village"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-orange-500" />
                                                        Village/Location
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="e.g. Jaipur, Rajasthan"
                                                            className="border-gray-200 focus-visible:ring-orange-500 bg-white/60 shadow-inner"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Bio */}
                                    <FormField
                                        control={form.control}
                                        name="bio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-orange-500" />
                                                    Your Story
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Share the story of your craft and your heritage..."
                                                        rows={4}
                                                        className="border-gray-200 focus-visible:ring-orange-500 bg-white/60 shadow-inner resize-none"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

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
                            </Form>
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
