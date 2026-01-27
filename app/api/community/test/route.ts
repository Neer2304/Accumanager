// app/api/community/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get all posts with IDs
    const posts = await Community.find({}).select('_id title').limit(10).lean();
    
    return NextResponse.json({
      success: true,
      message: `Found ${posts.length} posts`,
      posts: posts.map(p => ({
        id: p._id,
        title: p.title,
        idString: p._id.toString()
      }))
    });
    
  } catch (error: any) {
    console.error('Test route error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}