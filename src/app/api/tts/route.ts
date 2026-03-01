import { PollyClient, SynthesizeSpeechCommand, OutputFormat, Engine, VoiceId } from '@aws-sdk/client-polly';
import { NextRequest, NextResponse } from 'next/server';

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey || !region) {
    throw new Error("AWS environment variables not configured properly.");
}

const client = new PollyClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export async function POST(req: NextRequest) {
    try {
        const { text, language } = await req.json();

        if (!text || !language) {
            return NextResponse.json({ error: 'Text and language are required' }, { status: 400 });
        }

        const command = new SynthesizeSpeechCommand({
            OutputFormat: "mp3",
            Text: text,
            VoiceId: "Aditi",
            Engine: "standard",
        });

        const response = await client.send(command);

        if (response.AudioStream) {
            // Return the raw audio buffer directly to be read via response.blob() on the client
            const webStream = response.AudioStream.transformToWebStream();
            return new NextResponse(webStream, {
                headers: {
                    'Content-Type': 'audio/mpeg',
                },
            });
        }

        throw new Error('No audio stream returned');
    } catch (error: any) {
        console.error("TTS error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
