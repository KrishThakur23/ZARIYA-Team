export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

let docClient: DynamoDBDocumentClient | null = null;

function getDocClient(): DynamoDBDocumentClient | null {
    if (!docClient) {
        const region = process.env.REGION;
        const accessKeyId = process.env.ACCESS_KEY_ID;
        const secretAccessKey = process.env.SECRET_ACCESS_KEY;

        if (!accessKeyId || !secretAccessKey || !region) {
            console.error("AWS environment variables not configured properly.");
            return null;
        }

        const client = new DynamoDBClient({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
        docClient = DynamoDBDocumentClient.from(client);
    }
    return docClient;
}

function getArtisansTableName(): string {
    return process.env.DDB_ARTISANS_TABLE || 'Artisans';
}

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
        const client = getDocClient();
        if (client) {
            const command = new PutCommand({
                TableName: getArtisansTableName(),
                Item: artisanProfile,
            });

            await client.send(command);
            console.log("Artisan profile saved to DynamoDB");
        } else {
            console.log("DynamoDB not configured, artisan profile created locally");
        }

        return NextResponse.json({
            success: true,
            artisan: artisanProfile
        });

    } catch (error: any) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const artisanId = searchParams.get('id');

        const client = getDocClient();
        if (artisanId) {
            // Get specific artisan
            if (!client) {
                return NextResponse.json({ error: "Database not configured" }, { status: 500 });
            }

            const command = new GetCommand({
                TableName: getArtisansTableName(),
                Key: { artisanId },
            });

            const response = await client.send(command);

            if (!response.Item) {
                return NextResponse.json({ error: "Artisan not found" }, { status: 404 });
            }

            return NextResponse.json({ artisan: response.Item });
        } else {
            // List all artisans
            if (!client) {
                return NextResponse.json({ artisans: [] });
            }

            const command = new ScanCommand({
                TableName: getArtisansTableName(),
                Limit: 20,
            });

            const response = await client.send(command);
            return NextResponse.json({ artisans: response.Items || [] });
        }

    } catch (error: any) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}