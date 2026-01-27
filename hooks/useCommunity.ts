"use client";

import { useState, useCallback } from "react";
import {
  PostType,
  CommunityFilters,
  CommunityStats,
  CommentType,
} from "@/types/community";

// Re-export the types from types file
export type {
  PostType,
  CommunityFilters,
  CommunityStats,
  CommentType,
} from "@/types/community";

export const useCommunity = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch posts with filters
  const fetchPosts = useCallback(
    async (filters: Partial<CommunityFilters> = {}) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "" && value !== null) {
            queryParams.append(key, String(value));
          }
        });

        const response = await fetch(`/api/community?${queryParams}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          setPosts(data.data || []);
          setPagination(
            data.pagination || {
              total: 0,
              page: 1,
              limit: 20,
              pages: 0,
              hasNextPage: false,
              hasPrevPage: false,
            },
          );
        } else {
          throw new Error(data.message || "Failed to fetch posts");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch posts";
        setError(errorMessage);
        console.error("Fetch posts error:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Fetch single post
  const fetchPost = useCallback(async (postId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Clean the ID
      const cleanPostId = String(postId).trim();
      const encodedId = encodeURIComponent(cleanPostId);
      const apiUrl = `/api/community/${encodedId}`;

      console.log("Fetching post:", apiUrl);

      const response = await fetch(apiUrl, {
        credentials: "include",
      });

      console.log("Fetch post response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fetch post error response:", errorText);
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetch post response data:", data);

      if (data.success) {
        setPost(data.data || null);
      } else {
        throw new Error(data.message || "Failed to fetch post");
      }
    } catch (err) {
      console.error("❌ fetchPost error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch post";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new post
  const createPost = useCallback(
    async (postData: {
      title: string;
      content: string;
      category: string;
      tags: string[];
      excerpt?: string;
      attachments?: Array<{
        name: string;
        url: string;
        type: string;
        size: number;
      }>;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/community", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(postData),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to create post");
        }

        // Add to local state
        setPosts((prev) => [data.data, ...prev]);

        return data.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create post";
        setError(errorMessage);
        console.error("Create post error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Update post
  const updatePost = useCallback(
    async (postId: string, updates: Partial<PostType>) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/community/${postId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updates),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to update post");
        }

        // Update in local state
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, ...data.data } : p)),
        );

        if (post && post._id === postId) {
          setPost(data.data);
        }

        return data.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update post";
        setError(errorMessage);
        console.error("Update post error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [post],
  );

  // Delete post
  const deletePost = useCallback(
    async (postId: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/community/${postId}`, {
          method: "DELETE",
          credentials: "include",
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to delete post");
        }

        // Remove from local state
        setPosts((prev) => prev.filter((p) => p._id !== postId));

        if (post && post._id === postId) {
          setPost(null);
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete post";
        setError(errorMessage);
        console.error("Delete post error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [post],
  );

  // In your useCommunity hook, update the toggleLike function:
  // In your useCommunity hook, fix the toggleLike function:

  // In your useCommunity hook, update toggleLike:

  const toggleLike = useCallback(
    async (postId: string) => {
      try {
        console.log("=== TOGGLE LIKE START ===");
        console.log("postId received:", postId);

        // Clean the ID - ensure it's a string
        const cleanPostId = String(postId).trim();
        console.log("Clean post ID:", cleanPostId);

        // Don't encode the entire URL, just the ID if needed
        const encodedId = encodeURIComponent(cleanPostId);
        const apiUrl = `/api/community/${encodedId}/like`;
        console.log("API URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        // Try to get response text first
        const responseText = await response.text();
        console.log("Raw response:", responseText);

        if (!response.ok) {
          console.error("HTTP error:", response.status);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse JSON:", e);
          throw new Error("Invalid server response");
        }

        console.log("Parsed response:", data);

        if (!data.success) {
          throw new Error(data.message || "Failed to toggle like");
        }

        // Update in local state
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            // Get the post ID as string
            const currentId = p._id ? String(p._id).trim() : "";
            console.log("Comparing:", currentId, "with", cleanPostId);

            if (currentId === cleanPostId) {
              console.log("✅ Updating post:", p.title);
              console.log("New likes:", data.data.likes);
              console.log("New likeCount:", data.data.likeCount);

              return {
                ...p,
                likes: data.data.likes || [],
                likeCount: data.data.likeCount || 0,
                lastActivityAt: new Date().toISOString(),
              };
            }
            return p;
          }),
        );

        // Update current post if it matches
        if (post) {
          const currentId = post._id ? String(post._id).trim() : "";
          if (currentId === cleanPostId) {
            console.log("✅ Updating current post");
            setPost({
              ...post,
              likes: data.data.likes || [],
              likeCount: data.data.likeCount || 0,
              lastActivityAt: new Date().toISOString(),
            });
          }
        }

        console.log("✅ Like toggled successfully");
        return data.data;
      } catch (err) {
        console.error("❌ toggleLike error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to toggle like";
        setError(errorMessage);
        throw err;
      }
    },
    [post],
  );

  const addComment = useCallback(
    async (postId: string, content: string) => {
      try {
        console.log(
          "💬 addComment called with postId:",
          postId,
          "content:",
          content,
        );

        // Clean the ID
        const cleanPostId = String(postId).trim();
        const encodedId = encodeURIComponent(cleanPostId);
        const apiUrl = `/api/community/${encodedId}/comments`;

        console.log("Calling comment API:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ content }),
        });

        console.log("Comment response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Comment error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Comment response data:", data);

        if (!data.success) {
          throw new Error(data.message || "Failed to add comment");
        }

        // Update in local state
        setPosts((prev) =>
          prev.map((p) => {
            const currentId = p._id ? String(p._id).trim() : "";
            if (currentId === cleanPostId) {
              console.log("Updating comment for post:", p.title);
              return {
                ...p,
                comments: [...(p.comments || []), data.data],
                commentCount: (p.commentCount || 0) + 1,
                lastActivityAt: new Date().toISOString(),
              };
            }
            return p;
          }),
        );

        // Update current post if it matches
        if (post) {
          const currentId = post._id ? String(post._id).trim() : "";
          if (currentId === cleanPostId) {
            setPost({
              ...post,
              comments: [...(post.comments || []), data.data],
              commentCount: (post.commentCount || 0) + 1,
              lastActivityAt: new Date().toISOString(),
            });
          }
        }

        return data.data;
      } catch (err) {
        console.error("❌ addComment error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add comment";
        setError(errorMessage);
        throw err;
      }
    },
    [post],
  );

  // Update comment
  const updateComment = useCallback(
    async (postId: string, commentId: string, content: string) => {
      try {
        const response = await fetch(
          `/api/community/${postId}/comments/${commentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ content }),
          },
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to update comment");
        }

        // Update in local state
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  comments: (p.comments || []).map((c) =>
                    c._id === commentId ? { ...c, content } : c,
                  ),
                }
              : p,
          ),
        );

        if (post && post._id === postId) {
          setPost({
            ...post,
            comments: (post.comments || []).map((c) =>
              c._id === commentId ? { ...c, content } : c,
            ),
          });
        }

        return data.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update comment";
        setError(errorMessage);
        console.error("Update comment error:", err);
        throw err;
      }
    },
    [post],
  );

  // Delete comment
  const deleteComment = useCallback(
    async (postId: string, commentId: string) => {
      try {
        const response = await fetch(
          `/api/community/${postId}/comments/${commentId}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to delete comment");
        }

        // Update in local state
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  comments: (p.comments || []).filter(
                    (c) => c._id !== commentId,
                  ),
                  commentCount: Math.max(0, (p.commentCount || 0) - 1),
                }
              : p,
          ),
        );

        if (post && post._id === postId) {
          setPost({
            ...post,
            comments: (post.comments || []).filter((c) => c._id !== commentId),
            commentCount: Math.max(0, (post.commentCount || 0) - 1),
          });
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete comment";
        setError(errorMessage);
        console.error("Delete comment error:", err);
        throw err;
      }
    },
    [post],
  );

  // Fetch community stats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/community/stats", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch stats");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch stats";
      setError(errorMessage);
      console.error("Fetch stats error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleBookmark = useCallback(
    async (postId: string) => {
      try {
        console.log("🔖 toggleBookmark called with postId:", postId);

        // Clean the ID
        const cleanPostId = String(postId).trim();
        const encodedId = encodeURIComponent(cleanPostId);
        const apiUrl = `/api/community/${encodedId}/bookmark`;

        console.log("Calling bookmark API:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "POST",
          credentials: "include",
        });

        console.log("Bookmark response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Bookmark error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Bookmark response data:", data);

        if (!data.success) {
          throw new Error(data.message || "Failed to toggle bookmark");
        }

        // Update local state
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            const currentId = p._id ? String(p._id).trim() : "";
            if (currentId === cleanPostId) {
              console.log("Updating bookmark for post:", p.title);
              return {
                ...p,
                bookmarks: data.data.bookmarks || [],
                bookmarkCount: data.data.bookmarkCount || 0,
                lastActivityAt: new Date().toISOString(),
              };
            }
            return p;
          }),
        );

        // Update current post if it matches
        if (post) {
          const currentId = post._id ? String(post._id).trim() : "";
          if (currentId === cleanPostId) {
            setPost({
              ...post,
              bookmarks: data.data.bookmarks || [],
              bookmarkCount: data.data.bookmarkCount || 0,
              lastActivityAt: new Date().toISOString(),
            });
          }
        }

        return data.data;
      } catch (err) {
        console.error("❌ toggleBookmark error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to toggle bookmark";
        setError(errorMessage);
        throw err;
      }
    },
    [post],
  );

  const fetchUserBookmarks = useCallback(async () => {
    try {
      const response = await fetch("/api/community/bookmarks", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookmarks: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // You can store bookmarks in state if needed
        return data.data;
      } else {
        throw new Error(data.message || "Failed to fetch bookmarks");
      }
    } catch (err) {
      console.error("Fetch bookmarks error:", err);
      throw err;
    }
  }, []);

  // Mark as solution
  const markAsSolution = useCallback(
    async (postId: string, commentId: string) => {
      try {
        const response = await fetch(`/api/community/${postId}/solution`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ commentId }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to mark as solution");
        }

        // Update in local state
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  isSolved: data.data?.isSolved || false,
                  solutionCommentId: data.data?.solutionCommentId || undefined,
                  comments: (p.comments || []).map((c) =>
                    c._id === commentId
                      ? { ...c, isSolution: data.data?.isSolved || false }
                      : c,
                  ),
                }
              : p,
          ),
        );

        if (post && post._id === postId) {
          setPost({
            ...post,
            isSolved: data.data?.isSolved || false,
            solutionCommentId: data.data?.solutionCommentId || undefined,
            comments: (post.comments || []).map((c) =>
              c._id === commentId
                ? { ...c, isSolution: data.data?.isSolved || false }
                : c,
            ),
          });
        }

        return data.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to mark as solution";
        setError(errorMessage);
        console.error("Mark as solution error:", err);
        throw err;
      }
    },
    [post],
  );

  return {
    // State
    posts,
    post,
    loading,
    error,
    stats,
    pagination,

    // Actions
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    addComment,
    updateComment,
    deleteComment,
    fetchStats,
    toggleBookmark,
    markAsSolution,

    // Utility
    setError,
  };
};
