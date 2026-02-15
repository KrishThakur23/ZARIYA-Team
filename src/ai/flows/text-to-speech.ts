'use server';

/**
 * @fileOverview A flow to convert text to speech with caching.
 *
 * - textToSpeech - A function that converts text to speech.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  language: z.enum(['en', 'hi', 'ta']).optional().default('en').describe('Language code: en (English), hi (Hindi), ta (Tamil)'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audio: z.string().describe('The base64 encoded audio data URI.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

// In-memory cache for audio data
const audioCache = new Map<string, string>();

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

// Voice mapping for different languages
const getVoiceForLanguage = (language: string): string => {
  const voiceMap: Record<string, string> = {
    'en': 'Algenib',      // English
    'hi': 'Puck',         // Hindi
    'ta': 'Charon',       // Tamil (using Charon as regional voice)
  };
  return voiceMap[language] || 'Algenib';
};

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text, language = 'en' }) => {
    // Create cache key with language
    const cacheKey = `${language}:${text}`;
    
    // Check cache first
    if (audioCache.has(cacheKey)) {
      return { audio: audioCache.get(cacheKey)! };
    }

    const voiceName = getVoiceForLanguage(language);

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
      prompt: text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const audioDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    // Store in cache with language-specific key
    audioCache.set(cacheKey, audioDataUri);

    return {
      audio: audioDataUri,
    };
  }
);

export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}
