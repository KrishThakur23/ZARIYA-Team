export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { PollyClient, SynthesizeSpeechCommand, OutputFormat, Engine, VoiceId } from '@aws-sdk/client-polly';
import { NextRequest, NextResponse } from 'next/server';

let _pollyClient: PollyClient | null = null;

function getPollyClient(): PollyClient {
    if (!_pollyClient) {
        const region = process.env.REGION;
        const accessKeyId = process.env.ACCESS_KEY_ID;
        const secretAccessKey = process.env.SECRET_ACCESS_KEY;

        if (!accessKeyId || !secretAccessKey || !region) {
            throw new Error("AWS environment variables not configured properly.");
        }

        _pollyClient = new PollyClient({
            region,
            credentials: { accessKeyId, secretAccessKey },
        });
    }
    return _pollyClient;
}

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

        const response = await getPollyClient().send(command);

        if (response.AudioStream) {
            const byteArray = await response.AudioStream.transformToByteArray();
            const base64 = Buffer.from(byteArray).toString('base64');
            return NextResponse.json({ audio: `data:audio/mpeg;base64,${base64}` });
        }

        throw new Error('No audio stream returned');
    } catch (error: any) {
        console.error("API error:", error);
        return NextResponse.json({ audio: null });
    }
}
