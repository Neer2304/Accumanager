// app/community/profile/page.tsx - COMPLETE REDESIGNED VERSION
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Card,
  CardContent,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Badge,
  Tooltip,
  alpha,
  Divider,
  Stack,
  Skeleton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Forum as ForumIcon,
  ThumbUp as ThumbUpIcon,
  Bookmark as BookmarkIcon,
  Comment as CommentIcon,
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
  Add as AddIcon,
  Home as HomeIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDate, formatNumber } from "@/utils/formatUtils";
import CommunityProfileDialog from "./CommunityProfileDialog";
import FollowDialog from "./FollowDialog";
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
    purple: dark ? "#b39ddb" : "#7b1fa2",
  };
};

const AVATAR_COLORS = ["#1877f2", "#e91e63", "#9c27b0", "#ff9800", "#4caf50", "#00bcd4", "#ff5722", "#607d8b"];
function avatarColor(name: string) {
  return AVATAR_COLORS[(name || "U").charCodeAt(0) % AVATAR_COLORS.length];
}

function UserAvatar({ name, src, size = 80 }: { name?: string; src?: string; size?: number }) {
  const c = useColors();
  const initials = (name || "U").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <Avatar src={src || undefined}
      sx={{
        width: size, height: size, bgcolor: avatarColor(name || "U"),
        fontSize: size * 0.38, fontWeight: 700,
        border: `4px solid ${c.surface}`,
      }}>
      {!src && initials}
    </Avatar>
  );
}

export interface CommunityProfile {
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
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks: { twitter: string; linkedin: string; instagram: string; facebook: string };
  isVerified: boolean;
  verificationBadge: boolean;
  expertInCategories: string[];
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
  badges: string[];
  preferences: { privateProfile: boolean; allowMessages: "everyone" | "followers" | "none" };
}

interface User {
  _id: string;
  username: string;
  avatar?: string;
  bio?: string;
  communityStats: { totalPosts: number; followerCount: number };
  userId: { name: string };
  isFollowing?: boolean;
}

