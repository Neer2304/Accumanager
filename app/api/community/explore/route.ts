// app/api/community/explore/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import Community from '@/models/Community'; // Add this import
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const sort = searchParams.get('sort') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    
    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Build sort
    let sortOptions: any = {};
    if (sort === 'popular') {
      sortOptions = { followerCount: -1, 'communityStats.totalPosts': -1 };
    } else if (sort === 'new') {
      sortOptions = { createdAt: -1 };
    } else {
      sortOptions = { 'communityStats.engagementScore': -1 };
    }
    
    // Get users
    const users = await CommunityUser.find(query)
      .populate('userId', 'name email role shopName subscription.plan')
      .select('username avatar bio expertInCategories followerCount followingCount communityStats verificationBadge userId')
      .sort(sortOptions)
      .limit(limit)
      .lean();
    
    // Get current user's ID for following status
    let currentUserId: mongoose.Types.ObjectId | null = null;
    let followingMap: Record<string, boolean> = {};
    
    const cookies = request.headers.get('cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    
    if (authToken) {
      try {
        const decoded = verifyToken(authToken) as any;
        if (decoded?.userId) {
          currentUserId = new mongoose.Types.ObjectId(decoded.userId);
          const currentProfile = await CommunityUser.findOne({ userId: currentUserId });
          if (currentProfile) {
            followingMap = users.reduce((acc: Record<string, boolean>, user: any) => {
              acc[user._id.toString()] = currentProfile.following.some(
                (id: any) => id.toString() === user._id.toString()
              );
              return acc;
            }, {});
          }
        }
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    }
    
    // Get actual post counts for each user
    const transformedUsers = await Promise.all(
      users.map(async (user: any) => {
        // Get actual post count from Community model
        const actualPostCount = await Community.countDocuments({
          author: user.userId._id,
          status: 'active'
        });
        
        // Filter out current user's own profile
        const isCurrentUser = currentUserId && 
          (currentUserId.toString() === user.userId._id.toString() || 
           currentUserId.toString() === user._id.toString());
        
        return {
          _id: user._id.toString(),
          username: user.username,
          avatar: user.avatar,
          bio: user.bio,
          isVerified: user.verificationBadge,
          expertInCategories: user.expertInCategories || [],
          isFollowing: followingMap[user._id.toString()] || false,
          communityStats: {
            totalPosts: actualPostCount, // Use actual count from Community model
            followerCount: user.followerCount || 0,
            followingCount: user.followingCount || 0,
          },
          userId: {
            _id: user.userId._id.toString(),
            name: user.userId.name,
            email: user.userId.email,
            role: user.userId.role,
            shopName: user.userId.shopName,
            subscription: user.userId.subscription,
          },
          isCurrentUser // Add flag to filter in frontend
        };
      })
    );
    
    // Filter out current user's profile
    const filteredUsers = transformedUsers.filter(user => !user.isCurrentUser);
    
    // Remove isCurrentUser flag from final response
    const finalUsers = filteredUsers.map(({ isCurrentUser, ...rest }) => rest);
    
    return NextResponse.json({
      success: true,
      data: finalUsers,
    });
    
  } catch (error: any) {
    console.error('GET /api/community/explore error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}