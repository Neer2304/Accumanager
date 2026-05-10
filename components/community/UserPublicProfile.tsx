// app/community/profile/[username]/page.tsx
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
  Card,
  CardContent,
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
  Breadcrumbs,
  Link as MuiLink,
  Divider,
} from "@mui/material";
import {
  People as PeopleIcon,
  Forum as ForumIcon,
  ThumbUp as ThumbUpIcon,
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
  Home as HomeIcon,
  Whatshot as HotIcon,
  BookmarkBorder as BookmarkIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import FollowDialog from "@/components/community/FollowDialog";
import Link from "next/link";
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

// Avatar with deterministic color
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

const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

interface CommunityProfile {
  _id: string;
  userId: any;
  username: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: any;
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
  preferences: any;
  isFollowing?: boolean;
  isOwnProfile?: boolean;
}

export default function UserProfilePage({ profile, username }: { profile: CommunityProfile; username: string }) {
  const c = useColors();
  const router = useRouter();
  
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [followDialogOpen, setFollowDialogOpen] = useState(false);
  const [followDialogType, setFollowDialogType] = useState<"followers" | "following">("followers");
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing || false);
  const [followerCount, setFollowerCount] = useState(profile.followerCount);
  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  const isOwnProfile = profile.isOwnProfile || false;
  const userInfo = typeof profile.userId === "object" ? profile.userId : { name: profile.username };

  useEffect(() => {
    if (tabValue === 3) fetchUserPosts();
    if (tabValue === 1) fetchFollowers();
    if (tabValue === 2) fetchFollowing();
  }, [tabValue]);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const userId = typeof profile.userId === "object" ? profile.userId._id : profile.userId;
      const res = await fetch(`/api/community/posts/user/${userId}?limit=10`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setUserPosts(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchFollowers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/community/profile/${profile.username}/connections?type=followers&limit=100`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setFollowers(data.data?.users || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchFollowing = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/community/profile/${profile.username}/connections?type=following&limit=100`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setFollowing(data.data?.users || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleFollowToggle = async () => {
    if (isOwnProfile) return;
    setLoading(true);
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(`/api/community/profile/${encodeURIComponent(profile.username)}/follow`, { method, credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setIsFollowing(!isFollowing);
        setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleOpenFollowDialog = (type: "followers" | "following") => {
    setFollowDialogType(type);
    setFollowDialogOpen(true);
  };

  return (
    <Box sx={{ bgcolor: c.bg, minHeight: "100vh" }}>
      {/* Sticky Header */}
      <Box sx={{ 
        position: "sticky", top: 0, zIndex: 100,
        bgcolor: alpha(c.surface, 0.95), borderBottom: `1px solid ${c.border}`,
        backdropFilter: "blur(10px)"
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.25 }}>
            <IconButton size="small" onClick={() => router.back()}
              sx={{ bgcolor: c.surface2, color: c.ink, "&:hover": { bgcolor: c.border } }}>
              <ArrowBackIcon sx={{ fontSize: 19 }} />
            </IconButton>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: c.ink }}>
              {userInfo.name || profile.username}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
        {/* Cover & Avatar Section */}
        <Paper sx={{ borderRadius: "16px", overflow: "hidden", bgcolor: c.surface, border: `1px solid ${c.border}`, mb: 3 }}>
          <Box sx={{ height: 180, bgcolor: c.blue, background: `linear-gradient(135deg, ${c.blue} 0%, ${c.purple} 100%)` }} />
          <Box sx={{ px: 3, pb: 3, position: "relative" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, mt: -50 }}>
                <UserAvatar name={userInfo.name} src={profile.avatar} size={100} />
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ color: c.ink }}>
                      {userInfo.name || profile.username}
                    </Typography>
                    {profile.isVerified && <VerifiedIcon sx={{ color: c.blue, fontSize: 20 }} />}
                  </Box>
                  <Typography sx={{ color: c.inkMuted, fontSize: "0.85rem" }}>@{profile.username}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                {!isOwnProfile && (
                  <Button
                    variant={isFollowing ? "outlined" : "contained"}
                    onClick={handleFollowToggle}
                    disabled={loading}
                    sx={{
                      borderRadius: "40px",
                      textTransform: "none",
                      px: 3,
                      ...(isFollowing ? {
                        borderColor: c.border,
                        color: c.ink,
                        "&:hover": { borderColor: c.blue, bgcolor: c.blueSoft }
                      } : {
                        bgcolor: c.blue,
                        "&:hover": { bgcolor: "#166fe5" }
                      })
                    }}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
                {isOwnProfile && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => router.push("/community/profile/edit")}
                    sx={{ borderRadius: "40px", textTransform: "none", borderColor: c.border, color: c.ink }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Box>

            {/* Bio */}
            {profile.bio && (
              <Typography sx={{ mt: 2, color: c.inkSub, fontSize: "0.9rem" }}>
                {profile.bio}
              </Typography>
            )}

            {/* Info Row */}
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
                  <Typography component="a" href={profile.website} target="_blank" sx={{ fontSize: "0.75rem", color: c.blue, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                    Website
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarIcon sx={{ fontSize: 14, color: c.inkMuted }} />
                <Typography sx={{ fontSize: "0.75rem", color: c.inkMuted }}>
                  Joined {formatDate(profile.communityStats?.joinDate || profile._id)}
                </Typography>
              </Box>
            </Box>

            {/* Stats Row */}
            <Box sx={{ display: "flex", gap: 3, mt: 3, pt: 2, borderTop: `1px solid ${c.border}` }}>
              <Box sx={{ cursor: "pointer" }} onClick={() => handleOpenFollowDialog("followers")}>
                <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: c.ink }}>
                  {formatNumber(followerCount)}
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
                  {formatNumber(profile.communityStats?.totalPosts || 0)}
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
            <Tab label="Posts" />
            <Tab label="Followers" />
            <Tab label="Following" />
            <Tab label="Activity" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Stack spacing={2}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress sx={{ color: c.blue }} /></Box>
            ) : userPosts.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: "16px", bgcolor: c.surface }}>
                <ForumIcon sx={{ fontSize: 48, color: c.inkMuted, mb: 1, opacity: 0.5 }} />
                <Typography sx={{ color: c.inkSub }}>No posts yet</Typography>
              </Paper>
            ) : (
              userPosts.map((post) => (
                <Paper key={post._id} sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, overflow: "hidden" }}>
                  <Box sx={{ p: 2.5 }}>
                    <Typography component={Link} href={`/community/post/${post._id}`} sx={{ fontWeight: 700, fontSize: "1rem", color: c.ink, textDecoration: "none", "&:hover": { color: c.blue } }}>
                      {post.title}
                    </Typography>
                    {post.excerpt && (
                      <Typography sx={{ fontSize: "0.8rem", color: c.inkSub, mt: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {post.excerpt}
                      </Typography>
                    )}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ThumbUpIcon sx={{ fontSize: 12, color: c.red }} />
                        <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>{post.likeCount || 0}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ForumIcon sx={{ fontSize: 12, color: c.inkMuted }} />
                        <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>{post.commentCount || 0}</Typography>
                      </Box>
                      <Button size="small" component={Link} href={`/community/post/${post._id}`} sx={{ color: c.blue, textTransform: "none", fontSize: "0.7rem", ml: "auto" }}>Read More</Button>
                    </Box>
                  </Box>
                </Paper>
              ))
            )}
          </Stack>
        )}

        {tabValue === 1 && (
          <Stack spacing={2}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress sx={{ color: c.blue }} /></Box>
            ) : followers.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: "16px", bgcolor: c.surface }}>
                <PeopleIcon sx={{ fontSize: 48, color: c.inkMuted, mb: 1, opacity: 0.5 }} />
                <Typography sx={{ color: c.inkSub }}>No followers yet</Typography>
              </Paper>
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2 }}>
                {followers.map((user) => (
                  <Paper key={user._id} sx={{ borderRadius: "12px", bgcolor: c.surface, border: `1px solid ${c.border}`, p: 2, cursor: "pointer" }} onClick={() => router.push(`/community/profile/${user.username}`)}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <UserAvatar name={user.username} src={user.avatar} size={48} />
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: c.ink }}>{user.userId?.name || user.username}</Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>@{user.username}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Stack>
        )}

        {tabValue === 2 && (
          <Stack spacing={2}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress sx={{ color: c.blue }} /></Box>
            ) : following.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: "16px", bgcolor: c.surface }}>
                <PeopleIcon sx={{ fontSize: 48, color: c.inkMuted, mb: 1, opacity: 0.5 }} />
                <Typography sx={{ color: c.inkSub }}>Not following anyone yet</Typography>
              </Paper>
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2 }}>
                {following.map((user) => (
                  <Paper key={user._id} sx={{ borderRadius: "12px", bgcolor: c.surface, border: `1px solid ${c.border}`, p: 2, cursor: "pointer" }} onClick={() => router.push(`/community/profile/${user.username}`)}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <UserAvatar name={user.username} src={user.avatar} size={48} />
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: c.ink }}>{user.userId?.name || user.username}</Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: c.inkMuted }}>@{user.username}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Stack>
        )}

        {tabValue === 3 && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
            <Paper sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, p: 2.5 }}>
              <Typography sx={{ fontWeight: 600, color: c.ink, mb: 2 }}>📊 Activity Stats</Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "0.8rem", color: c.inkMuted }}>Total Comments</Typography>
                  <Typography sx={{ fontWeight: 600, color: c.ink }}>{formatNumber(profile.communityStats?.totalComments || 0)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "0.8rem", color: c.inkMuted }}>Likes Given</Typography>
                  <Typography sx={{ fontWeight: 600, color: c.ink }}>{formatNumber(profile.communityStats?.totalLikesGiven || 0)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "0.8rem", color: c.inkMuted }}>Likes Received</Typography>
                  <Typography sx={{ fontWeight: 600, color: c.ink }}>{formatNumber(profile.communityStats?.totalLikesReceived || 0)}</Typography>
                </Box>
                <Divider sx={{ borderColor: c.border }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "0.8rem", color: c.inkMuted }}>Engagement Score</Typography>
                  <Typography sx={{ fontWeight: 600, color: c.green }}>{formatNumber(profile.communityStats?.engagementScore || 0)}</Typography>
                </Box>
              </Stack>
            </Paper>
            <Paper sx={{ borderRadius: "16px", bgcolor: c.surface, border: `1px solid ${c.border}`, p: 2.5 }}>
              <Typography sx={{ fontWeight: 600, color: c.ink, mb: 2 }}>🏆 Badges</Typography>
              {profile.badges && profile.badges.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {profile.badges.map((badge, i) => (
                    <Chip key={i} label={badge} size="small" sx={{ bgcolor: c.surface2, color: c.ink }} />
                  ))}
                </Box>
              ) : (
                <Typography sx={{ fontSize: "0.8rem", color: c.inkMuted, textAlign: "center", py: 2 }}>No badges yet</Typography>
              )}
            </Paper>
          </Box>
        )}
      </Container>

      {/* Follow Dialog */}
      <FollowDialog
        open={followDialogOpen}
        onClose={() => setFollowDialogOpen(false)}
        profileId={profile.username}
        type={followDialogType}
        title={`@${profile.username}'s ${followDialogType}`}
      />
    </Box>
  );
}