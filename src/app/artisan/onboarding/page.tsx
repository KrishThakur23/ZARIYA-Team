import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, PlayCircle, Sparkles, Camera, Mic, Palette, Star } from 'lucide-react';
import Logo from '@/components/logo';

export default function ArtisanOnboardingPage() {
  // The AssistantProvider and VoiceAssistant are now in the layout.
  // We can still use the context to set messages if needed,
  // but for this page, the initial message is set in the layout.
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Header Section */}
        <div className="mb-8">
          <Logo className="h-16 w-auto mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Welcome to Your Creative Journey
          </h1>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed max-w-lg mx-auto">
            Transform your passion into profit. Watch this quick guide to see how easy it is to 
            showcase your art to the world with our AI-powered platform.
          </p>
        </div>

        {/* Video Demo Section */}
        <Card className="aspect-[9/16] w-full max-w-xs mx-auto overflow-hidden mb-8 shadow-2xl border-0 bg-gradient-to-br from-gray-900 to-black">
          <CardContent className="flex h-full flex-col items-center justify-center p-0 relative">
            {/* Video Background */}
            <video
              className="absolute top-0 left-0 w-full h-full object-cover opacity-80"
              src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
              autoPlay
              loop
              muted
              playsInline
            ></video>
            
            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex flex-col items-center justify-center p-6">
              <div className="text-center space-y-4">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <PlayCircle className="h-12 w-12 text-white" />
                </div>
                <div>
                  <p className="font-serif font-bold text-white text-lg mb-2">
                    Zariya Demo
                  </p>
                  <p className="text-white/80 text-sm">
                    See how artisans showcase their work
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-white/60 rounded-xl border border-amber-200">
            <div className="p-3 bg-amber-100 rounded-full w-fit mx-auto mb-2">
              <Camera className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Smart Photos</p>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-xl border border-orange-200">
            <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-2">
              <Mic className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Voice Stories</p>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-xl border border-red-200">
            <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-2">
              <Palette className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">AI Enhancement</p>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-xl border border-amber-200">
            <div className="p-3 bg-amber-100 rounded-full w-fit mx-auto mb-2">
              <Star className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Premium Listing</p>
          </div>
        </div>

        {/* Main CTA */}
        <Button asChild size="lg" className="w-full md:w-auto px-12 py-4 text-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 border-0 shadow-lg group">
          <Link href="/artisan/new-product">
            <Sparkles className="mr-2 h-5 w-5" />
            Start Your First Listing
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>

        {/* Bottom Text */}
        <div className="mt-6 space-y-2">
          <p className="text-gray-600 text-sm">
            Join thousands of artisans already selling on Zariya
          </p>
          <p className="text-xs text-gray-500">
            Takes less than 5 minutes to create your first listing
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-6 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Global Reach</span>
          </div>
        </div>
      </div>
    </div>
  );
}
