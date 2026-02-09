// app/community/page.tsx
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
  Tooltip,
  LinearProgress,
  Snackbar,
} from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Add as AddIcon,
  ThumbUp as LikeIcon,
  ThumbUpOutlined as LikeOutlinedIcon,
  ChatBubbleOutline as CommentIcon,
  ChatBubble as CommentFilledIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  BookmarkBorder as BookmarkOutlinedIcon,
  Bookmark as BookmarkFilledIcon,
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
} from "@mui/icons-material";
import Link from "next/link";
import { useCommunity } from "@/hooks/useCommunity";
import { formatDate } from "@/utils/dateUtils";

// Define TypeScript interfaces
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
  { id: "all", name: "All Posts", icon: <ForumIcon />, color: "#4285f4" },
  {
    id: "general",
    name: "General Discussion",
    icon: <CommentIcon />,
    color: "#4285f4",
  },
  { id: "questions", name: "Q&A", icon: <QAIcon />, color: "#34a853" },
  { id: "tips", name: "Tips & Tricks", icon: <TipIcon />, color: "#fbbc04" },
  { id: "bugs", name: "Bug Reports", icon: <BugIcon />, color: "#ea4335" },
  {
    id: "features",
    name: "Feature Requests",
    icon: <TipIcon />,
    color: "#f57c00",
  },
  {
    id: "announcements",
    name: "Announcements",
    icon: <PinIcon />,
    color: "#9c27b0",
  },
];

// Sort options
const SORT_OPTIONS = [
  { value: "newest", label: "Newest", icon: <DateIcon /> },
  { value: "oldest", label: "Oldest", icon: <DateIcon /> },
  { value: "popular", label: "Most Popular", icon: <LikeIcon /> },
  { value: "most_commented", label: "Most Comments", icon: <CommentIcon /> },
  { value: "most_viewed", label: "Most Viewed", icon: <ViewIcon /> },
  { value: "trending", label: "Trending", icon: <TrendingIcon /> },
];

