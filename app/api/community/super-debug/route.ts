// app/api/community/super-debug/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/Community';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    console.log('✅ Database connected');
    
    // Get the specific post
    const postId = '6978e4d20d3c5e18e81f191b';
    console.log('Looking for post ID:', postId);
    
    // Method 1: Direct findById
    console.log('Method 1: findById');
    const post1 = await Community.findById(postId);
    console.log('Result:', post1 ? 'FOUND' : 'NOT FOUND');
    
    // Method 2: findById with ObjectId
    console.log('Method 2: findById with ObjectId');
    const objectId = new mongoose.Types.ObjectId(postId);
    const post2 = await Community.findById(objectId);
    console.log('Result:', post2 ? 'FOUND' : 'NOT FOUND');
    
    // Method 3: findOne
    console.log('Method 3: findOne with _id');
    const post3 = await Community.findOne({ _id: postId });
    console.log('Result:', post3 ? 'FOUND' : 'NOT FOUND');
    
    // Method 4: findOne with ObjectId
    console.log('Method 4: findOne with ObjectId');
    const post4 = await Community.findOne({ _id: objectId });
    console.log('Result:', post4 ? 'FOUND' : 'NOT FOUND');
    
    // Check total posts
    const totalPosts = await Community.countDocuments({});
    console.log('Total posts in database:', totalPosts);
    
    // Get all posts
    const allPosts = await Community.find({}).lean();
    console.log('All posts IDs:', allPosts.map(p => ({
      id: p._id.toString(),
      title: p.title,
      length: p._id.toString().length
    })));
    
    return NextResponse.json({
      success: true,
      debug: {
        postId,
        isValidObjectId: mongoose.Types.ObjectId.isValid(postId),
        objectId: objectId.toString(),
        methods: {
          findById: !!post1,
          findByIdWithObjectId: !!post2,
          findOne: !!post3,
          findOneWithObjectId: !!post4
        },
        totalPosts,
        allPosts: allPosts.map(p => ({
          id: p._id.toString(),
          title: p.title,
          dbId: p._id,
          dbIdType: typeof p._id
        }))
      }
    });
    
  } catch (error: any) {
    console.error('Super debug error:', error);
    return NextResponse.json({
      success: false,
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}