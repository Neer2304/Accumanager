// app/api/community/fix-id/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get all posts and check their IDs
    const posts = await Community.find({}).select('_id title').lean();
    
    const analysis = posts.map(post => {
      const idStr = post._id.toString();
      return {
        id: idStr,
        title: post.title,
        length: idStr.length,
        isValid: mongoose.Types.ObjectId.isValid(idStr),
        is24Char: idStr.length === 24,
        is25Char: idStr.length === 25,
        // If 25 chars, show what removing last char would be
        possible24CharId: idStr.length === 25 ? idStr.slice(0, 24) : null,
        possible24CharValid: idStr.length === 25 ? 
          mongoose.Types.ObjectId.isValid(idStr.slice(0, 24)) : null
      };
    });
    
    return NextResponse.json({
      success: true,
      totalPosts: posts.length,
      postsWith25Chars: analysis.filter(p => p.length === 25).length,
      postsWith24Chars: analysis.filter(p => p.length === 24).length,
      analysis
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}