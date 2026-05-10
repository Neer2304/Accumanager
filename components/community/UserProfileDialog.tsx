// components/community/UserProfileDialog.tsx - REDESIGNED
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Avatar,
  Typography,
  Chip,
  Divider,
  Button,
  IconButton,
  Paper,
  CircularProgress,
  Badge,
  Tooltip,
  alpha,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Forum as ForumIcon,
  ThumbUp as LikeIcon,
  Bookmark as BookmarkIcon,
  People as PeopleIcon,
  CheckCircle as VerifiedIcon,
  Link as LinkIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { formatDate } from "@/utils/dateUtils";
import { useTheme } from "@mui/material/styles";

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
    purple: dark ? "#b39ddb" : "#7b1fa2",
  };
};

const AVATAR_COLORS = ["#1877f2", "#e91e63", "#9c27b0", "#ff9800", "#4caf50", "#00bcd4", "#ff5722", "#607d8b"];
function avatarColor(name: string) {
  return AVATAR_COLORS[(name || "U").charCodeAt(0) % AVATAR_COLORS.length];
}

interface UserProfile {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
    shopName?: string;
    subscription?: { plan: string; status: string };
  };
  username: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: { twitter?: string; linkedin?: string; instagram?: string; facebook?: string };
  isVerified?: boolean;
  verificationBadge?: boolean;
  expertInCategories?: string[];
  followerCount: number;
  followingCount: number;
  communityStats: {
    totalPosts: number;
    totalComments: number;
    totalLikesReceived: number;
    totalLikesGiven: number;
    totalBookmarks: number;
    engagementScore: number;
    lastActive: Date;
    joinDate: Date;
  };
  badges?: string[];
  isFollowing?: boolean;
}

interface UserProfileDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  loading?: boolean;
  user?: UserProfile | null;
}