export default function CommunityProfilePage() {
  const c = useColors();
  const router = useRouter();
  
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState<CommunityProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<any[]>([]);
  const [loadingState, setLoadingState] = useState({
    followers: false,
    following: false,
    posts: false,
    likes: false,
    bookmarks: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [followDialogOpen, setFollowDialogOpen] = useState(false);
  const [followDialogType, setFollowDialogType] = useState<"followers" | "following">("followers");
  
  // Track if data has been fetched for each tab
  const tabFetchedRef = useRef({ 
    followers: false, 
    following: false, 
    posts: false,
    likes: false,
    bookmarks: false 
  });

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/community/profile", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        const profileData = data.data;
        if (!profileData.socialLinks) profileData.socialLinks = { twitter: "", linkedin: "", instagram: "", facebook: "" };
        if (!profileData.preferences) profileData.preferences = { privateProfile: false, allowMessages: "everyone" };
        if (!profileData.followers) profileData.followers = [];
        if (!profileData.following) profileData.following = [];
        setProfile(profileData);
      } else {
        setError(data.message);
      }
    } catch (err: any) { 
      setError(err.message || "Failed to load profile"); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  // Fetch user's created posts
  const fetchUserPosts = useCallback(async () => {
    if (!profile || loadingState.posts) return;
    setLoadingState(prev => ({ ...prev, posts: true }));
    try {
      const res = await fetch(`/api/community?limit=50`, { credentials: "include" });
      const data = await res.json();
      if (data.success && data.data) {
        const currentUserId = profile.userId?._id || profile._id;
        const posts = data.data.filter((post: any) => {
          const authorId = post.author?._id || post.author?.userId || post.author;
          return authorId?.toString() === currentUserId?.toString();
        });
        setUserPosts(posts);
        console.log(`Found ${posts.length} posts`);
      }
    } catch (error) { console.error(error); }
    finally { setLoadingState(prev => ({ ...prev, posts: false })); }
  }, [profile, loadingState.posts]);

  // Fetch user's liked posts
  const fetchLikedPosts = useCallback(async () => {
    if (!profile || loadingState.likes) return;
    setLoadingState(prev => ({ ...prev, likes: true }));
    try {
      const res = await fetch(`/api/community?limit=50`, { credentials: "include" });
      const data = await res.json();
      if (data.success && data.data) {
        const currentUserId = profile.userId?._id || profile._id;
        const posts = data.data.filter((post: any) => 
          post.likes?.includes(currentUserId)
        );
        setLikedPosts(posts);
      }
    } catch (error) { console.error(error); }
    finally { setLoadingState(prev => ({ ...prev, likes: false })); }
  }, [profile, loadingState.likes]);

  // Fetch user's bookmarked posts
  const fetchBookmarkedPosts = useCallback(async () => {
    if (!profile || loadingState.bookmarks) return;
    setLoadingState(prev => ({ ...prev, bookmarks: true }));
    try {
      const res = await fetch(`/api/community?limit=50`, { credentials: "include" });
      const data = await res.json();
      if (data.success && data.data) {
        const currentUserId = profile.userId?._id || profile._id;
        const posts = data.data.filter((post: any) => 
          post.bookmarks?.includes(currentUserId)
        );
        setBookmarkedPosts(posts);
      }
    } catch (error) { console.error(error); }
    finally { setLoadingState(prev => ({ ...prev, bookmarks: false })); }
  }, [profile, loadingState.bookmarks]);

  // Fetch followers list
  const fetchFollowers = useCallback(async () => {
    if (!profile || loadingState.followers) return;
    setLoadingState(prev => ({ ...prev, followers: true }));
    try {
      const res = await fetch(`/api/community/profile/${profile.username}/connections?type=followers&limit=100`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setFollowers(data.data?.users || []);
    } catch (error) { console.error(error); }
    finally { setLoadingState(prev => ({ ...prev, followers: false })); }
  }, [profile?.username, loadingState.followers]);

  // Fetch following list
  const fetchFollowing = useCallback(async () => {
    if (!profile || loadingState.following) return;
    setLoadingState(prev => ({ ...prev, following: true }));
    try {
      const res = await fetch(`/api/community/profile/${profile.username}/connections?type=following&limit=100`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setFollowing(data.data?.users || []);
    } catch (error) { console.error(error); }
    finally { setLoadingState(prev => ({ ...prev, following: false })); }
  }, [profile?.username, loadingState.following]);

  // Initialize - fetch profile only once
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Fetch data when tab changes - only once per tab
  useEffect(() => {
    if (!profile) return;
    
    if (tabValue === 1 && !tabFetchedRef.current.followers) {
      tabFetchedRef.current.followers = true;
      fetchFollowers();
    } else if (tabValue === 2 && !tabFetchedRef.current.following) {
      tabFetchedRef.current.following = true;
      fetchFollowing();
    } else if (tabValue === 3 && !tabFetchedRef.current.posts) {
      tabFetchedRef.current.posts = true;
      fetchUserPosts();
    } else if (tabValue === 4 && !tabFetchedRef.current.likes) {
      tabFetchedRef.current.likes = true;
      fetchLikedPosts();
    } else if (tabValue === 5 && !tabFetchedRef.current.bookmarks) {
      tabFetchedRef.current.bookmarks = true;
      fetchBookmarkedPosts();
    }
  }, [tabValue, profile, fetchFollowers, fetchFollowing, fetchUserPosts, fetchLikedPosts, fetchBookmarkedPosts]);

  const handleOpenFollowDialog = (type: "followers" | "following") => {
    setFollowDialogType(type);
    setFollowDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: c.bg, minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Skeleton variant="rounded" height={300} sx={{ borderRadius: "16px", mb: 2 }} />
          <Skeleton variant="rounded" height={100} sx={{ borderRadius: "16px", mb: 2 }} />
          <Skeleton variant="rounded" height={400} sx={{ borderRadius: "16px" }} />
        </Container>
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error || "Profile not found"}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: c.bg, minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        {/* Profile Header Card */}
        <Paper sx={{ borderRadius: "16px", overflow: "hidden", bgcolor: c.surface, border: `1px solid ${c.border}`, mb: 3 }}>
          <Box sx={{ height: 180, bgcolor: c.blue, background: `linear-gradient(135deg, ${c.blue} 0%, ${c.purple} 100%)` }} />
          
          <Box sx={{ px: 3, pb: 3, position: "relative" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, mt: -50 }}>
                <UserAvatar name={profile.userId.name} src={profile.avatar} size={100} />
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ color: c.ink }}>
                      {profile.userId.name}
                    </Typography>
                    {profile.isVerified && <VerifiedIcon sx={{ color: c.blue, fontSize: 20 }} />}
                  </Box>
                  <Typography sx={{ color: c.inkMuted, fontSize: "0.85rem" }}>@{profile.username}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditDialogOpen(true)}
                  sx={{ borderRadius: "40px", textTransform: "none", borderColor: c.border, color: c.ink }}
                >
                  Edit Profile
                </Button>
                <IconButton sx={{ border: `1px solid ${c.border}`, borderRadius: "40px", color: c.ink }}>
                  <SettingsIcon />
                </IconButton>
              </Box>
            </Box>

            {profile.bio && (
              <Typography sx={{ mt: 2, color: c.inkSub, fontSize: "0.9rem" }}>{profile.bio}</Typography>
            )}

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
              {profile.location && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationIcon sx={{ fontSize: 14, color: c.inkMuted }} />
                  <Typography sx={{ fontSize: "0.75rem", color: c.inkMuted }}>{profile.location}</Typography>
                </Box>
              )}
              {profile.website && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LinkIcon sx={{ fontSize: 14, color: c.inkMuted }} />
                  <Typography component="a" href={profile.website} target="_blank" sx={{ fontSize: "0.75rem", color: c.blue, textDecoration: "none" }}>
                    Website
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarIcon sx={{ fontSize: 14, color: c.inkMuted }} />
                <Typography sx={{ fontSize: "0.75rem", color: c.inkMuted }}>
                  Joined {formatDate(profile.communityStats.joinDate)}
                </Typography>
              </Box>
            </Box>

            {/* Stats Row */}
            <Box sx={{ display: "flex", gap: 3, mt: 3, pt: 2, borderTop: `1px solid ${c.border}` }}>
              <Box sx={{ cursor: "pointer" }} onClick={() => handleOpenFollowDialog("followers")}>
                <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: c.ink }}>
                  {formatNumber(profile.followerCount)}
                </Typography>
                <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>Followers</Typography>
              </Box>
              <Box sx={{ cursor: "pointer" }} onClick={() => handleOpenFollowDialog("following")}>
                <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: c.ink }}>
                  {formatNumber(profile.followingCount)}
                </Typography>
                <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>Following</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: c.ink }}>
                  {formatNumber(userPosts.length)}
                </Typography>
                <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>Posts</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Tabs */}
        <Paper sx={{ borderRadius: "16px", overflow: "hidden", bgcolor: c.surface, border: `1px solid ${c.border}`, mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": { textTransform: "none", fontSize: "0.85rem", py: 1.5, color: c.inkSub, "&.Mui-selected": { color: c.blue } },
              "& .MuiTabs-indicator": { bgcolor: c.blue }
            }}
          >
            <Tab label="Overview" />
            <Tab label={`Followers (${formatNumber(profile.followerCount)})`} />
            <Tab label={`Following (${formatNumber(profile.followingCount)})`} />
            <Tab label={`Posts (${formatNumber(userPosts.length)})`} />
            <Tab label="Likes" />
            <Tab label="Bookmarks" />
          </Tabs>
        </Paper>

        {/* Tab Content - Overview */}
        {tabValue === 0 && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
            <Paper sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, p: 2.5 }}>
              <Typography sx={{ fontWeight: 600, color: c.ink, mb: 2 }}>📊 Activity Stats</Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "0.8rem", color: c.inkMuted }}>Total Posts</Typography>
                  <Typography sx={{ fontWeight: 600, color: c.ink }}>{formatNumber(userPosts.length)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "0.8rem", color: c.inkMuted }}>Total Comments</Typography>
                  <Typography sx={{ fontWeight: 600, color: c.ink }}>{formatNumber(profile.communityStats.totalComments)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "0.8rem", color: c.inkMuted }}>Likes Given</Typography>
                  <Typography sx={{ fontWeight: 600, color: c.ink }}>{formatNumber(profile.communityStats.totalLikesGiven)}</Typography>
                </Box>
                <Divider sx={{ borderColor: c.border }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "0.8rem", color: c.inkMuted }}>Engagement Score</Typography>
                  <Typography sx={{ fontWeight: 600, color: c.green }}>{formatNumber(profile.communityStats.engagementScore)}</Typography>
                </Box>
              </Stack>
            </Paper>
            <Paper sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, p: 2.5 }}>
              <Typography sx={{ fontWeight: 600, color: c.ink, mb: 2 }}>🏆 Badges & Expertise</Typography>
              {profile.badges?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: "0.75rem", color: c.inkMuted, mb: 1 }}>Badges</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {profile.badges.map((badge, i) => (
                      <Chip key={i} label={badge} size="small" sx={{ bgcolor: c.surface2, color: c.ink }} />
                    ))}
                  </Box>
                </Box>
              )}
              {profile.expertInCategories?.length > 0 && (
                <Box>
                  <Typography sx={{ fontSize: "0.75rem", color: c.inkMuted, mb: 1 }}>Expert In</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {profile.expertInCategories.map((cat, i) => (
                      <Chip key={i} label={cat} size="small" sx={{ bgcolor: c.blueSoft, color: c.blue }} />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        )}

        {/* Tab Content - Followers */}
        {tabValue === 1 && (
          <Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Search followers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "40px", bgcolor: c.surface2 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: c.inkMuted }} /></InputAdornment> }}
            />
            {loadingState.followers ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress sx={{ color: c.blue }} /></Box>
            ) : followers.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: "16px", bgcolor: c.surface }}>
                <PeopleIcon sx={{ fontSize: 48, color: c.inkMuted, mb: 1, opacity: 0.5 }} />
                <Typography sx={{ color: c.inkSub }}>No followers yet</Typography>
              </Paper>
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2 }}>
                {followers.filter(u => u.username.includes(searchQuery.toLowerCase())).map((user) => (
                  <Paper key={user._id} sx={{ borderRadius: "12px", bgcolor: c.surface, border: `1px solid ${c.border}`, p: 2, cursor: "pointer" }} onClick={() => router.push(`/community/profile/${user.username}`)}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <UserAvatar name={user.userId.name} src={user.avatar} size={48} />
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: c.ink }}>{user.userId.name}</Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>@{user.username}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Tab Content - Following */}
        {tabValue === 2 && (
          <Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Search following..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "40px", bgcolor: c.surface2 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: c.inkMuted }} /></InputAdornment> }}
            />
            {loadingState.following ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress sx={{ color: c.blue }} /></Box>
            ) : following.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: "16px", bgcolor: c.surface }}>
                <PeopleIcon sx={{ fontSize: 48, color: c.inkMuted, mb: 1, opacity: 0.5 }} />
                <Typography sx={{ color: c.inkSub }}>Not following anyone yet</Typography>
              </Paper>
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2 }}>
                {following.filter(u => u.username.includes(searchQuery.toLowerCase())).map((user) => (
                  <Paper key={user._id} sx={{ borderRadius: "12px", bgcolor: c.surface, border: `1px solid ${c.border}`, p: 2, cursor: "pointer" }} onClick={() => router.push(`/community/profile/${user.username}`)}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <UserAvatar name={user.userId.name} src={user.avatar} size={48} />
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: c.ink }}>{user.userId.name}</Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>@{user.username}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Tab Content - Posts */}
        {tabValue === 3 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push("/community/create")}
                sx={{ borderRadius: "40px", bgcolor: c.blue, textTransform: "none" }}
              >
                Create New Post
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  tabFetchedRef.current.posts = false;
                  fetchUserPosts();
                }}
                sx={{ borderRadius: "40px", textTransform: "none" }}
              >
                Refresh
              </Button>
            </Box>
            {loadingState.posts ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress sx={{ color: c.blue }} /></Box>
            ) : userPosts.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: "16px", bgcolor: c.surface }}>
                <ForumIcon sx={{ fontSize: 48, color: c.inkMuted, mb: 1, opacity: 0.5 }} />
                <Typography sx={{ color: c.inkSub }}>No posts yet</Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {userPosts.map((post) => (
                  <Paper key={post._id} sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, overflow: "hidden", cursor: "pointer" }} onClick={() => router.push(`/community/post/${post._id}`)}>
                    <Box sx={{ p: 2.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: c.ink, mb: 1 }}>{post.title}</Typography>
                      {post.excerpt && <Typography sx={{ fontSize: "0.8rem", color: c.inkSub, mb: 1.5 }}>{post.excerpt}</Typography>}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <ThumbUpIcon sx={{ fontSize: 12, color: c.red }} />
                          <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>{post.likeCount || 0}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <CommentIcon sx={{ fontSize: 12, color: c.inkMuted }} />
                          <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>{post.commentCount || 0}</Typography>
                        </Box>
                        <Button size="small" component={Link} href={`/community/post/${post._id}`} sx={{ color: c.blue, textTransform: "none", fontSize: "0.7rem", ml: "auto" }}>View Post</Button>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        )}

        {/* Tab Content - Likes */}
        {tabValue === 4 && (
          <Box>
            {loadingState.likes ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress sx={{ color: c.blue }} /></Box>
            ) : likedPosts.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: "16px", bgcolor: c.surface }}>
                <ThumbUpIcon sx={{ fontSize: 48, color: c.inkMuted, mb: 1, opacity: 0.5 }} />
                <Typography sx={{ color: c.inkSub }}>No liked posts yet</Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {likedPosts.map((post) => (
                  <Paper key={post._id} sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, overflow: "hidden", cursor: "pointer" }} onClick={() => router.push(`/community/post/${post._id}`)}>
                    <Box sx={{ p: 2.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: c.ink, mb: 1 }}>{post.title}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <ThumbUpIcon sx={{ fontSize: 12, color: c.red }} />
                          <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>{post.likeCount || 0}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <CommentIcon sx={{ fontSize: 12, color: c.inkMuted }} />
                          <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>{post.commentCount || 0}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        )}

        {/* Tab Content - Bookmarks */}
        {tabValue === 5 && (
          <Box>
            {loadingState.bookmarks ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress sx={{ color: c.blue }} /></Box>
            ) : bookmarkedPosts.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: "16px", bgcolor: c.surface }}>
                <BookmarkIcon sx={{ fontSize: 48, color: c.inkMuted, mb: 1, opacity: 0.5 }} />
                <Typography sx={{ color: c.inkSub }}>No bookmarked posts yet</Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {bookmarkedPosts.map((post) => (
                  <Paper key={post._id} sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, overflow: "hidden", cursor: "pointer" }} onClick={() => router.push(`/community/post/${post._id}`)}>
                    <Box sx={{ p: 2.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: c.ink, mb: 1 }}>{post.title}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <ThumbUpIcon sx={{ fontSize: 12, color: c.red }} />
                          <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>{post.likeCount || 0}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <CommentIcon sx={{ fontSize: 12, color: c.inkMuted }} />
                          <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>{post.commentCount || 0}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Container>

      <CommunityProfileDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} profile={profile} onUpdate={setProfile} />
      <FollowDialog open={followDialogOpen} onClose={() => setFollowDialogOpen(false)} profileId={profile.username} type={followDialogType} title={`@${profile.username}'s ${followDialogType}`} />
    </Box>
  );
}