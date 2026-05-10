"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  Avatar,
  Typography,
  Button,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Badge,
  alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  CheckCircle as VerifiedIcon,
  Message as MessageIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";

// Theme colors (matching Facebook-style)
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

interface User {
  _id: string;
  username: string;
  avatar?: string;
  bio?: string;
  isVerified?: boolean;
  expertInCategories?: string[];
  communityStats: {
    totalPosts: number;
    followerCount: number;
  };
  userId: {
    _id: string;
    name: string;
  };
  isFollowing?: boolean;
}

interface FollowDialogProps {
  open: boolean;
  onClose: () => void;
  profileId: string;
  type?: "followers" | "following";
  title?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

// Avatar with deterministic color
const AVATAR_COLORS = ["#1877f2", "#e91e63", "#9c27b0", "#ff9800", "#4caf50", "#00bcd4", "#ff5722", "#607d8b"];
function avatarColor(name: string) {
  return AVATAR_COLORS[(name || "U").charCodeAt(0) % AVATAR_COLORS.length];
}

function UserAvatar({ name, src, size = 56 }: { name?: string; src?: string; size?: number }) {
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

export default function FollowDialog({
  open,
  onClose,
  profileId,
  type = "followers",
  title = "Connections",
}: FollowDialogProps) {
  const router = useRouter();
  const c = useColors();
  
  const [activeTab, setActiveTab] = useState(type === "followers" ? 0 : 1);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ followerCount: 0, followingCount: 0 });
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch("/api/community/profile", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          if (data.success) setCurrentUserId(data.data.userId?._id || data.data.userId);
        }
      } catch (error) { console.error(error); }
    };
    if (open) getCurrentUser();
  }, [open]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const isFollowers = activeTab === 0;
      const response = await fetch(
        `/api/community/profile/${profileId}/connections?type=${isFollowers ? "followers" : "following"}&limit=100`,
        { credentials: "include" }
      );
      const data = await response.json();
      if (data.success) {
        const users = data.data?.users || [];
        if (activeTab === 0) {
          setFollowers(users);
          setStats(prev => ({ ...prev, followerCount: data.data?.profile?.followerCount || users.length }));
        } else {
          setFollowing(users);
          setStats(prev => ({ ...prev, followingCount: data.data?.profile?.followingCount || users.length }));
        }
      } else {
        setError(data.message || "Failed to fetch data");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchData();
    else {
      setFollowers([]);
      setFollowing([]);
      setSearchQuery("");
      setError(null);
    }
  }, [open, activeTab]);

  const handleFollowToggle = async (user: User, isCurrentlyFollowing: boolean) => {
    setFollowLoading(prev => ({ ...prev, [user._id]: true }));
    try {
      const response = await fetch(`/api/community/profile/${encodeURIComponent(user.username)}/follow`, {
        method: isCurrentlyFollowing ? "DELETE" : "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        const updateList = (users: User[]) =>
          users.map(u => u._id === user._id ? { ...u, isFollowing: !isCurrentlyFollowing } : u);
        if (activeTab === 0) setFollowers(updateList);
        else setFollowing(updateList);
      }
    } catch (error) { console.error(error); }
    finally { setFollowLoading(prev => ({ ...prev, [user._id]: false })); }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setActiveTab(newValue);
  const handleViewProfile = (username: string) => { onClose(); router.push(`/community/profile/${username}`); };

  const filterUsers = (users: User[]) => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(u => u.username?.toLowerCase().includes(query) || u.userId?.name?.toLowerCase().includes(query));
  };

  const currentUsers = activeTab === 0 ? followers : following;
  const filteredUsers = filterUsers(currentUsers);
  const isCurrentUser = (userId: string) => currentUserId === userId;

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
      {/* Header */}
      <DialogTitle sx={{ 
        p: 2, 
        borderBottom: `1px solid ${c.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: c.ink }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: c.inkMuted }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Tabs */}
      <Box sx={{ px: 2, borderBottom: `1px solid ${c.border}` }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: "44px",
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "0.85rem",
              fontWeight: 500,
              minHeight: "44px",
              color: c.inkSub,
              "&.Mui-selected": { color: c.blue },
            },
            "& .MuiTabs-indicator": { bgcolor: c.blue },
          }}
        >
          <Tab label={`Followers ${stats.followerCount > 0 ? `(${formatNumber(stats.followerCount)})` : ""}`} />
          <Tab label={`Following ${stats.followingCount > 0 ? `(${formatNumber(stats.followingCount)})` : ""}`} />
        </Tabs>
      </Box>

      {/* Search */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${c.border}` }}>
        <TextField
          fullWidth
          size="small"
          placeholder={`Search ${activeTab === 0 ? "followers" : "following"}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: c.inkMuted }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "40px",
              bgcolor: c.surface2,
              "& fieldset": { borderColor: "transparent" },
              "&:hover fieldset": { borderColor: c.border },
              "&.Mui-focused fieldset": { borderColor: c.blue },
            },
            "& .MuiInputBase-input": { fontSize: "0.85rem", py: 1, color: c.ink },
          }}
        />
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 0, flex: 1, overflow: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={32} sx={{ color: c.blue }} />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography sx={{ color: c.red, fontSize: "0.85rem" }}>{error}</Typography>
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <PeopleIcon sx={{ fontSize: 48, color: c.inkMuted, mb: 1, opacity: 0.5 }} />
            <Typography sx={{ color: c.inkSub, fontSize: "0.85rem" }}>
              {searchQuery ? "No users found" : `No ${activeTab === 0 ? "followers" : "following"} yet`}
            </Typography>
          </Box>
        ) : (
          filteredUsers.map((user, idx) => (
            <React.Fragment key={user._id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  cursor: "pointer",
                  transition: "background 0.15s",
                  "&:hover": { bgcolor: c.surface2 },
                }}
                onClick={() => handleViewProfile(user.username)}
              >
                <UserAvatar name={user.userId?.name || user.username} src={user.avatar} size={48} />
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: c.ink }}>
                      {user.userId?.name || user.username}
                    </Typography>
                    {user.isVerified && <VerifiedIcon sx={{ fontSize: 14, color: c.blue }} />}
                  </Box>
                  <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>@{user.username}</Typography>
                  {user.bio && (
                    <Typography sx={{ fontSize: "0.75rem", color: c.inkSub, mt: 0.5, display: "-webkit-box", WebkitLineClamp: 1, overflow: "hidden" }}>
                      {user.bio}
                    </Typography>
                  )}
                  <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                    <Typography sx={{ fontSize: "0.65rem", color: c.inkMuted }}>
                      {formatNumber(user.communityStats?.followerCount || 0)} followers
                    </Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: c.inkMuted }}>
                      {formatNumber(user.communityStats?.totalPosts || 0)} posts
                    </Typography>
                  </Box>
                </Box>

                {!isCurrentUser(user.userId?._id || user._id) && (
                  <Button
                    size="small"
                    variant={user.isFollowing ? "outlined" : "contained"}
                    onClick={(e) => { e.stopPropagation(); handleFollowToggle(user, !!user.isFollowing); }}
                    disabled={followLoading[user._id]}
                    sx={{
                      minWidth: "90px",
                      borderRadius: "20px",
                      textTransform: "none",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      ...(user.isFollowing ? {
                        borderColor: c.border,
                        color: c.ink,
                        "&:hover": { borderColor: c.blue, bgcolor: c.blueSoft }
                      } : {
                        bgcolor: c.blue,
                        "&:hover": { bgcolor: "#166fe5" }
                      }),
                    }}
                  >
                    {followLoading[user._id] ? <CircularProgress size={16} /> : (user.isFollowing ? "Following" : "Follow")}
                  </Button>
                )}
              </Box>
              {idx < filteredUsers.length - 1 && <Divider sx={{ borderColor: c.border }} />}
            </React.Fragment>
          ))
        )}
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ 
        p: 1.5, 
        borderTop: `1px solid ${c.border}`,
        justifyContent: "space-between",
      }}>
        <Typography variant="caption" sx={{ color: c.inkMuted }}>
          {filteredUsers.length} {activeTab === 0 ? "followers" : "following"}
        </Typography>
        <Typography variant="caption" sx={{ color: c.inkMuted }}>
          Click a user to view profile
        </Typography>
      </DialogActions>
    </Dialog>
  );
}