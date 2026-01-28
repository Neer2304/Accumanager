// app/community/profile/[username]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UserPublicProfile from '@/components/community/UserPublicProfile';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers'; // Import cookies from next/headers

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
    
    // Check if current user is following this profile
    let isFollowing = false;
    
    try {
      // Get cookies from next/headers
      const cookieStore = await cookies();
      const authToken = cookieStore.get('auth_token')?.value;
      
      if (authToken) {
        const decoded = verifyToken(authToken) as any;
        if (decoded?.userId) {
          const currentProfile = await CommunityUser.findOne({ 
            userId: decoded.userId 
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
      // Continue without follow status
    }
    
    // Get actual post count from Community model
    const Community = (await import('@/models/Community')).default;
    const postCount = await Community.countDocuments({
      author: communityProfile.userId,
      status: 'active'
    });
    
    // Create profile with correct data
    const profile = {
      ...communityProfile,
      userId: user || communityProfile.userId,
      isFollowing: isFollowing,
      // Update community stats with actual post count
      communityStats: {
        ...communityProfile.communityStats,
        totalPosts: postCount,
      },
      // Ensure counts are numbers
      followerCount: Number(communityProfile.followerCount) || 0,
      followingCount: Number(communityProfile.followingCount) || 0,
    };
    
    // Convert to plain object
    const serializedProfile = JSON.parse(JSON.stringify(profile));
    
    return <UserPublicProfile profile={serializedProfile} username={username} />;
  } catch (error) {
    console.error('Error loading user profile:', error);
    notFound();
  }
}