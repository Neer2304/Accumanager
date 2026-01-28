// app/community/profile/[username]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UserPublicProfile from '@/components/community/UserPublicProfile';
import { connectToDatabase } from '@/lib/mongodb';
import CommunityUser from '@/models/CommunityUser';
import User from '@/models/User';

interface PageProps {
  params: Promise<{ username: string }>; // Note: params is now a Promise
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    await connectToDatabase();
    
    // Await the params first
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
    
    // Get user details
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
    
    // Await the params first
    const { username } = await params;
    
    if (!username) {
      notFound();
    }
    
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
    
    // Merge user details with community profile
    const profile = {
      ...communityProfile,
      userId: user || communityProfile.userId,
    };
    
    // Convert to plain object
    const serializedProfile = JSON.parse(JSON.stringify(profile));
    
    return <UserPublicProfile profile={serializedProfile} username={username} />;
  } catch (error) {
    console.error('Error loading user profile:', error);
    notFound();
  }
}