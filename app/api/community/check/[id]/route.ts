// app/api/community/check/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { id: postId } = params;
    console.log('Check API called with ID:', postId);
    
    // Try different ways to find the post
    const results = {
      isValidObjectId: mongoose.Types.ObjectId.isValid(postId),
      findById: null,
      findOneById: null,
      findOneByStringId: null,
      findOneRaw: null
    };
    
    // Method 1: findById with ObjectId
    if (results.isValidObjectId) {
      const postObjectId = new mongoose.Types.ObjectId(postId);
      results.findById = await Community.findById(postObjectId).lean();
    }
    
    // Method 2: findOne with _id as ObjectId
    if (results.isValidObjectId) {
      const postObjectId = new mongoose.Types.ObjectId(postId);
      results.findOneById = await Community.findOne({ _id: postObjectId }).lean();
    }
    
    // Method 3: findOne with _id as string
    results.findOneByStringId = await Community.findOne({ _id: postId }).lean();
    
    // Method 4: Raw find to see all
    const allPosts = await Community.find({}).select('_id title').limit(5).lean();
    results.findOneRaw = allPosts;
    
    return NextResponse.json({
      success: true,
      postId,
      results,
      allPostsSample: allPosts
    });
    
  } catch (error: any) {
    console.error('Check API error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}