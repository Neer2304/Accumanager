// app/api/projects/updates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ProjectUpdate from '@/models/ProjectUpdate';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/projects/updates - Starting...');
    
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      
      await connectToDatabase();

      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '20');

      // Get updates for user's projects
      const updates = await ProjectUpdate.find({ userId: decoded.userId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();

      console.log(`✅ Found ${updates.length} project updates for user ${decoded.userId}`);
      return NextResponse.json({ updates });

    } catch (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('❌ Get project updates error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}