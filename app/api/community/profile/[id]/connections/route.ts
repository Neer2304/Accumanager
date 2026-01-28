import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import User from '@/models/User';
import { Types } from 'mongoose';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    
    const identifier = params.id;
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'followers';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Find community profile by userId or username
    let communityProfile;
    
    if (Types.ObjectId.isValid(identifier)) {
      communityProfile = await CommunityUser.findOne({ userId: identifier })
        .populate('userId', 'name email role shopName')
        .lean();
    } else {
      communityProfile = await CommunityUser.findOne({ username: identifier.toLowerCase() })
        .populate('userId', 'name email role shopName')
        .lean();
    }
    
    if (!communityProfile) {
      return NextResponse.json(
        { success: false, message: 'Community profile not found' },
        { status: 404 }
      );
    }
    
    let users = [];
    let total = 0;
    
    if (type === 'followers') {
      // Get followers
      const followers = await CommunityUser.find({
        _id: { $in: communityProfile.followers }
      })
      .populate('userId', 'name email role shopName subscription.plan')
      .select('username avatar bio expertInCategories communityStats followerCount followingCount badges verificationBadge')
      .skip(skip)
      .limit(limit)
      .lean();
      
      users = followers;
      total = communityProfile.followerCount || 0;
    } else {
      // Get following
      const following = await CommunityUser.find({
        _id: { $in: communityProfile.following }
      })
      .populate('userId', 'name email role shopName subscription.plan')
      .select('username avatar bio expertInCategories communityStats followerCount followingCount badges verificationBadge')
      .skip(skip)
      .limit(limit)
      .lean();
      
      users = following;
      total = communityProfile.followingCount || 0;
    }
    
    // Transform users for frontend
    const transformedUsers = users.map(user => ({
      _id: user._id.toString(),
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      isVerified: user.verificationBadge,
      expertInCategories: user.expertInCategories || [],
      badges: user.badges || [],
      communityStats: {
        totalPosts: user.communityStats?.totalPosts || 0,
        followerCount: user.followerCount || 0,
        followingCount: user.followingCount || 0
      },
      userId: {
        _id: user.userId._id.toString(),
        name: user.userId.name,
        email: user.userId.email,
        role: user.userId.role,
        shopName: user.userId.shopName,
        subscription: user.userId.subscription
      }
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        profile: {
          username: communityProfile.username,
          avatar: communityProfile.avatar,
          followerCount: communityProfile.followerCount || 0,
          followingCount: communityProfile.followingCount || 0
        },
        users: transformedUsers,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      }
    });
    
  } catch (error: any) {
    console.error('GET /api/community/profile/[id]/connections error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch connections' },
      { status: 500 }
    );
  }
}