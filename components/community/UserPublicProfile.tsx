// components/community/UserPublicProfile.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Tab,
  Tabs,
  Chip,
  IconButton,
  Divider,
  Card,
  CardContent,
  CardActions,
  Stack,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Badge,
  Tooltip,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  People as PeopleIcon,
  Forum as ForumIcon,
  ThumbUp as ThumbUpIcon,
  Bookmark as BookmarkIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Link as LinkIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  CheckCircle as VerifiedIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import FollowDialog from "@/components/community/FollowDialog";

interface CommunityProfile {
  _id: string;
  userId:
    | string
    | {
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
  username: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  isVerified?: boolean;
  verificationBadge?: boolean;
  expertInCategories?: string[];
  followers: string[];
  following: string[];
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
  preferences: {
    privateProfile: boolean;
    allowMessages: string;
  };
  isFollowing?: boolean;
}

interface UserPublicProfileProps {
  profile: CommunityProfile;
  username: string;
}

// Helper functions
const formatDate = (
  dateString: string | Date,
  relative: boolean = false,
): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  if (relative) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

// User Card Component
interface UserCardProps {
  user: any;
  isFollowing?: boolean;
  onFollow?: (username: string) => void;
  onUnfollow?: (username: string) => void;
  onViewProfile?: (username: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  isFollowing = false,
  onFollow,
  onUnfollow,
  onViewProfile,
}) => {
  return (
    <Card sx={{ height: "100%", borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar src={user.avatar} sx={{ width: 50, height: 50 }}>
            {user.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight={600}>
              {user.userId?.name || user.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{user.username}
            </Typography>
          </Box>
        </Box>

        {user.bio && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {user.bio.length > 100
              ? user.bio.substring(0, 100) + "..."
              : user.bio}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Followers
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatNumber(user.followerCount || 0)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Posts
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatNumber(user.communityStats?.totalPosts || 0)}
            </Typography>
          </Box>
        </Box>

        {user.expertInCategories && user.expertInCategories.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
            {user.expertInCategories
              .slice(0, 2)
              .map((category: string, idx: number) => (
                <Chip
                  key={idx}
                  label={category}
                  size="small"
                  variant="outlined"
                />
              ))}
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant={isFollowing ? "outlined" : "contained"}
          fullWidth
          onClick={() => {
            if (isFollowing && onUnfollow) {
              onUnfollow(user.username);
            } else if (!isFollowing && onFollow) {
              onFollow(user.username);
            }
          }}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
        {onViewProfile && (
          <Button
            size="small"
            variant="outlined"
            fullWidth
            onClick={() => onViewProfile(user.username)}
          >
            View Profile
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

// Post Card Component
interface PostCardProps {
  post: any;
  showActions?: boolean;
  onViewPost?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  showActions = true,
  onViewPost,
}) => {
  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {post.title}
        </Typography>
        {post.excerpt && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {post.excerpt}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="caption" color="text.secondary">
              👍 {post.likeCount || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              💬 {post.commentCount || 0}
            </Typography>
            {post.isSolved && (
              <Chip label="Solved" size="small" color="success" />
            )}
          </Box>
          <Button size="small" onClick={() => onViewPost?.(post._id)}>
            View
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Main User Public Profile Component
export default function UserPublicProfile({
  profile,
  username,
}: UserPublicProfileProps) {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [followDialogOpen, setFollowDialogOpen] = useState(false);
  const [followDialogType, setFollowDialogType] = useState<
    "followers" | "following"
  >("followers");

  // State for follow status
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing || false);
  const [followerCount, setFollowerCount] = useState(
    profile.followerCount || 0,
  );
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Check if this is the current user's own profile
  useEffect(() => {
    const checkOwnProfile = async () => {
      try {
        const response = await fetch("/api/community/profile", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const currentUserProfile = data.data;
            // Check if the viewed profile is the same as current user's profile
            const isSameUser =
              currentUserProfile.username === profile.username ||
              currentUserProfile._id === profile._id ||
              (typeof profile.userId === "string"
                ? currentUserProfile.userId._id === profile.userId
                : currentUserProfile.userId._id === profile.userId._id);

            setIsOwnProfile(isSameUser);
          }
        }
      } catch (error) {
        console.error("Failed to check own profile:", error);
      }
    };

    checkOwnProfile();
  }, [profile]);

  // Safely extract user information
  // In UserPublicProfile component, update the getUserInfo function:

  const getUserInfo = () => {
    if (!profile)
      return {
        _id: "",
        name: "",
        email: "",
        role: "",
        shopName: "",
        subscription: null,
      };

    if (typeof profile.userId === "string") {
      // Try to find user info from followers/following lists
      const userFromList =
        followers.find((f) => f._id === profile.userId) ||
        following.find((f) => f._id === profile.userId);

      if (userFromList) {
        return userFromList.userId;
      }

      return {
        _id: profile.userId,
        name: profile.username || "User",
        email: "",
        role: "",
        shopName: "",
        subscription: null,
      };
    }

    return profile.userId;
  };

  const userInfo = getUserInfo();

  // Fetch user posts
  const fetchUserPosts = async () => {
    if (!profile) return;

    try {
      setConnectionsLoading(true);
      const userId =
        typeof profile.userId === "string"
          ? profile.userId
          : profile.userId._id;
      const response = await fetch(
        `/api/community/posts/user/${userId}?limit=10`,
        { credentials: "include" },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserPosts(data.data || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
    } finally {
      setConnectionsLoading(false);
    }
  };

  // Fetch followers
  const fetchFollowers = async () => {
    if (!profile) return;

    try {
      setConnectionsLoading(true);
      const response = await fetch(
        `/api/community/profile/${profile.username}/connections?type=followers&limit=12`,
        { credentials: "include" },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFollowers(data.data.users || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch followers:", error);
    } finally {
      setConnectionsLoading(false);
    }
  };

  // Function to open follow dialog
  const handleOpenFollowDialog = (type: "followers" | "following") => {
    setFollowDialogType(type);
    setFollowDialogOpen(true);
  };

  // Fetch following
  const fetchFollowing = async () => {
    if (!profile) return;

    try {
      setConnectionsLoading(true);
      const response = await fetch(
        `/api/community/profile/${profile.username}/connections?type=following&limit=12`,
        { credentials: "include" },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFollowing(data.data.users || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch following:", error);
    } finally {
      setConnectionsLoading(false);
    }
  };

  // Handle follow/unfollow toggle
  const handleFollowToggle = async () => {
    if (!profile || isOwnProfile) return;

    setFollowLoading(true);

    try {
      const method = isFollowing ? "DELETE" : "POST";
      const url = `/api/community/profile/${encodeURIComponent(profile.username)}/follow`;

      const response = await fetch(url, {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setIsFollowing(!isFollowing);
        if (data.data?.followerCount !== undefined) {
          setFollowerCount(data.data.followerCount);
        }
        // Refresh followers list if on followers tab
        if (tabValue === 1) {
          fetchFollowers();
        }
      } else {
        throw new Error(data.message || "Failed to follow/unfollow");
      }
    } catch (error: any) {
      console.error("Follow toggle error:", error);
      alert("Error: " + error.message);
    } finally {
      setFollowLoading(false);
    }
  };

  // Handle follow user in the list
  const handleFollowUser = async (username: string) => {
    try {
      const response = await fetch(
        `/api/community/profile/${username}/follow`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh the list
          fetchFollowers();
        }
      }
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  // Handle unfollow user in the list
  const handleUnfollowUser = async (username: string) => {
    try {
      const response = await fetch(
        `/api/community/profile/${username}/follow`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh the list
          fetchFollowers();
        }
      }
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageContent.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      console.log(
        "Sending message to:",
        userInfo._id,
        "Content:",
        messageContent,
      );
      alert("Message sent successfully!");
      setMessageContent("");
      setMessageDialogOpen(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    if (!profile) return;

    switch (tabValue) {
      case 1: // Followers
        fetchFollowers();
        break;
      case 2: // Following
        fetchFollowing();
        break;
      case 3: // Posts
        fetchUserPosts();
        break;
    }
  }, [tabValue, profile]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Check message permissions
  const canMessage = () => {
    if (!profile.preferences || isOwnProfile) return false;
    if (profile.preferences.allowMessages === "none") return false;
    if (profile.preferences.allowMessages === "followers" && !isFollowing)
      return false;
    return true;
  };

  // If no profile, show error
  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          User profile not found
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        {/* Profile Header */}
        <Paper
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 4,
            position: "relative",
          }}
        >
          {/* Cover Image */}
          <Box
            sx={{
              height: 200,
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.1),
              backgroundImage: profile.coverImage
                ? `url(${profile.coverImage})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: -60,
                left: 40,
                display: "flex",
                alignItems: "flex-end",
                gap: 3,
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  profile.verificationBadge && (
                    <VerifiedIcon
                      sx={{
                        color: "#1DA1F2",
                        fontSize: 28,
                        bgcolor: "white",
                        borderRadius: "50%",
                        p: 0.5,
                      }}
                    />
                  )
                }
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: 48,
                    border: "4px solid white",
                    boxShadow: 3,
                  }}
                  src={profile.avatar}
                >
                  {userInfo.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>

              <Box
                sx={{
                  mb: 2,
                  color: "white",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {userInfo.name}
                  {profile.isVerified && (
                    <VerifiedIcon
                      sx={{
                        color: "#1DA1F2",
                        ml: 1,
                        verticalAlign: "middle",
                        fontSize: 28,
                      }}
                    />
                  )}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  @{profile.username}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Profile Info */}
          <Box sx={{ pt: 8, px: 4, pb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1, minWidth: "300px" }}>
                {/* Bio */}
                {profile.bio && (
                  <Typography variant="body1" paragraph sx={{ maxWidth: 800 }}>
                    {profile.bio}
                  </Typography>
                )}

                {/* Details */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    mb: 3,
                  }}
                >
                  {profile.location && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {profile.location}
                      </Typography>
                    </Box>
                  )}

                  {userInfo.shopName && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {userInfo.shopName}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Joined{" "}
                      {formatDate(
                        profile.communityStats?.joinDate || profile._id,
                      )}
                    </Typography>
                  </Box>

                  {profile.website && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LinkIcon fontSize="small" color="action" />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "primary.main",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        onClick={() => window.open(profile.website, "_blank")}
                      >
                        Website
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Social Links */}
                {profile.socialLinks && (
                  <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                    {profile.socialLinks.twitter && (
                      <Tooltip title="Twitter">
                        <IconButton
                          size="small"
                          onClick={() =>
                            window.open(profile.socialLinks!.twitter, "_blank")
                          }
                          sx={{ color: "#1DA1F2" }}
                        >
                          <TwitterIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {profile.socialLinks.linkedin && (
                      <Tooltip title="LinkedIn">
                        <IconButton
                          size="small"
                          onClick={() =>
                            window.open(profile.socialLinks!.linkedin, "_blank")
                          }
                          sx={{ color: "#0077B5" }}
                        >
                          <LinkedInIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {profile.socialLinks.instagram && (
                      <Tooltip title="Instagram">
                        <IconButton
                          size="small"
                          onClick={() =>
                            window.open(
                              profile.socialLinks!.instagram,
                              "_blank",
                            )
                          }
                          sx={{ color: "#E4405F" }}
                        >
                          <InstagramIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {profile.socialLinks.facebook && (
                      <Tooltip title="Facebook">
                        <IconButton
                          size="small"
                          onClick={() =>
                            window.open(profile.socialLinks!.facebook, "_blank")
                          }
                          sx={{ color: "#1877F2" }}
                        >
                          <FacebookIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                )}

                {/* Badges */}
                {profile.badges && profile.badges.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      Badges
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {profile.badges.map((badge, index) => (
                        <Chip
                          key={index}
                          label={badge}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Expert Categories */}
                {profile.expertInCategories &&
                  profile.expertInCategories.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        gutterBottom
                      >
                        Expert In
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        {profile.expertInCategories.map((category, index) => (
                          <Chip
                            key={index}
                            label={category}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {/* Only show follow button if it's NOT the current user's own profile */}
                {!isOwnProfile && (
                  <Button
                    variant={isFollowing ? "outlined" : "contained"}
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    startIcon={
                      followLoading ? <CircularProgress size={20} /> : undefined
                    }
                  >
                    {followLoading
                      ? "..."
                      : isFollowing
                        ? "Following"
                        : "Follow"}
                  </Button>
                )}

                {/* If it's own profile, show edit button */}
                {isOwnProfile && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => router.push("/community/profile/edit")}
                  >
                    Edit Profile
                  </Button>
                )}

                {/* Message button - only show if not own profile and user allows messages */}
                {canMessage() && (
                  <Button
                    variant="outlined"
                    startIcon={<MessageIcon />}
                    onClick={() => setMessageDialogOpen(true)}
                  >
                    Message
                  </Button>
                )}

                {/* Email button - only show if not own profile */}
                {!isOwnProfile && userInfo.email && (
                  <Button
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    onClick={() =>
                      (window.location.href = `mailto:${userInfo.email}`)
                    }
                  >
                    Email
                  </Button>
                )}
              </Box>
            </Box>

            {/* Stats Bar */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
                border: "1px solid",
                borderColor: "divider",
                mt: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                }}
              >
                {/* Followers - Clickable */}
                <Box
                  sx={{
                    flex: 1,
                    minWidth: "120px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                  onClick={() => handleOpenFollowDialog("followers")}
                >
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="primary"
                    sx={{
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {formatNumber(followerCount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Followers
                  </Typography>
                </Box>

                {/* Following - Clickable */}
                <Box
                  sx={{
                    flex: 1,
                    minWidth: "120px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                  onClick={() => handleOpenFollowDialog("following")}
                >
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="primary"
                    sx={{
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {formatNumber(profile.followingCount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Following
                  </Typography>
                </Box>

                {/* Posts */}
                <Box sx={{ flex: 1, minWidth: "120px", textAlign: "center" }}>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {formatNumber(profile.communityStats?.totalPosts || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posts
                  </Typography>
                </Box>

                {/* Engagement Score */}
                <Box sx={{ flex: 1, minWidth: "120px", textAlign: "center" }}>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {formatNumber(profile.communityStats?.engagementScore || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Engagement Score
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab
                  icon={<PeopleIcon />}
                  iconPosition="start"
                  label="Overview"
                />
                <Tab
                  icon={<PeopleIcon />}
                  iconPosition="start"
                  label={`Followers (${formatNumber(followerCount)})`}
                />
                <Tab
                  icon={<PeopleIcon />}
                  iconPosition="start"
                  label={`Following (${formatNumber(profile.followingCount)})`}
                />
                <Tab
                  icon={<ForumIcon />}
                  iconPosition="start"
                  label={`Posts (${formatNumber(profile.communityStats?.totalPosts || 0)})`}
                />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Community Activity Overview
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                      }}
                    >
                      <Card sx={{ flex: 1, minWidth: "300px" }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 2,
                            }}
                          >
                            <ForumIcon color="primary" />
                            <Typography variant="h6">Post Activity</Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            {userInfo.name} has created{" "}
                            {profile.communityStats?.totalPosts || 0} posts and
                            made {profile.communityStats?.totalComments || 0}{" "}
                            comments in the community.
                          </Typography>
                          <Typography variant="body2">
                            Last active:{" "}
                            {formatDate(
                              profile.communityStats?.lastActive || profile._id,
                              true,
                            )}
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card sx={{ flex: 1, minWidth: "300px" }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 2,
                            }}
                          >
                            <ThumbUpIcon color="primary" />
                            <Typography variant="h6">Engagement</Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            {userInfo.name} has given{" "}
                            {profile.communityStats?.totalLikesGiven || 0} likes
                            and received{" "}
                            {profile.communityStats?.totalLikesReceived || 0}{" "}
                            likes.
                          </Typography>
                          <Typography variant="body2">
                            Engagement score:{" "}
                            {profile.communityStats?.engagementScore || 0}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>

                    {/* Subscription Info */}
                    {userInfo.subscription && (
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Subscription Status
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Chip
                              label={userInfo.subscription.plan.toUpperCase()}
                              color={
                                userInfo.subscription.plan === "premium"
                                  ? "primary"
                                  : userInfo.subscription.plan === "pro"
                                    ? "success"
                                    : "default"
                              }
                              variant="outlined"
                            />
                            <Typography variant="body2" color="text.secondary">
                              Status: {userInfo.subscription.status}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  </Box>
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6">
                      Followers ({formatNumber(followerCount)})
                    </Typography>
                    <TextField
                      size="small"
                      placeholder="Search followers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: { xs: "100%", sm: "300px" } }}
                    />
                  </Box>

                  {connectionsLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : followers.length === 0 ? (
                    <Alert severity="info">No followers yet.</Alert>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                      }}
                    >
                      {followers
                        .filter(
                          (user) =>
                            user.username
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            user.userId?.name
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                        )
                        .map((user) => (
                          <Box
                            key={user._id}
                            sx={{
                              width: {
                                xs: "100%",
                                sm: "calc(50% - 12px)",
                                md: "calc(33.333% - 16px)",
                              },
                              minWidth: "280px",
                            }}
                          >
                            <UserCard
                              user={user}
                              onFollow={handleFollowUser}
                              onUnfollow={handleUnfollowUser}
                              onViewProfile={(username) =>
                                router.push(`/community/profile/${username}`)
                              }
                            />
                          </Box>
                        ))}
                    </Box>
                  )}
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6">
                      Following ({formatNumber(profile.followingCount)})
                    </Typography>
                    <TextField
                      size="small"
                      placeholder="Search following..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: { xs: "100%", sm: "300px" } }}
                    />
                  </Box>

                  {connectionsLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : following.length === 0 ? (
                    <Alert severity="info">Not following anyone yet.</Alert>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                      }}
                    >
                      {following
                        .filter(
                          (user) =>
                            user.username
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            user.userId?.name
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                        )
                        .map((user) => (
                          <Box
                            key={user._id}
                            sx={{
                              width: {
                                xs: "100%",
                                sm: "calc(50% - 12px)",
                                md: "calc(33.333% - 16px)",
                              },
                              minWidth: "280px",
                            }}
                          >
                            <UserCard
                              user={user}
                              isFollowing={true}
                              onFollow={handleFollowUser}
                              onUnfollow={handleUnfollowUser}
                              onViewProfile={(username) =>
                                router.push(`/community/profile/${username}`)
                              }
                            />
                          </Box>
                        ))}
                    </Box>
                  )}
                </Box>
              )}

              {tabValue === 3 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6">
                      Posts (
                      {formatNumber(
                        profile.communityStats?.totalPosts || userPosts.length,
                      )}
                      )
                    </Typography>
                  </Box>

                  {connectionsLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : userPosts.length === 0 ? (
                    <Alert severity="info">
                      {userInfo.name} hasn't created any posts yet.
                    </Alert>
                  ) : (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      {userPosts.map((post) => (
                        <Box key={post._id}>
                          <PostCard
                            post={{
                              _id: post._id,
                              title: post.title,
                              excerpt: post.excerpt,
                              author: post.author,
                              category: post.category,
                              tags: post.tags,
                              likeCount: post.likeCount,
                              commentCount: post.commentCount,
                              views: post.views,
                              createdAt: post.createdAt,
                              updatedAt: post.updatedAt,
                              isPinned: post.isPinned,
                              isSolved: post.isSolved,
                              attachments: post.attachments,
                            }}
                            showActions={true}
                            onViewPost={(postId) =>
                              router.push(`/community/post/${postId}`)
                            }
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* Message Dialog */}
      <Dialog
        open={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Message to {userInfo.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message here..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            disabled={!messageContent.trim() || sendingMessage}
            startIcon={
              sendingMessage ? <CircularProgress size={20} /> : undefined
            }
          >
            {sendingMessage ? "Sending..." : "Send Message"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Follow Dialog */}
      <FollowDialog
        open={followDialogOpen}
        onClose={() => setFollowDialogOpen(false)}
        profileId={profile.username}
        type={followDialogType}
        title={`@${profile.username}'s ${followDialogType}`}
      />
    </>
  );
}
