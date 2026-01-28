// app/api/community/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// GET /api/community/profile - Get current user's community profile
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Check authentication
    const cookies = request.headers.get('cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(authToken) as any;
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const userId = decoded.userId;
    
    // Find community profile
    let communityProfile = await CommunityUser.findOne({ userId })
      .populate('userId', 'name email role shopName subscription.plan')
      .lean();
    
    // If no community profile exists, create one
    if (!communityProfile) {
      const user = await User.findById(userId).select('name email').lean();
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
      
      // Create username from email
      const username = user.email.split('@')[0].toLowerCase();
      
      communityProfile = await CommunityUser.create({
        userId,
        username,
        bio: `Hello! I'm ${user.name}`,
        communityStats: {
          joinDate: new Date()
        }
      });
      
      // Update user with community profile reference
      await User.findByIdAndUpdate(userId, {
        communityProfile: communityProfile._id
      });
      
      communityProfile = await CommunityUser.findById(communityProfile._id)
        .populate('userId', 'name email role shopName subscription.plan')
        .lean();
    }
    
    return NextResponse.json({
      success: true,
      data: communityProfile
    });
    
  } catch (error: any) {
    console.error('GET /api/community/profile error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/community/profile - Update community profile
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Check authentication
    const cookies = request.headers.get('cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(authToken) as any;
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const userId = decoded.userId;
    const body = await request.json();
    
    // Check if profile exists
    let communityProfile = await CommunityUser.findOne({ userId });
    if (!communityProfile) {
      return NextResponse.json(
        { success: false, message: 'Community profile not found. Please create one first.' },
        { status: 404 }
      );
    }
    
    // Validate username if being changed
    if (body.username && body.username !== communityProfile.username) {
      const existingUser = await CommunityUser.findOne({ 
        username: body.username.toLowerCase(),
        _id: { $ne: communityProfile._id }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'Username already taken' },
          { status: 400 }
        );
      }
      
      body.username = body.username.toLowerCase();
    }
    
    // Update profile
    const updatedProfile = await CommunityUser.findByIdAndUpdate(
      communityProfile._id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('userId', 'name email role shopName subscription.plan');
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
    
  } catch (error: any) {
    console.error('PUT /api/community/profile error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}