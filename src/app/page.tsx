import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { Palette, Users, Globe } from 'lucide-react';

export default function LanguageSelectionPage() {
  const languages = [
    { name: 'English', native: 'English', href: '/role', primary: true },
    { name: 'हिन्दी', native: 'Hindi', href: '/role', primary: false },
    { name: 'বাংলা', native: 'Bengali', href: '/role', primary: false },
    { name: 'मराठी', native: 'Marathi', href: '/role', primary: false },
    { name: 'ગુજરાતી', native: 'Gujarati', href: '/role', primary: false },
    { name: 'தமிழ்', native: 'Tamil', href: '/role', primary: false },
    { name: 'తెలుగు', native: 'Telugu', href: '/role', primary: false },
    { name: 'ಕನ್ನಡ', native: 'Kannada', href: '/role', primary: false },
    { name: 'മലയാളം', native: 'Malayalam', href: '/role', primary: false },
  ];

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-8">
      <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        {/* Logo and Title */}
        <div className="mb-8">
          <Logo className="h-20 w-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold font-headline mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Welcome to Zariya
          </h1>
          <p className="max-w-2xl text-xl text-gray-700 mb-8 leading-relaxed">
            Your marketplace for authentic, traditional art. Connect with local artisans and discover unique handmade treasures from across India.
          </p>
        </div>

        {/* Feature Icons */}
        <div className="flex items-center gap-8 mb-12">
          <div className="flex items-center gap-2 text-gray-600">
            <Palette className="h-6 w-6 text-orange-600" />
            <span className="text-sm font-medium">Traditional Art</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-6 w-6 text-orange-600" />
            <span className="text-sm font-medium">Local Artisans</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Globe className="h-6 w-6 text-orange-600" />
            <span className="text-sm font-medium">Multi-Language</span>
          </div>
        </div>

        {/* Language Selection */}
        <div className="w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Choose Your Language</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl">
            {languages.map((lang, index) => (
              <Button
                key={index}
                asChild
                size="lg"
                variant={lang.primary ? "default" : "outline"}
                className={`text-lg px-6 py-4 h-auto flex flex-col gap-1 hover:scale-105 transition-transform duration-200 ${lang.primary
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0'
                    : 'bg-white border-2 border-gray-200 hover:border-orange-300 text-gray-700 hover:bg-orange-50'
                  }`}
              >
                <Link href={lang.href} className="flex flex-col items-center gap-1">
                  <span className="text-xl font-medium">{lang.name}</span>
                  <span className={`text-sm ${lang.primary ? 'text-orange-100' : 'text-gray-500'}`}>
                    {lang.native}
                  </span>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-gray-500 mt-8 max-w-md">
          Don't worry, you can always change your language preference later in settings.
        </p>
      </div>
    </main>
  );
}
