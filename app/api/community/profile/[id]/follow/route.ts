import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { Types } from 'mongoose';

interface RouteParams {
  params: { id: string };
}

// POST /api/community/profile/[id]/follow - Follow a user
export async function POST(request: NextRequest, { params }: RouteParams) {
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
    
    const currentUserId = decoded.userId;
    const targetIdentifier = params.id; // This can be username or user ID
    
    // Get current user's community profile
    const currentUserProfile = await CommunityUser.findOne({ userId: currentUserId });
    if (!currentUserProfile) {
      return NextResponse.json(
        { success: false, message: 'Your community profile not found' },
        { status: 404 }
      );
    }
    
    // Find target user's community profile
    let targetUserProfile;
    
    // Check if targetIdentifier is a username or user ID
    if (Types.ObjectId.isValid(targetIdentifier)) {
      // It's a user ID
      targetUserProfile = await CommunityUser.findOne({ userId: targetIdentifier })
        .populate('userId', 'name email');
    } else {
      // It's a username
      targetUserProfile = await CommunityUser.findOne({ username: targetIdentifier.toLowerCase() })
        .populate('userId', 'name email');
    }
    
    if (!targetUserProfile) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Prevent following yourself
    if (currentUserProfile._id.toString() === targetUserProfile._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'You cannot follow yourself' },
        { status: 400 }
      );
    }
    
    // Check if already following
    const isAlreadyFollowing = currentUserProfile.following.some(
      (id: Types.ObjectId) => id.toString() === targetUserProfile._id.toString()
    );
    
    if (isAlreadyFollowing) {
      return NextResponse.json(
        { success: false, message: 'Already following this user' },
        { status: 400 }
      );
    }
    
    // Add to following list
    currentUserProfile.following.push(targetUserProfile._id);
    currentUserProfile.followingCount = currentUserProfile.following.length;
    
    // Add to target's followers list
    targetUserProfile.followers.push(currentUserProfile._id);
    targetUserProfile.followerCount = targetUserProfile.followers.length;
    
    // Save both profiles
    await Promise.all([
      currentUserProfile.save(),
      targetUserProfile.save()
    ]);
    
    return NextResponse.json({
      success: true,
      message: 'Successfully followed user',
      data: {
        isFollowing: true,
        followerCount: targetUserProfile.followerCount,
        followingCount: currentUserProfile.followingCount
      }
    });
    
  } catch (error: any) {
    console.error('POST /api/community/profile/[id]/follow error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to follow user' },
      { status: 500 }
    );
  }
}

// DELETE /api/community/profile/[id]/follow - Unfollow a user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    
    const currentUserId = decoded.userId;
    const targetIdentifier = params.id;
    
    // Get current user's community profile
    const currentUserProfile = await CommunityUser.findOne({ userId: currentUserId });
    if (!currentUserProfile) {
      return NextResponse.json(
        { success: false, message: 'Your community profile not found' },
        { status: 404 }
      );
    }
    
    // Find target user's community profile
    let targetUserProfile;
    
    if (Types.ObjectId.isValid(targetIdentifier)) {
      targetUserProfile = await CommunityUser.findOne({ userId: targetIdentifier });
    } else {
      targetUserProfile = await CommunityUser.findOne({ username: targetIdentifier.toLowerCase() });
    }
    
    if (!targetUserProfile) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if actually following
    const isFollowing = currentUserProfile.following.some(
      (id: Types.ObjectId) => id.toString() === targetUserProfile._id.toString()
    );
    
    if (!isFollowing) {
      return NextResponse.json(
        { success: false, message: 'Not following this user' },
        { status: 400 }
      );
    }
    
    // Remove from following list
    currentUserProfile.following = currentUserProfile.following.filter(
      (id: Types.ObjectId) => id.toString() !== targetUserProfile._id.toString()
    );
    currentUserProfile.followingCount = currentUserProfile.following.length;
    
    // Remove from target's followers list
    targetUserProfile.followers = targetUserProfile.followers.filter(
      (id: Types.ObjectId) => id.toString() !== currentUserProfile._id.toString()
    );
    targetUserProfile.followerCount = targetUserProfile.followers.length;
    
    // Save both profiles
    await Promise.all([
      currentUserProfile.save(),
      targetUserProfile.save()
    ]);
    
    return NextResponse.json({
      success: true,
      message: 'Successfully unfollowed user',
      data: {
        isFollowing: false,
        followerCount: targetUserProfile.followerCount,
        followingCount: currentUserProfile.followingCount
      }
    });
    
  } catch (error: any) {
    console.error('DELETE /api/community/profile/[id]/follow error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to unfollow user' },
      { status: 500 }
    );
  }
}