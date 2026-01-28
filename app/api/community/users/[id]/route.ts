// app/api/community/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import CommunityUser from '@/models/CommunityUser';
import CommunityPost from '@/models/CommunityPost';
import { Types } from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectToDatabase();
    
    const userId = params.id;
    
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: 'Valid user ID is required' },
        { status: 400 }
      );
    }
    
    // Get user and community profile
    const [user, communityUser] = await Promise.all([
      User.findById(userId)
        .select('name email role shopName isActive subscription.plan subscription.status screenTime')
        .lean(),
      CommunityUser.findOne({ userId })
        .populate('followers', 'username avatar')
        .populate('following', 'username avatar')
        .lean()
    ]);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user stats
    const statsPromises = [];
    
    // Total posts
    statsPromises.push(
      CommunityPost.countDocuments({
        author: communityUser?._id || userId,
        status: 'published'
      })
    );
    
    // Total comments
    statsPromises.push(
      CommunityPost.aggregate([
        { $match: { status: 'published' } },
        { $unwind: '$comments' },
        { 
          $match: { 
            'comments.user': communityUser?._id || userId,
            'comments.status': 'active'
          }
        },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0)
    );
    
    // Total likes received
    statsPromises.push(
      CommunityPost.aggregate([
        { 
          $match: { 
            author: communityUser?._id || userId,
            status: 'published'
          }
        },
        { $unwind: '$likes' },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0)
    );
    
    // Total likes given
    statsPromises.push(
      CommunityPost.aggregate([
        { $match: { status: 'published' } },
        { 
          $match: { 
            likes: communityUser?._id || userId
          }
        },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0)
    );
    
    // Total bookmarks
    statsPromises.push(
      CommunityPost.countDocuments({
        bookmarks: communityUser?._id || userId,
        status: 'published'
      })
    );
    
    const [totalPosts, totalComments, totalLikesReceived, totalLikesGiven, totalBookmarks] = 
      await Promise.all(statsPromises);
    
    // Calculate engagement score
    const engagementScore = calculateEngagementScore({
      totalPosts,
      totalComments,
      totalLikesReceived,
      totalLikesGiven,
      totalBookmarks,
      followerCount: communityUser?.followerCount || 0
    });
    
    // Prepare response
    const response = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      shopName: user.shopName,
      isActive: user.isActive,
      subscription: user.subscription,
      screenTime: user.screenTime,
      communityProfile: communityUser ? {
        _id: communityUser._id.toString(),
        username: communityUser.username,
        avatar: communityUser.avatar,
        bio: communityUser.bio,
        location: communityUser.location,
        website: communityUser.website,
        socialLinks: communityUser.socialLinks,
        isVerified: communityUser.isVerified,
        verificationBadge: communityUser.verificationBadge,
        expertInCategories: communityUser.expertInCategories,
        badges: communityUser.badges,
        achievements: communityUser.achievements,
        preferences: communityUser.preferences,
        followers: communityUser.followers?.map((f: any) => ({
          _id: f._id.toString(),
          username: f.username,
          avatar: f.avatar
        })) || [],
        following: communityUser.following?.map((f: any) => ({
          _id: f._id.toString(),
          username: f.username,
          avatar: f.avatar
        })) || [],
        followerCount: communityUser.followerCount || 0,
        followingCount: communityUser.followingCount || 0
      } : null,
      stats: {
        totalPosts,
        totalComments,
        totalLikesReceived,
        totalLikesGiven,
        totalBookmarks,
        engagementScore,
        followerCount: communityUser?.followerCount || 0,
        followingCount: communityUser?.followingCount || 0
      }
    };
    
    return NextResponse.json({
      success: true,
      message: 'User profile fetched successfully',
      data: response
    });
    
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch user profile'
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate engagement score
function calculateEngagementScore(stats: {
  totalPosts: number;
  totalComments: number;
  totalLikesReceived: number;
  totalLikesGiven: number;
  totalBookmarks: number;
  followerCount: number;
}): number {
  const {
    totalPosts,
    totalComments,
    totalLikesReceived,
    totalLikesGiven,
    totalBookmarks,
    followerCount
  } = stats;
  
  let score = 0;
  
  // Posts contribute to score
  score += totalPosts * 5;
  
  // Comments contribute (both received and given)
  score += totalComments * 2;
  score += totalLikesReceived * 1;
  score += totalLikesGiven * 0.5;
  score += totalBookmarks * 3;
  
  // Followers contribute significantly
  score += followerCount * 10;
  
  // Normalize score (you can adjust this)
  return Math.min(Math.floor(score / 10), 100);
}