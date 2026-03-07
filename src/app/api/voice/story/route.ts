export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

let _bedrockClient: BedrockRuntimeClient | null = null;

function getBedrockClient(): BedrockRuntimeClient {
  if (!_bedrockClient) {
    const region = process.env.REGION;
    const accessKeyId = process.env.ACCESS_KEY_ID;
    const secretAccessKey = process.env.SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey || !region) {
      throw new Error("AWS environment variables not configured properly.");
    }

    _bedrockClient = new BedrockRuntimeClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return _bedrockClient;
}


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

    const prompt = `Based on this artisan's spoken story about their craft, create a polished product description and a short marketing description.

Original transcript: "${storyTranscript}"

Please provide:
1. A compelling craft story (2-3 paragraphs) that captures the artisan's passion and process
2. A short description (1-2 sentences) for marketing purposes

Format as JSON with keys: "craft_story" (string), "short_description" (string)`;

    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    };

    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    let parsedResponse;
    try {
      console.log("Calling AWS service: Bedrock (Generate Story)");
      const response = await getBedrockClient().send(command);
      console.log("AWS call success");

      const resultString = new TextDecoder().decode(response.body);
      const resultObj = JSON.parse(resultString);
      const textCompletion = resultObj.content[0].text;

      const jsonMatch = textCompletion.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse Claude output into JSON");
      }
    } catch (e: any) {
      console.error("AWS error:", e);
      if (e.name === 'AccessDeniedException') {
        console.error("Check IAM permissions for the following actions: bedrock:InvokeModel");
      }
      // Fallback if JSON parsing fails or Bedrock fails
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
