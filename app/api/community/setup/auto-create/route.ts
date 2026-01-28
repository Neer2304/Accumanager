// app/api/community/setup/auto-create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get token from YOUR auth system
    const cookies = request.headers.get('cookie') || '';
    const authTokenMatch = cookies.match(/auth_token=([^;]+)/);
    
    if (!authTokenMatch) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const authToken = authTokenMatch[1];
    const decoded = verifyToken(authToken) as any;
    
    if (!decoded?.userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Find user
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if already has community profile
    const existingProfile = await CommunityUser.findOne({ userId: user._id });
    
    if (existingProfile) {
      return NextResponse.json({
        success: true,
        message: 'Profile already exists',
        data: existingProfile
      });
    }
    
    // Generate unique username
    const baseUsername = user.email.split('@')[0];
    let username = baseUsername;
    let counter = 1;
    
    while (await CommunityUser.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }
    
    // Create profile
    const communityProfile = new CommunityUser({
      userId: user._id,
      username: username.toLowerCase(),
      avatar: '',
      bio: `Hello! I'm ${user.name}`,
      followers: [],
      following: [],
      followerCount: 0,
      followingCount: 0,
      communityStats: {
        totalPosts: 0,
        totalComments: 0,
        totalLikesReceived: 0,
        totalLikesGiven: 0,
        totalBookmarks: 0,
        engagementScore: 0,
        lastActive: new Date(),
        joinDate: new Date()
      },
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        showOnlineStatus: true,
        privateProfile: false,
        allowMessages: 'everyone'
      },
      badges: [],
      isVerified: false,
      verificationBadge: false
    });
    
    await communityProfile.save();
    
    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      data: communityProfile
    });
    
  } catch (error: any) {
    console.error('Auto-create error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create profile' },
      { status: 500 }
    );
  }
}