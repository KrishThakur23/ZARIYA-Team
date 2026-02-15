'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductDetail from '@/components/buyer/ProductDetail';

// Mock data as fallback
const mockProducts = [
    {
        id: 'trending-1',
        title: 'Ornate Porcelain Teapot - Floral Gold',
        artisan: 'Priya Sharma',
        price: 89.00,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=center',
        description: 'Hand-painted porcelain with intricate gold floral motifs',
        location: 'Jaipur, India',
        category: 'Ceramic Art',
        rating: 4.9,
    },
    {
        id: 'trending-2',
        title: 'Hand-Carved Rosewood Buddha Statue',
        artisan: 'Rajesh Kumar',
        price: 156.00,
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop&crop=center',
        rating: 4.8,
        location: 'Varanasi, India',
        description: 'Sacred rosewood carving with traditional craftsmanship'
    },
    {
        id: 'trending-3',
        title: 'Banarasi Silk Saree - Royal Blue',
        artisan: 'Meera Patel',
        price: 234.00,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=center',
        rating: 4.9,
        location: 'Varanasi, India',
        description: 'Luxurious handwoven silk with traditional patterns'
    }
];

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            // 1. Try to find in localStorage
            try {
                const localProducts = JSON.parse(localStorage.getItem('zariya_products') || '[]');
                const foundLocal = localProducts.find((p: any) => p.id === params.id);

                if (foundLocal) {
                    // Transform local product to match UI format if needed
                    const transformed = {
                        id: foundLocal.id,
                        title: foundLocal.title,
                        artisan: foundLocal.artisan || 'You',
                        price: foundLocal.price || 0,
                        image: foundLocal.images?.enhanced || foundLocal.images?.original || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
                        description: foundLocal.description || foundLocal.story,
                        location: foundLocal.location || 'India',
                        category: foundLocal.category,
                        rating: 5.0,
                        story: foundLocal.story,
                        specifications: {
                            material: 'Authentic Materials',
                            dimensions: foundLocal.dimensions || 'Standard',
                            weight: 'N/A',
                            care: 'Handle with care'
                        }
                    };
                    setProduct(transformed);
                    setLoading(false);
                    return;
                }
            } catch (e) {
                console.error("Error reading from localStorage", e);
            }

            // 2. Fallback to mock data
            const foundMock = mockProducts.find(p => p.id === params.id);
            if (foundMock) {
                setProduct(foundMock);
            } else {
                // 3. Fallback for demo: show first mock product if ID not found (so page never breaks)
                // Or handle 404 gracefully. For this demo, let's show a generic product logic
                // or keep loading false and show "Product not found"
            }
            setLoading(false);
        }
    }, [params.id]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!product) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Product Not Found</h1>
                <p>We couldn't find the product you're looking for.</p>
                <button onClick={() => router.back()} className="text-blue-600 underline">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <ProductDetail
            product={product}
            onBack={() => router.back()}
            onAddToCart={(p) => console.log('Added to cart', p)}
            onAddToWishlist={(p) => console.log('Added to wishlist', p)}
        />
    );
}
