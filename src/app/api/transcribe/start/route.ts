export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { TranscribeClient, StartTranscriptionJobCommand } from '@aws-sdk/client-transcribe';
import { NextResponse } from 'next/server';

let _transcribeClient: TranscribeClient | null = null;

function getTranscribeClient(): TranscribeClient {
    if (!_transcribeClient) {
        const region = process.env.REGION;
        const accessKeyId = process.env.ACCESS_KEY_ID;
        const secretAccessKey = process.env.SECRET_ACCESS_KEY;

        if (!accessKeyId || !secretAccessKey || !region) {
            throw new Error("AWS environment variables not configured properly.");
        }

        _transcribeClient = new TranscribeClient({
            region,
            credentials: { accessKeyId, secretAccessKey },
        });
    }
    return _transcribeClient;
}

export async function POST(req: Request) {
    try {
        console.log("Route hit: /api/transcribe/start");
        console.log("AWS Region:", process.env.REGION);
        const { objectKey, languageCode } = await req.json();

        if (!objectKey) {
            return NextResponse.json({ error: 'objectKey is required' }, { status: 400 });
        }

        const bucketName = process.env.S3_BUCKET;
        if (!bucketName) {
            throw new Error("S3_BUCKET environment variable not configured properly.");
        }
        const jobName = `zariya-transcribe-${Date.now()}`;
        const mediaUri = `s3://${bucketName}/${objectKey}`;

        const command = new StartTranscriptionJobCommand({
            TranscriptionJobName: jobName,
            LanguageCode: languageCode || 'en-US',
            MediaFormat: 'webm',
            Media: {
                MediaFileUri: mediaUri,
            },
            OutputBucketName: bucketName,
        });

        console.log("Calling AWS service: Transcribe (StartTranscriptionJob). Job:", jobName);
        const response = await getTranscribeClient().send(command);
        console.log("AWS call success");

        return NextResponse.json({
            jobName: response.TranscriptionJob?.TranscriptionJobName,
            status: response.TranscriptionJob?.TranscriptionJobStatus,
        });
    } catch (error: any) {
        console.error("AWS error:", error);
        if (error.name === 'AccessDeniedException') {
            console.error("Check IAM permissions for the following actions: transcribe:StartTranscriptionJob");
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
