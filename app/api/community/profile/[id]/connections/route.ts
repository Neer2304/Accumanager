// app/api/community/profile/[id]/connections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import Community from '@/models/Community'; // Make sure this is imported
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { Types } from 'mongoose';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const identifier = id;
    
    console.log('=== CONNECTIONS API CALLED ===');
    console.log('Identifier:', identifier);
    
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'followers';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;
    
    // Find community profile by username
    let communityProfile;
    communityProfile = await CommunityUser.findOne({ 
      username: identifier.toLowerCase() 
    })
    .populate('userId', 'name email role shopName')
    .lean();
    
    if (!communityProfile && Types.ObjectId.isValid(identifier)) {
      communityProfile = await CommunityUser.findById(identifier)
        .populate('userId', 'name email role shopName')
        .lean();
    }
    
    if (!communityProfile) {
      console.error('Community profile not found');
      return NextResponse.json(
        { success: false, message: 'Community profile not found' },
        { status: 404 }
      );
    }
    
    console.log('Profile found:', communityProfile.username);
    
    // Get current user for isFollowing check
    let currentProfile = null;
    const cookies = request.headers.get('cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    
    if (authToken) {
      try {
        const decoded = verifyToken(authToken) as any;
        if (decoded?.userId) {
          currentProfile = await CommunityUser.findOne({ 
            userId: decoded.userId 
          });
        }
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    }
    
    let users = [];
    let total = 0;
    
    if (type === 'followers') {
      console.log('Fetching followers...');
      const followers = await CommunityUser.find({
        _id: { $in: communityProfile.followers || [] }
      })
      .populate('userId', 'name email role shopName subscription.plan')
      .select('username avatar bio expertInCategories followerCount followingCount communityStats verificationBadge')
      .skip(skip)
      .limit(limit)
      .lean();
      
      console.log(`Found ${followers.length} followers`);
      
      // Get actual post counts for each follower
      users = await Promise.all(
        followers.map(async (user: any) => {
          try {
            // Get actual post count from Community model
            const actualPostCount = await Community.countDocuments({
              author: user.userId._id,
              status: 'active'
            });
            
            // Check if current user is following this user
            const isFollowing = currentProfile ? 
              currentProfile.following.some((id: any) => 
                id.toString() === user._id.toString()
              ) : false;
            
            return {
              _id: user._id.toString(),
              username: user.username || '',
              avatar: user.avatar || '',
              bio: user.bio || '',
              isVerified: user.verificationBadge || false,
              expertInCategories: user.expertInCategories || [],
              badges: user.badges || [],
              isFollowing: isFollowing,
              followerCount: user.followerCount || 0,
              followingCount: user.followingCount || 0,
              communityStats: {
                totalPosts: actualPostCount, // Use actual count
                followerCount: user.followerCount || 0,
                followingCount: user.followingCount || 0
              },
              userId: {
                _id: user.userId._id.toString(),
                name: user.userId.name || '',
                email: user.userId.email || '',
                role: user.userId.role || '',
                shopName: user.userId.shopName || '',
                subscription: user.userId.subscription || null
              }
            };
          } catch (error) {
            console.error(`Error processing user ${user.username}:`, error);
            return null;
          }
        })
      );
      
      users = users.filter(user => user !== null);
      total = communityProfile.followerCount || communityProfile.followers?.length || 0;
    } else {
      console.log('Fetching following...');
      const following = await CommunityUser.find({
        _id: { $in: communityProfile.following || [] }
      })
      .populate('userId', 'name email role shopName subscription.plan')
      .select('username avatar bio expertInCategories followerCount followingCount communityStats verificationBadge')
      .skip(skip)
      .limit(limit)
      .lean();
      
      console.log(`Found ${following.length} following`);
      
      // Get actual post counts for each following user
      users = await Promise.all(
        following.map(async (user: any) => {
          try {
            // Get actual post count from Community model
            const actualPostCount = await Community.countDocuments({
              author: user.userId._id,
              status: 'active'
            });
            
            // Check if current user is following this user
            const isFollowing = currentProfile ? 
              currentProfile.following.some((id: any) => 
                id.toString() === user._id.toString()
              ) : false;
            
            return {
              _id: user._id.toString(),
              username: user.username || '',
              avatar: user.avatar || '',
              bio: user.bio || '',
              isVerified: user.verificationBadge || false,
              expertInCategories: user.expertInCategories || [],
              badges: user.badges || [],
              isFollowing: isFollowing,
              followerCount: user.followerCount || 0,
              followingCount: user.followingCount || 0,
              communityStats: {
                totalPosts: actualPostCount, // Use actual count
                followerCount: user.followerCount || 0,
                followingCount: user.followingCount || 0
              },
              userId: {
                _id: user.userId._id.toString(),
                name: user.userId.name || '',
                email: user.userId.email || '',
                role: user.userId.role || '',
                shopName: user.userId.shopName || '',
                subscription: user.userId.subscription || null
              }
            };
          } catch (error) {
            console.error(`Error processing user ${user.username}:`, error);
            return null;
          }
        })
      );
      
      users = users.filter(user => user !== null);
      total = communityProfile.followingCount || communityProfile.following?.length || 0;
    }
    
    console.log(`Returning ${users.length} users`);
    
    const responseData = {
      success: true,
      data: {
        profile: {
          username: communityProfile.username || '',
          avatar: communityProfile.avatar || '',
          followerCount: communityProfile.followerCount || communityProfile.followers?.length || 0,
          followingCount: communityProfile.followingCount || communityProfile.following?.length || 0
        },
        users: users,
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
    
    return NextResponse.json(responseData);
    
  } catch (error: any) {
    console.error('GET /api/community/profile/[id]/connections error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch connections'
      },
      { status: 500 }
    );
  }
}