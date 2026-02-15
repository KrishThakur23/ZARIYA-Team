import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/logo';
import { ArtisanIcon } from '@/components/icons/artisan-icon';
import { BuyerIcon } from '@/components/icons/buyer-icon';
import { Palette, ShoppingBag, Sparkles, Users } from 'lucide-react';

export default function RoleSelectionPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8">
      <div className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <Logo className="h-20 w-auto mb-8" />
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Choose Your Journey
          </h1>
          <p className="max-w-2xl text-xl text-gray-700 mb-8 leading-relaxed">
            Join our vibrant community of artisans and collectors. Whether you create masterpieces or appreciate them, 
            your story begins here.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Palette className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium">Artisan Marketplace</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium">Global Community</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Sparkles className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
          
          {/* Artisan Card */}
          <Link href="/artisan/onboarding" className="group">
            <Card className="h-full bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-transparent hover:border-amber-200 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <ArtisanIcon className="h-16 w-16 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-serif font-bold text-gray-800 mb-2">
                  I'm an Artisan
                </CardTitle>
                <p className="text-lg text-gray-600 font-medium">Create • Share • Inspire</p>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Transform your passion into profit. List your creations, share your unique story, 
                  and connect with collectors who appreciate authentic craftsmanship.
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="text-2xl mb-1">🎨</div>
                    <p className="text-sm font-medium text-gray-700">Showcase Art</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="text-2xl mb-1">💰</div>
                    <p className="text-sm font-medium text-gray-700">Earn Money</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="text-2xl mb-1">🌍</div>
                    <p className="text-sm font-medium text-gray-700">Global Reach</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="text-2xl mb-1">👥</div>
                    <p className="text-sm font-medium text-gray-700">Build Community</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full text-sm font-medium">
                    <span>Start Creating</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Buyer Card */}
          <Link href="/buyer" className="group">
            <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-transparent hover:border-blue-200 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <BuyerIcon className="h-16 w-16 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-serif font-bold text-gray-800 mb-2">
                  I'm a Collector
                </CardTitle>
                <p className="text-lg text-gray-600 font-medium">Discover • Collect • Support</p>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Explore a curated collection of unique, handcrafted treasures. 
                  Support talented artisans while building your own collection of meaningful pieces.
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="text-2xl mb-1">🔍</div>
                    <p className="text-sm font-medium text-gray-700">Discover</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="text-2xl mb-1">🛒</div>
                    <p className="text-sm font-medium text-gray-700">Shop Easy</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="text-2xl mb-1">💎</div>
                    <p className="text-sm font-medium text-gray-700">Unique Finds</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="text-2xl mb-1">❤️</div>
                    <p className="text-sm font-medium text-gray-700">Support Art</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-medium">
                    <span>Start Exploring</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Not sure which path to choose? You can always switch between roles later.
          </p>
        </div>
      </div>
    </main>
  );
}
