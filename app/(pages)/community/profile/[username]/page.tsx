// app/community/profile/[username]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UserPublicProfile from '@/components/community/UserPublicProfile';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import Community from '@/models/Community';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    await connectToDatabase();
    
    const { username } = await params;
    
    if (!username) {
      return {
        title: 'User Not Found',
      };
    }
    
    const communityProfile = await CommunityUser.findOne({ 
      username: username.toLowerCase() 
    }).lean();
    
    if (!communityProfile) {
      return {
        title: 'User Not Found',
      };
    }
    
    const user = await User.findById(communityProfile.userId).select('name').lean();
    
    return {
      title: `${user?.name || 'User'} - Community Profile`,
      description: communityProfile.bio || `View ${user?.name || 'User'}'s community profile`,
    };
  } catch (error) {
    return {
      title: 'User Profile',
    };
  }
}

export default async function UserProfilePage({ params }: PageProps) {
  try {
    await connectToDatabase();
    
    const { username } = await params;
    
    if (!username) {
      notFound();
    }
    
    // Get community profile
    const communityProfile = await CommunityUser.findOne({ 
      username: username.toLowerCase() 
    }).lean();
    
    if (!communityProfile) {
      notFound();
    }
    
    // Get user details
    const user = await User.findById(communityProfile.userId)
      .select('name email role shopName subscription')
      .lean();
    
    // Get actual post count from Community model
    const postCount = await Community.countDocuments({
      author: communityProfile.userId,
      status: 'active'
    });
    
    // Get actual follower count (count the followers array)
    const followerCount = await CommunityUser.countDocuments({
      following: communityProfile._id
    });
    
    // Get actual following count (count the following array)
    const followingCount = await CommunityUser.countDocuments({
      followers: communityProfile._id
    });
    
    // Check if current user is following this profile
    let isFollowing = false;
    let isOwnProfile = false;
    
    try {
      // Get cookies from next/headers
      const cookieStore = await cookies();
      const authToken = cookieStore.get('auth_token')?.value;
      
      if (authToken) {
        const decoded = verifyToken(authToken) as any;
        if (decoded?.userId) {
          const currentUserId = new mongoose.Types.ObjectId(decoded.userId);
          
          // Check if it's own profile
          isOwnProfile = currentUserId.toString() === communityProfile.userId.toString();
          
          const currentProfile = await CommunityUser.findOne({ 
            userId: currentUserId 
          });
          
          if (currentProfile && currentProfile.following) {
            isFollowing = currentProfile.following.some(
              (id: any) => id.toString() === communityProfile._id.toString()
            );
          }
        }
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
    
    // Create profile with correct data
    const profile = {
      ...communityProfile,
      userId: user || communityProfile.userId,
      isFollowing: isFollowing,
      isOwnProfile: isOwnProfile,
      // Update with actual counts
      followerCount: followerCount,
      followingCount: followingCount,
      communityStats: {
        ...communityProfile.communityStats,
        totalPosts: postCount,
      },
    };
    
    // Convert to plain object
    const serializedProfile = JSON.parse(JSON.stringify(profile));
    
    return <UserPublicProfile profile={serializedProfile} username={username} />;
  } catch (error) {
    console.error('Error loading user profile:', error);
    notFound();
  }
}