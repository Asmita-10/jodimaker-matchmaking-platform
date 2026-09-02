import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Message from '@/models/Message';

// GET /api/messages?user1=X&user2=Y
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user1 = searchParams.get('user1')?.toLowerCase().trim();
    const user2 = searchParams.get('user2')?.toLowerCase().trim();

    if (!user1 || !user2) {
      return NextResponse.json({ error: 'Both user1 and user2 emails are required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured', fallback: true }, { status: 503 });
    }

    const messages = await Message.find({
      $or: [
        { senderEmail: user1, receiverEmail: user2 },
        { senderEmail: user2, receiverEmail: user1 }
      ]
    }).sort({ timestamp: 1 }).lean();

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    console.error('Messages GET error:', error);
    return NextResponse.json({ error: 'Internal server error', fallback: true }, { status: 500 });
  }
}

// POST /api/messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderEmail, receiverEmail, senderName, text } = body;

    if (!senderEmail || !receiverEmail || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured', fallback: true }, { status: 503 });
    }

    const newMessage = await Message.create({
      senderEmail: senderEmail.toLowerCase().trim(),
      receiverEmail: receiverEmail.toLowerCase().trim(),
      senderName,
      text,
      timestamp: new Date()
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error('Messages POST error:', error);
    return NextResponse.json({ error: 'Internal server error', fallback: true }, { status: 500 });
  }
}
