import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const region = process.env.REGION!;
const accessKeyId = process.env.ACCESS_KEY_ID!;
const secretAccessKey = process.env.SECRET_ACCESS_KEY!;

const client = new BedrockRuntimeClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
});

export async function POST(req: NextRequest) {
    try {
        const { messages, language, generationMode } = await req.json();

        let systemText = `You are a multilingual voice assistant guiding Indian artisans to list handcrafted products. You MUST respond ONLY in ${language}. If you respond in English when language is not English, it is incorrect. `;

        if (generationMode) {
            systemText += `Generate final polished product story based on the provided text. Do NOT ask follow-up questions. Return only final story text.`;
        } else {
            systemText += `Keep answers short and ask one question at a time.`;
        }

        const payload = {
            system: [
                {
                    text: systemText
                }
            ],
            messages: messages.map((m: any) => ({
                role: m.role,
                content: [{ text: m.content }]
            })),
            inferenceConfig: {
                maxTokens: 800,
                temperature: 0.7
            }
        };

        const command = new InvokeModelCommand({
            modelId: 'us.amazon.nova-lite-v1:0',
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify(payload),
        });

        const response = await client.send(command);
        const decoded = new TextDecoder().decode(response.body);
        const result = JSON.parse(decoded);

        const reply = result.output.message.content[0].text;

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("Titan error:", error.name, error.message);
        return NextResponse.json({ error: "Chat failed", details: error.message }, { status: 500 });
    }
}
