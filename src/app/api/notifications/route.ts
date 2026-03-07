import { NextRequest, NextResponse } from 'next/server';
import { listUserNotifications, saveNotification, Notification } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        const notifications = await listUserNotifications(userId);
        return NextResponse.json({ notifications });
    } catch (error: any) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, title, message } = body;

        if (!userId || !title || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const notification: Notification = {
            userId,
            notificationId: crypto.randomUUID(),
            title,
            message,
            isRead: false,
            createdAt: new Date().toISOString()
        };

        await saveNotification(notification);
        return NextResponse.json({ success: true, notification });
    } catch (error: any) {
        console.error("Error saving notification:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
