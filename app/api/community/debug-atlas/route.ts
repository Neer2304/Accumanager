// app/api/community/debug-atlas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Test the specific post ID
    const testId = '6978e4d20d3c5e18e81f191b';
    
    // Import dynamically to avoid circular dependencies
    const Community = (await import('@/models/Community')).default;
    
    const analysis = {
      testId,
      length: testId.length,
      isValidObjectId: mongoose.Types.ObjectId.isValid(testId),
      // Try to create ObjectId
      canCreateObjectId: (() => {
        try {
          new mongoose.Types.ObjectId(testId);
          return true;
        } catch {
          return false;
        }
      })(),
      // Check for hidden characters
      charCodes: testId.split('').map((char, i) => ({
        index: i,
        char,
        charCode: char.charCodeAt(0),
        isHex: /^[0-9a-f]$/i.test(char)
      })),
      // Try to find post
      findResult: await Community.findById(testId).select('_id title').lean(),
      // Count all posts
      totalPosts: await Community.countDocuments({}),
      // Get all posts
      allPosts: await Community.find({}).select('_id title').lean().then(posts => 
        posts.map(p => ({
          id: p._id.toString(),
          title: p.title,
          idLength: p._id.toString().length,
          match: p._id.toString() === testId
        }))
      )
    };
    
    return NextResponse.json({
      success: true,
      message: 'Atlas Debug Analysis',
      analysis
    });
    
  } catch (error: any) {
    console.error('Atlas debug error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}