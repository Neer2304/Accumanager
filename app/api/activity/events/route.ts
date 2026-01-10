// app/api/activity/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ActivityEvent from '@/models/ActivityEvent';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/activity/events - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '20');

      // Get recent activity events
      const events = await ActivityEvent.find({ userId: decoded.userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      console.log(`✅ Found ${events.length} activity events`);
      
      return NextResponse.json({ events });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get activity events error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}