import { NextRequest, NextResponse } from 'next/server';
import { saveProduct, listProducts } from '@/lib/db';

export async function GET() {
    try {
        console.log("Route hit: /api/products (GET)");
        console.log("AWS Region:", process.env.AWS_REGION);
        const products = await listProducts();

        const mappedProducts = products.map((item: any) => {
            if (item.imageKey) {
                return {
                    ...item,
                    originalImage: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.imageKey}`
                };
            }
            return item;
        });

        // Sort by newest first
        mappedProducts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return NextResponse.json(mappedProducts);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        console.log("Route hit: /api/products (POST)");
        console.log("AWS Region:", process.env.AWS_REGION);
        const productData = await req.json();

        if (!productData || !productData.id) {
            return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
        }

        await saveProduct(productData);

        return NextResponse.json({ success: true, product: productData });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
