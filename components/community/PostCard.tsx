// components/community/PostCard.tsx - REDESIGNED
"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Typography,
  Box,
  IconButton,
  Button,
  Chip,
  Stack,
  Tooltip,
  alpha,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  ChatBubbleOutline as CommentIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  AccessTime as TimeIcon,
  Tag as TagIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/formatUtils';
import { useTheme } from '@mui/material/styles';

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
    blueSoft: dark ? "rgba(24,119,242,0.15)" : "rgba(24,119,242,0.08)",
    green: dark ? "#45bd62" : "#31a24c",
    red: dark ? "#f28b82" : "#e41e3f",
  };
};

// Avatar with deterministic color
const AVATAR_COLORS = ["#1877f2", "#e91e63", "#9c27b0", "#ff9800", "#4caf50", "#00bcd4", "#ff5722", "#607d8b"];
function avatarColor(name: string) {
  return AVATAR_COLORS[(name || "U").charCodeAt(0) % AVATAR_COLORS.length];
}

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    excerpt?: string;
    author: {
      _id: string;
      name: string;
      avatar?: string;
      role?: string;
    };
    category?: string;
    tags?: string[];
    likeCount: number;
    commentCount: number;
    views: number;
    createdAt: string;
    updatedAt?: string;
    isPinned?: boolean;
    isSolved?: boolean;
    attachments?: any[];
  };
  showActions?: boolean;
  onViewPost?: (postId: string) => void;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  compact?: boolean;
}

