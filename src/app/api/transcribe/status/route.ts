import { TranscribeClient, GetTranscriptionJobCommand } from '@aws-sdk/client-transcribe';
import { NextResponse } from 'next/server';

const region = process.env.REGION;
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey || !region) {
    throw new Error("AWS environment variables not configured properly.");
}

const client = new TranscribeClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export async function GET(req: Request) {
    try {
        console.log("Route hit: /api/transcribe/status");
        console.log("AWS Region:", process.env.REGION);
        const { searchParams } = new URL(req.url);
        const jobName = searchParams.get('jobName');

        if (!jobName) {
            return NextResponse.json({ error: 'jobName is required' }, { status: 400 });
        }

        const command = new GetTranscriptionJobCommand({
            TranscriptionJobName: jobName,
        });

        console.log("Calling AWS service: Transcribe (GetTranscriptionJob)");
        const response = await client.send(command);
        console.log("AWS call success");
        const status = response.TranscriptionJob?.TranscriptionJobStatus;

        let transcriptText = '';

        if (status === 'COMPLETED') {
            const transcriptFileUri = response.TranscriptionJob?.Transcript?.TranscriptFileUri;
            if (transcriptFileUri) {
                console.log("Fetching transcript from S3 URI");
                const transcriptRes = await fetch(transcriptFileUri);
                const transcriptData = await transcriptRes.json();
                transcriptText = transcriptData.results.transcripts[0]?.transcript || '';
                console.log("Transcript fetched. Length:", transcriptText.length);
            }
        }

        return NextResponse.json({
            status,
            transcript: transcriptText,
        });
    } catch (error: any) {
        console.error("AWS error:", error);
        if (error.name === 'AccessDeniedException') {
            console.error("Check IAM permissions for the following actions: transcribe:GetTranscriptionJob");
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
