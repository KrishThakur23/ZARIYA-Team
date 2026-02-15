'use server';

import { enhanceAndCartoonizeImage } from '@/ai/flows/enhance-and-cartoonize-image';
import { generateProductDetails } from '@/ai/flows/generate-product-details';
import { z } from 'zod';

const EnhanceImageSchema = z.object({
  productPhotoDataUri: z.string().startsWith('data:image/'),
});

export async function handleEnhanceImage(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = EnhanceImageSchema.safeParse(data);

  if (!parsed.success) {
    return { error: 'Invalid image data URI.' };
  }

  const originalImage = parsed.data.productPhotoDataUri;

  try {
    // TRY AI enhancement first
    const result = await enhanceAndCartoonizeImage({
      productPhotoDataUri: originalImage,
    });

    // Success! Return AI-enhanced images
    console.log('✅ AI image enhancement succeeded');
    return {
      success: true,
      enhancedImage: result.enhancedImage,
      cartoonImage: result.cartoonImage
    };

  } catch (e: any) {
    // AI failed - silently use client-side fallback
    console.log('⚠️ AI enhancement unavailable, using client-side fallback');
    console.error('AI error details:', e.message);

    // ALWAYS return success with fallback images
    // The client-side processing will happen in the browser
    return {
      success: true,
      enhancedImage: originalImage, // Will be processed by client
      cartoonImage: originalImage,  // Will be processed by client
      fallback: true // Flag to trigger client-side processing
    };
  }
}

const GenerateDetailsSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  category: z.string().min(1, 'Category is required.'),
  dimensions: z.string().min(1, 'Dimensions are required.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  story: z.string().optional(),
});

export async function handleGenerateDetails(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = GenerateDetailsSchema.safeParse(data);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { error: 'Invalid input.', errors };
  }

  try {
    const result = await generateProductDetails(parsed.data);
    return { success: true, ...result };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate details.' };
  }
}
