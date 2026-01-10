// app/api/notes/route.ts - UPDATED WITH USAGE TRACKING
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Note from '@/models/Note';
import { verifyToken } from '@/lib/jwt';
import { PaymentService } from '@/services/paymentService';

// Helper function to verify auth
async function verifyAuth(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const authHeader = request.headers.get('authorization');
  
  const token = authHeader?.replace('Bearer ', '') || authToken;
  
  if (!token) {
    throw new Error('Unauthorized');
  }
  
  const decoded = verifyToken(token);
  await connectToDatabase();
  
  // Check subscription status
  const subscription = await PaymentService.checkSubscription(decoded.userId);
  if (!subscription.isActive) {
    throw new Error('Your subscription has expired. Please upgrade to continue using the service.');
  }
  
  return { userId: decoded.userId, subscription };
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await verifyAuth(request);
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query: any = { userId };
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const notes = await Note.find(query)
      .sort({ isPinned: -1, updatedAt: -1 })
      .lean();

    return NextResponse.json(notes);

  } catch (error: any) {
    console.error('Get notes error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (error.message.includes('subscription')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, subscription } = await verifyAuth(request);
    
    // Check storage usage before creating note
    await PaymentService.checkUsageLimit(userId, 'storageMB', 1); // Each note uses ~1MB
    
    const noteData = await request.json();

    // Validate required fields
    if (!noteData.title || !noteData.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const note = new Note({
      ...noteData,
      userId
    });

    await note.save();
    
    // Update storage usage
    await PaymentService.updateUsage(userId, 'storageMB', 1);

    return NextResponse.json(note, { status: 201 });

  } catch (error: any) {
    console.error('Create note error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (error.message.includes('limit') || error.message.includes('subscription')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}