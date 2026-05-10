// app/community/bookmarks/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  CircularProgress,
  alpha,
  IconButton,
  Divider,
  useTheme,
  Stack,
  Skeleton,
} from '@mui/material';
import {
  ArrowBack,
  Bookmark as BookmarkIcon,
  BookmarkBorder,
  Favorite,
  ChatBubbleOutline,
  AccessTime,
  Delete,
  Launch,
  CheckCircle,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCommunity } from '@/hooks/useCommunity';
import { PostType } from '@/types/community';
import { formatDate } from '@/utils/dateUtils';

// Theme colors (matching Facebook-style)
const useColors = () => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  return {
    dark,
    bg:       dark ? "#18191a" : "#f0f2f5",
    surface:  dark ? "#242526" : "#ffffff",
    surface2: dark ? "#3a3b3c" : "#f0f2f5",
    border:   dark ? "#3e4042" : "#e4e6ea",
    ink:      dark ? "#e4e6eb" : "#050505",
    inkSub:   dark ? "#b0b3b8" : "#65676b",
    inkMuted: dark ? "#6a6d73" : "#8a8d91",
    blue:     "#1877f2",
    blueSoft: dark ? "rgba(24,119,242,0.15)" : "rgba(24,119,242,0.08)",
    green:    dark ? "#45bd62" : "#31a24c",
    red:      dark ? "#f28b82" : "#e41e3f",
    redSoft:  dark ? "rgba(242,139,130,0.12)" : "rgba(228,30,63,0.06)",
  };
};

// Avatar with deterministic color
const AVATAR_COLORS = ["#1877f2","#e91e63","#9c27b0","#ff9800","#4caf50","#00bcd4","#ff5722","#607d8b"];
function avatarColor(name: string) { return AVATAR_COLORS[(name || "U").charCodeAt(0) % AVATAR_COLORS.length]; }

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

