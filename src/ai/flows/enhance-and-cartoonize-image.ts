'use server';
/**
 * @fileOverview Enhances a product image and generates a cartoon version.
 *
 * - enhanceAndCartoonizeImage - A function that enhances and cartoonizes an image.
 * - EnhanceAndCartoonizeImageInput - The input type for the enhanceAndCartoonizeImage function.
 * - EnhanceAndCartoonizeImageOutput - The return type for the enhanceAndCartoonizeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceAndCartoonizeImageInputSchema = z.object({
  productPhotoDataUri: z
    .string()
    .describe(
      'A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // prettier-ignore
    ),
});
export type EnhanceAndCartoonizeImageInput = z.infer<typeof EnhanceAndCartoonizeImageInputSchema>;

const EnhanceAndCartoonizeImageOutputSchema = z.object({
  enhancedImage: z
    .string()
    .describe(
      'The enhanced product image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // prettier-ignore
    ),
  cartoonImage: z
    .string()
    .describe(
      'The cartoon version of the product image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // prettier-ignore
    ),
});
export type EnhanceAndCartoonizeImageOutput = z.infer<typeof EnhanceAndCartoonizeImageOutputSchema>;

export async function enhanceAndCartoonizeImage(
  input: EnhanceAndCartoonizeImageInput
): Promise<EnhanceAndCartoonizeImageOutput> {
  return enhanceAndCartoonizeImageFlow(input);
}

const enhanceAndCartoonizeImageFlow = ai.defineFlow(
  {
    name: 'enhanceAndCartoonizeImageFlow',
    inputSchema: EnhanceAndCartoonizeImageInputSchema,
    outputSchema: EnhanceAndCartoonizeImageOutputSchema,
  },
  async input => {
    // Generate enhanced image
    const enhancedImageResponse = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: input.productPhotoDataUri}},
        {text: 'enhance the image'},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const enhancedImage = enhancedImageResponse.output?.media?.url;
    if (!enhancedImage) {
      throw new Error('Failed to generate enhanced image.');
    }

    // Generate cartoon image
    const cartoonImageResponse = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: input.productPhotoDataUri}},
        {text: 'generate a cartoon version of the image'},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const cartoonImage = cartoonImageResponse.output?.media?.url;
    if (!cartoonImage) {
      throw new Error('Failed to generate cartoon image.');
    }

    return {
      enhancedImage,
      cartoonImage,
    };
  }
);
