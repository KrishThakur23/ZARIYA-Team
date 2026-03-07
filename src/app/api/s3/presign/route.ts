export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest, NextResponse } from 'next/server';

let _s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!_s3Client) {
    const region = process.env.REGION;
    const accessKeyId = process.env.ACCESS_KEY_ID;
    const secretAccessKey = process.env.SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey || !region) {
      throw new Error("AWS environment variables not configured properly.");
    }

    _s3Client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return _s3Client;
}

export async function POST(req: NextRequest) {
  try {
    console.log("Route hit: /api/s3/presign");
    console.log("AWS Region:", process.env.REGION);

    const { filename, contentType } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const bucketName = process.env.S3_BUCKET;
    if (!bucketName) {
      throw new Error("S3_BUCKET environment variable not configured properly.");
    }

    console.log("S3 Bucket Name:", bucketName);

    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const isAudio = contentType && contentType.startsWith('audio/');
    const objectKey = isAudio
      ? `audio/${Date.now()}-${sanitizedFilename}`
      : `products/${Date.now()}-${sanitizedFilename}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: contentType || 'application/octet-stream',
    });

    console.log("Calling AWS service: S3 (generate presigned URL)");
    const uploadUrl = await getSignedUrl(getS3Client(), command, { expiresIn: 3600 });
    console.log("AWS call success. Generated URL length:", uploadUrl.length);

    return NextResponse.json({ uploadUrl, objectKey });
  } catch (error: any) {
    console.error("AWS error:", error);
    if (error.name === 'AccessDeniedException') {
      console.error("Check IAM permissions for the following actions: s3:PutObject");
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
