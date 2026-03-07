import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

// Lazy-initialized DynamoDB client to prevent module-load crashes in Amplify
let _docClient: DynamoDBDocumentClient | null = null;

function getDocClient(): DynamoDBDocumentClient {
    if (!_docClient) {
        const region = process.env.REGION;
        const accessKeyId = process.env.ACCESS_KEY_ID;
        const secretAccessKey = process.env.SECRET_ACCESS_KEY;

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

        _docClient = DynamoDBDocumentClient.from(client);
    }
    return _docClient;
}

function getTableName(): string {
    const name = process.env.DDB_TABLE;
    if (!name) throw new Error("DDB_TABLE environment variable not configured.");
    return name;
}

const FAVORITES_TABLE = process.env.DDB_FAVORITES_TABLE || 'Favorites';
const NOTIFICATIONS_TABLE = process.env.DDB_NOTIFICATIONS_TABLE || 'Notifications';

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
        TableName: getTableName(),
        Item: mappedProduct,
    });

    try {
        console.log("Calling AWS service: DynamoDB (PutItem)");
        await getDocClient().send(command);
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
        TableName: getTableName(),
        Key: {
            productId,
        },
    });

    try {
        console.log("Calling AWS service: DynamoDB (GetItem)");
        const response = await getDocClient().send(command);
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
        TableName: getTableName(),
        Limit: 20,
        ProjectionExpression: "productId, title, price, originalImage, category, createdAt, imageKey, #s, artisan, #loc, description, story",
        ExpressionAttributeNames: {
            "#s": "status",
            "#loc": "location"
        }
    });

    try {
        console.log("Calling AWS service: DynamoDB (Scan)");
        const response = await getDocClient().send(command);
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

// Favorites Functions
export interface Favorite {
    userId: string;
    productId: string;
    addedAt: string;
    [key: string]: any;
}

export async function saveFavorite(favorite: Favorite): Promise<void> {
    const command = new PutCommand({
        TableName: FAVORITES_TABLE,
        Item: favorite,
    });
    try {
        await getDocClient().send(command);
    } catch (error: any) {
        console.error("AWS error:", error);
        throw new Error('Could not save favorite');
    }
}

export async function removeFavorite(userId: string, productId: string): Promise<void> {
    const command = new DeleteCommand({
        TableName: FAVORITES_TABLE,
        Key: { userId, productId },
    });
    try {
        await getDocClient().send(command);
    } catch (error: any) {
        console.error("AWS error:", error);
        throw new Error('Could not remove favorite');
    }
}

export async function listUserFavorites(userId: string): Promise<Favorite[]> {
    const command = new QueryCommand({
        TableName: FAVORITES_TABLE,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId,
        },
    });
    try {
        const response = await getDocClient().send(command);
        return (response.Items as Favorite[]) || [];
    } catch (error: any) {
        console.error("AWS error:", error);
        throw new Error('Could not list favorites');
    }
}

// Notification Functions
export interface Notification {
    userId: string;
    notificationId: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export async function saveNotification(notification: Notification): Promise<void> {
    const command = new PutCommand({
        TableName: NOTIFICATIONS_TABLE,
        Item: notification,
    });
    try {
        await getDocClient().send(command);
    } catch (error: any) {
        console.error("AWS error:", error);
        throw new Error('Could not save notification');
    }
}

export async function listUserNotifications(userId: string): Promise<Notification[]> {
    const command = new QueryCommand({
        TableName: NOTIFICATIONS_TABLE,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId,
        },
    });
    try {
        const response = await getDocClient().send(command);
        return (response.Items as Notification[]) || [];
    } catch (error: any) {
        console.error("AWS error:", error);
        throw new Error('Could not list notifications');
    }
}
