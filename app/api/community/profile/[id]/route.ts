// app/api/community/profile/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import { verifyToken } from '@/lib/jwt';
import { Types } from 'mongoose';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    
    const userId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const includeStats = searchParams.get('stats') === 'true';
    
    // Check if requesting by username or userId
    let query: any;
    if (Types.ObjectId.isValid(userId)) {
      query = { userId };
    } else {
      query = { username: userId.toLowerCase() };
    }
    
    // Get community profile
    const communityProfile = await CommunityUser.findOne(query)
      .populate('userId', 'name email role shopName subscription')
      .lean();
    
    if (!communityProfile) {
      return NextResponse.json(
        { success: false, message: 'Community profile not found' },
        { status: 404 }
      );
    }
    
    // Check if current user is following this profile
    let isFollowing = false;
    const cookies = request.headers.get('cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    
    if (authToken) {
      try {
        const decoded = verifyToken(authToken) as any;
        if (decoded?.userId) {
          const currentProfile = await CommunityUser.findOne({ 
            userId: decoded.userId 
          });
          
          if (currentProfile && currentProfile.following.includes(communityProfile._id)) {
            isFollowing = true;
          }
        }
      } catch (error) {
        // Token verification failed, user is not logged in
      }
    }
    
    // Add following status
    const profileWithFollowing = {
      ...communityProfile,
      isFollowing,
    };
    
    return NextResponse.json({
      success: true,
      data: profileWithFollowing,
    });
    
  } catch (error: any) {
    console.error('GET /api/community/profile/[id] error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}