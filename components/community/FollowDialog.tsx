// components/community/FollowDialog.tsx
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
  Alert,
  Badge,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  CheckCircle as VerifiedIcon,
  Business as BusinessIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  username: string;
  avatar?: string;
  bio?: string;
  isVerified?: boolean;
  expertInCategories?: string[];
  badges?: string[];
  communityStats: {
    totalPosts: number;
    followerCount: number;
    followingCount: number;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
    shopName?: string;
    subscription?: {
      plan: string;
      status: string;
    };
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
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

export default function FollowDialog({
  open,
  onClose,
  profileId,
  type = "followers",
  title = "Connections",
}: FollowDialogProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(type === "followers" ? 0 : 1);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState({
    followers: false,
    following: false,
  });
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>(
    {},
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    followerCount: 0,
    followingCount: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch("/api/community/profile", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCurrentUserId(data.data.userId?._id || data.data.userId);
          }
        }
      } catch (error) {
        console.error("Failed to get current user:", error);
      }
    };

    if (open) {
      getCurrentUser();
    }
  }, [open]);

  const fetchFollowers = async () => {
    setLoading((prev) => ({ ...prev, followers: true }));
    setError(null);

    try {
      const response = await fetch(
        `/api/community/profile/${profileId}/connections?type=followers&limit=100`,
        { credentials: "include" },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const users = data.data?.users || [];
          setFollowers(users);
          setStats((prev) => ({
            ...prev,
            followerCount:
              data.data?.profile?.followerCount ||
              data.data?.pagination?.total ||
              users.length,
          }));
        } else {
          setError(data.message || "Failed to fetch followers");
        }
      }
    } catch (error: any) {
      console.error("Error fetching followers:", error);
      setError(error.message || "Failed to fetch followers");
    } finally {
      setLoading((prev) => ({ ...prev, followers: false }));
    }
  };

  const fetchFollowing = async () => {
    setLoading((prev) => ({ ...prev, following: true }));
    setError(null);

    try {
      const response = await fetch(
        `/api/community/profile/${profileId}/connections?type=following&limit=100`,
        { credentials: "include" },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const users = data.data?.users || [];
          setFollowing(users);
          setStats((prev) => ({
            ...prev,
            followingCount:
              data.data?.profile?.followingCount ||
              data.data?.pagination?.total ||
              users.length,
          }));
        } else {
          setError(data.message || "Failed to fetch following");
        }
      }
    } catch (error: any) {
      console.error("Error fetching following:", error);
      setError(error.message || "Failed to fetch following");
    } finally {
      setLoading((prev) => ({ ...prev, following: false }));
    }
  };

  // Handle follow/unfollow
  const handleFollowToggle = async (
    user: User,
    isCurrentlyFollowing: boolean,
  ) => {
    setFollowLoading((prev) => ({ ...prev, [user._id]: true }));

    try {
      const method = isCurrentlyFollowing ? "DELETE" : "POST";
      const response = await fetch(
        `/api/community/profile/${user.username}/follow`,
        {
          method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Immediately update the user in the current list
          const updateUserInList = (
            users: User[],
            userId: string,
            isFollowing: boolean,
          ) =>
            users.map((u) => {
              if (u._id === userId) {
                return {
                  ...u,
                  isFollowing,
                  communityStats: {
                    ...u.communityStats,
                    followerCount: isFollowing
                      ? (u.communityStats.followerCount || 0) + 1
                      : Math.max(0, (u.communityStats.followerCount || 0) - 1),
                  },
                };
              }
              return u;
            });

          if (activeTab === 0) {
            setFollowers((prev) =>
              updateUserInList(prev, user._id, !isCurrentlyFollowing),
            );
          } else {
            setFollowing((prev) =>
              updateUserInList(prev, user._id, !isCurrentlyFollowing),
            );
          }

          // Show success message
          console.log(
            `Successfully ${isCurrentlyFollowing ? "unfollowed" : "followed"} ${user.username}`,
          );
        }
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      // Optionally show an error toast
    } finally {
      setFollowLoading((prev) => ({ ...prev, [user._id]: false }));
    }
  };

  // Load data when dialog opens or tab changes
  useEffect(() => {
    if (open) {
      if (activeTab === 0) {
        fetchFollowers();
      } else {
        fetchFollowing();
      }
    } else {
      setFollowers([]);
      setFollowing([]);
      setSearchQuery("");
      setError(null);
    }
  }, [open, activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleViewProfile = (username: string) => {
    onClose();
    router.push(`/community/profile/${username}`);
  };

  const handleMessage = (userId: string) => {
    onClose();
    // Navigate to messages page or open message dialog
    router.push(`/messages?userId=${userId}`);
  };

  // Filter users based on search query
  const filterUsers = (users: User[]) => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        (user.username && user.username.toLowerCase().includes(query)) ||
        (user.userId?.name && user.userId.name.toLowerCase().includes(query)) ||
        (user.userId?.email &&
          user.userId.email.toLowerCase().includes(query)) ||
        (user.bio && user.bio.toLowerCase().includes(query)),
    );
  };

  const currentUsers = activeTab === 0 ? followers : following;
  const filteredUsers = filterUsers(currentUsers);

  // Check if user is the current user (hide follow button for own profile)
  const isCurrentUser = (userId: string) => {
    if (!currentUserId) return false;
    return (
      userId === currentUserId ||
      currentUsers.find((u) => u._id === userId)?.userId?._id === currentUserId
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "85vh",
          minHeight: "400px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
          px: 3,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: 3,
          bgcolor: "background.paper",
          position: "sticky",
          top: 64,
          zIndex: 1,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              py: 1.5,
              minHeight: "48px",
              textTransform: "none",
              fontSize: "0.95rem",
            },
            "& .Mui-selected": {
              fontWeight: 600,
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  Followers
                </Typography>
                {stats.followerCount > 0 && (
                  <Badge
                    badgeContent={formatNumber(stats.followerCount)}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.65rem",
                        height: "18px",
                        minWidth: "18px",
                        borderRadius: "9px",
                      },
                    }}
                  />
                )}
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  Following
                </Typography>
                {stats.followingCount > 0 && (
                  <Badge
                    badgeContent={formatNumber(stats.followingCount)}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.65rem",
                        height: "18px",
                        minWidth: "18px",
                        borderRadius: "9px",
                      },
                    }}
                  />
                )}
              </Box>
            }
          />
        </Tabs>
      </Box>

      {/* Search */}
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: "background.paper",
          position: "sticky",
          top: 112,
          zIndex: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder={`Search ${activeTab === 0 ? "followers" : "following"}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "background.default",
            },
          }}
        />
      </Box>

      {/* Error Message */}
      {error && (
        <Box sx={{ px: 3, py: 2 }}>
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ borderRadius: 2 }}
          >
            {error}
          </Alert>
        </Box>
      )}

      {/* Content */}
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "300px",
          bgcolor: "background.default",
        }}
      >
        {loading.followers && activeTab === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading followers...
            </Typography>
          </Box>
        ) : loading.following && activeTab === 1 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading following...
            </Typography>
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              textAlign: "center",
              p: 4,
            }}
          >
            <Box>
              <PersonIcon
                sx={{
                  fontSize: 64,
                  color: "text.secondary",
                  opacity: 0.3,
                  mb: 2,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchQuery.trim()
                  ? "No users found"
                  : `No ${activeTab === 0 ? "followers" : "following"} yet`}
              </Typography>
              {!searchQuery.trim() && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {activeTab === 0
                    ? "When someone follows this user, they'll appear here."
                    : "When this user follows someone, they'll appear here."}
                </Typography>
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ overflow: "auto", flex: 1 }}>
            {filteredUsers.map((user, index) => (
              <React.Fragment key={user._id || index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    gap: 2,
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => handleViewProfile(user.username)}
                >
                  {/* Avatar */}
                  <Box sx={{ flexShrink: 0 }}>
                    <Avatar
                      src={user.avatar}
                      sx={{
                        width: 56,
                        height: 56,
                        border: "2px solid",
                        borderColor: "background.paper",
                        boxShadow: 1,
                      }}
                    >
                      {user.userId?.name?.charAt(0)?.toUpperCase() ||
                        user.username?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </Avatar>
                  </Box>

                  {/* User Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {user.userId?.name || user.username || "Unknown User"}
                      </Typography>
                      {user.isVerified && (
                        <VerifiedIcon
                          fontSize="small"
                          color="primary"
                          sx={{ flexShrink: 0 }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      @{user.username || "unknown"}
                    </Typography>

                    {user.bio && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: 1.4,
                          fontSize: "0.85rem",
                        }}
                      >
                        {user.bio}
                      </Typography>
                    )}

                    {/* Stats */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mt: 1,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        <strong>
                          {formatNumber(
                            user.communityStats?.followerCount || 0,
                          )}
                        </strong>{" "}
                        followers
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <strong>
                          {formatNumber(user.communityStats?.totalPosts || 0)}
                        </strong>{" "}
                        posts
                      </Typography>
                    </Box>

                    {/* Badges */}
                    {user.expertInCategories &&
                      user.expertInCategories.length > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            mt: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          {user.expertInCategories
                            .slice(0, 2)
                            .map((category, idx) => (
                              <Chip
                                key={idx}
                                label={category}
                                size="small"
                                sx={{
                                  height: "22px",
                                  fontSize: "0.65rem",
                                  bgcolor: "primary.50",
                                  color: "primary.700",
                                  borderColor: "primary.200",
                                }}
                                variant="outlined"
                              />
                            ))}
                        </Box>
                      )}
                  </Box>

                  {/* Action Buttons */}
                  <Box
                    sx={{
                      flexShrink: 0,
                      display: "flex",
                      gap: 1,
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent profile navigation
                  >
                    {/* Message Button */}
                    {!isCurrentUser(user.userId?._id || user._id) && (
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleMessage(user.userId?._id || user._id)
                        }
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          p: 0.75,
                        }}
                      >
                        <MessageIcon fontSize="small" />
                      </IconButton>
                    )}

                    {/* Follow/Unfollow Button - Only show for non-current users */}
                    {!isCurrentUser(user.userId?._id || user._id) && (
                      <Button
                        size="small"
                        variant={user.isFollowing ? "outlined" : "contained"}
                        sx={{
                          minWidth: "100px",
                          borderRadius: 1.5,
                          textTransform: "none",
                          fontWeight: 500,
                        }}
                        onClick={() =>
                          handleFollowToggle(user, !!user.isFollowing)
                        }
                        disabled={followLoading[user._id]}
                        startIcon={
                          followLoading[user._id] ? (
                            <CircularProgress size={16} />
                          ) : undefined
                        }
                      >
                        {followLoading[user._id]
                          ? "..."
                          : user.isFollowing
                            ? "Following"
                            : "Follow"}
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Divider except for last item */}
                {index < filteredUsers.length - 1 && <Divider sx={{ mx: 2 }} />}
              </React.Fragment>
            ))}
          </Box>
        )}
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Showing {filteredUsers.length} of{" "}
          {formatNumber(
            activeTab === 0 ? stats.followerCount : stats.followingCount,
          )}{" "}
          {activeTab === 0 ? "followers" : "following"}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Click on a user to view their profile
        </Typography>
      </DialogActions>
    </Dialog>
  );
}