export default function BookmarksPage() {
  const theme = useTheme();
  const c = useColors();
  const router = useRouter();
  
  const { toggleBookmark, loading } = useCommunity();
  const [bookmarkedPosts, setBookmarkedPosts] = useState<PostType[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const fetchUserBookmarks = async () => {
    try {
      const response = await fetch('/api/community/bookmarks', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`Failed to fetch bookmarks`);
      const data = await response.json();
      if (data.success) return data.data || [];
      throw new Error(data.message || 'Failed to fetch bookmarks');
    } catch (err) {
      console.error('Fetch bookmarks error:', err);
      throw err;
    }
  };

  const loadBookmarks = async () => {
    try {
      setLocalLoading(true);
      setLocalError(null);
      const posts = await fetchUserBookmarks();
      setBookmarkedPosts(posts || []);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to load bookmarks');
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleRemoveBookmark = async (postId: string) => {
    try {
      await toggleBookmark(postId);
      setBookmarkedPosts(prev => prev.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  const CAT_COLOR: Record<string, string> = {
    general:"#1877f2", questions:"#0288d1", tips:"#388e3c",
    bugs:"#d32f2f", features:"#f57c00", announcements:"#7b1fa2",
  };

  // Calculate stats
  const totalBookmarks = bookmarkedPosts.length;
  const solvedPosts = bookmarkedPosts.filter(p => p.isSolved).length;
  const totalLikes = bookmarkedPosts.reduce((acc, post) => acc + (post.likeCount || 0), 0);
  const totalComments = bookmarkedPosts.reduce((acc, post) => acc + (post.commentCount || 0), 0);

  if (localLoading) {
    return (
      <Box sx={{ bgcolor: c.bg, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="md">
          <Skeleton variant="rounded" height={60} sx={{ borderRadius: "16px", mb: 2 }} />
          <Skeleton variant="rounded" height={100} sx={{ borderRadius: "16px", mb: 2 }} />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={200} sx={{ borderRadius: "16px", mb: 2 }} />
          ))}
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: c.bg, minHeight: "100vh" }}>
      {/* Sticky Header */}
      <Box sx={{ 
        position: "sticky", top: 0, zIndex: 100,
        bgcolor: alpha(c.surface, 0.95), borderBottom: `1px solid ${c.border}`,
        backdropFilter: "blur(10px)" 
      }}>
        <Container maxWidth="md">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.25 }}>
            <IconButton size="small" onClick={() => router.back()}
              sx={{ bgcolor: c.surface2, color: c.ink, "&:hover": { bgcolor: c.border } }}>
              <ArrowBack sx={{ fontSize: 19 }} />
            </IconButton>
            <Typography sx={{ flex: 1, fontWeight: 600, fontSize: "1rem", color: c.ink }}>
              Saved Posts
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: c.inkMuted }}>
              {totalBookmarks} saved
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* Stats Cards */}
        <Paper sx={{ 
          p: 2.5, mb: 3, borderRadius: "16px",
          bgcolor: c.surface, border: `1px solid ${c.border}`
        }}>
          <Box sx={{ 
            display: "flex", flexWrap: "wrap", gap: 2,
            justifyContent: "space-around"
          }}>
            <Box sx={{ textAlign: "center", flex: 1, minWidth: 80 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: c.blue }}>
                {totalBookmarks}
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>Saved</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: c.border }} />
            <Box sx={{ textAlign: "center", flex: 1, minWidth: 80 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: c.green }}>
                {solvedPosts}
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>Solved</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: c.border }} />
            <Box sx={{ textAlign: "center", flex: 1, minWidth: 80 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: c.red }}>
                {totalLikes}
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>Likes</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: c.border }} />
            <Box sx={{ textAlign: "center", flex: 1, minWidth: 80 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: c.blue }}>
                {totalComments}
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>Comments</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Error State */}
        {localError && (
          <Paper sx={{ p: 3, borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, mb: 3 }}>
            <Typography sx={{ color: c.red, textAlign: "center" }}>{localError}</Typography>
            <Button fullWidth onClick={loadBookmarks} sx={{ mt: 2, color: c.blue }}>Retry</Button>
          </Paper>
        )}

        {/* No Bookmarks State */}
        {!localLoading && totalBookmarks === 0 && (
          <Paper sx={{ 
            p: 6, textAlign: "center", borderRadius: "16px", 
            bgcolor: c.surface, border: `1px solid ${c.border}` 
          }}>
            <BookmarkBorder sx={{ fontSize: 64, color: c.inkMuted, mb: 2, opacity: 0.5 }} />
            <Typography sx={{ fontWeight: 600, fontSize: "1.2rem", color: c.ink, mb: 1 }}>
              No saved posts yet
            </Typography>
            <Typography sx={{ color: c.inkSub, mb: 3 }}>
              When you find posts you want to save, click the bookmark icon to add them here.
            </Typography>
            <Button 
              component={Link} href="/community"
              sx={{ bgcolor: c.blue, color: "#fff", textTransform: "none", borderRadius: "8px",
                "&:hover": { bgcolor: "#166fe5" } }}
            >
              Explore Community
            </Button>
          </Paper>
        )}

        {/* Bookmarks List */}
        {!localLoading && totalBookmarks > 0 && (
          <Stack spacing={2}>
            {bookmarkedPosts.map((post) => {
              const catColor = CAT_COLOR[post.category] || c.blue;
              
              return (
                <Paper 
                  key={post._id}
                  sx={{ 
                    borderRadius: "16px", overflow: "hidden",
                    bgcolor: c.surface, border: `1px solid ${c.border}`,
                    transition: "all 0.2s",
                    "&:hover": { transform: "translateY(-2px)", borderColor: c.blue }
                  }}
                >
                  <Box sx={{ height: 3, bgcolor: catColor }} />
                  
                  <CardContent sx={{ p: 2.5 }}>
                    {/* Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <UserAvatar name={post.author?.name} src={post.author?.avatar} size={36} />
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: c.ink }}>
                              {post.author?.name || "Anonymous"}
                            </Typography>
                            {post.author?.isVerified && (
                              <CheckCircle sx={{ fontSize: 12, color: c.blue }} />
                            )}
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AccessTime sx={{ fontSize: 11, color: c.inkMuted }} />
                            <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>
                              {formatDate(post.createdAt)}
                            </Typography>
                            {post.category && (
                              <>
                                <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: c.inkMuted }} />
                                <Chip 
                                  label={post.category} size="small" 
                                  sx={{ height: 18, fontSize: "0.6rem", bgcolor: alpha(catColor, 0.1), color: catColor }} 
                                />
                              </>
                            )}
                            {post.isSolved && (
                              <Chip 
                                label="Solved" size="small" 
                                sx={{ height: 18, fontSize: "0.6rem", bgcolor: alpha(c.green, 0.1), color: c.green }} 
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                      
                      <IconButton 
                        size="small" onClick={() => handleRemoveBookmark(post._id)}
                        sx={{ color: c.inkMuted, "&:hover": { color: c.red, bgcolor: c.redSoft } }}
                      >
                        <Delete sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>

                    {/* Title */}
                    <Typography 
                      component={Link} href={`/community/post/${post._id}`}
                      sx={{ 
                        fontWeight: 700, fontSize: "1.1rem", color: c.ink, mb: 1,
                        display: "block", textDecoration: "none",
                        "&:hover": { color: c.blue }
                      }}
                    >
                      {post.title}
                    </Typography>

                    {/* Content Preview */}
                    <Typography sx={{ 
                      fontSize: "0.85rem", color: c.inkSub, lineHeight: 1.5,
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                      overflow: "hidden", mb: 1.5
                    }}>
                      {post.excerpt || post.content?.substring(0, 200)}...
                    </Typography>

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1.5 }}>
                        {post.tags.slice(0, 3).map((tag, i) => (
                          <Chip key={i} label={`#${tag}`} size="small" variant="outlined"
                            sx={{ height: 22, fontSize: "0.65rem", borderColor: c.border, color: c.inkMuted }} />
                        ))}
                        {post.tags.length > 3 && (
                          <Chip label={`+${post.tags.length - 3}`} size="small"
                            sx={{ height: 22, fontSize: "0.65rem", bgcolor: c.blueSoft, color: c.blue }} />
                        )}
                      </Box>
                    )}

                    {/* Stats */}
                    <Box sx={{ 
                      display: "flex", alignItems: "center", gap: 2, pt: 1,
                      borderTop: `1px solid ${c.border}`
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Favorite sx={{ fontSize: 14, color: c.red }} />
                        <Typography sx={{ fontSize: "0.75rem", color: c.inkMuted }}>
                          {post.likeCount || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ChatBubbleOutline sx={{ fontSize: 14, color: c.inkMuted }} />
                        <Typography sx={{ fontSize: "0.75rem", color: c.inkMuted }}>
                          {post.commentCount || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }} />
                      <Button 
                        size="small" component={Link} href={`/community/post/${post._id}`}
                        startIcon={<Launch sx={{ fontSize: 14 }} />}
                        sx={{ color: c.blue, textTransform: "none", fontSize: "0.75rem" }}
                      >
                        Read More
                      </Button>
                    </Box>
                  </CardContent>
                </Paper>
              );
            })}
          </Stack>
        )}

        {/* Refresh Button */}
        {!localLoading && totalBookmarks > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button 
              onClick={loadBookmarks} disabled={loading}
              sx={{ color: c.blue, textTransform: "none", "&:hover": { bgcolor: c.blueSoft } }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: c.blue }} /> : "Refresh"}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}