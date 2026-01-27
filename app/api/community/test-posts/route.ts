// app/api/community/test-posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get all posts with IDs
    const posts = await Community.find({}, '_id title').limit(10).lean();
    
    return NextResponse.json({
      success: true,
      posts: posts.map(p => ({
        _id: p._id.toString(),
        _id_type: typeof p._id,
        _id_raw: p._id,
        title: p.title
      }))
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}