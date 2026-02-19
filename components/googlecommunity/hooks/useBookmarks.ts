// components/googlecommunity/hooks/useBookmarks.ts
import { useState, useEffect, useCallback } from 'react';
import { PostType } from '@/types/community';
import { useCommunity } from '@/hooks/useCommunity';

interface UseBookmarksReturn {
  bookmarkedPosts: PostType[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    solved: number;
    totalLikes: number;
    totalComments: number;
  };
  handleRemoveBookmark: (postId: string) => Promise<void>;
  handleClearAll: () => Promise<void>;
  loadBookmarks: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useBookmarks = (): UseBookmarksReturn => {
  const { toggleBookmark, loading: communityLoading } = useCommunity();
  const [bookmarkedPosts, setBookmarkedPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate stats
  const stats = {
    total: bookmarkedPosts.length,
    solved: bookmarkedPosts.filter(p => p.isSolved).length,
    totalLikes: bookmarkedPosts.reduce((acc, post) => acc + (post.likeCount || 0), 0),
    totalComments: bookmarkedPosts.reduce((acc, post) => acc + (post.commentCount || 0), 0)
  };

  // Fetch user bookmarks
  const fetchUserBookmarks = async () => {
    try {
      const response = await fetch('/api/community/bookmarks', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookmarks: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        return data.data || [];
      } else {
        throw new Error(data.message || 'Failed to fetch bookmarks');
      }
    } catch (err) {
      console.error('Fetch bookmarks error:', err);
      throw err;
    }
  };

  // Load bookmarks
  const loadBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const posts = await fetchUserBookmarks();
      setBookmarkedPosts(posts || []);
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove single bookmark
  const handleRemoveBookmark = async (postId: string) => {
    try {
      await toggleBookmark(postId);
      setBookmarkedPosts(prev => prev.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      setError('Failed to remove bookmark');
    }
  };

  // Clear all bookmarks
  const handleClearAll = async () => {
    try {
      setLoading(true);
      // TODO: Implement bulk bookmark removal API
      // For now, remove one by one
      for (const post of bookmarkedPosts) {
        await toggleBookmark(post._id);
      }
      setBookmarkedPosts([]);
    } catch (error) {
      console.error('Failed to clear bookmarks:', error);
      setError('Failed to clear bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  return {
    bookmarkedPosts,
    loading: loading || communityLoading,
    error,
    stats,
    handleRemoveBookmark,
    handleClearAll,
    loadBookmarks,
    setError
  };
};