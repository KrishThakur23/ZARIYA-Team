'use server';

/**
 * @fileOverview A flow to generate product details including description, suggested price, and craft story.
 *
 * - generateProductDetails - A function that generates product details.
 * - GenerateProductDetailsInput - The input type for the generateProductDetails function.
 * - GenerateProductDetailsOutput - The return type for the generateProductDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDetailsInputSchema = z.object({
  title: z.string().describe('The title of the product.'),
  category: z.string().describe('The category of the product (e.g., pottery, painting, jewelry).'),
  dimensions: z.string().describe('The dimensions of the product (e.g., 10x12 inches).'),
  price: z.number().describe('The price of the product in USD.'),
  story: z.string().optional().describe('An optional story about the product or the artisan.'),
});
export type GenerateProductDetailsInput = z.infer<typeof GenerateProductDetailsInputSchema>;

const GenerateProductDetailsOutputSchema = z.object({
  description: z.string().describe('A detailed description of the product.'),
  suggestedPrice: z.number().describe('A suggested price for the product in USD.'),
  craftStory: z.string().describe('A short story about the craft or the artisan.'),
});
export type GenerateProductDetailsOutput = z.infer<typeof GenerateProductDetailsOutputSchema>;

export async function generateProductDetails(
  input: GenerateProductDetailsInput
): Promise<GenerateProductDetailsOutput> {
  return generateProductDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDetailsPrompt',
  input: {schema: GenerateProductDetailsInputSchema},
  output: {schema: GenerateProductDetailsOutputSchema},
  prompt: `You are an expert in crafting compelling product listings for artisan goods.

  Based on the following product details, generate a detailed product description, a suggested price, and a short craft story.

  Title: {{{title}}}
  Category: {{{category}}}
  Dimensions: {{{dimensions}}}
  Price: {{{price}}}
  Story: {{{story}}}

  Product Description:
  Suggested Price:
  Craft Story:`,
});

const generateProductDetailsFlow = ai.defineFlow(
  {
    name: 'generateProductDetailsFlow',
    inputSchema: GenerateProductDetailsInputSchema,
    outputSchema: GenerateProductDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
