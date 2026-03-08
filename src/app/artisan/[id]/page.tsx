'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Palette, Star, Heart, ShoppingCart, User } from 'lucide-react';

interface ArtisanProfile {
  artisanId: string;
  name: string;
  village: string;
  craftType: string;
  bio: string;
  userId: string;
  createdAt: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  originalImage?: string;
  image?: string;
  description?: string;
  story?: string;
  category?: string;
  artisan?: string;
  location?: string;
  rating?: number;
}

export default function ArtisanProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchArtisanData = async () => {
      try {
        // Fetch artisan profile
        const artisanRes = await fetch(`/api/artisans?id=${params.id}`);
        if (artisanRes.ok) {
          const artisanData = await artisanRes.json();
          setArtisan(artisanData.artisan);
        }

        // Fetch artisan's products
        const productsRes = await fetch(`/api/products?artisanId=${params.id}`);
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const remoteProducts = Array.isArray(productsData) ? productsData : productsData.products || [];
          const filteredProducts = remoteProducts
            .filter((p: any) => p.status === 'published' && (p.originalImage || p.image))
            .map((p: any) => ({
              id: p.id,
              title: p.title,
              price: p.price || 0,
              originalImage: p.originalImage || p.image,
              description: p.description || p.story,
              category: p.category,
              artisan: p.artisan,
              location: p.location,
              rating: p.rating || 5.0
            }));
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Error fetching artisan data:', error);
      } finally {
        setLoading(false);
        setProductsLoading(false);
      }
    };

    if (params.id) {
      fetchArtisanData();
    }
  }, [params.id]);

  const handleAddToCart = (product: Product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('zariya_cart') || '[]');
      const exists = cart.find((p: any) => p.productId === product.id);

      if (!exists) {
        cart.push({
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.originalImage,
          quantity: 1,
          artisan: product.artisan
        });
        localStorage.setItem('zariya_cart', JSON.stringify(cart));
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddToFavorites = (product: Product) => {
    try {
      const favorites = JSON.parse(localStorage.getItem('zariya_favorites') || '[]');
      const exists = favorites.find((p: any) => p.productId === product.id);

      if (!exists) {
        favorites.push({
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.originalImage,
          artisan: product.artisan,
          addedAt: new Date().toISOString()
        });
        localStorage.setItem('zariya_favorites', JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading artisan profile...</p>
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artisan Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the artisan profile you're looking for.</p>
          <Button onClick={() => router.back()} className="bg-gradient-to-r from-amber-600 to-orange-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
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
          <h1 className="text-lg font-semibold text-gray-900">Artisan Profile</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Artisan Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="overflow-hidden border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl">
                  <User className="w-16 h-16 text-white" />
                </div>

                {/* Artisan Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
                    {artisan.name}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{artisan.village}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Palette className="w-4 h-4" />
                      <span>{artisan.craftType}</span>
                    </div>
                  </div>

                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-4">
                    Master Artisan
                  </Badge>

                  <p className="text-gray-700 leading-relaxed max-w-2xl">
                    {artisan.bio}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-600">{products.length}</p>
                      <p className="text-sm text-gray-600">Products</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">4.9</p>
                      <p className="text-sm text-gray-600">Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">156</p>
                      <p className="text-sm text-gray-600">Sales</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                {artisan.name}'s Creations
              </h2>
              <p className="text-gray-600">
                Discover authentic handcrafted pieces
              </p>
            </div>
          </div>

          {productsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/product/${product.id}`}>
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white/95 backdrop-blur-sm">
                      <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                        {product.originalImage && (
                          <Image
                            src={product.originalImage}
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}

                        {/* Action buttons */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <motion.button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToFavorites(product);
                            }}
                            className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                          </motion.button>
                          <motion.button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ShoppingCart className="h-4 w-4 text-gray-600 hover:text-green-500" />
                          </motion.button>
                        </div>

                        {/* Category badge */}
                        {product.category && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md">
                              {product.category}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-serif font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
                          {product.title}
                        </h3>

                        {product.description && (
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                            <span className="text-xs text-gray-500 ml-1">INR</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h3>
              <p className="text-gray-600 mb-6">
                {artisan.name} hasn't listed any products yet. Check back later!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}