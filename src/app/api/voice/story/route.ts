import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StoryRequestSchema = z.object({
  productId: z.string(),
  transcript: z.string().optional(), // Transcript from Web Speech API
  audioData: z.string().optional(), // Base64 encoded audio (legacy)
  language: z.string().optional(), // Language code
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, transcript, audioData, language } = StoryRequestSchema.parse(body);

    // Use provided transcript from Web Speech API, or fallback
    const storyTranscript = transcript || "I created this beautiful handmade piece with passion and traditional techniques.";
    console.log('📝 Processing story transcript (language:', language || 'en', '):', storyTranscript.substring(0, 50) + '...');

    // Generate story using AI
    const storyGeneration = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `Based on this artisan's spoken story about their craft, create a polished product description and a short marketing description.

Original transcript: "${storyTranscript}"

Please provide:
1. A compelling craft story (2-3 paragraphs) that captures the artisan's passion and process
2. A short description (1-2 sentences) for marketing purposes

Format as JSON with keys: craft_story, short_description`
    });

    const aiResponse = storyGeneration.output?.text;
    let parsedResponse;

    try {
      parsedResponse = JSON.parse(aiResponse || '{}');
    } catch {
      // Fallback if JSON parsing fails
      parsedResponse = {
        craft_story: "This beautiful handmade piece was crafted with passion and attention to detail. Each item tells a unique story of traditional craftsmanship and artistic vision.",
        short_description: "A beautifully crafted handmade piece that combines traditional techniques with modern appeal."
      };
    }

    // In a real implementation, you'd save to Firestore here
    const aiAssetId = `ai_asset_${Date.now()}`;

    // Mock Firestore save (replace with actual Firestore operations)
    const aiAsset = {
      id: aiAssetId,
      type: 'story' as const,
      product_id: productId,
      generated_text: parsedResponse.craft_story,
      transcript: storyTranscript,
      is_edited_by_artisan: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      transcript: storyTranscript,
      craft_story_id: aiAssetId,
      craft_story: parsedResponse.craft_story,
      short_description: parsedResponse.short_description,
      ai_asset: aiAsset
    });

  } catch (error) {
    console.error('Story capture error:', error);
    return NextResponse.json(
      { error: 'Failed to process story' },
      { status: 500 }
    );
  }
}
