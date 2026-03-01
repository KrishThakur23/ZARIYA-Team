import { config } from 'dotenv';
config({ path: '.env.local' });

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const docClient = DynamoDBDocumentClient.from(client);

async function testSave() {
    try {
        const product = {
            id: `server-test-${Date.now()}`,
            productId: `server-test-${Date.now()}`,
            artisanId: 'user-id-placeholder',
            title: 'jsc kjddh nd',
            category: 'ceramics',
            dimensions: '10*34',
            price: 45,
            createdAt: new Date().toISOString()
        };

        console.log("Attempting to save product:", product);

        const command = new PutCommand({
            TableName: process.env.DDB_TABLE,
            Item: product,
        });

        await docClient.send(command);
        console.log("Product saved successfully locally.");
    } catch (err: any) {
        console.error("Local save failed:", err.name, err.message);
    }
}

testSave();
