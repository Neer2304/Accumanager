// app/api/community/setup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt'; // YOUR JWT system

export async function GET(request: NextRequest) {
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
    
    // Find user by ID (ObjectId)
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if CommunityUser exists
    const existingProfile = await CommunityUser.findOne({ userId: user._id });
    
    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          // Add username from your User model or use email
          username: user.username || user.email.split('@')[0],
        },
        hasCommunityProfile: !!existingProfile,
        communityProfile: existingProfile
      }
    });
    
  } catch (error: any) {
    console.error('GET /api/community/setup error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch setup data' },
      { status: 500 }
    );
  }
}

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
    
    // Get form data
    const body = await request.json();
    const { username, bio, location, website, expertInCategories } = body;
    
    // Find user by ID
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if username is available
    const existingWithUsername = await CommunityUser.findOne({ 
      username: username.toLowerCase() 
    });
    
    if (existingWithUsername && existingWithUsername.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'Username already taken' },
        { status: 400 }
      );
    }
    
    // Check if CommunityUser already exists
    const existingProfile = await CommunityUser.findOne({ userId: user._id });
    
    if (existingProfile) {
      // Update existing profile
      existingProfile.username = username.toLowerCase();
      existingProfile.bio = bio;
      existingProfile.location = location;
      existingProfile.website = website;
      existingProfile.expertInCategories = expertInCategories || [];
      
      await existingProfile.save();
      
      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        data: existingProfile
      });
    }
    
    // Create new CommunityUser profile
    const communityProfile = new CommunityUser({
      userId: user._id,
      username: username.toLowerCase(),
      avatar: '', // You can add avatar later
      bio: bio || `Hello! I'm ${user.name}`,
      location: location,
      website: website,
      expertInCategories: expertInCategories || [],
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
      badges: ['new-member'],
      isVerified: false,
      verificationBadge: false
    });
    
    await communityProfile.save();
    
    return NextResponse.json({
      success: true,
      message: 'Community profile created successfully',
      data: communityProfile
    });
    
  } catch (error: any) {
    console.error('POST /api/community/setup error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create profile' },
      { status: 500 }
    );
  }
}