// Reusable Card Component
const GoogleCard = ({ 
  children, 
  elevation = 0, 
  sx = {}, 
  hover = true,
  clickable = false,
  onClick,
}: {
  children: React.ReactNode;
  elevation?: number;
  sx?: any;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  return (
    <Paper
      elevation={elevation}
      sx={{
        borderRadius: 3,
        backgroundColor: darkMode ? "#202124" : "#ffffff",
        border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
        transition: hover ? "all 0.2s ease" : "none",
        "&:hover": hover
          ? {
              boxShadow: darkMode
                ? "0 8px 24px rgba(0,0,0,0.3)"
                : "0 8px 24px rgba(0,0,0,0.1)",
              transform: "translateY(-2px)",
              borderColor: darkMode ? "#5f6368" : "#bdc1c6",
            }
          : {},
        cursor: clickable ? "pointer" : "default",
        overflow: "hidden",
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </Paper>
  );
};

// Reusable Icon Button with active state
interface ActionIconButtonProps {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  active: boolean;
  count?: number;
  onClick: (e: React.MouseEvent) => void;
  loading?: boolean;
  size?: "small" | "medium" | "large";
}

const ActionIconButton: React.FC<ActionIconButtonProps> = ({
  icon,
  activeIcon,
  active,
  count,
  onClick,
  loading = false,
  size = "small",
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <IconButton
        size={size}
        onClick={onClick}
        disabled={loading}
        sx={{
          color: active ? "#4285f4" : darkMode ? "#9aa0a6" : "#5f6368",
          "&:hover": {
            backgroundColor: alpha("#4285f4", 0.1),
            color: "#4285f4",
          },
          padding: size === "small" ? "4px" : "8px",
        }}
      >
        {loading ? (
          <CircularProgress size={size === "small" ? 16 : 24} />
        ) : active ? (
          activeIcon
        ) : (
          icon
        )}
      </IconButton>
      {count !== undefined && (
        <Typography
          variant="caption"
          sx={{
            color: active ? "#4285f4" : darkMode ? "#9aa0a6" : "#5f6368",
            fontWeight: active ? 600 : 400,
            minWidth: "1.5rem",
            fontSize: "0.75rem",
          }}
        >
          {count}
        </Typography>
      )}
    </Box>
  );
};

// Post Card Component with active state icons
interface PostCardProps {
  post: CommunityPost;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onSelect: (post: CommunityPost) => void;
  currentUserId?: string;
}

function PostCard({ post, onLike, onBookmark, onSelect, currentUserId }: PostCardProps) {
  const theme = useTheme();
  const category = CATEGORIES.find((c) => c.id === post.category);

  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  // Check if current user has liked/bookmarked this post
  const hasLiked = useMemo(() => {
    if (!currentUserId || !post.likes) return false;
    return post.likes.some((likeId: string) => likeId === currentUserId);
  }, [post.likes, currentUserId]);

  const hasBookmarked = useMemo(() => {
    if (!currentUserId || !post.bookmarks) return false;
    return post.bookmarks.some((bookmarkId: string) => bookmarkId === currentUserId);
  }, [post.bookmarks, currentUserId]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);
    try {
      let actualId = "";
      if (typeof post._id === "string") {
        actualId = post._id;
      } else if (post._id && post._id.toString) {
        actualId = post._id.toString();
      } else {
        actualId = String(post._id);
      }
      await onLike(actualId);
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarking) return;
    setIsBookmarking(true);
    try {
      let actualId = "";
      if (typeof post._id === "string") {
        actualId = post._id;
      } else if (post._id && post._id.toString) {
        actualId = post._id.toString();
      } else {
        actualId = String(post._id);
      }
      await onBookmark(actualId);
    } catch (error) {
      console.error("Bookmark error:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleViewClick = () => {
    onSelect(post);
  };

  const handleEyeIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(post);
  };

  return (
    <GoogleCard hover clickable onClick={handleViewClick}>
      <CardContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Chip
              icon={category?.icon}
              label={category?.name || post.category}
              size="small"
              sx={{
                mb: 1,
                bgcolor: alpha(category?.color || "#4285f4", 0.1),
                color: category?.color || "#4285f4",
                borderColor: alpha(category?.color || "#4285f4", 0.3),
                fontSize: "0.75rem",
                height: "24px",
              }}
            />
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 500,
                mb: 1,
                cursor: "pointer",
                color: theme.palette.mode === "dark" ? "#e8eaed" : "#202124",
                "&:hover": { color: "#4285f4" },
                fontSize: { xs: "1rem", sm: "1.125rem" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(post);
              }}
            >
              {post.title}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
            {post.isPinned && (
              <PinIcon fontSize="small" sx={{ color: "#fbbc04" }} />
            )}
            {post.isSolved && (
              <CheckIcon fontSize="small" sx={{ color: "#34a853" }} />
            )}
          </Box>
        </Box>

        {/* Excerpt */}
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            lineHeight: 1.6,
            color: theme.palette.mode === "dark" ? "#9aa0a6" : "#5f6368",
            fontSize: "0.875rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {post.excerpt}
        </Typography>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ 
            display: "flex", 
            gap: 0.5, 
            flexWrap: "wrap", 
            mb: 2,
            overflow: "hidden",
            maxHeight: "32px"
          }}>
            {post.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.7rem",
                  height: "24px",
                  borderColor: theme.palette.mode === "dark" ? "#3c4043" : "#dadce0",
                  color: theme.palette.mode === "dark" ? "#9aa0a6" : "#5f6368",
                }}
              />
            ))}
            {post.tags.length > 3 && (
              <Chip
                label={`+${post.tags.length - 3}`}
                size="small"
                sx={{
                  fontSize: "0.7rem",
                  height: "24px",
                  bgcolor: alpha("#4285f4", 0.1),
                  color: "#4285f4",
                }}
              />
            )}
          </Box>
        )}

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            flexWrap: { xs: "wrap", sm: "nowrap" },
            gap: { xs: 1, sm: 0 },
          }}
        >
          {/* Author info */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            flex: { xs: "1 1 100%", sm: "0 1 auto" },
            minWidth: 0,
          }}>
            <Avatar sx={{ 
              width: { xs: 28, sm: 32 }, 
              height: { xs: 28, sm: 32 }, 
              fontSize: { xs: 12, sm: 14 } 
            }}>
              {post.author?.name?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <Box sx={{ minWidth: 0, overflow: "hidden" }}>
              <Typography
                variant="caption"
                fontWeight={500}
                sx={{ 
                  color: theme.palette.mode === "dark" ? "#e8eaed" : "#202124",
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {post.author?.name || "Unknown User"}
              </Typography>
              {post.author?.role !== "user" && post.author?.role && (
                <Chip
                  label={post.author.role}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.6rem",
                    textTransform: "capitalize",
                    bgcolor: alpha("#4285f4", 0.1),
                    color: "#4285f4",
                  }}
                />
              )}
            </Box>
            <Typography
              variant="caption"
              sx={{ 
                color: theme.palette.mode === "dark" ? "#9aa0a6" : "#5f6368",
                flexShrink: 0,
                fontSize: "0.7rem"
              }}
            >
              {formatDate(post.createdAt)}
            </Typography>
          </Box>

          {/* Stats with active state icons */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: { xs: 0.5, sm: 1 },
            flex: { xs: "1 1 100%", sm: "0 1 auto" },
            justifyContent: { xs: "space-between", sm: "flex-end" }
          }}>
            {/* Like Button - Blue when liked */}
            <ActionIconButton
              icon={<LikeOutlinedIcon />}
              activeIcon={<LikeIcon sx={{ color: "#4285f4" }} />}
              active={hasLiked}
              count={post.likeCount || 0}
              onClick={handleLikeClick}
              loading={isLiking}
              size="small"
            />

            {/* Bookmark Button - Blue when bookmarked */}
            <ActionIconButton
              icon={<BookmarkOutlinedIcon />}
              activeIcon={<BookmarkFilledIcon sx={{ color: "#4285f4" }} />}
              active={hasBookmarked}
              count={post.bookmarkCount || 0}
              onClick={handleBookmarkClick}
              loading={isBookmarking}
              size="small"
            />

            {/* Comment Button */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton
                size="small"
                sx={{
                  color: theme.palette.mode === "dark" ? "#9aa0a6" : "#5f6368",
                  padding: "4px",
                }}
              >
                <CommentIcon />
              </IconButton>
              <Typography
                variant="caption"
                sx={{ 
                  color: theme.palette.mode === "dark" ? "#9aa0a6" : "#5f6368",
                  minWidth: "1.5rem",
                  fontSize: "0.75rem"
                }}
              >
                {post.commentCount || 0}
              </Typography>
            </Box>

            {/* View Button - This should open the dialog */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={handleEyeIconClick}
                sx={{
                  color: theme.palette.mode === "dark" ? "#9aa0a6" : "#5f6368",
                  padding: "4px",
                  "&:hover": {
                    backgroundColor: alpha("#4285f4", 0.1),
                    color: "#4285f4",
                  },
                }}
              >
                <ViewIcon />
              </IconButton>
              <Typography
                variant="caption"
                sx={{ 
                  color: theme.palette.mode === "dark" ? "#9aa0a6" : "#5f6368",
                  minWidth: "1.5rem",
                  fontSize: "0.75rem"
                }}
              >
                {post.views || 0}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </GoogleCard>
  );
}

