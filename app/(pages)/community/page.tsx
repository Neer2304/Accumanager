// app/community/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  Avatar,
  IconButton,
  TextField,
  CircularProgress,
  useTheme,
  alpha,
  Skeleton,
} from "@mui/material";
import {
  Add as AddIcon,
  ThumbUp as LikeIcon,
  ThumbUpOutlined as LikeOutlinedIcon,
  ChatBubbleOutline as CommentIcon,
  BookmarkBorder as BookmarkOutlinedIcon,
  Bookmark as BookmarkFilledIcon,
  Search as SearchIcon,
  Forum as ForumIcon,
  Whatshot as TrendingIcon,
  NewReleases as NewIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useCommunity } from "@/hooks/useCommunity";
import { formatDate } from "@/utils/dateUtils";

// Types
type SortType = "newest" | "popular" | "trending";

// Theme colors
const useColors = () => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  return {
    dark,
    bg: dark ? "#18191a" : "#f0f2f5",
    surface: dark ? "#242526" : "#ffffff",
    surface2: dark ? "#3a3b3c" : "#f0f2f5",
    border: dark ? "#3e4042" : "#e4e6ea",
    ink: dark ? "#e4e6eb" : "#050505",
    inkSub: dark ? "#b0b3b8" : "#65676b",
    inkMuted: dark ? "#6a6d73" : "#8a8d91",
    blue: "#1877f2",
    green: dark ? "#45bd62" : "#31a24c",
  };
};

// Avatar with deterministic color
const AVATAR_COLORS = ["#1877f2", "#e91e63", "#9c27b0", "#ff9800", "#4caf50", "#00bcd4", "#ff5722", "#607d8b"];
function avatarColor(name: string) {
  return AVATAR_COLORS[(name || "U").charCodeAt(0) % AVATAR_COLORS.length];
}

function UserAvatar({ name, src, size = 40 }: { name?: string; src?: string; size?: number }) {
  const c = useColors();
  const initials = (name || "U").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <Avatar src={src || undefined}
      sx={{
        width: size, height: size, bgcolor: avatarColor(name || "U"),
        fontSize: size * 0.38, fontWeight: 700,
        border: `2px solid ${c.surface}`,
      }}>
      {!src && initials}
    </Avatar>
  );
}

// Categories
const CATEGORIES = [
  { id: "all", name: "All", color: "#1877f2" },
  { id: "general", name: "General", color: "#1877f2" },
  { id: "questions", name: "Q&A", color: "#31a24c" },
  { id: "tips", name: "Tips", color: "#fbbc04" },
  { id: "announcements", name: "Announcements", color: "#7b1fa2" },
];

