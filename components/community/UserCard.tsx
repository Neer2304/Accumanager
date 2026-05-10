// components/community/UserCard.tsx - REDESIGNED
"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Avatar,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Forum as ForumIcon,
  CheckCircle as VerifiedIcon,
  Message as MessageIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Theme colors
const useColors = () => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  return {
    dark,
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

const AVATAR_COLORS = ["#1877f2", "#e91e63", "#9c27b0", "#ff9800", "#4caf50", "#00bcd4", "#ff5722", "#607d8b"];
function avatarColor(name: string) {
  return AVATAR_COLORS[(name || "U").charCodeAt(0) % AVATAR_COLORS.length];
}

interface UserCardProps {
  user: {
    _id: string;
    username: string;
    avatar?: string;
    bio?: string;
    communityStats: {
      totalPosts: number;
      followerCount: number;
    };
    userId: {
      name: string;
      shopName?: string;
    };
    isVerified?: boolean;
  };
  isFollowing?: boolean;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  onViewProfile: (userId: string) => void;
  onMessage?: (userId: string) => void;
}

export default function UserCard({
  user,
  isFollowing = false,
  onFollow,
  onUnfollow,
  onViewProfile,
  onMessage,
}: UserCardProps) {
  const c = useColors();
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (following) await onUnfollow(user._id);
      else await onFollow(user._id);
      setFollowing(!following);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  return (
    <Card sx={{ 
      borderRadius: "12px", 
      bgcolor: c.surface, 
      border: `1px solid ${c.border}`,
      overflow: "hidden",
      transition: "all 0.2s",
      "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <Avatar 
            src={user.avatar} 
            sx={{ width: 56, height: 56, bgcolor: avatarColor(user.userId.name) }}
          >
            {user.userId.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: c.ink }}>
                {user.userId.name}
              </Typography>
              {user.isVerified && <VerifiedIcon sx={{ fontSize: 14, color: c.blue }} />}
            </Box>
            <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>@{user.username}</Typography>
          </Box>
        </Box>

        {user.userId.shopName && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
            <BusinessIcon sx={{ fontSize: 14, color: c.inkMuted }} />
            <Typography sx={{ fontSize: "0.75rem", color: c.inkMuted }}>{user.userId.shopName}</Typography>
          </Box>
        )}

        {user.bio && (
          <Typography sx={{ fontSize: "0.75rem", color: c.inkSub, mb: 1.5, display: "-webkit-box", WebkitLineClamp: 2, overflow: "hidden" }}>
            {user.bio}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: c.ink }}>{user.communityStats.totalPosts}</Typography>
            <Typography sx={{ fontSize: "0.65rem", color: c.inkMuted }}>Posts</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: c.ink }}>{user.communityStats.followerCount}</Typography>
            <Typography sx={{ fontSize: "0.65rem", color: c.inkMuted }}>Followers</Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, gap: 1 }}>
        <Button
          fullWidth
          size="small"
          variant={following ? "outlined" : "contained"}
          onClick={handleFollowToggle}
          disabled={loading}
          startIcon={!following && <PersonAddIcon sx={{ fontSize: 14 }} />}
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            fontSize: "0.75rem",
            ...(following ? {
              borderColor: c.border,
              color: c.ink,
              "&:hover": { borderColor: c.blue, bgcolor: alpha(c.blue, 0.05) }
            } : {
              bgcolor: c.blue,
              "&:hover": { bgcolor: "#166fe5" }
            })
          }}
        >
          {loading ? "..." : following ? "Following" : "Follow"}
        </Button>
        <IconButton size="small" onClick={() => onViewProfile(user._id)} sx={{ border: `1px solid ${c.border}`, borderRadius: "20px", p: 0.75 }}>
          <PersonIcon sx={{ fontSize: 16 }} />
        </IconButton>
        {onMessage && (
          <IconButton size="small" onClick={() => onMessage(user._id)} sx={{ border: `1px solid ${c.border}`, borderRadius: "20px", p: 0.75 }}>
            <MessageIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
}