import { NextRequest, NextResponse } from 'next/server';
import { listUserFavorites, saveFavorite, removeFavorite, Favorite } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        const favorites = await listUserFavorites(userId);
        return NextResponse.json({ favorites });
    } catch (error: any) {
        console.error("Error fetching favorites:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, productId } = body;

        if (!userId || !productId) {
            return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });
        }

        const favorite: Favorite = {
            ...body,
            addedAt: new Date().toISOString()
        };

        await saveFavorite(favorite);
        return NextResponse.json({ success: true, favorite });
    } catch (error: any) {
        console.error("Error saving favorite:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const productId = searchParams.get('productId');

        if (!userId || !productId) {
            return NextResponse.json({ error: "Missing userId or productId parameter" }, { status: 400 });
        }

        await removeFavorite(userId, productId);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting favorite:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
