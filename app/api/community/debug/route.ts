// app/api/community/debug/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username') || 'm_neer143';
    
    // Get auth info
    const cookies = request.headers.get('cookie') || '';
    const authTokenMatch = cookies.match(/auth_token=([^;]+)/);
    const authToken = authTokenMatch?.[1];
    
    let currentUser = null;
    let currentUserProfile = null;
    
    if (authToken) {
      try {
        const decoded = verifyToken(authToken) as any;
        if (decoded?.userId) {
          currentUser = await User.findById(decoded.userId);
          if (currentUser) {
            currentUserProfile = await CommunityUser.findOne({ 
              userId: currentUser._id 
            });
          }
        }
      } catch (error) {
        console.log('Token verification failed:', error);
      }
    }
    
    // Find target user
    const targetUserProfile = await CommunityUser.findOne({ 
      username: username.toLowerCase() 
    }).populate('userId', 'name email');
    
    // Get all community users for debugging
    const allCommunityUsers = await CommunityUser.find({})
      .select('username userId')
      .populate('userId', 'name email')
      .limit(10);
    
    return NextResponse.json({
      success: true,
      debug: {
        authTokenExists: !!authToken,
        currentUser: currentUser ? {
          _id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email
        } : null,
        currentUserProfile: currentUserProfile ? {
          _id: currentUserProfile._id,
          username: currentUserProfile.username,
          followingCount: currentUserProfile.followingCount,
          followerCount: currentUserProfile.followerCount
        } : null,
        targetUserProfile: targetUserProfile ? {
          _id: targetUserProfile._id,
          username: targetUserProfile.username,
          followingCount: targetUserProfile.followingCount,
          followerCount: targetUserProfile.followerCount,
          userId: targetUserProfile.userId
        } : null,
        allCommunityUsers: allCommunityUsers.map(user => ({
          _id: user._id,
          username: user.username,
          userId: user.userId
        }))
      }
    });
    
  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}