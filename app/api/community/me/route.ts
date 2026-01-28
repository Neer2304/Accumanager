// app/api/community/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get token from your auth system
    const cookies = request.headers.get('cookie') || '';
    const authTokenMatch = cookies.match(/auth_token=([^;]+)/);
    
    if (!authTokenMatch) {
      return NextResponse.json({
        success: false,
        isAuthenticated: false,
        message: 'Not authenticated'
      }, { status: 200 });
    }
    
    const authToken = authTokenMatch[1];
    
    // Verify your JWT token
    const decoded = verifyToken(authToken) as any;
    
    if (!decoded?.userId) {
      return NextResponse.json({
        success: false,
        isAuthenticated: false,
        message: 'Invalid token'
      }, { status: 200 });
    }
    
    // Find user by ID (your system uses MongoDB ObjectId)
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        isAuthenticated: false,
        message: 'User not found in database'
      }, { status: 200 });
    }
    
    // Find community profile
    const communityProfile = await CommunityUser.findOne({ userId: user._id });
    
    return NextResponse.json({
      success: true,
      isAuthenticated: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username, // Your User model might have username
          image: '', // You can add profile image to your User model
        },
        hasCommunityProfile: !!communityProfile,
        communityProfile: communityProfile,
        // Your system doesn't have "token" from next-auth
        token: null
      }
    });
    
  } catch (error: any) {
    console.error('GET /api/community/me error:', error);
    return NextResponse.json({
      success: false,
      isAuthenticated: false,
      message: error.message || 'Failed to fetch user data'
    }, { status: 500 });
  }
}