// Post Detail Component - RESTORED
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
  const darkMode = theme.palette.mode === "dark";
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  // Check if current user has liked/bookmarked this post
  const hasLiked = useMemo(() => {
    if (!currentUserId || !post.likes) return false;
    return post.likes.some((likeId: string) => likeId === currentUserId);
  }, [post.likes, currentUserId]);

  const hasBookmarked = useMemo(() => {
    if (!currentUserId || !post.bookmarks) return false;
    return post.bookmarks.some((bookmarkId: string) => bookmarkId === currentUserId);
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

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    onComment(post._id, commentText);
    setCommentText("");
  };

  return (
    <Box>
      {/* Post Content */}
      <GoogleCard sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ 
              color: darkMode ? "#e8eaed" : "#202124",
              fontSize: { xs: "1.25rem", sm: "1.5rem" }
            }}>
              {post.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar sx={{ width: 40, height: 40 }}>
                {post.author?.name?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ 
                  color: darkMode ? "#e8eaed" : "#202124",
                  fontSize: { xs: "0.875rem", sm: "1rem" }
                }}>
                  {post.author?.name || "Unknown User"}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" }
                }}>
                  Posted {formatDate(post.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <ActionIconButton
              icon={<LikeOutlinedIcon />}
              activeIcon={<LikeIcon sx={{ color: "#4285f4" }} />}
              active={hasLiked}
              count={post.likeCount || 0}
              onClick={handleLikeClick}
              loading={isLiking}
              size="medium"
            />

            <ActionIconButton
              icon={<BookmarkOutlinedIcon />}
              activeIcon={<BookmarkFilledIcon sx={{ color: "#4285f4" }} />}
              active={hasBookmarked}
              count={post.bookmarkCount || 0}
              onClick={handleBookmarkClick}
              loading={isBookmarking}
              size="medium"
            />

            <IconButton
              sx={{
                color: darkMode ? "#9aa0a6" : "#5f6368",
                "&:hover": {
                  backgroundColor: alpha("#4285f4", 0.1),
                  color: "#4285f4",
                },
              }}
            >
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Post Body */}
        <Typography
          variant="body1"
          sx={{ 
            whiteSpace: "pre-wrap", 
            lineHeight: 1.8, 
            mb: 3,
            color: darkMode ? "#e8eaed" : "#202124",
            fontSize: { xs: "0.875rem", sm: "1rem" }
          }}
        >
          {post.content}
        </Typography>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {post.tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                sx={{
                  borderColor: darkMode ? "#3c4043" : "#dadce0",
                  color: darkMode ? "#e8eaed" : "#202124",
                }}
              />
            ))}
          </Box>
        )}

        {/* Stats */}
        <Box sx={{ 
          display: "flex", 
          gap: 3, 
          flexWrap: "wrap",
          color: darkMode ? "#9aa0a6" : "#5f6368",
        }}>
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
            <BookmarkOutlinedIcon fontSize="small" /> {post.bookmarkCount || 0}{" "}
            bookmarks
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
      </GoogleCard>

      {/* Comments Section */}
      <Typography variant="h6" gutterBottom sx={{ 
        color: darkMode ? "#e8eaed" : "#202124",
        fontSize: { xs: "1rem", sm: "1.25rem" }
      }}>
        Comments ({post.comments?.length || 0})
      </Typography>

      {!post.comments || post.comments.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          No comments yet. Be the first to comment!
        </Alert>
      ) : (
        <Stack spacing={2} sx={{ mb: 3 }}>
          {post.comments.map((comment) => (
            <GoogleCard key={comment._id} sx={{ p: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {comment.userName?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ 
                    color: darkMode ? "#e8eaed" : "#202124",
                    fontSize: "0.875rem"
                  }}>
                    {comment.userName || "Unknown User"}
                  </Typography>
                  {comment.isSolution && (
                    <Chip 
                      label="Solution" 
                      size="small" 
                      sx={{
                        backgroundColor: "#34a853",
                        color: "#ffffff",
                        fontSize: "0.75rem",
                        height: "20px",
                      }}
                    />
                  )}
                </Box>
                <Typography variant="caption" sx={{ 
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontSize: "0.75rem"
                }}>
                  {formatDate(comment.createdAt)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ 
                mb: 1,
                color: darkMode ? "#e8eaed" : "#202124",
                fontSize: "0.875rem"
              }}>
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
                    sx={{
                      color: "#4285f4",
                      fontSize: "0.75rem",
                    }}
                  >
                    Mark as Solution
                  </Button>
                )}
              </Box>
            </GoogleCard>
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
          sx={{
            "& .MuiInputBase-input": {
              color: darkMode ? "#e8eaed" : "#202124",
              fontSize: { xs: "0.875rem", sm: "1rem" }
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleCommentSubmit}
          disabled={!commentText.trim()}
          sx={{
            backgroundColor: "#4285f4",
            "&:hover": { backgroundColor: "#3367d6" },
            minWidth: "auto",
            px: 2,
          }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
}

export default function CommunityPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

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

  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch posts and stats
  useEffect(() => {
    fetchPosts(filters);
    fetchStats();
    // Get current user ID
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
  }, [filters, fetchPosts, fetchStats]);

  const handleFilterChange = (key: keyof CommunityFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
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

  const handleAddComment = async (postId: string, content: string) => {
    if (!content.trim()) return;
    try {
      await addComment(postId, content);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleMarkAsSolution = async (postId: string, commentId: string) => {
    try {
      await markAsSolution(postId, commentId);
    } catch (error) {
      console.error("Failed to mark as solution:", error);
    }
  };

  // Cast posts to CommunityPost type
  const communityPosts = posts as unknown as CommunityPost[];

  return (
    <Box sx={{ 
      backgroundColor: darkMode ? "#202124" : "#ffffff", 
      minHeight: "100vh",
      width: "100%",
      overflowX: "hidden",
    }}>
      {/* Header */}
      <Box
        sx={{
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
          background: darkMode
            ? "linear-gradient(135deg, #0d3064 0%, #202124 100%)"
            : "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
          width: "100%",
        }}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ 
          mb: { xs: 1, sm: 2 }, 
          fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
          overflow: "hidden",
          "& .MuiBreadcrumbs-ol": {
            flexWrap: "wrap",
          }
        }}>
          <MuiLink
            component={Link}
            href="/dashboard"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: darkMode ? "#9aa0a6" : "#5f6368",
              "&:hover": { color: darkMode ? "#8ab4f8" : "#4285f4" },
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: { xs: "12px", sm: "14px", md: "16px" } }} />
            Dashboard
          </MuiLink>
          <Typography sx={{ 
            color: darkMode ? "#e8eaed" : "#202124",
            fontSize: { xs: "0.7rem", sm: "0.8rem" }
          }}>
            Community
          </Typography>
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
            width: "100%",
          }}
        >
          <Box sx={{ maxWidth: "100%" }}>
            <Typography
              variant="h4"
              fontWeight={500}
              gutterBottom
              sx={{ 
                color: darkMode ? "#e8eaed" : "#202124",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
                wordBreak: "break-word",
              }}
            >
              👥 Community Forum
            </Typography>
            <Typography
              variant="body1"
              sx={{ 
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                wordBreak: "break-word",
              }}
            >
              Connect with other users, share knowledge, and get help
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems="center"
            sx={{
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "stretch", sm: "flex-end" },
              gap: 1,
            }}
          >
            {/* Stats Chips - Only show on tablet/desktop */}
            {!isMobile && stats && (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexWrap: "wrap" }}>
                <Chip
                  icon={<ForumIcon sx={{ fontSize: "14px" }} />}
                  label={`${stats.totalPosts}`}
                  size="small"
                  sx={{
                    bgcolor: alpha("#4285f4", darkMode ? 0.2 : 0.1),
                    color: "#4285f4",
                    borderColor: alpha("#4285f4", 0.3),
                    fontSize: "0.7rem",
                    height: "24px",
                  }}
                />
                <Chip
                  icon={<PeopleIcon sx={{ fontSize: "14px" }} />}
                  label={`${stats.totalUsers}`}
                  size="small"
                  sx={{
                    bgcolor: alpha("#34a853", darkMode ? 0.2 : 0.1),
                    color: "#34a853",
                    borderColor: alpha("#34a853", 0.3),
                    fontSize: "0.7rem",
                    height: "24px",
                  }}
                />
              </Stack>
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => {}}
                size={isMobile ? "small" : "medium"}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  borderColor: darkMode ? "#5f6368" : "#dadce0",
                  color: darkMode ? "#e8eaed" : "#202124",
                  "&:hover": {
                    borderColor: darkMode ? "#8ab4f8" : "#4285f4",
                    backgroundColor: darkMode
                      ? alpha("#4285f4", 0.1)
                      : alpha("#4285f4", 0.05),
                  },
                  flex: { xs: 1, sm: "auto" },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {isMobile ? "Export" : "Export Data"}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowNewPostDialog(true)}
                size={isMobile ? "small" : "medium"}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  backgroundColor: "#4285f4",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#3367d6",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                  flex: { xs: 1, sm: "auto" },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {isMobile ? "New" : "New Post"}
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Search & Filter Bar */}
        <GoogleCard sx={{ p: { xs: 1, sm: 2 }, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              width: "100%",
            }}
          >
            {/* Search */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                minWidth: { xs: "100%", sm: "300px" },
                width: "100%",
              }}
            >
              <SearchIcon sx={{ 
                mr: 1, 
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontSize: { xs: "18px", sm: "20px" }
              }} />
              <TextField
                fullWidth
                placeholder="Search discussions..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                variant="standard"
                size="small"
                InputProps={{ 
                  disableUnderline: true,
                  sx: { fontSize: { xs: "0.875rem", sm: "0.9375rem" } }
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    color: darkMode ? "#e8eaed" : "#202124",
                  },
                }}
              />
            </Box>

            {/* Filters */}
            <Box sx={{ 
              display: "flex", 
              gap: 1, 
              width: { xs: "100%", sm: "auto" },
              flexWrap: { xs: "wrap", sm: "nowrap" }
            }}>
              <FormControl size="small" sx={{ 
                minWidth: { xs: "calc(50% - 4px)", sm: "150px" },
                flex: { xs: 1, sm: "auto" }
              }}>
                <Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  displayEmpty
                  sx={{
                    color: darkMode ? "#e8eaed" : "#202124",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#3c4043" : "#dadce0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#5f6368" : "#bdc1c6",
                    },
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    height: "40px",
                  }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {CATEGORIES.filter(c => c.id !== "all").map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {cat.icon}
                        <span style={{ fontSize: "0.875rem" }}>{cat.name}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ 
                minWidth: { xs: "calc(50% - 4px)", sm: "150px" },
                flex: { xs: 1, sm: "auto" }
              }}>
                <Select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  displayEmpty
                  sx={{
                    color: darkMode ? "#e8eaed" : "#202124",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#3c4043" : "#dadce0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#5f6368" : "#bdc1c6",
                    },
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    height: "40px",
                  }}
                >
                  {SORT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {option.icon}
                        <span style={{ fontSize: "0.875rem" }}>{option.label}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </GoogleCard>
      </Box>

      {/* Main Content */}
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 1, sm: 2, md: 3 }, 
          px: { xs: 1, sm: 2, md: 3 },
          width: "100%",
          maxWidth: "100%!important",
        }}
      >
        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              fontSize: { xs: "0.875rem", sm: "1rem" }
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Categories Tabs - Horizontal scroll on mobile */}
        <Box sx={{ 
          mb: 3, 
          overflowX: { xs: "auto", sm: "visible" },
          "&::-webkit-scrollbar": { display: "none" },
          WebkitOverflowScrolling: "touch",
        }}>
          <Tabs
            value={filters.category}
            onChange={(e, newValue) => handleFilterChange("category", newValue)}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{
              minWidth: "fit-content",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                minHeight: "48px",
                minWidth: "auto",
                px: { xs: 1, sm: 2 },
              },
            }}
          >
            {CATEGORIES.map((category) => (
              <Tab
                key={category.id}
                value={category.id}
                icon={!isMobile ? category.icon : undefined}
                iconPosition="start"
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {isMobile && category.icon}
                    <span>{category.name}</span>
                    {stats?.popularCategories?.find((c) => c._id === category.id) && !isMobile && (
                      <Chip
                        label={
                          stats.popularCategories.find((c) => c._id === category.id)?.count
                        }
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.7rem",
                          backgroundColor: alpha(category.color, 0.1),
                          color: category.color,
                        }}
                      />
                    )}
                  </Box>
                }
                sx={{
                  color: filters.category === category.id ? category.color : darkMode ? "#9aa0a6" : "#5f6368",
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Content Grid */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
            width: "100%",
          }}
        >
          {/* Main Posts */}
          <Box sx={{ 
            flex: 1,
            minWidth: 0,
            width: "100%",
          }}>
            {loading ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <CircularProgress />
                <Typography
                  sx={{ mt: 2, color: darkMode ? "#9aa0a6" : "#5f6368" }}
                >
                  Loading community posts...
                </Typography>
              </Box>
            ) : communityPosts.length === 0 ? (
              <GoogleCard sx={{ textAlign: "center", p: { xs: 3, sm: 6, md: 8 } }}>
                <ForumIcon
                  sx={{
                    fontSize: { xs: 48, sm: 60, md: 72 },
                    color: darkMode ? "#5f6368" : "#9aa0a6",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ 
                    color: darkMode ? "#e8eaed" : "#202124", 
                    mb: 1,
                    fontSize: { xs: "1.1rem", sm: "1.25rem" }
                  }}
                >
                  No posts found
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    mb: 3, 
                    color: darkMode ? "#9aa0a6" : "#5f6368",
                    fontSize: { xs: "0.875rem", sm: "1rem" }
                  }}
                >
                  {filters.search
                    ? "Try a different search term"
                    : "Be the first to start a discussion!"}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowNewPostDialog(true)}
                  sx={{
                    backgroundColor: "#4285f4",
                    "&:hover": { backgroundColor: "#3367d6" },
                    fontSize: { xs: "0.875rem", sm: "1rem" }
                  }}
                >
                  Create First Post
                </Button>
              </GoogleCard>
            ) : (
              <>
                {/* Pinned Posts */}
                {communityPosts.filter((p) => p.isPinned).length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: darkMode ? "#e8eaed" : "#202124",
                        mb: 2,
                        fontSize: { xs: "1rem", sm: "1.25rem" }
                      }}
                    >
                      <PinIcon />
                      Pinned Posts
                    </Typography>
                    <Stack spacing={{ xs: 1.5, sm: 2 }}>
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
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                    color: darkMode ? "#e8eaed" : "#202124",
                    fontSize: { xs: "1rem", sm: "1.25rem" }
                  }}
                >
                  <NewIcon />
                  {filters.sort === "trending" ? "Trending Now" : "Recent Discussions"}
                </Typography>

                <Stack spacing={{ xs: 1.5, sm: 2 }}>
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
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    mt: 4,
                    width: "100%",
                    overflowX: "auto"
                  }}>
                    <Pagination
                      count={pagination.pages}
                      page={pagination.page}
                      onChange={(e, page) => handleFilterChange("page", page)}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      showFirstButton={!isMobile}
                      showLastButton={!isMobile}
                      sx={{
                        "& .MuiPaginationItem-root": {
                          color: darkMode ? "#e8eaed" : "#202124",
                          borderColor: darkMode ? "#3c4043" : "#dadce0",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" }
                        },
                        "& .MuiPaginationItem-root.Mui-selected": {
                          backgroundColor: "#4285f4",
                          color: "#ffffff",
                          "&:hover": {
                            backgroundColor: "#3367d6",
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Sidebar - Hidden on small screens */}
          {!isTablet && (
            <Box sx={{ 
              width: { xs: "100%", lg: "350px" },
              flexShrink: 0,
            }}>
              {/* Community Stats */}
              <GoogleCard sx={{ mb: 3 }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: darkMode ? "#e8eaed" : "#202124",
                      fontSize: { xs: "1rem", sm: "1.125rem" }
                    }}
                  >
                    <ChartIcon />
                    Community Stats
                  </Typography>
                  {stats ? (
                    <Stack spacing={1.5}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ 
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                          fontSize: "0.875rem"
                        }}>
                          Total Posts
                        </Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ 
                          color: darkMode ? "#e8eaed" : "#202124",
                          fontSize: "0.875rem"
                        }}>
                          {stats.totalPosts}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ 
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                          fontSize: "0.875rem"
                        }}>
                          Total Comments
                        </Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ 
                          color: darkMode ? "#e8eaed" : "#202124",
                          fontSize: "0.875rem"
                        }}>
                          {stats.totalComments}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ 
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                          fontSize: "0.875rem"
                        }}>
                          Total Users
                        </Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ 
                          color: darkMode ? "#e8eaed" : "#202124",
                          fontSize: "0.875rem"
                        }}>
                          {stats.totalUsers}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ 
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                          fontSize: "0.875rem"
                        }}>
                          Active Today
                        </Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ 
                          color: darkMode ? "#e8eaed" : "#202124",
                          fontSize: "0.875rem"
                        }}>
                          {stats.activeToday}
                        </Typography>
                      </Box>
                    </Stack>
                  ) : (
                    <CircularProgress size={20} />
                  )}
                </CardContent>
              </GoogleCard>

              {/* Popular Categories */}
              <GoogleCard sx={{ mb: 3 }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: darkMode ? "#e8eaed" : "#202124",
                      fontSize: { xs: "1rem", sm: "1.125rem" }
                    }}
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
                            bgcolor: alpha("#4285f4", darkMode ? 0.1 : 0.05),
                          },
                        }}
                        onClick={() => handleFilterChange("category", category._id)}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          {CATEGORIES.find((c) => c.id === category._id)?.icon}
                          <Typography variant="body2" fontWeight={500} sx={{ 
                            color: darkMode ? "#e8eaed" : "#202124",
                            fontSize: "0.875rem"
                          }}>
                            {CATEGORIES.find((c) => c.id === category._id)?.name || category._id}
                          </Typography>
                        </Box>
                        <Chip
                          label={category.count}
                          size="small"
                          sx={{
                            backgroundColor: alpha("#4285f4", 0.1),
                            color: "#4285f4",
                            fontSize: "0.75rem",
                            height: "24px",
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </GoogleCard>

              {/* Community Guidelines */}
              <GoogleCard>
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: darkMode ? "#e8eaed" : "#202124",
                    fontSize: { xs: "1rem", sm: "1.125rem" }
                  }}>
                    📝 Community Guidelines
                  </Typography>
                  <Stack spacing={1}>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        color: darkMode ? "#9aa0a6" : "#5f6368",
                        fontSize: "0.875rem"
                      }}
                    >
                      <CheckIcon fontSize="small" sx={{ color: "#34a853", mt: 0.2 }} />
                      Be respectful and professional
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        color: darkMode ? "#9aa0a6" : "#5f6368",
                        fontSize: "0.875rem"
                      }}
                    >
                      <CheckIcon fontSize="small" sx={{ color: "#34a853", mt: 0.2 }} />
                      No spam or self-promotion
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        color: darkMode ? "#9aa0a6" : "#5f6368",
                        fontSize: "0.875rem"
                      }}
                    >
                      <CheckIcon fontSize="small" sx={{ color: "#34a853", mt: 0.2 }} />
                      Stay on topic
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        color: darkMode ? "#9aa0a6" : "#5f6368",
                        fontSize: "0.875rem"
                      }}
                    >
                      <CheckIcon fontSize="small" sx={{ color: "#34a853", mt: 0.2 }} />
                      Help others when you can
                    </Typography>
                  </Stack>
                </CardContent>
              </GoogleCard>
            </Box>
          )}
        </Box>
      </Container>

      {/* New Post Dialog */}
      <Dialog
        open={showNewPostDialog}
        onClose={() => setShowNewPostDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: darkMode ? "#202124" : "#ffffff",
            border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            mx: { xs: 1, sm: 2 },
            width: { xs: "calc(100% - 16px)", sm: "auto" },
          },
        }}
      >
        <DialogTitle sx={{ 
          color: darkMode ? "#e8eaed" : "#202124",
          fontSize: { xs: "1.25rem", sm: "1.5rem" }
        }}>
          Create New Post
        </DialogTitle>
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
              sx={{
                "& .MuiInputBase-input": {
                  color: darkMode ? "#e8eaed" : "#202124",
                  fontSize: { xs: "0.875rem", sm: "1rem" }
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontSize: { xs: "0.875rem", sm: "1rem" }
                },
              }}
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
              sx={{
                "& .MuiInputBase-input": {
                  color: darkMode ? "#e8eaed" : "#202124",
                  fontSize: { xs: "0.875rem", sm: "1rem" }
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontSize: { xs: "0.875rem", sm: "1rem" }
                },
              }}
            />

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ 
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontSize: { xs: "0.875rem", sm: "1rem" }
                }}>
                  Category
                </InputLabel>
                <Select
                  value={newPostData.category}
                  onChange={(e) =>
                    setNewPostData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  label="Category"
                  sx={{
                    color: darkMode ? "#e8eaed" : "#202124",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#3c4043" : "#dadce0",
                    },
                    fontSize: { xs: "0.875rem", sm: "1rem" }
                  }}
                >
                  {CATEGORIES.filter((c) => c.id !== "all").map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {category.icon}
                        <span style={{ fontSize: "0.875rem" }}>{category.name}</span>
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
                sx={{
                  "& .MuiInputBase-input": {
                    color: darkMode ? "#e8eaed" : "#202124",
                    fontSize: { xs: "0.875rem", sm: "1rem" }
                  },
                  "& .MuiInputLabel-root": {
                    color: darkMode ? "#9aa0a6" : "#5f6368",
                    fontSize: { xs: "0.875rem", sm: "1rem" }
                  },
                }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Button
            onClick={() => setShowNewPostDialog(false)}
            sx={{
              color: darkMode ? "#e8eaed" : "#202124",
              fontSize: { xs: "0.875rem", sm: "1rem" }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreatePost}
            variant="contained"
            disabled={!newPostData.title.trim() || !newPostData.content.trim()}
            sx={{
              backgroundColor: "#4285f4",
              "&:hover": { backgroundColor: "#3367d6" },
              fontSize: { xs: "0.875rem", sm: "1rem" }
            }}
          >
            Create Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* Post Detail Dialog - RESTORED */}
      {selectedPost && (
        <Dialog
          open={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxHeight: "90vh",
              backgroundColor: darkMode ? "#202124" : "#ffffff",
              border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
              mx: { xs: 1, sm: 2 },
              width: { xs: "calc(100% - 16px)", sm: "auto" },
            },
          }}
        >
          <DialogTitle sx={{ 
            color: darkMode ? "#e8eaed" : "#202124",
            fontSize: { xs: "1.25rem", sm: "1.5rem" }
          }}>
            {selectedPost.title}
          </DialogTitle>
          <DialogContent dividers sx={{ overflowY: "auto" }}>
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
          <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
            <Button
              onClick={() => setSelectedPost(null)}
              sx={{
                color: darkMode ? "#e8eaed" : "#202124",
                fontSize: { xs: "0.875rem", sm: "1rem" }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}