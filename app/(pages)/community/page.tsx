"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
  TextField,
  Avatar,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Pagination,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Add as AddIcon,
  ThumbUp as LikeIcon,
  ChatBubbleOutline as CommentIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  TrendingUp as TrendingIcon,
  NewReleases as NewIcon,
  QuestionAnswer as QAIcon,
  Lightbulb as TipIcon,
  BugReport as BugIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  Lock as LockIcon,
  PushPin as PinIcon,
  CheckCircle as CheckIcon,
  Send as SendIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  Whatshot as HotIcon,
  Forum as ForumIcon,
  People as PeopleIcon,
  BarChart as ChartIcon,
  Download,
  ChatBubbleOutline,
  PushPin,
  ThumbUp,
} from "@mui/icons-material";
import Link from "next/link";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useCommunity } from "@/hooks/useCommunity";
import { formatDate } from "@/utils/dateUtils";

// Define interfaces locally since they might be missing in the imported hook
interface UserType {
  _id: string;
  name: string;
  role: "user" | "moderator" | "admin" | "expert";
}

interface CommentType {
  _id: string;
  userName: string;
  content: string;
  isSolution: boolean;
  createdAt: string;
}

interface CommunityPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: UserType;
  category: string;
  tags: string[];
  likes: string[];
  likeCount: number;
  comments: CommentType[];
  commentCount: number;
  views: number;
  isPinned: boolean;
  isSolved: boolean;
  solutionCommentId?: string;
  status: "active" | "closed" | "archived" | "deleted";
  lastActivityAt: string;
  createdAt: string;
  bookmarks?: string[];
  bookmarkCount?: number;
}

interface CommunityFilters {
  page: number;
  limit: number;
  category: string;
  sort:
    | "newest"
    | "oldest"
    | "popular"
    | "most_commented"
    | "most_viewed"
    | "trending";
  search: string;
  tag: string;
  author: string;
  status: string;
}

interface CommunityStats {
  totalPosts: number;
  totalComments: number;
  totalUsers: number;
  activeToday: number;
  popularCategories: Array<{ _id: string; count: number }>;
}

// Categories configuration
const CATEGORIES = [
  { id: "all", name: "All Posts", icon: <ForumIcon />, color: "#1976d2" },
  {
    id: "general",
    name: "General Discussion",
    icon: <ChatBubbleOutline />,
    color: "#1976d2",
  },
  { id: "questions", name: "Q&A", icon: <QAIcon />, color: "#0288d1" },
  { id: "tips", name: "Tips & Tricks", icon: <TipIcon />, color: "#388e3c" },
  { id: "bugs", name: "Bug Reports", icon: <BugIcon />, color: "#d32f2f" },
  {
    id: "features",
    name: "Feature Requests",
    icon: <TipIcon />,
    color: "#f57c00",
  },
  {
    id: "announcements",
    name: "Announcements",
    icon: <PushPin />,
    color: "#7b1fa2",
  },
];

// Sort options
const SORT_OPTIONS = [
  { value: "newest", label: "Newest", icon: <DateIcon /> },
  { value: "oldest", label: "Oldest", icon: <DateIcon /> },
  { value: "popular", label: "Most Popular", icon: <ThumbUp /> },
  { value: "most_commented", label: "Most Comments", icon: <CommentIcon /> },
  { value: "most_viewed", label: "Most Viewed", icon: <ViewIcon /> },
  { value: "trending", label: "Trending", icon: <TrendingIcon /> },
];

