// app/api/community/profile/[id]/follow/route.ts - UPDATED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { Types } from 'mongoose';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    
    // Extract params properly
    const { id } = await params;
    const targetUsername = id;
    
    console.log('=== FOLLOW API CALLED ===');
    console.log('Target username from params:', targetUsername);
    console.log('Full params:', await params);
    
    // Check if username is provided
    if (!targetUsername || targetUsername.trim() === '') {
      console.error('ERROR: Username is empty!');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Username is required',
          debug: { receivedUsername: targetUsername, params: await params }
        },
        { status: 400 }
      );
    }
    
    // Get current user from auth token
    const cookies = request.headers.get('cookie') || '';
    console.log('Cookies received:', cookies.substring(0, 100) + '...');
    
    const authTokenMatch = cookies.match(/auth_token=([^;]+)/);
    const authToken = authTokenMatch?.[1];
    
    console.log('Auth token found:', !!authToken);
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    let decoded;
    try {
      decoded = verifyToken(authToken) as any;
      console.log('Decoded token:', { userId: decoded?.userId, email: decoded?.email });
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    if (!decoded?.userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid token data' },
        { status: 401 }
      );
    }
    
    // Find current user
    const currentUser = await User.findById(decoded.userId);
    console.log('Current user found:', currentUser ? { _id: currentUser._id, email: currentUser.email } : 'NOT FOUND');
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Find or create community profile for current user
    let currentUserProfile = await CommunityUser.findOne({ userId: currentUser._id });
    console.log('Current user community profile:', currentUserProfile ? { username: currentUserProfile.username } : 'NOT FOUND');
    
    if (!currentUserProfile) {
      // Auto-create a community profile
      const baseUsername = currentUser.email.split('@')[0];
      let username = baseUsername;
      let counter = 1;
      
      while (await CommunityUser.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
      
      currentUserProfile = new CommunityUser({
        userId: currentUser._id,
        username: username.toLowerCase(),
        avatar: '',
        bio: `Hello! I'm ${currentUser.name}`,
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
      
      await currentUserProfile.save();
      console.log('Auto-created community profile:', currentUserProfile.username);
    }
    
    // Find target user by username - handle case sensitivity
    const targetUsernameLower = targetUsername.toLowerCase();
    console.log('Looking for target user with username (lowercase):', targetUsernameLower);
    
    let targetUserProfile = await CommunityUser.findOne({ 
      username: targetUsernameLower 
    });
    
    console.log('Target user profile found:', targetUserProfile ? { username: targetUserProfile.username } : 'NOT FOUND');
    
    if (!targetUserProfile) {
      console.error('Target user not found. Available users:');
      const allUsers = await CommunityUser.find({}).select('username').limit(5);
      console.log('First 5 community users:', allUsers.map(u => u.username));
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'User not found',
          debug: { 
            searchedUsername: targetUsernameLower,
            availableUsernames: allUsers.map(u => u.username)
          }
        },
        { status: 404 }
      );
    }
    
    console.log('Current user:', currentUserProfile.username);
    console.log('Target user:', targetUserProfile.username);
    
    // Prevent following yourself
    if (currentUserProfile._id.toString() === targetUserProfile._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'You cannot follow yourself' },
        { status: 400 }
      );
    }
    
    // Check if already following
    const isAlreadyFollowing = currentUserProfile.following.some(
      (id: Types.ObjectId) => id.toString() === targetUserProfile._id.toString()
    );
    
    console.log('Already following?', isAlreadyFollowing);
    
    if (isAlreadyFollowing) {
      return NextResponse.json(
        { success: false, message: 'Already following this user' },
        { status: 400 }
      );
    }
    
    // Add to following list
    currentUserProfile.following.push(targetUserProfile._id);
    currentUserProfile.followingCount = currentUserProfile.following.length;
    
    // Add to target's followers list
    targetUserProfile.followers.push(currentUserProfile._id);
    targetUserProfile.followerCount = targetUserProfile.followers.length;
    
    // Save both profiles
    await Promise.all([
      currentUserProfile.save(),
      targetUserProfile.save()
    ]);
    
    console.log('Follow successful!');
    console.log('Current user now following:', currentUserProfile.followingCount, 'users');
    console.log('Target user now has:', targetUserProfile.followerCount, 'followers');
    
    return NextResponse.json({
      success: true,
      message: 'Successfully followed user',
      data: {
        isFollowing: true,
        followerCount: targetUserProfile.followerCount,
        followingCount: currentUserProfile.followingCount,
        currentUser: currentUserProfile.username,
        targetUser: targetUserProfile.username
      }
    });
    
  } catch (error: any) {
    console.error('POST /api/community/profile/[id]/follow error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to follow user',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}