// components/community/CommunityNavbar.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem,
  Avatar, Badge, Drawer, List, ListItemIcon, ListItemText, Divider, alpha,
  ListItemButton, InputBase, Paper, useMediaQuery, useTheme, CircularProgress,
  ListItemAvatar, Chip, Grow, Popper, ClickAwayListener, Stack,
} from '@mui/material';
import {
  Menu as MenuIcon, Home as HomeIcon, Forum as ForumIcon,
  Notifications as NotificationsIcon, Search as SearchIcon, Add as AddIcon,
  Person as PersonIcon, Settings as SettingsIcon, ExitToApp as LogoutIcon,
  Close as CloseIcon, Favorite as FavoriteIcon, PersonAdd as PersonAddIcon,
  Comment as CommentIcon, Groups as GroupsIcon, Explore as ExploreIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const GC = {
  blue: '#4285f4', blueHover: '#3367d6', red: '#ea4335', green: '#34a853',
  grayText: '#5f6368', grayBorder: '#dadce0',
  darkBg: '#202124', darkSurface: '#303134', darkBorder: '#3c4043',
  darkText: '#e8eaed', darkTextSec: '#9aa0a6',
};

interface CommunityUser {
  _id: string;
  communityUserId: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  location?: string;
  followerCount: number;
  isVerified: boolean;
}

interface CommunityNotification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'follow' | 'like' | 'comment';
  isRead: boolean;
  actionUrl?: string;
  metadata?: { postId?: string; communityUserId?: string };
  createdAt: string;
}

interface AuthUser {
  _id: string;
  communityUserId?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

// ─── DesktopSearch — defined OUTSIDE the parent component ────────────────────
// This is the key fix: defining it inside CommunityNavbar meant React treated
// it as a NEW component type on every render, causing a full unmount/remount
// on every keystroke → focus lost after typing 1 character.
interface DesktopSearchProps {
  darkMode: boolean;
  searchQuery: string;
  searchResults: CommunityUser[];
  searchLoading: boolean;
  showResults: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  onUserClick: (id: string) => void;
  onClickAway: () => void;
}

const DesktopSearch = React.memo(function DesktopSearch({
  darkMode, searchQuery, searchResults, searchLoading, showResults,
  onChange, onSubmit, onClear, onUserClick, onClickAway,
}: DesktopSearchProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Box ref={containerRef} sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
        <Paper
          component="form"
          onSubmit={onSubmit}
          sx={{
            display: 'flex', alignItems: 'center', borderRadius: 2,
            bgcolor: darkMode ? GC.darkSurface : '#f8f9fa',
            border: `1px solid ${darkMode ? GC.darkBorder : GC.grayBorder}`,
            transition: 'all 0.2s',
            '&:focus-within': {
              borderColor: GC.blue,
              boxShadow: `0 1px 6px ${alpha(GC.blue, 0.3)}`,
              bgcolor: darkMode ? GC.darkBg : '#fff',
            },
          }}
        >
          <IconButton type="submit" sx={{ p: '8px', color: darkMode ? GC.darkTextSec : GC.grayText }}>
            <SearchIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <InputBase
            placeholder="Search users…"
            value={searchQuery}
            onChange={onChange}
            sx={{ flex: 1, fontSize: '0.875rem', py: 1, color: darkMode ? GC.darkText : '#202124' }}
          />
          {searchQuery && (
            <IconButton size="small" onClick={onClear} sx={{ mr: 0.5, color: darkMode ? GC.darkTextSec : GC.grayText }}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Paper>

        {showResults && searchResults.length > 0 && (
          <Popper
            open
            anchorEl={containerRef.current}
            placement="bottom-start"
            transition
            sx={{ width: containerRef.current?.clientWidth, zIndex: 1300 }}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} timeout={200}>
                <Paper
                  elevation={4}
                  sx={{
                    mt: 1, borderRadius: 2, overflow: 'hidden',
                    bgcolor: darkMode ? GC.darkBg : '#fff',
                    border: `1px solid ${darkMode ? GC.darkBorder : GC.grayBorder}`,
                    maxHeight: 400, overflowY: 'auto',
                  }}
                >
                  {searchLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress size={28} sx={{ color: GC.blue }} />
                    </Box>
                  ) : (
                    <>
                      <Box sx={{
                        px: 2, py: 1,
                        bgcolor: darkMode ? GC.darkSurface : '#f8f9fa',
                        borderBottom: `1px solid ${darkMode ? GC.darkBorder : GC.grayBorder}`,
                      }}>
                        <Typography variant="caption" sx={{ color: darkMode ? GC.darkTextSec : GC.grayText }}>
                          {searchResults.length} user{searchResults.length !== 1 ? 's' : ''} found
                        </Typography>
                      </Box>
                      {searchResults.map((u) => (
                        <MenuItem
                          key={u.communityUserId}
                          onClick={() => onUserClick(u.communityUserId)}
                          sx={{
                            py: 1.5, px: 2,
                            borderBottom: `1px solid ${darkMode ? GC.darkBorder : GC.grayBorder}`,
                            '&:last-child': { borderBottom: 0 },
                            '&:hover': { bgcolor: alpha(GC.blue, darkMode ? 0.1 : 0.05) },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar src={u.avatar} sx={{ width: 40, height: 40, bgcolor: GC.blue }}>
                              {u.name?.charAt(0) || u.username?.charAt(0) || 'U'}
                            </Avatar>
                          </ListItemAvatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="body2" fontWeight={600} noWrap>
                                {u.name || u.username}
                              </Typography>
                              {u.isVerified && (
                                <Chip label="✓" size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: GC.green, color: '#fff', px: 0.5 }} />
                              )}
                            </Box>
                            <Typography variant="caption" sx={{ color: darkMode ? GC.darkTextSec : GC.grayText, display: 'block' }}>
                              @{u.username}
                            </Typography>
                            {u.bio && (
                              <Typography variant="caption" sx={{ color: darkMode ? GC.darkTextSec : GC.grayText, display: 'block', mt: 0.25 }}>
                                {u.bio.length > 50 ? `${u.bio.slice(0, 50)}…` : u.bio}
                              </Typography>
                            )}
                            <Stack direction="row" spacing={1.5} sx={{ mt: 0.5 }}>
                              <Typography variant="caption" sx={{ color: darkMode ? GC.darkTextSec : GC.grayText }}>
                                {u.followerCount || 0} followers
                              </Typography>
                              {u.location && (
                                <Typography variant="caption" sx={{ color: darkMode ? GC.darkTextSec : GC.grayText }}>
                                  {u.location}
                                </Typography>
                              )}
                            </Stack>
                          </Box>
                        </MenuItem>
                      ))}
                      <Box sx={{
                        p: 1,
                        borderTop: `1px solid ${darkMode ? GC.darkBorder : GC.grayBorder}`,
                        bgcolor: darkMode ? GC.darkSurface : '#f8f9fa',
                      }}>
                        <Button fullWidth size="small" onClick={onSubmit as React.MouseEventHandler}
                          sx={{ color: GC.blue, textTransform: 'none' }}>
                          See all results for "{searchQuery}"
                        </Button>
                      </Box>
                    </>
                  )}
                </Paper>
              </Grow>
            )}
          </Popper>
        )}
      </Box>
    </ClickAwayListener>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CommunityNavbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const theme    = useTheme();
  const isMobile      = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';

