import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey || !region) {
    throw new Error("AWS environment variables not configured properly.");
}

const client = new DynamoDBClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DDB_TABLE;
if (!TABLE_NAME) {
    throw new Error("DDB_TABLE environment variable not configured properly.");
}

// Define the product type here (mirroring frontend expectations)
export interface Product {
    id: string; // Internal frontend ID
    productId?: string; // Partition key for DynamoDB
    artisanId?: string;
    title: string;
    imageKey?: string;
    originalImage?: string; // S3 presigned URL or public URL
    story?: string;
    price: number;
    suggestedPrice?: number;
    category: string;
    tags?: string[];
    createdAt: string;
    status?: string;
    dimensions?: string;
    [key: string]: any;
}

export async function saveProduct(product: Product): Promise<void> {
    // Ensure productId exists for mapping to DynamoDB table
    const mappedProduct = {
        ...product,
        productId: product.id,
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: mappedProduct,
    });

    try {
        console.log("Calling AWS service: DynamoDB (PutItem)");
        await docClient.send(command);
        console.log("AWS call success");
    } catch (error: any) {
        console.error("AWS error:", error);
        if (error.name === 'AccessDeniedException') {
            console.error("Check IAM permissions for the following actions: dynamodb:PutItem");
        }
        throw new Error('Could not save product: ' + error.message);
    }
}

export async function getProduct(productId: string): Promise<Product | null> {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: {
            productId,
        },
    });

    try {
        console.log("Calling AWS service: DynamoDB (GetItem)");
        const response = await docClient.send(command);
        console.log("AWS call success");
        return (response.Item as Product) || null;
    } catch (error: any) {
        console.error("AWS error:", error);
        if (error.name === 'AccessDeniedException') {
            console.error("Check IAM permissions for the following actions: dynamodb:GetItem");
        }
        throw new Error('Could not fetch product');
    }
}

export async function listProducts(): Promise<Product[]> {
    const command = new ScanCommand({
        TableName: TABLE_NAME,
        Limit: 20,
        ProjectionExpression: "productId, title, price, originalImage, category, createdAt, imageKey, #s",
        ExpressionAttributeNames: {
            "#s": "status"
        }
    });

    try {
        console.log("Calling AWS service: DynamoDB (Scan)");
        const response = await docClient.send(command);
        console.log("AWS call success");
        return (response.Items as Product[]) || [];
    } catch (error: any) {
        console.error("AWS error:", error);
        if (error.name === 'AccessDeniedException') {
            console.error("Check IAM permissions for the following actions: dynamodb:Scan");
        }
        throw new Error('Could not list products');
    }
}
