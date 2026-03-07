import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey || !region) {
    console.error("AWS environment variables not configured properly.");
}

let client: DynamoDBClient | null = null;
let docClient: DynamoDBDocumentClient | null = null;

// Initialize DynamoDB clients only if AWS credentials are available
if (accessKeyId && secretAccessKey && region) {
    client = new DynamoDBClient({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
    docClient = DynamoDBDocumentClient.from(client);
}

const ARTISANS_TABLE = process.env.DDB_ARTISANS_TABLE || 'Artisans';

export interface ArtisanProfile {
    artisanId: string;
    name: string;
    village: string;
    craftType: string;
    bio: string;
    userId: string;
    createdAt: string;
}

export async function POST(req: NextRequest) {
    try {
        const { name, village, craftType, bio, userId } = await req.json();

        if (!name || !village || !craftType || !bio || !userId) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const artisanProfile: ArtisanProfile = {
            artisanId: crypto.randomUUID(),
            name,
            village,
            craftType,
            bio,
            userId,
            createdAt: new Date().toISOString()
        };

        // If DynamoDB is configured, save to database
        if (docClient) {
            const command = new PutCommand({
                TableName: ARTISANS_TABLE,
                Item: artisanProfile,
            });

            await docClient.send(command);
            console.log("Artisan profile saved to DynamoDB");
        } else {
            console.log("DynamoDB not configured, artisan profile created locally");
        }

        return NextResponse.json({
            success: true,
            artisan: artisanProfile
        });

    } catch (error: any) {
        console.error("Error creating artisan profile:", error);
        return NextResponse.json({
            error: "Failed to create artisan profile",
            details: error.message
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const artisanId = searchParams.get('id');

        if (artisanId) {
            // Get specific artisan
            if (!docClient) {
                return NextResponse.json({ error: "Database not configured" }, { status: 500 });
            }

            const command = new GetCommand({
                TableName: ARTISANS_TABLE,
                Key: { artisanId },
            });

            const response = await docClient.send(command);

            if (!response.Item) {
                return NextResponse.json({ error: "Artisan not found" }, { status: 404 });
            }

            return NextResponse.json({ artisan: response.Item });
        } else {
            // List all artisans
            if (!docClient) {
                return NextResponse.json({ artisans: [] });
            }

            const command = new ScanCommand({
                TableName: ARTISANS_TABLE,
                Limit: 20,
            });

            const response = await docClient.send(command);
            return NextResponse.json({ artisans: response.Items || [] });
        }

    } catch (error: any) {
        console.error("Error fetching artisan(s):", error);
        return NextResponse.json({
            error: "Failed to fetch artisan data",
            details: error.message
        }, { status: 500 });
    }
}