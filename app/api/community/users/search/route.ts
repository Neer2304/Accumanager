// app/api/community/users/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get search query
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '5');
    
    console.log('Search query:', query);
    
    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        message: 'No query provided',
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit,
          pages: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }
    
    // Build search query with case-insensitive regex
    const searchRegex = new RegExp(query, 'i');
    
    // Search in CommunityUser model
    const communityUsers = await CommunityUser.find({
      $or: [
        { username: searchRegex },
        { bio: searchRegex },
        { location: searchRegex }
      ]
    })
    .select('username avatar bio location followerCount followingCount communityStats isVerified verificationBadge userId')
    .limit(limit)
    .lean();
    
    console.log('Found community users:', communityUsers.length);
    
    // Get user details for each community user
    const usersWithDetails = await Promise.all(
      communityUsers.map(async (communityUser) => {
        try {
          // Get User model details
          const userDetails = await User.findById(communityUser.userId)
            .select('name email role shopName')
            .lean();
          
          return {
            _id: communityUser.userId?.toString() || communityUser._id.toString(),
            communityUserId: communityUser._id.toString(),
            name: userDetails?.name || communityUser.username,
            email: userDetails?.email || '',
            shopName: userDetails?.shopName || '',
            username: communityUser.username,
            avatar: communityUser.avatar || '',
            bio: communityUser.bio || '',
            location: communityUser.location || '',
            role: userDetails?.role || 'member',
            businessName: userDetails?.shopName || '',
            followerCount: communityUser.followerCount || 0,
            followingCount: communityUser.followingCount || 0,
            communityStats: communityUser.communityStats || {},
            isVerified: communityUser.isVerified || false,
            verificationBadge: communityUser.verificationBadge || false,
            createdAt: communityUser.createdAt
          };
        } catch (error) {
          console.error('Error fetching user details:', error);
          // Return basic info if user details fetch fails
          return {
            _id: communityUser.userId?.toString() || communityUser._id.toString(),
            communityUserId: communityUser._id.toString(),
            name: communityUser.username,
            email: '',
            shopName: '',
            username: communityUser.username,
            avatar: communityUser.avatar || '',
            bio: communityUser.bio || '',
            location: communityUser.location || '',
            role: 'member',
            businessName: '',
            followerCount: communityUser.followerCount || 0,
            followingCount: communityUser.followingCount || 0,
            communityStats: communityUser.communityStats || {},
            isVerified: communityUser.isVerified || false,
            verificationBadge: communityUser.verificationBadge || false,
            createdAt: communityUser.createdAt
          };
        }
      })
    );
    
    console.log('Users with details:', usersWithDetails.length);
    
    // Sort by relevance
    const sortedUsers = usersWithDetails.sort((a, b) => {
      // Calculate relevance score
      const scoreA = calculateRelevance(a, query);
      const scoreB = calculateRelevance(b, query);
      return scoreB - scoreA;
    });
    
    return NextResponse.json({
      success: true,
      message: 'Users found successfully',
      data: sortedUsers,
      pagination: {
        total: sortedUsers.length,
        page: 1,
        limit,
        pages: Math.ceil(sortedUsers.length / limit),
        hasNextPage: sortedUsers.length > limit,
        hasPrevPage: false
      }
    });
    
  } catch (error: any) {
    console.error('Error in user search API:', error);
    
    // Return proper error response
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to search users',
      data: [],
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// Helper function to calculate relevance score
function calculateRelevance(user: any, query: string): number {
  const queryLower = query.toLowerCase();
  let score = 0;
  
  // Exact match on username
  if (user.username?.toLowerCase() === queryLower) {
    score += 100;
  }
  
  // Partial match on username
  if (user.username?.toLowerCase().includes(queryLower)) {
    score += 50;
  }
  
  // Match on name
  if (user.name?.toLowerCase().includes(queryLower)) {
    score += 40;
  }
  
  // Match on business name/shop name
  if (user.shopName?.toLowerCase().includes(queryLower) || 
      user.businessName?.toLowerCase().includes(queryLower)) {
    score += 30;
  }
  
  // Match on bio
  if (user.bio?.toLowerCase().includes(queryLower)) {
    score += 20;
  }
  
  // Match on location
  if (user.location?.toLowerCase().includes(queryLower)) {
    score += 15;
  }
  
  // Boost for verified users
  if (user.isVerified) {
    score += 25;
  }
  
  // Boost for users with more followers
  score += Math.min(user.followerCount || 0, 50) * 0.1;
  
  // Boost for engagement
  const posts = user.communityStats?.totalPosts || 0;
  score += Math.min(posts, 100) * 0.2;
  
  return score;
}