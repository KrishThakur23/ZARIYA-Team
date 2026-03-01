import { NextResponse } from 'next/server';
import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export async function GET() {
    try {
        console.log("Route hit: /api/health");
        console.log("AWS Region:", process.env.AWS_REGION);

        const region = process.env.AWS_REGION;
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

        if (!accessKeyId || !secretAccessKey || !region) {
            return NextResponse.json({ error: "AWS environment variables not configured properly." }, { status: 500 });
        }

        const credentials = { accessKeyId, secretAccessKey };

        const status: Record<string, string> = {
            s3: "checking",
            dynamodb: "checking",
            bedrock: "checking"
        };

        let hasError = false;

        // Check S3
        try {
            const s3Client = new S3Client({ region, credentials });
            const bucketName = process.env.S3_BUCKET;
            if (!bucketName) throw new Error("S3_BUCKET not defined");
            await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
            status.s3 = "ok";
        } catch (error: any) {
            status.s3 = `failed: ${error.message}`;
            hasError = true;
        }

        // Check DynamoDB
        try {
            const ddbClient = new DynamoDBClient({ region, credentials });
            const tableName = process.env.DDB_TABLE;
            if (!tableName) throw new Error("DDB_TABLE not defined");
            await ddbClient.send(new DescribeTableCommand({ TableName: tableName }));
            status.dynamodb = "ok";
        } catch (error: any) {
            status.dynamodb = `failed: ${error.message}`;
            hasError = true;
        }

        // Check Bedrock
        try {
            if (region !== 'us-east-1') {
                throw new Error("Bedrock requires us-east-1");
            }
            const bedrockClient = new BedrockRuntimeClient({ region, credentials });
            const payload = {
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: 10,
                messages: [{ role: 'user', content: 'Say "ok"' }],
            };
            const command = new InvokeModelCommand({
                modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
                contentType: 'application/json',
                accept: 'application/json',
                body: JSON.stringify(payload),
            });
            await bedrockClient.send(command);
            status.bedrock = "ok";
        } catch (error: any) {
            status.bedrock = `failed: ${error.message}`;
            hasError = true;
        }

        return NextResponse.json(status, { status: hasError ? 500 : 200 });
    } catch (error) {
        console.error("Health check error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
