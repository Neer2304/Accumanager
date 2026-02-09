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
  alpha,
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
import { useTheme } from "@mui/material/styles";

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
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
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

  const handleFollowToggle = async (
    user: User,
    isCurrentlyFollowing: boolean,
  ) => {
    setFollowLoading((prev) => ({ ...prev, [user._id]: true }));

    try {
      const method = isCurrentlyFollowing ? "DELETE" : "POST";
      const url = `/api/community/profile/${encodeURIComponent(user.username)}/follow`;

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          try {
            const errorText = await response.text();
            if (errorText) errorMessage = `${errorMessage}: ${errorText}`;
          } catch {
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.success) {
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

        console.log(`Successfully ${isCurrentlyFollowing ? 'unfollowed' : 'followed'} ${user.username}`);
      } else {
        throw new Error(data.message || "Failed to follow/unfollow");
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setFollowLoading((prev) => ({ ...prev, [user._id]: false }));
    }
  };

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
    router.push(`/messages?userId=${userId}`);
  };

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
          borderRadius: 2,
          maxHeight: "85vh",
          minHeight: "400px",
          bgcolor: darkMode ? '#202124' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
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
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          bgcolor: darkMode ? '#202124' : '#ffffff',
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" component="span" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '&:hover': {
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          px: 3,
          bgcolor: darkMode ? '#202124' : '#ffffff',
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
            '& .MuiTab-root': {
              py: 1.5,
              minHeight: "48px",
              textTransform: "none",
              fontSize: "0.95rem",
              color: darkMode ? '#9aa0a6' : '#5f6368',
              '&.Mui-selected': {
                color: '#4285f4',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#4285f4',
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
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: "0.65rem",
                        height: "18px",
                        minWidth: "18px",
                        borderRadius: "9px",
                        backgroundColor: '#4285f4',
                        color: 'white',
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
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: "0.65rem",
                        height: "18px",
                        minWidth: "18px",
                        borderRadius: "9px",
                        backgroundColor: '#4285f4',
                        color: 'white',
                      },
                    }}
                  />
                )}
              </Box>
            }
          />
        </Tabs>
      </Box>

      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: darkMode ? '#202124' : '#ffffff',
          position: "sticky",
          top: 112,
          zIndex: 1,
          borderBottom: 1,
          borderColor: darkMode ? '#3c4043' : '#dadce0',
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
                <SearchIcon fontSize="small" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              </InputAdornment>
            ),
            sx: { color: darkMode ? '#e8eaed' : '#202124' }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              '& fieldset': {
                borderColor: darkMode ? '#3c4043' : '#dadce0',
              },
              '&:hover fieldset': {
                borderColor: '#4285f4',
              },
            },
          }}
        />
      </Box>

      {error && (
        <Box sx={{ px: 3, py: 2 }}>
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ 
              borderRadius: 2,
              bgcolor: darkMode ? '#3c1e1e' : '#fdecea',
            }}
          >
            {error}
          </Alert>
        </Box>
      )}

      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "300px",
          bgcolor: darkMode ? '#202124' : '#ffffff',
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
            <CircularProgress sx={{ color: '#4285f4' }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
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
            <CircularProgress sx={{ color: '#4285f4' }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
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
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  opacity: 0.3,
                  mb: 2,
                }}
              />
              <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }} gutterBottom>
                {searchQuery.trim()
                  ? "No users found"
                  : `No ${activeTab === 0 ? "followers" : "following"} yet`}
              </Typography>
              {!searchQuery.trim() && (
                <Typography
                  variant="body2"
                  sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 1 }}
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
                    '&:hover': {
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => handleViewProfile(user.username)}
                >
                  <Box sx={{ flexShrink: 0 }}>
                    <Avatar
                      src={user.avatar}
                      sx={{
                        width: 56,
                        height: 56,
                        border: "2px solid",
                        borderColor: darkMode ? '#202124' : '#ffffff',
                        boxShadow: 1,
                      }}
                    >
                      {user.userId?.name?.charAt(0)?.toUpperCase() ||
                        user.username?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </Avatar>
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {user.userId?.name || user.username || "Unknown User"}
                      </Typography>
                      {user.isVerified && (
                        <VerifiedIcon
                          fontSize="small"
                          sx={{ flexShrink: 0, color: '#4285f4' }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant="caption"
                      noWrap
                      sx={{ display: "block", mb: 0.5, color: darkMode ? '#9aa0a6' : '#5f6368' }}
                    >
                      @{user.username || "unknown"}
                    </Typography>

                    {user.bio && (
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: 1.4,
                          fontSize: "0.85rem",
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                        }}
                      >
                        {user.bio}
                      </Typography>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mt: 1,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        <strong>
                          {formatNumber(
                            user.communityStats?.followerCount || 0,
                          )}
                        </strong>{" "}
                        followers
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        <strong>
                          {formatNumber(user.communityStats?.totalPosts || 0)}
                        </strong>{" "}
                        posts
                      </Typography>
                    </Box>

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
                                  bgcolor: darkMode ? '#303134' : '#f1f3f4',
                                  color: darkMode ? '#8ab4f8' : '#4285f4',
                                  borderColor: darkMode ? '#5f6368' : '#dadce0',
                                }}
                                variant="outlined"
                              />
                            ))}
                        </Box>
                      )}
                  </Box>

                  <Box
                    sx={{
                      flexShrink: 0,
                      display: "flex",
                      gap: 1,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!isCurrentUser(user.userId?._id || user._id) && (
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleMessage(user.userId?._id || user._id)
                        }
                        sx={{
                          border: 1,
                          borderColor: darkMode ? '#5f6368' : '#dadce0',
                          borderRadius: 1,
                          p: 0.75,
                          color: darkMode ? '#e8eaed' : '#202124',
                          '&:hover': {
                            backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                          },
                        }}
                      >
                        <MessageIcon fontSize="small" />
                      </IconButton>
                    )}

                    {!isCurrentUser(user.userId?._id || user._id) && (
                      <Button
                        size="small"
                        variant={user.isFollowing ? "outlined" : "contained"}
                        sx={{
                          minWidth: "100px",
                          borderRadius: 1.5,
                          textTransform: "none",
                          fontWeight: 500,
                          ...(user.isFollowing ? {
                            borderColor: darkMode ? '#5f6368' : '#dadce0',
                            color: darkMode ? '#e8eaed' : '#202124',
                            '&:hover': {
                              borderColor: '#4285f4',
                              backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                            },
                          } : {
                            backgroundColor: '#4285f4',
                            '&:hover': {
                              backgroundColor: '#3367d6',
                            },
                          }),
                        }}
                        onClick={() =>
                          handleFollowToggle(user, !!user.isFollowing)
                        }
                        disabled={followLoading[user._id]}
                        startIcon={
                          followLoading[user._id] ? (
                            <CircularProgress size={16} sx={{ color: user.isFollowing ? '#4285f4' : 'white' }} />
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

                {index < filteredUsers.length - 1 && (
                  <Divider sx={{ 
                    mx: 2,
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  }} />
                )}
              </React.Fragment>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: 1,
          borderColor: darkMode ? '#3c4043' : '#dadce0',
          bgcolor: darkMode ? '#202124' : '#ffffff',
          justifyContent: "space-between",
        }}
      >
        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
          Showing {filteredUsers.length} of{" "}
          {formatNumber(
            activeTab === 0 ? stats.followerCount : stats.followingCount,
          )}{" "}
          {activeTab === 0 ? "followers" : "following"}
        </Typography>

        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
          Click on a user to view their profile
        </Typography>
      </DialogActions>
    </Dialog>
  );
}