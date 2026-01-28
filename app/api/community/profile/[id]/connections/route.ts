// app/api/community/profile/[id]/connections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import User from '@/models/User';
import { Types } from 'mongoose';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    
    // Extract params properly using await
    const { id } = await params;
    const identifier = id;
    
    console.log('=== CONNECTIONS API CALLED ===');
    console.log('Identifier from params:', identifier);
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'followers';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    console.log('Query params:', { type, page, limit, skip });
    
    // Find community profile by username (since we're using username in the URL)
    let communityProfile;
    
    // Try username first (most common case)
    communityProfile = await CommunityUser.findOne({ 
      username: identifier.toLowerCase() 
    })
    .populate('userId', 'name email role shopName')
    .lean();
    
    console.log('Profile found by username:', communityProfile ? 'YES' : 'NO');
    
    // If not found by username, try ObjectId
    if (!communityProfile && Types.ObjectId.isValid(identifier)) {
      console.log('Trying to find by ObjectId:', identifier);
      communityProfile = await CommunityUser.findById(identifier)
        .populate('userId', 'name email role shopName')
        .lean();
      console.log('Profile found by ObjectId:', communityProfile ? 'YES' : 'NO');
    }
    
    if (!communityProfile) {
      console.error('Community profile not found for identifier:', identifier);
      return NextResponse.json(
        { success: false, message: 'Community profile not found' },
        { status: 404 }
      );
    }
    
    console.log('Found profile ID:', communityProfile._id);
    console.log('Followers count in DB:', communityProfile.followers?.length || 0);
    console.log('Following count in DB:', communityProfile.following?.length || 0);
    
    let users = [];
    let total = 0;
    
    if (type === 'followers') {
      console.log('Fetching followers...');
      // Get followers
      const followers = await CommunityUser.find({
        _id: { $in: communityProfile.followers || [] }
      })
      .populate('userId', 'name email role shopName subscription.plan')
      .select('username avatar bio expertInCategories communityStats followerCount followingCount badges verificationBadge')
      .skip(skip)
      .limit(limit)
      .lean();
      
      console.log(`Found ${followers.length} followers in query`);
      
      users = followers;
      total = communityProfile.followerCount || communityProfile.followers?.length || 0;
    } else {
      console.log('Fetching following...');
      // Get following
      const following = await CommunityUser.find({
        _id: { $in: communityProfile.following || [] }
      })
      .populate('userId', 'name email role shopName subscription.plan')
      .select('username avatar bio expertInCategories communityStats followerCount followingCount badges verificationBadge')
      .skip(skip)
      .limit(limit)
      .lean();
      
      console.log(`Found ${following.length} following in query`);
      
      users = following;
      total = communityProfile.followingCount || communityProfile.following?.length || 0;
    }
    
    // Transform users for frontend with safe access
    const transformedUsers = users.map(user => {
      // Debug log for each user
      console.log('Processing user:', user.username, 'userId type:', typeof user.userId);
      
      let userIdData;
      if (user.userId && typeof user.userId === 'object') {
        // Already populated
        userIdData = {
          _id: user.userId._id?.toString() || '',
          name: user.userId.name || '',
          email: user.userId.email || '',
          role: user.userId.role || '',
          shopName: user.userId.shopName || '',
          subscription: user.userId.subscription || null
        };
      } else {
        // Not populated, create empty structure
        userIdData = {
          _id: '',
          name: '',
          email: '',
          role: '',
          shopName: '',
          subscription: null
        };
      }
      
      return {
        _id: user._id.toString(),
        username: user.username || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
        isVerified: user.verificationBadge || false,
        expertInCategories: user.expertInCategories || [],
        badges: user.badges || [],
        communityStats: {
          totalPosts: user.communityStats?.totalPosts || 0,
          followerCount: user.followerCount || 0,
          followingCount: user.followingCount || 0
        },
        userId: userIdData
      };
    });
    
    console.log(`Transformed ${transformedUsers.length} users`);
    
    const responseData = {
      success: true,
      data: {
        profile: {
          username: communityProfile.username || '',
          avatar: communityProfile.avatar || '',
          followerCount: communityProfile.followerCount || communityProfile.followers?.length || 0,
          followingCount: communityProfile.followingCount || communityProfile.following?.length || 0
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
    };
    
    console.log('API Response prepared');
    
    return NextResponse.json(responseData);
    
  } catch (error: any) {
    console.error('GET /api/community/profile/[id]/connections error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch connections',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}