// Post Card Component
function PostCard({
  post,
  onLike,
  onBookmark,
  onSelect,
  currentUserId,
}: {
  post: CommunityPost;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onSelect: (post: CommunityPost) => void;
  currentUserId?: string;
}) {
  const theme = useTheme();
  const category = CATEGORIES.find((c) => c.id === post.category);

  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  // Check if current user has liked/bookmarked this post
  const hasLiked = useMemo(() => {
    if (!currentUserId || !post.likes) return false;
    return post.likes.some((likeId) => likeId === currentUserId);
  }, [post.likes, currentUserId]);

  const hasBookmarked = useMemo(() => {
    if (!currentUserId || !post.bookmarks) return false;
    return post.bookmarks.some((bookmarkId) => bookmarkId === currentUserId);
  }, [post.bookmarks, currentUserId]);

  const handleLikeClick = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      console.log("=== LIKE CLICK ===");
      console.log("Post object:", post);
      
      // Extract the actual ID
      let actualId = "";
      
      if (typeof post._id === "string") {
        actualId = post._id;
      } else if (post._id && post._id.toString) {
        actualId = post._id.toString();
      } else if (post._id && (post._id as any)._id) {
        actualId = (post._id as any)._id.toString();
      } else {
        actualId = String(post._id);
      }
      
      console.log("Actual ID to send:", actualId);
      await onLike(actualId);
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmarkClick = async () => {
    if (isBookmarking) return;
    
    setIsBookmarking(true);
    try {
      console.log("=== BOOKMARK CLICK ===");
      console.log("Post ID:", post._id);
      
      let actualId = "";
      if (typeof post._id === "string") {
        actualId = post._id;
      } else if (post._id && post._id.toString) {
        actualId = post._id.toString();
      } else {
        actualId = String(post._id);
      }
      
      console.log("Actual ID for bookmark:", actualId);
      await onBookmark(actualId);
    } catch (error) {
      console.error("Bookmark error:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleViewClick = () => {
    console.log("=== VIEW CLICK ===");
    console.log("Opening post:", post._id);
    onSelect(post);
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        transition: "all 0.2s",
        borderLeft: `4px solid ${category?.color || theme.palette.primary.main}`,
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Chip
              icon={category?.icon}
              label={category?.name || post.category}
              size="small"
              sx={{
                mb: 1,
                bgcolor: alpha(
                  category?.color || theme.palette.primary.main,
                  0.1,
                ),
                color: category?.color || theme.palette.primary.main,
              }}
            />
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                mb: 1,
                cursor: "pointer",
                "&:hover": { color: "primary.main" },
              }}
              onClick={handleViewClick}
            >
              {post.title}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {post.isPinned && <PinIcon fontSize="small" color="warning" />}
            {post.isSolved && <CheckIcon fontSize="small" color="success" />}
          </Box>
        </Box>

        {/* Excerpt */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, lineHeight: 1.6 }}
        >
          {post.excerpt}
        </Typography>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
            {post.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem" }}
              />
            ))}
          </Box>
        )}

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Author info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
              {post.author?.name?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography variant="caption" fontWeight={500}>
                {post.author?.name || "Unknown User"}
              </Typography>
              {post.author?.role !== "user" && post.author?.role && (
                <Chip
                  label={post.author.role}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.65rem",
                    textTransform: "capitalize",
                  }}
                />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {formatDate(post.createdAt)}
            </Typography>
          </Box>

          {/* Stats */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              size="small"
              startIcon={
                isLiking ? (
                  <CircularProgress size={16} />
                ) : hasLiked ? (
                  <LikeIcon sx={{ color: "#f44336" }} />
                ) : (
                  <LikeIcon />
                )
              }
              onClick={handleLikeClick}
              disabled={isLiking}
              sx={{
                minWidth: "auto",
                color: hasLiked ? "#f44336" : "text.secondary",
                "&:hover": {
                  color: hasLiked ? "#d32f2f" : "primary.main",
                },
              }}
            >
              {post.likeCount || 0}
            </Button>

            <Button
              size="small"
              startIcon={
                isBookmarking ? (
                  <CircularProgress size={16} />
                ) : hasBookmarked ? (
                  <BookmarkedIcon sx={{ color: "#2196f3" }} />
                ) : (
                  <BookmarkIcon />
                )
              }
              onClick={handleBookmarkClick}
              disabled={isBookmarking}
              sx={{
                minWidth: "auto",
                color: hasBookmarked ? "#2196f3" : "text.secondary",
                "&:hover": {
                  color: hasBookmarked ? "#1976d2" : "primary.main",
                },
              }}
            >
              {post.bookmarkCount || 0}
            </Button>

            <Button
              size="small"
              startIcon={<CommentIcon />}
              onClick={handleViewClick}
              sx={{ minWidth: "auto" }}
            >
              {post.commentCount || 0}
            </Button>

            <Button
              size="small"
              startIcon={<ViewIcon />}
              onClick={handleViewClick}
              sx={{ minWidth: "auto", color: "text.secondary" }}
            >
              {post.views || 0}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// Post Detail Component
function PostDetail({
  post,
  onClose,
  onLike,
  onBookmark,
  onComment,
  onMarkAsSolution,
  currentUserId,
}: {
  post: CommunityPost;
  onClose: () => void;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onComment: (id: string, content: string) => void;
  onMarkAsSolution: (postId: string, commentId: string) => void;
  currentUserId?: string;
}) {
  const theme = useTheme();
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  // Check if current user has liked/bookmarked this post
  const hasLiked = useMemo(() => {
    if (!currentUserId || !post.likes) return false;
    return post.likes.some((likeId) => likeId === currentUserId);
  }, [post.likes, currentUserId]);

  const hasBookmarked = useMemo(() => {
    if (!currentUserId || !post.bookmarks) return false;
    return post.bookmarks.some((bookmarkId) => bookmarkId === currentUserId);
  }, [post.bookmarks, currentUserId]);

  const handleLikeClick = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await onLike(post._id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmarkClick = async () => {
    if (isBookmarking) return;
    setIsBookmarking(true);
    try {
      await onBookmark(post._id);
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <Box>
      {/* Post Content */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {post.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar sx={{ width: 40, height: 40 }}>
                {post.author?.name?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {post.author?.name || "Unknown User"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Posted {formatDate(post.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton 
              onClick={handleLikeClick} 
              disabled={isLiking}
              sx={{ 
                color: hasLiked ? "#f44336" : "inherit",
                "&:hover": { color: hasLiked ? "#d32f2f" : "primary.main" }
              }}
            >
              {isLiking ? <CircularProgress size={24} /> : <LikeIcon />}
            </IconButton>
            
            <IconButton 
              onClick={handleBookmarkClick} 
              disabled={isBookmarking}
              sx={{ 
                color: hasBookmarked ? "#2196f3" : "inherit",
                "&:hover": { color: hasBookmarked ? "#1976d2" : "primary.main" }
              }}
            >
              {isBookmarking ? <CircularProgress size={24} /> : hasBookmarked ? <BookmarkedIcon /> : <BookmarkIcon />}
            </IconButton>
            
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Post Body */}
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8, mb: 3 }}
        >
          {post.content}
        </Typography>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {post.tags.map((tag, index) => (
              <Chip key={index} label={tag} size="small" />
            ))}
          </Box>
        )}

        {/* Stats */}
        <Box sx={{ display: "flex", gap: 3, color: "text.secondary" }}>
          <Typography
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <LikeIcon fontSize="small" /> {post.likeCount || 0} likes
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <BookmarkIcon fontSize="small" /> {post.bookmarkCount || 0} bookmarks
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <CommentIcon fontSize="small" /> {post.commentCount || 0} comments
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <ViewIcon fontSize="small" /> {post.views || 0} views
          </Typography>
        </Box>
      </Paper>

      {/* Comments Section */}
      <Typography variant="h6" gutterBottom>
        Comments ({post.comments?.length || 0})
      </Typography>

      {!post.comments || post.comments.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No comments yet. Be the first to comment!
        </Alert>
      ) : (
        <Stack spacing={2} sx={{ mb: 3 }}>
          {post.comments.map((comment) => (
            <Paper key={comment._id} sx={{ p: 2, borderRadius: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {comment.userName?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {comment.userName || "Unknown User"}
                  </Typography>
                  {comment.isSolution && (
                    <Chip label="Solution" size="small" color="success" />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(comment.createdAt)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {comment.content}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton size="small">
                  <LikeIcon fontSize="small" />
                </IconButton>
                {!post.isSolved && (
                  <Button
                    size="small"
                    onClick={() => onMarkAsSolution(post._id, comment._id)}
                  >
                    Mark as Solution
                  </Button>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Add Comment */}
      <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
        <TextField
          fullWidth
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          onClick={() => {
            if (commentText.trim()) {
              onComment(post._id, commentText);
              setCommentText("");
            }
          }}
          disabled={!commentText.trim()}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
}

export default function CommunityPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    posts,
    loading,
    error,
    stats,
    pagination,
    fetchPosts,
    fetchStats,
    createPost,
    toggleLike,
    addComment,
    deletePost,
    updatePost,
    toggleBookmark,
    markAsSolution,
    setError,
  } = useCommunity();

  const [filters, setFilters] = useState<CommunityFilters>({
    page: 1,
    limit: 20,
    category: "all",
    sort: "newest",
    search: "",
    tag: "",
    author: "",
    status: "active",
  });

  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [newPostData, setNewPostData] = useState({
    title: "",
    content: "",
    category: "general",
    tags: [] as string[],
    excerpt: "",
  });

  const [commentInput, setCommentInput] = useState("");
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch posts and stats on mount
  useEffect(() => {
    fetchPosts(filters);
    fetchStats();
    // Get current user ID from localStorage or cookies
    const token = document.cookie.match(/auth_token=([^;]+)/)?.[1];
    if (token) {
      try {
        // You need to decode the JWT token to get user ID
        // This is a simplified version - you should use your actual token decoding logic
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          setCurrentUserId(payload.userId);
        }
      } catch (e) {
        console.error("Failed to decode token:", e);
      }
    }
  }, [filters, fetchPosts, fetchStats]);

  const handleBack = () => {
    window.history.back();
  };

  const handleFilterChange = (key: keyof CommunityFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange("search", e.target.value);
  };

  const handleCreatePost = async () => {
    try {
      await createPost(newPostData);
      setShowNewPostDialog(false);
      setNewPostData({
        title: "",
        content: "",
        category: "general",
        tags: [],
        excerpt: "",
      });
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await toggleLike(postId);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleBookmarkPost = async (postId: string) => {
    try {
      await toggleBookmark(postId);
    } catch (error) {
      console.error("Failed to bookmark post:", error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentInput.trim()) return;

    try {
      await addComment(postId, commentInput);
      setCommentInput("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(postId);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleMarkAsSolution = async (postId: string, commentId: string) => {
    try {
      await markAsSolution(postId, commentId);
    } catch (error) {
      console.error("Failed to mark as solution:", error);
    }
  };

  const handleDownloadCommunity = () => {
    try {
      // Create community content
      const content = `
ATTENDANCE PRO COMMUNITY EXPORT
===============================
Generated on: ${new Date().toLocaleDateString()}
Total Posts: ${stats?.totalPosts || 0}
Total Users: ${stats?.totalUsers || 0}

${posts
  .map(
    (post: any, index) => `
${index + 1}. [${post.category.toUpperCase()}] ${post.title}
   By: ${post.author?.name || "Unknown"} | ${new Date(post.createdAt).toLocaleDateString()}
   Likes: ${post.likeCount || 0} | Comments: ${post.commentCount || 0} | Views: ${post.views || 0}
   
   ${post.excerpt}
   
   Tags: ${post.tags?.join(", ") || "None"}
   ${"-".repeat(80)}
`,
  )
  .join("\n")}

${stats?.popularCategories
  ?.map((cat) => `${cat._id}: ${cat.count} posts`)
  .join("\n")}

For more, visit: https://yourapp.com/community
      `.trim();

      // Create and trigger download
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `community_export_${new Date().toISOString().split("T")[0]}.txt`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("Community data exported successfully!");
    } catch (error) {
      console.error("Error exporting community:", error);
      alert("Failed to export community data");
    }
  };

  // Cast posts to CommunityPost type
  const communityPosts = posts as unknown as CommunityPost[];

  return (
    <MainLayout title="Community Forum">
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          {/* Back Button */}
          <Button
            startIcon={<BackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
            size="small"
            variant="outlined"
          >
            Back to Dashboard
          </Button>

          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
              Dashboard
            </MuiLink>
            <Typography color="text.primary">Community</Typography>
          </Breadcrumbs>

          {/* Main Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                👥 Community Forum
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Connect with other users, share knowledge, and get help
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                width: { xs: "100%", sm: "auto" },
                justifyContent: { xs: "space-between", sm: "flex-end" },
              }}
            >
              {/* Stats Chips */}
              <Stack direction="row" spacing={1} alignItems="center">
                {stats && (
                  <>
                    <Chip
                      icon={<ForumIcon />}
                      label={`${stats.totalPosts} Posts`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      icon={<PeopleIcon />}
                      label={`${stats.totalUsers} Users`}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                    <Chip
                      icon={<ChartIcon />}
                      label={`${stats.activeToday} Active Today`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </>
                )}
              </Stack>

              {/* Download Button */}
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadCommunity}
                size={isMobile ? "small" : "medium"}
                sx={{
                  borderRadius: 2,
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "primary.dark",
                  },
                }}
              >
                Export
              </Button>

              {/* New Post Button */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowNewPostDialog(true)}
                size={isMobile ? "small" : "medium"}
                sx={{
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: theme.shadows[2],
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                New Post
              </Button>
            </Stack>
          </Box>

          {/* Search & Filter Bar */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              background: "background.paper",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: "divider",
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {/* Search */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  minWidth: 300,
                }}
              >
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                <TextField
                  fullWidth
                  placeholder="Search discussions, questions, or topics..."
                  value={filters.search}
                  onChange={handleSearch}
                  variant="standard"
                  size="small"
                  InputProps={{ disableUnderline: true }}
                />
              </Box>

              {/* Category Filter */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  label="Category"
                  startAdornment={<CategoryIcon sx={{ mr: 1 }} />}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {cat.icon}
                        {cat.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Sort Filter */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  label="Sort by"
                  startAdornment={<SortIcon sx={{ mr: 1 }} />}
                >
                  {SORT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {option.icon}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Categories Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}>
          <Tabs
            value={filters.category}
            onChange={(e, newValue) => handleFilterChange("category", newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              bgcolor: "background.paper",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                minHeight: 60,
              },
            }}
          >
            {CATEGORIES.map((category) => (
              <Tab
                key={category.id}
                value={category.id}
                icon={category.icon}
                iconPosition="start"
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {category.name}
                    {stats?.popularCategories?.find(
                      (c) => c._id === category.id,
                    ) && (
                      <Chip
                        label={
                          stats.popularCategories.find(
                            (c) => c._id === category.id,
                          )?.count
                        }
                        size="small"
                        sx={{ height: 20, fontSize: "0.75rem" }}
                      />
                    )}
                  </Box>
                }
                sx={{
                  color:
                    filters.category === category.id
                      ? category.color
                      : "text.secondary",
                }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Content Grid */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
          }}
        >
          {/* Main Posts */}
          <Box sx={{ flex: 1 }}>
            {loading ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <CircularProgress />
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  Loading community posts...
                </Typography>
              </Box>
            ) : communityPosts.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <ForumIcon
                  sx={{
                    fontSize: 60,
                    color: "text.secondary",
                    opacity: 0.5,
                    mb: 2,
                  }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No posts found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {filters.search
                    ? "Try a different search term"
                    : "Be the first to start a discussion!"}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowNewPostDialog(true)}
                >
                  Create First Post
                </Button>
              </Box>
            ) : (
              <>
                {/* Pinned Posts */}
                {communityPosts.filter((p) => p.isPinned).length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <PinIcon />
                      Pinned Posts
                    </Typography>
                    <Stack spacing={2}>
                      {communityPosts
                        .filter((p) => p.isPinned)
                        .map((post) => (
                          <PostCard
                            key={post._id}
                            post={post}
                            onLike={handleLikePost}
                            onBookmark={handleBookmarkPost}
                            onSelect={setSelectedPost}
                            currentUserId={currentUserId || undefined}
                          />
                        ))}
                    </Stack>
                  </Box>
                )}

                {/* All Posts */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <NewIcon />
                  {filters.sort === "trending"
                    ? "Trending Now"
                    : "Recent Discussions"}
                </Typography>

                <Stack spacing={2}>
                  {communityPosts
                    .filter((p) => !p.isPinned)
                    .map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        onLike={handleLikePost}
                        onBookmark={handleBookmarkPost}
                        onSelect={setSelectedPost}
                        currentUserId={currentUserId || undefined}
                      />
                    ))}
                </Stack>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <Pagination
                      count={pagination.pages}
                      page={pagination.page}
                      onChange={(e, page) => handleFilterChange("page", page)}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Sidebar */}
          <Box sx={{ width: { xs: "100%", lg: 350 } }}>
            {/* Community Stats */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <ChartIcon />
                  Community Stats
                </Typography>
                {stats ? (
                  <Stack spacing={1.5}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Total Posts
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {stats.totalPosts}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Total Comments
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {stats.totalComments}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Total Users
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {stats.totalUsers}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Active Today
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {stats.activeToday}
                      </Typography>
                    </Box>
                  </Stack>
                ) : (
                  <CircularProgress size={20} />
                )}
              </CardContent>
            </Card>

            {/* Popular Categories */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <HotIcon />
                  Popular Categories
                </Typography>
                <Stack spacing={1}>
                  {stats?.popularCategories?.map((category) => (
                    <Box
                      key={category._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderRadius: 1,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        },
                      }}
                      onClick={() =>
                        handleFilterChange("category", category._id)
                      }
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        {CATEGORIES.find((c) => c.id === category._id)?.icon}
                        <Typography variant="body2" fontWeight={500}>
                          {CATEGORIES.find((c) => c.id === category._id)
                            ?.name || category._id}
                        </Typography>
                      </Box>
                      <Chip label={category.count} size="small" />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📝 Community Guidelines
                </Typography>
                <Stack spacing={1}>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <CheckIcon
                      fontSize="small"
                      sx={{ color: "success.main", mt: 0.2 }}
                    />
                    Be respectful and professional
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <CheckIcon
                      fontSize="small"
                      sx={{ color: "success.main", mt: 0.2 }}
                    />
                    No spam or self-promotion
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <CheckIcon
                      fontSize="small"
                      sx={{ color: "success.main", mt: 0.2 }}
                    />
                    Stay on topic
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <CheckIcon
                      fontSize="small"
                      sx={{ color: "success.main", mt: 0.2 }}
                    />
                    Help others when you can
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <CheckIcon
                      fontSize="small"
                      sx={{ color: "success.main", mt: 0.2 }}
                    />
                    Report inappropriate content
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* New Post Dialog */}
      <Dialog
        open={showNewPostDialog}
        onClose={() => setShowNewPostDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              value={newPostData.title}
              onChange={(e) =>
                setNewPostData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter a descriptive title for your post"
              required
            />

            <TextField
              fullWidth
              label="Content"
              value={newPostData.content}
              onChange={(e) =>
                setNewPostData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Describe your question, issue, or discussion topic in detail"
              multiline
              rows={6}
              required
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newPostData.category}
                  onChange={(e) =>
                    setNewPostData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  label="Category"
                >
                  {CATEGORIES.filter((c) => c.id !== "all").map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {category.icon}
                        {category.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Tags (comma separated)"
                value={newPostData.tags.join(", ")}
                onChange={(e) =>
                  setNewPostData((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t),
                  }))
                }
                placeholder="e.g., attendance, reports, mobile"
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewPostDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreatePost}
            variant="contained"
            disabled={!newPostData.title.trim() || !newPostData.content.trim()}
          >
            Create Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* Post Detail Dialog */}
      {selectedPost && (
        <Dialog
          open={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxHeight: '90vh',
            }
          }}
        >
          <DialogTitle>{selectedPost.title}</DialogTitle>
          <DialogContent dividers>
            <PostDetail
              post={selectedPost}
              onClose={() => setSelectedPost(null)}
              onLike={handleLikePost}
              onBookmark={handleBookmarkPost}
              onComment={handleAddComment}
              onMarkAsSolution={handleMarkAsSolution}
              currentUserId={currentUserId || undefined}
            />
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
}