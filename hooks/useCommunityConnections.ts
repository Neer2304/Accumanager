// hooks/useCommunityConnections.ts
import { useState, useCallback } from 'react';

export interface UserConnection {
  _id: string;
  username: string;
  avatar?: string;
  bio?: string;
  isVerified?: boolean;
  followerCount: number;
  followingCount: number;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
    shopName?: string;
  };
}

export const useCommunityConnections = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});

  // Get user profile by ID or username
  const getUserProfile = useCallback(async (identifier: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/community/profile/${identifier}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      console.error('Get user profile error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user connections (followers/following)
  const getUserConnections = useCallback(async (
    userId: string, 
    type: 'followers' | 'following' = 'followers',
    page: number = 1,
    limit: number = 20
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/community/profile/${userId}/connections?type=${type}&page=${page}&limit=${limit}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || `Failed to fetch ${type}`);
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch ${type}`;
      setError(errorMessage);
      console.error(`Get ${type} error:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Follow a user
  const followUser = useCallback(async (targetUserId: string) => {
    try {
      setFollowLoading(prev => ({ ...prev, [targetUserId]: true }));
      setError(null);

      console.log('Attempting to follow user:', targetUserId);

      const response = await fetch(`/api/community/profile/${targetUserId}/follow`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Follow response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Follow error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Follow response data:', data);

      if (!data.success) {
        throw new Error(data.message || 'Failed to follow user');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to follow user';
      setError(errorMessage);
      console.error('Follow user error:', err);
      throw err;
    } finally {
      setFollowLoading(prev => ({ ...prev, [targetUserId]: false }));
    }
  }, []);

  // Unfollow a user
  const unfollowUser = useCallback(async (targetUserId: string) => {
    try {
      setFollowLoading(prev => ({ ...prev, [targetUserId]: true }));
      setError(null);

      console.log('Attempting to unfollow user:', targetUserId);

      const response = await fetch(`/api/community/profile/${targetUserId}/follow`, {
        method: 'DELETE',
        credentials: 'include',
      });

      console.log('Unfollow response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Unfollow error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Unfollow response data:', data);

      if (!data.success) {
        throw new Error(data.message || 'Failed to unfollow user');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unfollow user';
      setError(errorMessage);
      console.error('Unfollow user error:', err);
      throw err;
    } finally {
      setFollowLoading(prev => ({ ...prev, [targetUserId]: false }));
    }
  }, []);

  // Check if current user is following a specific user
  const checkFollowingStatus = useCallback(async (targetUserId: string) => {
    try {
      const profile = await getUserProfile(targetUserId);
      return profile?.isFollowing || false;
    } catch (err) {
      console.error('Check following status error:', err);
      return false;
    }
  }, [getUserProfile]);

  // Toggle follow/unfollow
  const toggleFollow = useCallback(async (targetUserId: string, isCurrentlyFollowing: boolean) => {
    try {
      if (isCurrentlyFollowing) {
        return await unfollowUser(targetUserId);
      } else {
        return await followUser(targetUserId);
      }
    } catch (err) {
      console.error('Toggle follow error:', err);
      throw err;
    }
  }, [followUser, unfollowUser]);

  return {
    loading,
    error,
    followLoading,
    getUserProfile,
    getUserConnections,
    followUser,
    unfollowUser,
    checkFollowingStatus,
    toggleFollow,
    setError,
  };
};