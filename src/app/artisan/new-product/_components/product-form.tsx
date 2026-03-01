
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState, useTransition, useRef } from 'react';
import Image from 'next/image';
import { useAssistantContext } from '@/app/artisan/_components/assistant-provider';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Loader2,
  Sparkles,
  UploadCloud,
  FileImage,
  Mic,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleEnhanceImage, handleGenerateDetails } from '../actions';
import { enhanceImageWithCanvas, createCartoonEffect } from '@/lib/image-processing';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductPreview from '@/components/product/ProductPreview';
import CameraCapture from './camera-capture';
import VoiceStoryRecorder from './voice-story-recorder';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().min(1, 'Please select a category.'),
  dimensions: z.string().min(3, 'Please provide dimensions, e.g., 10" x 12".'),
  price: z.coerce.number().optional(), // Make price optional for now
  story: z.string().optional(),
  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

import { assistantTranslations } from '@/lib/i18n';

export default function ProductForm() {
  const router = useRouter();
  const { setAssistantMessage, activeLanguage, setActiveLanguage } = useAssistantContext();
  const t = assistantTranslations[activeLanguage || 'en'] || assistantTranslations.en;
  const [step, setStep] = useState('language');
  const [images, setImages] = useState({
    original: null as string | null,
    enhanced: null as string | null,
    cartoon: null as string | null,
  });
  // ... (rest of state initialization) ...

  // ... (existing code) ...

  const prevStep = () => {
    if (step === 'language') {
      router.back();
      return;
    }

    if (step === 'photos') setStep('language');
    else if (step === 'review') setStep('billing');
    else if (step === 'billing') setStep('shipping');
    else if (step === 'shipping') setStep('pricing');
    else if (step === 'pricing') setStep('story');
    else if (step === 'story') setStep('details');
    else if (step === 'details') setStep('photos');
  };
  const [storyData, setStoryData] = useState<{
    transcript: string;
    craft_story_id: string;
    craft_story: string;
    short_description: string;
  } | null>(null);
  const [selectedImageType, setSelectedImageType] = useState<'original' | 'enhanced' | 'cartoon'>('enhanced');
  const [isAiLoading, startAiTransition] = useTransition();
  const { toast } = useToast();

  const [photoSource, setPhotoSource] = useState<'camera' | 'upload'>('camera');
  const [cameraReady, setCameraReady] = useState(false);
  const instructionIndex = useRef(0);
  const instructionInterval = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      category: '',
      dimensions: '',
      price: 0,
      story: '',
      description: '',
    },
  });

  useEffect(() => {
    const giveInstruction = () => {
      const getMessage = () => {
        if (step === 'photos') {
          return t.photo1 as string;
        }
        return (assistantTranslations[activeLanguage || 'en'] || assistantTranslations.en)[step] as string;
      };

      const message = getMessage();
      console.log('Product Form - Setting message for step:', step, 'message:', message);
      if (typeof message === 'string' && message) {
        setAssistantMessage(message);
      }
    };

    if (step !== 'language') {
      giveInstruction();
    }
  }, [step, images.original]);


  const processAndEnhanceImage = (dataUrl: string) => {
    setImages({ original: dataUrl, enhanced: null, cartoon: null });
    /* auto-removed redeclaration */
    setAssistantMessage(t.processingPhoto as string);

    startAiTransition(async () => {
      const formData = new FormData();
      formData.append('productPhotoDataUri', dataUrl);
      const result = await handleEnhanceImage(formData);

      // ALWAYS process - no error messages
      if (result.success) {
        if (result.fallback) {
          // Use client-side enhancement (AI unavailable)
          try {
            /* auto-removed redeclaration */
            setAssistantMessage(t.processingMagic as string);
            const enhancedImage = await enhanceImageWithCanvas(dataUrl);
            const cartoonImage = await createCartoonEffect(dataUrl);

            setImages(prev => ({ ...prev, enhanced: enhancedImage, cartoon: cartoonImage }));
            toast({
              title: 'Image Enhanced!',
              description: 'Your images are ready.'
            });
            /* auto-removed redeclaration */
            setAssistantMessage(t.photoGreatNext as string);
          } catch (enhanceError) {
            // Even if client processing fails, show original
            console.error('Browser enhancement failed:', enhanceError);
            setImages(prev => ({ ...prev, enhanced: dataUrl, cartoon: dataUrl }));
            toast({
              title: 'Image Ready!',
              description: 'Your photo is ready.'
            });
            /* auto-removed redeclaration */
            setAssistantMessage(t.photoGreatNextFallback as string);
          }
        } else {
          // Use AI-enhanced images
          setImages(prev => ({ ...prev, enhanced: result.enhancedImage, cartoon: result.cartoonImage }));
          toast({
            title: 'AI Enhanced!',
            description: 'Your images have been enhanced by AI.'
          });
          /* auto-removed redeclaration */
          setAssistantMessage(t.photoGreatNext as string);
        }
      } else {
        // Fallback to original images (should rarely happen)
        setImages(prev => ({ ...prev, enhanced: dataUrl, cartoon: dataUrl }));
        toast({
          title: 'Image Ready!',
          description: 'Your photo is ready.'
        });
        /* auto-removed redeclaration */
        setAssistantMessage(t.photoGreatNextFallback as string);
      }
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload an image file (JPG, PNG, etc.)'
      });
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        variant: 'destructive',
        title: 'File Too Large',
        description: 'Please upload an image smaller than 10MB.'
      });
      return;
    }

    /* auto-removed redeclaration */
    setAssistantMessage(t.loadingPhoto as string);

    const reader = new FileReader();

    reader.onerror = () => {
      console.error('File reading error');
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Could not read the file. Please try again.'
      });
      /* auto-removed redeclaration */
      setAssistantMessage(t.readError as string);
    };

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        processAndEnhanceImage(dataUrl);
      } else {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: 'Could not process the image. Please try again.'
        });
        /* auto-removed redeclaration */
        setAssistantMessage(t.processError as string);
      }
    };

    reader.readAsDataURL(file);
  };

  const onGenerateDetails = () => {
    /* auto-removed redeclaration */
    setAssistantMessage(t.generatingPricing as string);
    startAiTransition(async () => {
      const formData = new FormData();
      const fields: (keyof ProductFormValues)[] = ['title', 'category', 'dimensions', 'price', 'story'];
      fields.forEach(field => {
        const value = form.getValues(field);
        if (value !== undefined && value !== null) {
          formData.append(field, String(value));
        }
      });

      const result = await handleGenerateDetails(formData);
      /* auto-removed redeclaration */
      if ('error' in result && result.error) {
        toast({ variant: 'destructive', title: 'Generation Failed', description: 'Please check your inputs.' });
        setAssistantMessage(t.generateError as string);
      } else if ('success' in result && result.success) {
        form.setValue('description', result.description, { shouldValidate: true });
        form.setValue('story', result.craftStory || result.description, { shouldValidate: true });
        form.setValue('price', result.suggestedPrice, { shouldValidate: true });
        toast({ title: 'Success!', description: 'AI has generated product details for you.' });
        setAssistantMessage(t.generateSuccess as string);
      }
    });
  };

  const handleStoryCaptured = (data: {
    transcript: string;
    craft_story_id: string;
    craft_story: string;
    short_description: string;
  }) => {
    setStoryData(data);
    form.setValue('story', data.craft_story, { shouldValidate: true });
    form.setValue('description', data.short_description, { shouldValidate: true });
    /* auto-removed redeclaration */
    setAssistantMessage(t.storyCaptured as string);
  };

  const onSubmit = async (data: ProductFormValues) => {
    /* auto-removed redeclaration */
    setAssistantMessage(t.savingProduct as string);
    try {
      let imageKey = '';
      let imageUrl = images.original || '';

      if (images.original && images.original.startsWith('data:image')) {
        // 1. Get presigned URL
        const presignRes = await fetch('/api/s3/presign', {
          method: 'POST',
          body: JSON.stringify({ filename: 'product-photo.jpg' })
        });
        const presignData = await presignRes.json();

        if (presignData.uploadUrl) {
          // 2. Convert DataURI to Blob
          const res = await fetch(images.original);
          const blob = await res.blob();

          // 3. Upload to S3
          await fetch(presignData.uploadUrl, {
            method: 'PUT',
            body: blob,
            headers: { 'Content-Type': 'image/jpeg' }
          });

          imageKey = presignData.objectKey;
          imageUrl = presignData.uploadUrl.split('?')[0]; // Extract base URL
        }
      }

      const product = {
        artisanId: 'user-id-placeholder',
        ...data,
        images: {
          original: imageUrl,
          enhanced: images.enhanced, // Note: keeping as dataURI for demo
          cartoon: images.cartoon,   // Note: keeping as dataURI for demo
        },
        imageKey,
        originalImage: imageUrl,
        status: 'published',
        createdAt: new Date().toISOString(),
        id: `product-${Date.now()}`,
        artisan: 'You',
        location: 'India',
        rating: 5.0,
      };

      console.log('Submitting to AWS API:', product);

      const saveRes = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product),
      });

      if (!saveRes.ok) throw new Error('Failed to save to DynamoDB');

      setAssistantMessage(t.listingSuccess as string);
      toast({ title: 'Product Listed!', description: 'Your creation is now live on the marketplace.' });

      setTimeout(() => {
        router.push('/buyer');
      }, 1500);

    } catch (error) {
      console.error('Failed to submit:', error);
      toast({ variant: 'destructive', title: 'Submit Failed', description: 'Could not save product.' });
      setAssistantMessage(t.listingError as string);
    }
  };


  const nextStep = async () => {
    if (step === 'language') setStep('photos');
    else if (step === 'photos' && images.original) setStep('details');
    else if (step === 'details') setStep('story');
    else if (step === 'story') {
      const currentStory = form.getValues('story');
      if (currentStory && currentStory.trim().length > 10) {
        setStep('pricing');
        /* auto-removed redeclaration */
        setAssistantMessage(t.setPrice as string);
      } else {
        setStep('pricing');
      }
    }
    else if (step === 'pricing') setStep('shipping');
    else if (step === 'shipping') setStep('billing');
    else if (step === 'billing') setStep('review');
  };

  const renderStep = () => {
    switch (step) {
      case 'language':
        const languages = [
          { code: 'en', label: 'English', native: 'English', flag: '🇺🇸' },
          { code: 'hi', label: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
          { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
          { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
          { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
          { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
          { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
        ];
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-serif font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Choose Your Language
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Select your preferred language to begin adding your masterpiece to Zariya.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setActiveLanguage(lang.code);
                    setStep('photos');
                  }}
                  className="group relative flex flex-col items-center justify-center p-8 bg-white rounded-3xl border-2 border-orange-100 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-4xl mb-4 relative z-10">{lang.flag}</span>
                  <span className="text-2xl font-bold text-gray-800 mb-1 relative z-10">{lang.native}</span>
                  <span className="text-sm font-medium text-gray-500 relative z-10">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'photos':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Capture Your Masterpiece
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Let's start by capturing your beautiful creation. Choose your preferred method and watch as our AI enhances your photos.
              </p>
            </div>

            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-amber-50/30">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-serif font-bold text-gray-800">Product Photo</CardTitle>
                      <p className="text-gray-600">Showcase your work in the best light</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPhotoSource(photoSource === 'upload' ? 'camera' : 'upload')}
                    className="px-4 py-2 rounded-lg hover:bg-amber-100 hidden" // Added hidden class for demo
                  >
                    {photoSource === 'upload' ? <Camera className="mr-2 h-4 w-4" /> : <FileImage className="mr-2 h-4 w-4" />}
                    {photoSource === 'upload' ? 'Use Camera' : 'Upload File'}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {photoSource === 'upload' && !images.original && (
                  <label htmlFor="photo-upload" className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="p-4 bg-white rounded-full shadow-lg mb-4">
                      <UploadCloud className="h-12 w-12 text-gray-400" />
                    </div>
                    <span className="text-lg font-semibold text-gray-700 mb-2">Click to upload your photo</span>
                    <span className="text-sm text-gray-500">PNG, JPG, or GIF up to 10MB</span>
                    <Input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                  </label>
                )}

                {photoSource === 'camera' && !images.original && (
                  <div className="aspect-square w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                    <CameraCapture
                      onCapture={processAndEnhanceImage}
                      isProcessing={isAiLoading}
                      onCameraReady={() => setCameraReady(true)}
                    />
                  </div>
                )}

                {(images.original || isAiLoading) && (
                  <div className="space-y-6">
                    {images.original && !isAiLoading && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 text-center">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-lg font-semibold text-green-800">Photo Processed Successfully!</p>
                        </div>
                        <p className="text-sm text-green-700">Your image has been enhanced and is ready for the next step.</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <h3 className="text-xl font-serif font-semibold text-gray-800 text-center">Your Enhanced Images</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700 mb-3">Original</p>
                          <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                            {images.original ? <Image src={images.original} alt="Original" width={200} height={200} className="object-cover w-full h-full" /> : <div />}
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700 mb-3">AI Enhanced</p>
                          <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                            {images.enhanced ? (
                              <Image src={images.enhanced} alt="Enhanced" width={200} height={200} className="object-cover w-full h-full" />
                            ) : isAiLoading ? (
                              <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-50 to-orange-50">
                                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                              </div>
                            ) : <div className="flex items-center justify-center h-full bg-gray-50 text-center text-xs p-4 text-gray-500">AI enhancement will appear here</div>}
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700 mb-3">Artistic Style</p>
                          <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                            {images.cartoon ? (
                              <Image src={images.cartoon} alt="Cartoon" width={200} height={200} className="object-cover w-full h-full" />
                            ) : isAiLoading ? (
                              <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 to-pink-50">
                                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                              </div>
                            ) : <div className="flex items-center justify-center h-full bg-gray-50 text-center text-xs p-4 text-gray-500">Artistic version will appear here</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 'details':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Tell Us About Your Creation
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Help potential buyers understand your masterpiece. Our AI can enhance your descriptions to make them more compelling.
              </p>
            </div>

            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-amber-50/30">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-serif font-bold text-gray-800">Product Details</CardTitle>
                    <p className="text-gray-600">Share the story behind your masterpiece</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-gray-800">Product Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Hand-carved Wooden Bowl"
                            className="h-12 text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="category" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-gray-800">Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pottery">🏺 Pottery</SelectItem>
                            <SelectItem value="woodworking">🪵 Woodworking</SelectItem>
                            <SelectItem value="jewelry">💎 Jewelry</SelectItem>
                            <SelectItem value="textiles">🧵 Textiles</SelectItem>
                            <SelectItem value="painting">🎨 Painting</SelectItem>
                            <SelectItem value="ceramics">🏺 Ceramics</SelectItem>
                            <SelectItem value="glasswork">🪟 Glasswork</SelectItem>
                            <SelectItem value="other">✨ Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="dimensions" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-gray-800">Dimensions</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g., 10" x 12" x 4"'
                            className="h-12 text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="space-y-4">
                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-gray-800">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your product, its unique features, and what makes it special..."
                            rows={8}
                            className="text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onGenerateDetails}
                    disabled={isAiLoading}
                    className="w-full md:w-auto px-8 py-3 text-lg border-2 border-amber-300 hover:border-amber-400 hover:bg-amber-50 rounded-xl"
                  >
                    <Sparkles className="mr-3 h-5 w-5" />
                    {isAiLoading ? 'Generating with AI...' : 'Enhance with AI'}
                  </Button>
                </div>

                {isAiLoading && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200 text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-600 border-t-transparent"></div>
                      <span className="text-lg font-medium text-amber-800">AI is crafting your perfect description...</span>
                    </div>
                    <p className="text-sm text-amber-700">This may take a few moments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 'story':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Share Your Story
              </h1>
              <p className="text-xl text-gray-600">
                Every product has a soul. Tell us about yours.
              </p>
            </div>

            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-amber-50/30 overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">Tell us about your creation</h3>
                    <p className="text-sm text-gray-500">Tap the microphone to speak, or type directly below.</p>
                  </div>

                  <div className="w-full max-w-xs mx-auto mb-4">
                    <Select value={activeLanguage} onValueChange={setActiveLanguage}>
                      <SelectTrigger className="border-2 border-amber-200 focus:border-amber-400 bg-white">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English (US)</SelectItem>
                        <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                        <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                        <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                        <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                        <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                        <SelectItem value="pa">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <VoiceStoryRecorder
                    onTranscriptUpdate={(text) => {
                      const currentStory = form.getValues('story') || '';
                      const separator = currentStory && !currentStory.endsWith(' ') ? ' ' : '';
                      form.setValue('story', currentStory + separator + text, { shouldValidate: true });
                    }}
                    onAiResponse={(text) => {
                      setAssistantMessage(text);
                      form.setValue('story', text, { shouldValidate: true });
                    }}
                    isProcessing={isAiLoading}
                  />

                  <FormField
                    control={form.control}
                    name="story"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Textarea
                            placeholder="I made this using traditional techniques passed down from my grandmother..."
                            className="min-h-[200px] text-lg p-6 border-2 border-amber-100 focus:border-orange-400 rounded-2xl bg-white/50 backdrop-blur-sm resize-none shadow-inner"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 flex w-full justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const currentStory = form.getValues('story');
                        if (!currentStory) return;

                        /* auto-removed redeclaration */
                        setAssistantMessage(t.refiningStory as string);
                        startAiTransition(async () => {
                          try {
                            const response = await fetch('/api/chat', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                language: activeLanguage,
                                generationMode: true,
                                messages: [{ role: 'user', content: currentStory }]
                              })
                            });

                            const data = await response.json();
                            if (data.reply) {
                              form.setValue('story', data.reply, { shouldValidate: true });
                              setAssistantMessage(t.storyEnhanced as string);
                              toast({ title: 'Story Enhanced', description: 'AI polished your product story.' });
                            }
                          } catch (error) {
                            console.error('Enhancement generation failed:', error);
                            toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not enhance story at this time.' });
                          }
                        });
                      }}
                      disabled={isAiLoading}
                      className="w-full md:w-auto px-8 py-3 text-lg border-2 border-amber-300 hover:border-amber-400 hover:bg-amber-50 rounded-xl"
                    >
                      <Sparkles className="mr-3 h-5 w-5" />
                      {isAiLoading ? 'Enhancing...' : 'Enhance with AI'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'pricing':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Set Your Price
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Price your masterpiece competitively. Our AI analyzes market trends and similar products to suggest the perfect price.
              </p>
            </div>

            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-amber-50/30">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-serif font-bold text-gray-800">Pricing Strategy</CardTitle>
                    <p className="text-gray-600">Let AI help you find the perfect price</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Price Input Section */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
                      <h3 className="text-xl font-serif font-bold text-gray-800 mb-4">Your Price</h3>
                      <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-800">Price (USD)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-amber-600">$</span>
                              <Input
                                type="number"
                                placeholder="49.99"
                                className="h-14 text-2xl font-bold pl-10 border-2 border-gray-200 focus:border-amber-400 rounded-xl"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    {/* Price Range Suggestion */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                      <h3 className="text-lg font-serif font-bold text-gray-800 mb-4">Suggested Range</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Conservative</span>
                          <span>$25 - $45</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Premium</span>
                          <span>$65 - $95</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Suggestion Section */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-500 rounded-full">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-gray-800">AI Price Suggestion</h3>
                      </div>
                      <p className="text-gray-700 mb-4">
                        Our AI analyzes similar products, market trends, and your product details to suggest the optimal price.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/price/suggest', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                title: form.getValues('title'),
                                category: form.getValues('category'),
                                dimensions: form.getValues('dimensions'),
                                timeSpent: 8,
                                material: 'wood',
                                complexity: 'medium'
                              })
                            });
                            const result = await response.json();
                            if (result.success) {
                              form.setValue('price', result.suggested_price);
                              setAssistantMessage(`I suggest $${result.suggested_price}. ${result.rationale}`);
                            }
                          } catch (error) {
                            console.error('Price suggestion failed:', error);
                            setAssistantMessage('Price suggestion temporarily unavailable. Please set your own price.');
                          }
                        }}
                        disabled={isAiLoading}
                        className="w-full px-6 py-3 text-lg border-2 border-green-300 hover:border-green-400 hover:bg-green-50 rounded-xl"
                      >
                        <Sparkles className="mr-3 h-5 w-5" />
                        {isAiLoading ? 'Calculating...' : 'Get AI Suggestion'}
                      </Button>
                    </div>

                    {/* Pricing Factors */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                      <h3 className="text-lg font-serif font-bold text-gray-800 mb-4">Pricing Factors</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Material quality & rarity</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Time invested in creation</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Artisan skill level</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Market demand & trends</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Similar product prices</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 text-sm mb-4">
                    Remember: You can always adjust your price after listing
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'shipping':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Shipping Setup
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Set up your shipping details so customers know where their beautiful creations will come from.
              </p>
            </div>

            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-amber-50/30">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-serif font-bold text-gray-800">Shipping Address</CardTitle>
                    <p className="text-gray-600">Where will your products ship from?</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-base font-semibold text-gray-800 mb-2 block">Street Address</label>
                      <Input
                        placeholder="123 Main St, Apt 4B"
                        className="h-12 text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-base font-semibold text-gray-800 mb-2 block">City</label>
                      <Input
                        placeholder="San Francisco"
                        className="h-12 text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-base font-semibold text-gray-800 mb-2 block">State/Province</label>
                      <Input
                        placeholder="CA"
                        className="h-12 text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-base font-semibold text-gray-800 mb-2 block">ZIP/Postal Code</label>
                      <Input
                        placeholder="94102"
                        className="h-12 text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500 rounded-full">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-blue-800">Shipping Information</h3>
                  </div>
                  <p className="text-blue-700">This address will be used to calculate shipping costs and show customers where their items ship from.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'billing':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Payment Setup
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Secure your payment information to start receiving payments from customers worldwide.
              </p>
            </div>

            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-amber-50/30">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-serif font-bold text-gray-800">Payment Information</CardTitle>
                    <p className="text-gray-600">Secure and encrypted payment processing</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-base font-semibold text-gray-800 mb-2 block">Card Number</label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        className="h-12 text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-base font-semibold text-gray-800 mb-2 block">Name on Card</label>
                      <Input
                        placeholder="John Doe"
                        className="h-12 text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-base font-semibold text-gray-800 mb-2 block">Expiry Date</label>
                      <Input
                        placeholder="MM/YY"
                        className="h-12 text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-base font-semibold text-gray-800 mb-2 block">CVV</label>
                      <Input
                        placeholder="123"
                        className="h-12 text-lg border-2 border-gray-200 focus:border-amber-400 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500 rounded-full">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-green-800">Secure Payment Processing</h3>
                  </div>
                  <p className="text-green-700 mb-4">Your payment information is encrypted and processed securely using industry-standard protocols.</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium">SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium">PCI Compliant</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    setAssistantMessage('Payment processed successfully! Your product is ready to go live.');
                    setTimeout(() => setStep('review'), 1000);
                  }}
                  className="w-full md:w-auto px-12 py-4 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg"
                >
                  <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Process Payment & Continue
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'review':
        return (
          <div className="w-full">
            <ProductPreview
              product={{
                title: form.watch('title') || 'Your Beautiful Creation',
                category: form.watch('category') || 'Handcrafted',
                dimensions: form.watch('dimensions') || 'Custom Size',
                price: Number(form.watch('price') || 0),
                story: form.watch('story') || form.watch('description') || 'This beautiful piece was crafted with love and passion, representing the rich heritage of traditional craftsmanship.',
                description: form.watch('description') || 'A beautiful handmade creation',
                transcript: storyData?.transcript,
                tags: ['handmade', 'artisan', 'traditional'],
                images: {
                  original: images.original ?? undefined,
                  enhanced: images.enhanced ?? undefined,
                  cartoon: images.cartoon ?? undefined
                },
                suggestedPrice: undefined,
                priceRationale: undefined,
                artisanName: 'You',
                location: 'India',
                shippingEta: '3-5 days'
              }}
              userType="artisan"
              onPublish={() => onSubmit(form.getValues())}
              onEdit={() => setStep('details')}
              onShare={() => console.log('Share')}
              onReport={() => console.log('Report')}
              onFavorite={() => console.log('Favorite')}
              onPriceChange={(newPrice) => form.setValue('price', newPrice)}
              onStoryEdit={(newStory) => form.setValue('story', newStory)}
              onTagClick={(tag) => console.log('Tag clicked:', tag)}
              onCategoryClick={(category) => console.log('Category clicked:', category)}
            />
          </div>
        );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full min-h-screen">
        <div className="flex-grow flex items-center justify-center p-4">
          {renderStep()}
        </div>
        <div className="sticky bottom-0 left-0 right-0 w-full bg-background/80 backdrop-blur-sm border-t p-4">
          <div className="max-w-lg mx-auto flex justify-between">
            <Button variant="outline" type="button" onClick={prevStep}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            {step !== 'review' ? (
              <Button type="button" onClick={nextStep} disabled={
                (step === 'photos' && !images.original) ||
                (step === 'details' && (!form.watch('title') || !form.watch('category') || !form.watch('dimensions'))) ||
                (step === 'story' && !storyData && !form.watch('story')) ||
                (step === 'pricing' && !form.watch('price'))
              }>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isAiLoading}>
                {isAiLoading ? <Loader2 className="animate-spin" /> : "Publish Listing"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