export default function UserProfileDialog({
  open,
  onClose,
  userId,
  loading = false,
  user,
}: UserProfileDialogProps) {
  const c = useColors();
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(user?.isFollowing || false);
  const [followerCount, setFollowerCount] = useState(user?.followerCount || 0);

  useEffect(() => {
    if (user) {
      setIsFollowing(user.isFollowing || false);
      setFollowerCount(user.followerCount || 0);
    }
  }, [user]);

  const handleFollowToggle = async () => {
    if (!user) return;
    setFollowLoading(true);
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      await fetch(`/api/community/profile/${user.userId._id}/follow`, { method, credentials: 'include' });
      setIsFollowing(!isFollowing);
      setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
    } catch (error) { console.error(error); }
    finally { setFollowLoading(false); }
  };

  const renderSocialLinks = () => {
    if (!user?.socialLinks) return null;
    const { twitter, linkedin, instagram, facebook } = user.socialLinks;
    const links = [];
    if (twitter) links.push({ icon: <TwitterIcon />, url: twitter, color: "#1DA1F2" });
    if (linkedin) links.push({ icon: <LinkedInIcon />, url: linkedin, color: "#0077B5" });
    if (instagram) links.push({ icon: <InstagramIcon />, url: instagram, color: "#E4405F" });
    if (facebook) links.push({ icon: <FacebookIcon />, url: facebook, color: "#1877F2" });
    if (links.length === 0) return null;
    return (
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
        {links.map((link, i) => (
          <IconButton key={i} size="small" onClick={() => window.open(link.url, '_blank')} sx={{ color: link.color, bgcolor: c.surface2 }}>
            {link.icon}
          </IconButton>
        ))}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          maxHeight: "80vh",
          bgcolor: c.surface,
          border: `1px solid ${c.border}`,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ p: 2, borderBottom: `1px solid ${c.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: c.ink }}>Profile</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: c.inkMuted }}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, overflow: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress sx={{ color: c.blue }} /></Box>
        ) : user ? (
          <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={user.verificationBadge && <VerifiedIcon sx={{ fontSize: 20, color: c.blue, bgcolor: c.surface, borderRadius: "50%" }} />}
              >
                <Avatar src={user.avatar} sx={{ width: 96, height: 96, bgcolor: avatarColor(user.userId.name), fontSize: 40 }}>
                  {user.userId.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
              <Typography sx={{ fontWeight: 700, fontSize: "1.2rem", color: c.ink, mt: 1 }}>{user.userId.name}</Typography>
              <Typography sx={{ fontSize: "0.8rem", color: c.inkMuted }}>@{user.username}</Typography>
              {user.userId.shopName && (
                <Chip icon={<BusinessIcon sx={{ fontSize: 14 }} />} label={user.userId.shopName} size="small" sx={{ mt: 1, bgcolor: c.surface2 }} />
              )}
              {user.bio && <Typography sx={{ fontSize: "0.85rem", color: c.inkSub, textAlign: "center", mt: 1.5 }}>{user.bio}</Typography>}
            </Box>

            {/* Stats */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 3 }}>
              <Box sx={{ textAlign: "center" }}><Typography sx={{ fontWeight: 700, fontSize: "1rem", color: c.ink }}>{followerCount}</Typography><Typography sx={{ fontSize: "0.65rem", color: c.inkMuted }}>Followers</Typography></Box>
              <Box sx={{ textAlign: "center" }}><Typography sx={{ fontWeight: 700, fontSize: "1rem", color: c.ink }}>{user.followingCount}</Typography><Typography sx={{ fontSize: "0.65rem", color: c.inkMuted }}>Following</Typography></Box>
              <Box sx={{ textAlign: "center" }}><Typography sx={{ fontWeight: 700, fontSize: "1rem", color: c.ink }}>{user.communityStats?.totalPosts || 0}</Typography><Typography sx={{ fontSize: "0.65rem", color: c.inkMuted }}>Posts</Typography></Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 3 }}>
              <Button
                variant={isFollowing ? "outlined" : "contained"}
                onClick={handleFollowToggle}
                disabled={followLoading}
                sx={{ borderRadius: "40px", textTransform: "none", px: 3, ...(isFollowing ? { borderColor: c.border, color: c.ink } : { bgcolor: c.blue }) }}
              >
                {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
              </Button>
              <Button variant="outlined" startIcon={<MessageIcon />} sx={{ borderRadius: "40px", textTransform: "none", borderColor: c.border, color: c.ink }}>Message</Button>
            </Box>

            {/* Info Cards */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, mb: 2 }}>
              {user.location && (
                <Paper sx={{ p: 1.5, borderRadius: "12px", bgcolor: c.surface2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}><LocationIcon sx={{ fontSize: 14, color: c.blue }} /><Typography sx={{ fontWeight: 600, fontSize: "0.75rem", color: c.ink }}>Location</Typography></Box>
                  <Typography sx={{ fontSize: "0.8rem", color: c.inkSub }}>{user.location}</Typography>
                </Paper>
              )}
              {user.website && (
                <Paper sx={{ p: 1.5, borderRadius: "12px", bgcolor: c.surface2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}><LinkIcon sx={{ fontSize: 14, color: c.blue }} /><Typography sx={{ fontWeight: 600, fontSize: "0.75rem", color: c.ink }}>Website</Typography></Box>
                  <Typography component="a" href={user.website} target="_blank" sx={{ fontSize: "0.8rem", color: c.blue, textDecoration: "none" }}>{user.website}</Typography>
                </Paper>
              )}
            </Box>

            {/* Social Links */}
            {renderSocialLinks()}

            <Divider sx={{ my: 2, borderColor: c.border }} />

            {/* Community Stats */}
            <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: c.ink, mb: 1.5 }}>Community Activity</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, mb: 2 }}>
              {[
                { icon: <ForumIcon />, value: user.communityStats?.totalComments || 0, label: "Comments", color: c.green },
                { icon: <LikeIcon />, value: user.communityStats?.totalLikesGiven || 0, label: "Likes", color: c.red },
                { icon: <BookmarkIcon />, value: user.communityStats?.totalBookmarks || 0, label: "Bookmarks", color: c.purple },
                { icon: <PeopleIcon />, value: user.communityStats?.engagementScore || 0, label: "Score", color: c.blue },
              ].map((stat, i) => (
                <Paper key={i} sx={{ p: 1, textAlign: "center", borderRadius: "12px", bgcolor: c.surface2 }}>
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5, color: stat.color }}>{stat.icon}</Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: c.ink }}>{stat.value}</Typography>
                  <Typography sx={{ fontSize: "0.6rem", color: c.inkMuted }}>{stat.label}</Typography>
                </Paper>
              ))}
            </Box>

            {/* Expert Categories */}
            {user.expertInCategories && user.expertInCategories.length > 0 && (
              <>
                <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: c.ink, mb: 1 }}>Expert In</Typography>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
                  {user.expertInCategories.map((cat, i) => (<Chip key={i} label={cat} size="small" sx={{ bgcolor: c.blueSoft, color: c.blue }} />))}
                </Box>
              </>
            )}

            {/* Badges */}
            {user.badges && user.badges.length > 0 && (
              <>
                <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: c.ink, mb: 1 }}>Badges</Typography>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {user.badges.map((badge, i) => (<Chip key={i} label={badge} size="small" sx={{ bgcolor: c.surface2, color: c.ink }} />))}
                </Box>
              </>
            )}
          </Box>
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <PersonIcon sx={{ fontSize: 64, color: c.inkMuted, mb: 1, opacity: 0.5 }} />
            <Typography sx={{ color: c.ink }}>User not found</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}