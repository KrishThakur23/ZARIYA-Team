import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import 'dotenv/config';
import fs from 'fs';

const region = process.env.AWS_REGION!;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

const client = new BedrockRuntimeClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
});

async function testTitan() {
    const payload = {
        inputText: `Hello, this is a test.`
    };

    const command = new InvokeModelCommand({
        modelId: 'amazon.titan-text-premier-v1:0',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(payload),
    });

    try {
        const response = await client.send(command);
        const decoded = new TextDecoder().decode(response.body);
        console.log("SUCCESS:", JSON.parse(decoded));
    } catch (e: any) {
        fs.writeFileSync('error2.json', JSON.stringify({ name: e.name, message: e.message }, null, 2));
    }
}

testTitan();
