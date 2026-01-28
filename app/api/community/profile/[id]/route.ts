// app/api/community/profile/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import User from '@/models/User'; // Add this import
import { verifyToken } from '@/lib/jwt';
import { Types } from 'mongoose';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    
    const identifier = params.id;
    
    console.log('Looking for profile with identifier:', identifier);
    
    let communityProfile;
    
    // Always try username first (it's unique)
    communityProfile = await CommunityUser.findOne({ 
      username: identifier.toLowerCase() 
    })
    .populate('userId', 'name email role shopName subscription')
    .lean();
    
    // If not found by username, check if it's an ObjectId
    if (!communityProfile && Types.ObjectId.isValid(identifier)) {
      console.log('Trying to find by ObjectId:', identifier);
      communityProfile = await CommunityUser.findById(identifier)
        .populate('userId', 'name email role shopName subscription')
        .lean();
    }
    
    // If still not found, it might be a numeric user ID string
    if (!communityProfile) {
      console.log('Trying to find by userId field:', identifier);
      // We need to find the User document first, then find CommunityUser by that ObjectId
      const user = await User.findOne({ 
        $or: [
          { _id: identifier }, // Try as string ID
          { 'providerId': identifier } // If you have a providerId field
        ]
      });
      
      if (user) {
        communityProfile = await CommunityUser.findOne({ userId: user._id })
          .populate('userId', 'name email role shopName subscription')
          .lean();
      }
    }
    
    if (!communityProfile) {
      console.log('Profile not found for identifier:', identifier);
      return NextResponse.json(
        { success: false, message: 'Community profile not found' },
        { status: 404 }
      );
    }
    
    console.log('Found profile:', communityProfile._id);
    
    // Check if current user is following this profile
    let isFollowing = false;
    const cookies = request.headers.get('cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    
    if (authToken) {
      try {
        const decoded = verifyToken(authToken) as any;
        if (decoded?.userId) {
          // Find current user's CommunityUser profile
          const currentUser = await User.findOne({ _id: decoded.userId });
          if (currentUser) {
            const currentProfile = await CommunityUser.findOne({ 
              userId: currentUser._id 
            });
            
            if (currentProfile && currentProfile.following.some(
              (id: Types.ObjectId) => id.toString() === communityProfile._id.toString()
            )) {
              isFollowing = true;
            }
          }
        }
      } catch (error) {
        console.log('Token verification failed:', error);
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