export default function PostCard({
  post,
  showActions = true,
  onViewPost,
  onLike,
  onBookmark,
  onComment,
  onShare,
  onEdit,
  onDelete,
  compact = false,
}: PostCardProps) {
  const c = useColors();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleLike = async () => {
    if (onLike) {
      await onLike(post._id);
    } else {
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
      try {
        const response = await fetch(`/api/community/posts/${post._id}/like`, {
          method: liked ? 'DELETE' : 'POST',
          credentials: 'include',
        });
        if (!response.ok) {
          setLiked(!liked);
          setLikeCount(prev => liked ? prev + 1 : prev - 1);
        }
      } catch (error) {
        console.error('Failed to toggle like:', error);
        setLiked(!liked);
        setLikeCount(prev => liked ? prev + 1 : prev - 1);
      }
    }
  };

  const handleBookmark = async () => {
    if (onBookmark) {
      await onBookmark(post._id);
    } else {
      setBookmarked(!bookmarked);
      try {
        await fetch(`/api/community/posts/${post._id}/bookmark`, {
          method: bookmarked ? 'DELETE' : 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Failed to toggle bookmark:', error);
        setBookmarked(!bookmarked);
      }
    }
  };

  const handleViewPost = () => {
    if (onViewPost) onViewPost(post._id);
    else router.push(`/community/post/${post._id}`);
  };

  const handleShare = () => {
    setAnchorEl(null);
    if (onShare) onShare(post._id);
    else {
      navigator.clipboard.writeText(`${window.location.origin}/community/post/${post._id}`)
        .then(() => alert('Link copied!'));
    }
  };

  const handleEdit = () => { setAnchorEl(null); if (onEdit) onEdit(post._id); };
  const handleDelete = async () => {
    setAnchorEl(null);
    if (onDelete) onDelete(post._id);
    else if (confirm('Delete this post?')) {
      await fetch(`/api/community/posts/${post._id}`, { method: 'DELETE', credentials: 'include' });
      window.location.reload();
    }
  };

  const handleViewAuthorProfile = () => router.push(`/community/profile/${post.author._id}`);

  return (
    <Card sx={{ 
      borderRadius: "16px", 
      bgcolor: c.surface, 
      border: `1px solid ${post.isPinned ? c.red : c.border}`,
      mb: compact ? 1 : 2,
      overflow: "hidden",
      transition: "all 0.2s",
      "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }
    }}>
      {/* Colored top bar for pinned posts */}
      {post.isPinned && <Box sx={{ height: 3, bgcolor: c.red }} />}
      
      <CardHeader
        avatar={
          <Avatar 
            src={post.author.avatar} 
            onClick={handleViewAuthorProfile}
            sx={{ 
              width: 40, height: 40, 
              bgcolor: avatarColor(post.author.name),
              cursor: "pointer",
              "&:hover": { opacity: 0.9 }
            }}
          >
            {post.author.name?.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {post.category && !compact && (
              <Chip label={post.category} size="small" sx={{ bgcolor: alpha(c.blue, 0.1), color: c.blue }} />
            )}
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ color: c.inkMuted }}>
              <MoreVertIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={openMenu} onClose={() => setAnchorEl(null)}>
              <MenuItem onClick={handleShare}>Share</MenuItem>
              {onEdit && <MenuItem onClick={handleEdit}>Edit</MenuItem>}
              {onDelete && <MenuItem onClick={handleDelete} sx={{ color: c.red }}>Delete</MenuItem>}
            </Menu>
          </Box>
        }
        title={
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: c.ink, cursor: "pointer", "&:hover": { color: c.blue, textDecoration: "underline" } }} onClick={handleViewAuthorProfile}>
            {post.author.name}
          </Typography>
        }
        subheader={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <TimeIcon sx={{ fontSize: 12, color: c.inkMuted }} />
            <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>{formatDate(post.createdAt)}</Typography>
            {!compact && (
              <>
                <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: c.inkMuted }} />
                <VisibilityIcon sx={{ fontSize: 12, color: c.inkMuted }} />
                <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>{post.views} views</Typography>
              </>
            )}
          </Box>
        }
        sx={{ p: 2, pb: 0 }}
      />

      <CardContent sx={{ p: 2, pt: 1 }}>
        <Typography 
          onClick={handleViewPost}
          sx={{ 
            fontWeight: 700, 
            fontSize: "1rem", 
            color: c.ink, 
            mb: 1, 
            cursor: "pointer",
            "&:hover": { color: c.blue }
          }}
        >
          {post.title}
        </Typography>
        
        {!compact && post.excerpt && (
          <Typography sx={{ fontSize: "0.8rem", color: c.inkSub, mb: 1.5, display: "-webkit-box", WebkitLineClamp: 2, overflow: "hidden" }}>
            {post.excerpt}
          </Typography>
        )}

        {post.tags && post.tags.length > 0 && !compact && (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {post.tags.slice(0, 3).map((tag, i) => (
              <Chip key={i} label={`#${tag}`} size="small" variant="outlined" sx={{ height: 22, fontSize: "0.65rem" }} />
            ))}
            {post.tags.length > 3 && <Chip label={`+${post.tags.length - 3}`} size="small" sx={{ height: 22, fontSize: "0.65rem", bgcolor: c.blueSoft, color: c.blue }} />}
          </Box>
        )}
      </CardContent>

      {showActions && (
        <>
          <Divider sx={{ borderColor: c.border }} />
          <CardActions sx={{ px: 2, py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
              <Tooltip title="Like">
                <Button size="small" startIcon={liked ? <ThumbUpIcon sx={{ fontSize: 16, color: c.blue }} /> : <ThumbUpOutlinedIcon sx={{ fontSize: 16 }} />} onClick={handleLike} sx={{ color: liked ? c.blue : c.inkMuted, minWidth: "auto" }}>
                  {likeCount > 0 && <Typography sx={{ ml: 0.5, fontSize: "0.75rem" }}>{likeCount}</Typography>}
                </Button>
              </Tooltip>
              <Tooltip title="Comment">
                <Button size="small" startIcon={<CommentIcon sx={{ fontSize: 16 }} />} onClick={handleViewPost} sx={{ color: c.inkMuted, minWidth: "auto" }}>
                  {post.commentCount > 0 && <Typography sx={{ ml: 0.5, fontSize: "0.75rem" }}>{post.commentCount}</Typography>}
                </Button>
              </Tooltip>
              <Tooltip title="Bookmark">
                <IconButton size="small" onClick={handleBookmark} sx={{ color: bookmarked ? c.blue : c.inkMuted, p: 0.5 }}>
                  {bookmarked ? <BookmarkIcon sx={{ fontSize: 16 }} /> : <BookmarkBorderIcon sx={{ fontSize: 16 }} />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton size="small" onClick={handleShare} sx={{ color: c.inkMuted, p: 0.5 }}>
                  <ShareIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              {!compact && (
                <Button size="small" onClick={handleViewPost} sx={{ color: c.blue, ml: "auto", textTransform: "none", fontSize: "0.75rem" }}>
                  Read More
                </Button>
              )}
            </Box>
          </CardActions>
        </>
      )}
    </Card>
  );
}