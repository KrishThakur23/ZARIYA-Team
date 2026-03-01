import { config } from 'dotenv';
config({ path: '.env.local' });

import { DynamoDBClient, DescribeTableCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
});

async function checkTable() {
    try {
        const command = new DescribeTableCommand({
            TableName: process.env.DDB_TABLE
        });

        const response = await client.send(command);
        console.log("Table Description:", JSON.stringify(response.Table, null, 2));
    } catch (err) {
        console.error("Error describing table:", err);
    }
}

checkTable();