  const [anchorEl,             setAnchorEl]            = useState<null | HTMLElement>(null);
  const [mobileOpen,           setMobileOpen]          = useState(false);
  const [notifAnchorEl,        setNotifAnchorEl]       = useState<null | HTMLElement>(null);
  const [notifications,        setNotifications]       = useState<CommunityNotification[]>([]);
  const [user,                 setUser]                = useState<AuthUser | null>(null);
  const [notifCount,           setNotifCount]          = useState(0);
  const [searchDrawerOpen,     setSearchDrawerOpen]    = useState(false);
  const [searchQuery,          setSearchQuery]         = useState('');
  const [searchResults,        setSearchResults]       = useState<CommunityUser[]>([]);
  const [searchLoading,        setSearchLoading]       = useState(false);
  const [showSearchResults,    setShowSearchResults]   = useState(false);

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Profile URL helper — always use communityUserId, fall back to username ──
  // Fix: the original code used user._id (MongoDB ObjectId like "6823abc...")
  // which produced URLs like /community/profile/6823abc instead of /community/profile/m_neer143
  const profilePath = user?.communityUserId
    ? `/community/profile/${user.communityUserId}`
    : '/settings';

  useEffect(() => {
    fetchUser();
    fetchNotifications();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch { /* silent */ }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/community/notifications', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const list: CommunityNotification[] = data.data || [];
          setNotifications(list);
          setNotifCount(list.filter(n => !n.isRead).length);
        }
      }
    } catch { /* silent */ }
  };

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults([]); setShowSearchResults(false); return; }
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/community/users/search?q=${encodeURIComponent(q)}&limit=5`, { credentials: 'include' });
      const data = await res.json();
      if (data.success && data.data) {
        setSearchResults(data.data);
        setShowSearchResults(data.data.length > 0);
      } else {
        setSearchResults([]); setShowSearchResults(false);
      }
    } catch {
      setSearchResults([]); setShowSearchResults(false);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Debounced search — input change does NOT lose focus because DesktopSearch
  // is now stable (defined outside) and searchQuery is just a prop
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (q.length >= 2) {
      searchTimerRef.current = setTimeout(() => doSearch(q), 400);
    } else {
      setSearchResults([]); setShowSearchResults(false);
    }
  };

  const handleSearchSubmit = useCallback((e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/community/explore?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery('');
      if (isMobile) setSearchDrawerOpen(false);
    }
  }, [searchQuery, isMobile, router]);

  const handleUserClick = useCallback((communityUserId: string) => {
    // Fix: routes to /community/profile/[communityUserId] (e.g. m_neer143)
    // not /community/profile/[_id] (e.g. 6823abc...)
    router.push(`/community/profile/${communityUserId}`);
    setShowSearchResults(false);
    setSearchQuery('');
    if (isMobile) setSearchDrawerOpen(false);
  }, [isMobile, router]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  }, []);

  const handleClickAway = useCallback(() => setShowSearchResults(false), []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      router.push('/login');
    } catch { /* silent */ }
  };

  const handleNotifClick = async (n: CommunityNotification) => {
    try {
      await fetch(`/api/community/notifications/${n._id}/read`, { method: 'PUT', credentials: 'include' });
      if (n.actionUrl)                           router.push(n.actionUrl);
      else if (n.metadata?.postId)               router.push(`/community/post/${n.metadata.postId}`);
      else if (n.metadata?.communityUserId)      router.push(`/community/profile/${n.metadata.communityUserId}`);
      fetchNotifications();
    } catch { /* silent */ }
    setNotifAnchorEl(null);
  };

  const notifIcon = (type: CommunityNotification['type']) => {
    if (type === 'like')    return <FavoriteIcon  sx={{ color: GC.red,   fontSize: 18 }} />;
    if (type === 'follow')  return <PersonAddIcon sx={{ color: GC.green, fontSize: 18 }} />;
    if (type === 'comment') return <CommentIcon   sx={{ color: GC.blue,  fontSize: 18 }} />;
    return <NotificationsIcon sx={{ color: GC.grayText, fontSize: 18 }} />;
  };

  const timeAgo = (ds: string) => {
    const diff = Date.now() - new Date(ds).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (m < 60)  return `${m}m ago`;
    if (h < 24)  return `${h}h ago`;
    if (d < 7)   return `${d}d ago`;
    return new Date(ds).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const navItems = [
    { label: 'Home',        href: '/community',             icon: <HomeIcon    sx={{ fontSize: 20 }} /> },
    { label: 'Explore',     href: '/community/explore',     icon: <ExploreIcon sx={{ fontSize: 20 }} /> },
    { label: 'Discussions', href: '/community/discussions', icon: <ForumIcon   sx={{ fontSize: 20 }} /> },
    { label: 'Members',     href: '/community/members',     icon: <GroupsIcon  sx={{ fontSize: 20 }} /> },
  ];

  // ── Mobile sidebar drawer ──────────────────────────────────────────────────
  const drawer = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: darkMode ? GC.darkBg : '#fff' }}>
      {/* User info */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${darkMode ? GC.darkBorder : GC.grayBorder}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar src={user?.avatar} sx={{ width: 48, height: 48, bgcolor: GC.blue }}>
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>{user?.name || 'User'}</Typography>
            <Typography variant="caption" noWrap sx={{ color: darkMode ? GC.darkTextSec : GC.grayText }}>
              {user?.email || ''}
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ flex: 1, p: 1, overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <ListItemButton
              key={item.label}
              component={Link}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2, mb: 0.5,
                color: active ? GC.blue : (darkMode ? GC.darkText : '#202124'),
                bgcolor: active ? alpha(GC.blue, 0.08) : 'transparent',
              }}
            >
              <ListItemIcon sx={{ color: active ? GC.blue : (darkMode ? GC.darkTextSec : GC.grayText), minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 600 : 400 }} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 1, borderTop: `1px solid ${darkMode ? GC.darkBorder : GC.grayBorder}` }}>
        <ListItemButton
          onClick={() => { router.push(profilePath); setMobileOpen(false); }}
          sx={{ borderRadius: 2, mb: 0.5 }}
        >
          <ListItemIcon sx={{ color: darkMode ? GC.darkTextSec : GC.grayText, minWidth: 40 }}>
            <AccountCircle sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </ListItemButton>
        <ListItemButton onClick={() => { router.push('/settings'); setMobileOpen(false); }} sx={{ borderRadius: 2, mb: 0.5 }}>
          <ListItemIcon sx={{ color: darkMode ? GC.darkTextSec : GC.grayText, minWidth: 40 }}>
            <SettingsIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: GC.red }}>
          <ListItemIcon sx={{ color: GC.red, minWidth: 40 }}>
            <LogoutIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="default" elevation={0} sx={{
        borderBottom: `1px solid ${darkMode ? GC.darkBorder : GC.grayBorder}`,
        bgcolor: darkMode ? GC.darkBg : '#fff',
      }}>
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1.5, sm: 2, md: 3 }, gap: { xs: 0.5, sm: 1 } }}>

          {/* Hamburger — mobile */}
          <IconButton onClick={() => setMobileOpen(v => !v)}
            sx={{ display: { md: 'none' }, color: darkMode ? GC.darkText : '#202124' }}>
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            component={Link} href="/community"
            sx={{ textDecoration: 'none', color: GC.blue, display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600, fontSize: { xs: '1rem', sm: '1.1rem' }, flexShrink: 0 }}>
            <ForumIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Community</Box>
          </Typography>

          {/* Desktop nav links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, ml: 2, flexShrink: 0 }}>
            {navItems.map(item => {
              const active = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  startIcon={item.icon}
                  sx={{
                    color: active ? GC.blue : (darkMode ? GC.darkText : '#202124'),
                    bgcolor: active ? alpha(GC.blue, 0.08) : 'transparent',
                    px: 1.5, py: 0.75, borderRadius: 2,
                    fontWeight: active ? 600 : 400,
                    fontSize: '0.875rem', textTransform: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* Desktop search — stable component, never remounts */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, flex: 1, maxWidth: 400, mx: 2 }}>
            <DesktopSearch
              darkMode={darkMode}
              searchQuery={searchQuery}
              searchResults={searchResults}
              searchLoading={searchLoading}
              showResults={showSearchResults}
              onChange={handleSearchChange}
              onSubmit={handleSearchSubmit}
              onClear={handleClearSearch}
              onUserClick={handleUserClick}
              onClickAway={handleClickAway}
            />
          </Box>

          {/* Right actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.25, sm: 0.75 }, ml: 'auto', flexShrink: 0 }}>
            {/* Mobile search icon */}
            <IconButton sx={{ display: { md: 'none' }, color: darkMode ? GC.darkText : '#202124' }}
              onClick={() => setSearchDrawerOpen(true)}>
              <SearchIcon />
            </IconButton>

            {/* Create post */}
            {!isSmallMobile ? (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={() => router.push('/community/create')}
                sx={{ borderRadius: 2, px: { sm: 1.5, md: 2 }, py: 0.75, textTransform: 'none', fontWeight: 500, fontSize: '0.875rem', bgcolor: GC.blue, '&:hover': { bgcolor: GC.blueHover }, whiteSpace: 'nowrap' }}
              >
                Create
              </Button>
            ) : (
              <IconButton sx={{ bgcolor: GC.blue, color: '#fff', width: 34, height: 34, '&:hover': { bgcolor: GC.blueHover } }}
                onClick={() => router.push('/community/create')}>
                <AddIcon sx={{ fontSize: 18 }} />
              </IconButton>
            )}

            {/* Notifications */}
            <IconButton onClick={e => setNotifAnchorEl(e.currentTarget)} sx={{ color: darkMode ? GC.darkText : '#202124' }}>
              <Badge badgeContent={notifCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}>
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Avatar */}
            <IconButton onClick={e => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar src={user?.avatar} sx={{ width: { xs: 30, sm: 34 }, height: { xs: 30, sm: 34 }, bgcolor: GC.blue, fontSize: '0.85rem' }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Mobile search drawer (slides from top) ── */}
      <Drawer anchor="top" open={searchDrawerOpen} onClose={() => setSearchDrawerOpen(false)}
        PaperProps={{ sx: { bgcolor: darkMode ? GC.darkBg : '#fff', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 } }}>
        <Box sx={{ p: 2, pb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <IconButton onClick={() => setSearchDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
            <Paper component="form" onSubmit={handleSearchSubmit} sx={{
              flex: 1, display: 'flex', alignItems: 'center', borderRadius: 2,
              bgcolor: darkMode ? GC.darkSurface : '#f8f9fa',
              border: `1px solid ${darkMode ? GC.darkBorder : GC.grayBorder}`,
            }}>
              <InputBase autoFocus placeholder="Search users…" value={searchQuery} onChange={handleSearchChange}
                sx={{ flex: 1, px: 2, py: 1.25, fontSize: '1rem', color: darkMode ? GC.darkText : '#202124' }} />
              {searchQuery && (
                <IconButton size="small" onClick={handleClearSearch} sx={{ mr: 0.5 }}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
              <IconButton type="submit" sx={{ p: 1, color: GC.blue }}>
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>

          <Box sx={{ maxHeight: '55vh', overflow: 'auto' }}>
            {searchLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={28} sx={{ color: GC.blue }} />
              </Box>
            )}
            {!searchLoading && searchResults.map(u => (
              <MenuItem key={u.communityUserId} onClick={() => handleUserClick(u.communityUserId)}
                sx={{ py: 1.5, borderRadius: 2, mb: 0.5, '&:hover': { bgcolor: alpha(GC.blue, 0.06) } }}>
                <ListItemAvatar>
                  <Avatar src={u.avatar} sx={{ bgcolor: GC.blue }}>
                    {u.name?.charAt(0) || 'U'}
                  </Avatar>
                </ListItemAvatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>{u.name || u.username}</Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? GC.darkTextSec : GC.grayText }}>
                    @{u.username} · {u.followerCount || 0} followers
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            {!searchLoading && searchQuery.length >= 2 && searchResults.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: darkMode ? GC.darkTextSec : GC.grayText }}>
                  No users found for "{searchQuery}"
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* ── Profile menu ── */}
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { mt: 1, minWidth: 200, borderRadius: 2, border: `1px solid ${darkMode ? GC.darkBorder : GC.grayBorder}` } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem onClick={() => { router.push(profilePath); setAnchorEl(null); }}>
          <PersonIcon sx={{ mr: 2, fontSize: 20 }} /> My Profile
        </MenuItem>
        <MenuItem onClick={() => { router.push('/settings'); setAnchorEl(null); }}>
          <SettingsIcon sx={{ mr: 2, fontSize: 20 }} /> Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: GC.red }}>
          <LogoutIcon sx={{ mr: 2, fontSize: 20 }} /> Logout
        </MenuItem>
      </Menu>

      {/* ── Notifications menu ── */}
      <Menu anchorEl={notifAnchorEl} open={!!notifAnchorEl} onClose={() => setNotifAnchorEl(null)}
        PaperProps={{ sx: { mt: 1, width: 360, maxWidth: '92vw', borderRadius: 2, border: `1px solid ${darkMode ? GC.darkBorder : GC.grayBorder}` } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <Box sx={{ p: 2, borderBottom: `1px solid ${darkMode ? GC.darkBorder : GC.grayBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600}>Notifications</Typography>
          {notifCount > 0 && <Chip label={notifCount} size="small" sx={{ bgcolor: GC.red, color: '#fff', height: 20, fontSize: '0.7rem' }} />}
        </Box>
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: 40, color: darkMode ? GC.darkTextSec : GC.grayText, mb: 1 }} />
              <Typography variant="body2" sx={{ color: darkMode ? GC.darkTextSec : GC.grayText }}>No notifications yet</Typography>
            </Box>
          ) : notifications.map(n => (
            <MenuItem key={n._id} onClick={() => handleNotifClick(n)}
              sx={{
                py: 1.5, px: 2,
                borderBottom: `1px solid ${darkMode ? GC.darkBorder : GC.grayBorder}`,
                bgcolor: n.isRead ? 'transparent' : alpha(GC.blue, 0.05),
                '&:last-child': { borderBottom: 0 },
                alignItems: 'flex-start',
              }}>
              <Box sx={{ mr: 1.5, mt: 0.25, flexShrink: 0 }}>{notifIcon(n.type)}</Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>{n.title}</Typography>
                <Typography variant="body2" sx={{ color: darkMode ? GC.darkTextSec : GC.grayText, fontSize: '0.75rem', mt: 0.25 }}>
                  {n.message}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? GC.darkTextSec : GC.grayText }}>
                  {timeAgo(n.createdAt)}
                </Typography>
              </Box>
              {!n.isRead && <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: GC.blue, mt: 0.75, ml: 1, flexShrink: 0 }} />}
            </MenuItem>
          ))}
        </Box>
      </Menu>

      {/* ── Mobile sidebar ── */}
      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { borderRadius: '0 16px 16px 0' } }}>
        {drawer}
      </Drawer>
    </>
  );
}