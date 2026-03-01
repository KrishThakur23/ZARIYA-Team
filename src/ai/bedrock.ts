import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey || !region) {
    throw new Error("AWS environment variables not configured properly.");
}

if (region !== 'us-east-1') {
    throw new Error("Bedrock Claude 3 Haiku requires AWS_REGION to be us-east-1");
}

const client = new BedrockRuntimeClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export interface GenerateProductDetailsInput {
    title: string;
    category: string;
    dimensions: string;
    price: number;
    story?: string;
}

export interface GenerateProductDetailsOutput {
    description: string;
    suggestedPrice: number;
    craftStory: string;
}

export async function generateProductDetails(
    input: GenerateProductDetailsInput
): Promise<GenerateProductDetailsOutput> {
    const prompt = `You are an expert in crafting compelling product listings for artisan goods.

Based on the following product details, generate a detailed product description, a suggested price in USD (as a number), and a short craft story.
Return your response ONLY as a valid JSON object with the following keys:
"description" (string), "suggestedPrice" (number), and "craftStory" (string).

Title: ${input.title}
Category: ${input.category}
Dimensions: ${input.dimensions}
Price: ${input.price}
Story: ${input.story || 'None provided'}
`;

    const payload = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    };

    const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(payload),
    });

    try {
        console.log("Calling AWS service: Bedrock");
        const response = await client.send(command);
        console.log("AWS call success");
        const resultString = new TextDecoder().decode(response.body);
        const resultObj = JSON.parse(resultString);

        // Claude 3 Messages API response format
        const textCompletion = resultObj.content[0].text;

        // Attempt to parse JSON from the text
        const jsonMatch = textCompletion.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                description: parsed.description || input.title,
                suggestedPrice: Number(parsed.suggestedPrice) || input.price,
                craftStory: parsed.craftStory || input.story || 'A beautifully crafted item.',
            };
        }

        throw new Error('Failed to parse Claude output into JSON');
    } catch (error: any) {
        console.error("AWS error:", error);
        if (error.name === 'AccessDeniedException') {
            console.error("Check IAM permissions for the following actions: bedrock:InvokeModel");
        }
        throw new Error('Could not generate product details. Internal server error.');
    }
}
