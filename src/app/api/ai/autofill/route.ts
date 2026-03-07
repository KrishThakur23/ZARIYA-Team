import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';

const region = process.env.REGION || 'us-east-1';
const credentials = {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!
};
const bedrock = new BedrockRuntimeClient({ region: 'us-east-1', credentials }); // Requirements explicitly set us-east-1 for Bedrock
const s3 = new S3Client({ region, credentials });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { imageKey, language } = body;

        if (!imageKey) {
            return NextResponse.json({ error: 'Missing imageKey' }, { status: 400 });
        }

        const bucket = process.env.S3_BUCKET!;

        console.log(`[Autofill] Fetching ${imageKey} from S3 bucket ${bucket}`);
        const getObjectParams = {
            Bucket: bucket,
            Key: imageKey,
        };
        const s3Response = await s3.send(new GetObjectCommand(getObjectParams));

        if (!s3Response.Body) {
            throw new Error("S3 Body is empty");
        }

        // Convert Node.js Readable stream into Buffer
        const streamToBuffer = async (stream: any) => {
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
            }
            return Buffer.concat(chunks);
        };

        const buffer = await streamToBuffer(s3Response.Body);

        // Pre-process and optimize image size heavily to save LLM tokens and increase speed
        console.log(`[Autofill] Downloaded raw buffer length:`, buffer.length);
        const resizedBuffer = await sharp(buffer)
            .resize(512)
            .jpeg({ quality: 80 })
            .toBuffer();
        console.log(`[Autofill] Resized image size:`, resizedBuffer.length);

        const detectedType = await fileTypeFromBuffer(resizedBuffer);
        let imageFormat: "jpeg" | "png" | "gif" | "webp" = "jpeg";

        if (detectedType) {
            if (detectedType.mime === "image/png") {
                imageFormat = "png";
            }
            if (detectedType.mime === "image/jpeg") {
                imageFormat = "jpeg";
            }
            if (detectedType.mime === "image/gif") {
                imageFormat = "gif";
            }
            if (detectedType.mime === "image/webp") {
                imageFormat = "webp";
            }
        }

        console.log("Detected MIME from buffer:", detectedType?.mime);
        console.log("Using Bedrock format:", imageFormat);
        console.log(`[Autofill] Calling Bedrock Amazon Nova Pro for image analysis via ConverseCommand`);

        const promptText = `
You are a strict product recognition AI.

Carefully analyze the uploaded image and identify the actual physical object shown.

Rules:
- Identify the literal object (example: ballpoint pen, plastic bottle, leather shoe, brass lamp).
- Do NOT assume it is handcrafted unless clearly visible.
- Do NOT use generic phrases like "Handcrafted Indian Product".
- Be specific and practical.
- Title must be short (max 6 words).
- Description must be 2–3 simple factual sentences.
- Infer realistic material.
- Suggest realistic Indian market price in INR.
- Estimate approximate dimensions visually.

Return ONLY valid JSON.
Do NOT include markdown.
Do NOT include explanations.
Do NOT include extra text.

Strictly follow this schema:

{
  "title": "",
  "description": "",
  "category": "",
  "tags": [],
  "suggested_price": 0,
  "estimated_dimensions": "",
  "material_guess": "",
  "confidence_score": 0.0
}
`;

        const command = new ConverseCommand({
            modelId: 'us.amazon.nova-pro-v1:0',
            inferenceConfig: {
                maxTokens: 1000
            },
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            image: {
                                format: imageFormat,
                                source: {
                                    bytes: resizedBuffer
                                }
                            }
                        },
                        {
                            text: promptText
                        }
                    ]
                }
            ]
        });

        const bedrockResponse = await bedrock.send(command);

        let aiText = bedrockResponse.output?.message?.content?.[0]?.text || "";
        console.log(`[Autofill] Raw Bedrock response:`, aiText);

        console.log("========== RAW NOVA OUTPUT ==========");
        console.log(aiText);
        console.log("=====================================");

        // clean markdown from JSON
        let jsonStr = aiText;
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        } else {
            jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
        }

        let data;
        try {
            data = JSON.parse(jsonStr);
        } catch (parseError: any) {
            console.error("[Autofill] JSON parse failed, triggering fallback:", parseError);
            throw new Error("Invalid JSON format from AI"); // triggers catch fallback
        }

        // Clamp price
        let price = Number(data.suggested_price);
        if (isNaN(price)) price = 500;
        if (price < 100) price = 100;
        if (price > 50000) price = 50000;
        data.suggested_price = price;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[Autofill] Error:", error);

        // safe fallback JSON per requirements
        const fallbackData = {
            title: "Handcrafted Indian Product",
            description: "A beautiful handcrafted product with rich cultural heritage.",
            category: "other",
            tags: ["handcrafted", "artisan"],
            suggested_price: 500,
            estimated_dimensions: "10x10",
            material_guess: "mixed",
            confidence_score: 0.1
        };

        return NextResponse.json(fallbackData, { status: 200 }); // requirement: return safe fallback JSON instead of 500
    }
}