export default function CommunityPage() {
  const c = useColors();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    posts,
    loading,
    error,
    pagination,
    fetchPosts,
    toggleLike,
    toggleBookmark,
    setError,
  } = useCommunity();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    category: "all",
    sort: "newest" as SortType,
    search: "",
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");

  // Get current user
  useEffect(() => {
    const token = document.cookie.match(/auth_token=([^;]+)/)?.[1];
    if (token) {
      try {
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          setCurrentUserId(payload.userId);
        }
      } catch (e) {
        console.error("Failed to decode token:", e);
      }
    }
  }, []);

  // Fetch posts when filters change
  const loadPosts = useCallback(async () => {
    await fetchPosts(filters);
  }, [filters, fetchPosts]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Infinite scroll setup
  useEffect(() => {
    if (loading) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.hasNextPage && !loading) {
          setFilters(prev => ({ ...prev, page: prev.page + 1 }));
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, pagination.hasNextPage]);

  const handleLike = async (postId: string) => {
    try {
      await toggleLike(postId);
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };

  const handleBookmark = async (postId: string) => {
    try {
      await toggleBookmark(postId);
    } catch (error) {
      console.error("Failed to bookmark:", error);
    }
  };

  const handleSearch = () => {
    if (searchInput.trim() !== filters.search) {
      setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    }
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category, page: 1 }));
  };

  const handleSortChange = (sort: SortType) => {
    setFilters(prev => ({ ...prev, sort, page: 1 }));
  };

  const communityPosts = posts as any[];
  const hasLiked = (post: any) => {
    if (!currentUserId || !post.likes) return false;
    return post.likes.some((id: string) => id === currentUserId);
  };
  const hasBookmarked = (post: any) => {
    if (!currentUserId || !post.bookmarks) return false;
    return post.bookmarks.some((id: string) => id === currentUserId);
  };

  return (
    <Box sx={{ bgcolor: c.bg, minHeight: "100vh" }}>
      {/* Hero Header - Clean and Modern */}
      <Box sx={{ 
        bgcolor: c.blue,
        background: `linear-gradient(135deg, ${c.blue} 0%, #0d47a1 100%)`,
        color: "#fff",
        pt: { xs: 4, sm: 5, md: 6 },
        pb: { xs: 5, sm: 6, md: 7 },
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: "700px", mx: "auto" }}>
            <ForumIcon sx={{ fontSize: { xs: 40, sm: 48 }, mb: 2, opacity: 0.9 }} />
            <Typography 
              variant="h3" 
              fontWeight={700} 
              sx={{ 
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
                mb: 1.5,
                letterSpacing: "-0.02em"
              }}
            >
              Community Forum
            </Typography>
            <Typography 
              sx={{ 
                fontSize: { xs: "0.9rem", sm: "1rem" }, 
                opacity: 0.9,
                mb: 3
              }}
            >
              Connect, share knowledge, and grow together with fellow members
            </Typography>
            
            {/* Search Bar in Header */}
            <Paper sx={{ 
              display: "flex", 
              alignItems: "center", 
              maxWidth: "500px", 
              mx: "auto",
              borderRadius: "40px",
              p: "4px 8px",
              bgcolor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
              <SearchIcon sx={{ mx: 1, color: "rgba(255,255,255,0.7)" }} />
              <TextField
                fullWidth
                placeholder="Search discussions..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                variant="standard"
                InputProps={{ disableUnderline: true }}
                sx={{ 
                  "& .MuiInputBase-input": { 
                    py: 1.5, 
                    color: "#fff",
                    "&::placeholder": { color: "rgba(255,255,255,0.7)" }
                  } 
                }}
              />
              <Button 
                onClick={handleSearch}
                sx={{ 
                  color: "#fff", 
                  textTransform: "none",
                  borderRadius: "40px",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
                }}
              >
                Search
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        {/* Create Post Button & Categories Row */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            href="/community/create"
            sx={{ 
              bgcolor: c.blue, 
              textTransform: "none", 
              borderRadius: "40px",
              px: 3,
              py: 1,
              "&:hover": { bgcolor: "#166fe5" }
            }}
          >
            Create New Post
          </Button>

          {/* Sort Chips */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              icon={<NewIcon sx={{ fontSize: 16 }} />}
              label="Newest"
              onClick={() => handleSortChange("newest")}
              sx={{
                bgcolor: filters.sort === "newest" ? c.blue : "transparent",
                color: filters.sort === "newest" ? "#fff" : c.inkSub,
                border: `1px solid ${filters.sort === "newest" ? c.blue : c.border}`,
                borderRadius: "20px",
              }}
            />
            <Chip
              icon={<TrendingIcon sx={{ fontSize: 16 }} />}
              label="Popular"
              onClick={() => handleSortChange("popular")}
              sx={{
                bgcolor: filters.sort === "popular" ? c.blue : "transparent",
                color: filters.sort === "popular" ? "#fff" : c.inkSub,
                border: `1px solid ${filters.sort === "popular" ? c.blue : c.border}`,
                borderRadius: "20px",
              }}
            />
          </Box>
        </Box>

        {/* Categories - Horizontal Scroll */}
        <Box sx={{ 
          display: "flex", 
          gap: 1, 
          overflowX: "auto", 
          pb: 1,
          mb: 3,
          "&::-webkit-scrollbar": { display: "none" },
        }}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              onClick={() => handleCategoryChange(cat.id)}
              sx={{
                bgcolor: filters.category === cat.id ? cat.color : "transparent",
                color: filters.category === cat.id ? "#fff" : c.inkSub,
                border: `1px solid ${filters.category === cat.id ? cat.color : c.border}`,
                borderRadius: "20px",
                px: 1,
                "&:hover": { bgcolor: filters.category === cat.id ? cat.color : alpha(cat.color, 0.1) }
              }}
            />
          ))}
        </Box>

        {/* Error */}
        {error && (
          <Paper sx={{ p: 2, mb: 3, borderRadius: "12px", bgcolor: alpha("#e41e3f", 0.1), border: `1px solid ${alpha("#e41e3f", 0.3)}` }}>
            <Typography sx={{ color: "#e41e3f", fontSize: "0.85rem" }}>{error}</Typography>
            <Button size="small" onClick={() => setError(null)} sx={{ mt: 1, color: "#e41e3f" }}>Dismiss</Button>
          </Paper>
        )}

        {/* Posts List */}
        {communityPosts.length === 0 && !loading ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: "16px", bgcolor: c.surface }}>
            <ForumIcon sx={{ fontSize: 64, color: c.inkMuted, mb: 2, opacity: 0.5 }} />
            <Typography sx={{ fontWeight: 600, color: c.ink, mb: 1 }}>No posts yet</Typography>
            <Typography sx={{ color: c.inkSub, mb: 3 }}>Be the first to start a discussion!</Typography>
            <Button component={Link} href="/community/create" variant="contained" sx={{ bgcolor: c.blue }}>
              Create First Post
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {communityPosts.map((post, index) => {
              const isLast = index === communityPosts.length - 1;
              const catColor = CATEGORIES.find(c => c.id === post.category)?.color || c.blue;
              
              return (
                <Paper 
                  key={post._id} 
                  ref={isLast ? loadMoreRef : null}
                  sx={{ 
                    borderRadius: "16px", 
                    bgcolor: c.surface, 
                    border: `1px solid ${c.border}`, 
                    overflow: "hidden",
                    transition: "all 0.2s",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }
                  }}
                >
                  <Box sx={{ height: 3, bgcolor: catColor }} />
                  <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                    {/* Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <UserAvatar name={post.author?.name} size={36} />
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: c.ink }}>
                            {post.author?.name || "Anonymous"}
                          </Typography>
                          <Typography sx={{ fontSize: "0.65rem", color: c.inkMuted }}>
                            {formatDate(post.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      {post.category && post.category !== "general" && (
                        <Chip 
                          label={post.category} 
                          size="small" 
                          sx={{ height: 20, fontSize: "0.6rem", bgcolor: alpha(catColor, 0.1), color: catColor }} 
                        />
                      )}
                    </Box>

                    {/* Title */}
                    <Typography 
                      component={Link} 
                      href={`/community/post/${post._id}`}
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: "1rem", 
                        color: c.ink, 
                        mb: 1, 
                        display: "block", 
                        textDecoration: "none",
                        "&:hover": { color: c.blue } 
                      }}
                    >
                      {post.title}
                    </Typography>

                    {/* Excerpt */}
                    <Typography sx={{ 
                      fontSize: "0.8rem", 
                      color: c.inkSub, 
                      lineHeight: 1.5, 
                      mb: 1.5, 
                      display: "-webkit-box", 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: "vertical", 
                      overflow: "hidden" 
                    }}>
                      {post.excerpt || post.content?.substring(0, 120)}...
                    </Typography>

                    {/* Actions */}
                    <Box sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 1.5, 
                      pt: 1, 
                      borderTop: `1px solid ${c.border}` 
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleLike(post._id)} 
                          sx={{ p: 0.5, color: hasLiked(post) ? c.blue : c.inkMuted }}
                        >
                          {hasLiked(post) ? <LikeIcon sx={{ fontSize: 14 }} /> : <LikeOutlinedIcon sx={{ fontSize: 14 }} />}
                        </IconButton>
                        <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>{post.likeCount || 0}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <CommentIcon sx={{ fontSize: 13, color: c.inkMuted }} />
                        <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>{post.commentCount || 0}</Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleBookmark(post._id)} 
                        sx={{ p: 0.5, color: hasBookmarked(post) ? c.blue : c.inkMuted }}
                      >
                        {hasBookmarked(post) ? <BookmarkFilledIcon sx={{ fontSize: 14 }} /> : <BookmarkOutlinedIcon sx={{ fontSize: 14 }} />}
                      </IconButton>
                      <Box sx={{ flex: 1 }} />
                      <Button 
                        size="small" 
                        component={Link} 
                        href={`/community/post/${post._id}`} 
                        sx={{ color: c.blue, textTransform: "none", fontSize: "0.7rem", minWidth: "auto" }}
                      >
                        Read More
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
            
            {/* Loading indicator */}
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={28} sx={{ color: c.blue }} />
              </Box>
            )}
            
            {/* End of posts */}
            {!pagination.hasNextPage && communityPosts.length > 0 && (
              <Typography sx={{ textAlign: "center", py: 3, color: c.inkMuted, fontSize: "0.8rem" }}>
                ✨ You've seen all posts ✨
              </Typography>
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
}