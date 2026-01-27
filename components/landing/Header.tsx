"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useScrollTrigger,
  Slide,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
  alpha,
  Badge,
  Typography as MuiTypography,
  CircularProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard,
  AccountCircle,
  ExitToApp,
  Settings,
  Person,
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkReadIcon,
  Circle as CircleIcon,
  HelpCenter,
} from "@mui/icons-material";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactElement;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

function HideOnScroll(props: Props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export const LandingHeader: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    router.push("/");
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;

    try {
      setNotificationsLoading(true);
      const res = await fetch("/api/notifications", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setNotifications(result.data || []);
          const unread = (result.data || []).filter(
            (n: Notification) => !n.isRead
          ).length;
          setUnreadCount(unread);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          // Update local state
          setNotifications((prev) =>
            prev.map((n) =>
              n._id === notificationId ? { ...n, isRead: true } : n
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markAll: true }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
          setUnreadCount(0);
        }
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }

    handleNotificationMenuClose();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const getNotificationColor = (type: string) => {
    const colors = {
      info: theme.palette.info.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
    };
    return colors[type as keyof typeof colors] || theme.palette.info.main;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const menuItems = [
    { name: "Features", href: "#features" },
    { name: "Solutions", href: "#solutions" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const userMenuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Dashboard fontSize="small" />,
    },
    { name: "Profile", href: "/profile", icon: <Person fontSize="small" /> },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings fontSize="small" />,
    },
    {
      name: "Help & Support",
      href: "/help-support",
      icon: <HelpCenter fontSize="small" />,
    },
  ];

  const drawer = (
    <Box
      sx={{
        width: { xs: 280, sm: 320 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          component={Link}
          href="/"
          onClick={handleDrawerToggle}
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textDecoration: "none",
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          AccumaManage
        </Typography>
        <IconButton onClick={handleDrawerToggle} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {isAuthenticated ? (
          <>
            {/* User Info in Drawer */}
            <Box
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <Avatar
                  sx={{
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    bgcolor: theme.palette.primary.main,
                  }}
                >
                  {user?.name?.charAt(0) || <AccountCircle />}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {user?.name || "User"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {user?.email || "Welcome back!"}
                  </Typography>
                </Box>
              </Box>
              {unreadCount > 0 && (
                <Chip
                  label={`${unreadCount} unread notification${
                    unreadCount !== 1 ? "s" : ""
                  }`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={handleNotificationMenuOpen}
                  clickable
                />
              )}
            </Box>

            <List dense>
              {userMenuItems.map((item) => (
                <ListItem
                  key={item.name}
                  component={Link}
                  href={item.href}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <Box sx={{ mr: 2, color: theme.palette.primary.main }}>
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: { xs: "0.9rem", sm: "0.95rem" },
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Button
              variant="outlined"
              fullWidth
              startIcon={<ExitToApp />}
              onClick={handleLogout}
              sx={{
                mt: 2,
                py: { xs: 0.75, sm: 1 },
              }}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <List dense>
              {menuItems.map((item) => (
                <ListItem
                  key={item.name}
                  component="a"
                  href={item.href}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Box
              sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 1.5 }}
            >
              <Button
                variant="contained"
                fullWidth
                component={Link}
                href="/dashboard"
                onClick={handleDrawerToggle}
                sx={{
                  py: { xs: 0.75, sm: 1 },
                  fontSize: { xs: "0.875rem", sm: "0.95rem" },
                }}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                href="/login"
                onClick={handleDrawerToggle}
                sx={{
                  py: { xs: 0.75, sm: 1 },
                  fontSize: { xs: "0.875rem", sm: "0.95rem" },
                }}
              >
                Sign In
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <HideOnScroll>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            color: "text.primary",
            boxShadow: "0 1px 10px rgba(0,0,0,0.08)",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Container maxWidth="xl">
            <Toolbar
              sx={{
                justifyContent: "space-between",
                py: { xs: 1, sm: 1.5 },
                px: { xs: 1, sm: 0 },
                gap: 1,
              }}
            >
              {/* Logo */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 2 },
                  flex: 1,
                }}
              >
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  component={Link}
                  href="/"
                  sx={{
                    fontWeight: "bold",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    textDecoration: "none",
                    fontSize: {
                      xs: "1.1rem",
                      sm: "1.25rem",
                      md: "1.5rem",
                    },
                  }}
                >
                  AccumaManage
                </Typography>
              </Box>

              {/* Right Side Actions */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 2 },
                }}
              >
                {/* Notifications Icon (only when authenticated) */}
                {isAuthenticated && (
                  <IconButton
                    onClick={handleNotificationMenuOpen}
                    sx={{
                      borderRadius: "8px",
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "action.hover",
                        color: "primary.main",
                      },
                    }}
                  >
                    <Badge badgeContent={unreadCount} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                )}

                {/* User Icon for Mobile/Tab when authenticated */}
                {isAuthenticated && isMobile && (
                  <>
                    {/* User Avatar for Mobile */}
                    <IconButton
                      onClick={handleMenuOpen}
                      size="small"
                      sx={{
                        p: 0.5,
                        border: `2px solid ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                        },
                        display: { xs: "flex", md: "none" },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: theme.palette.primary.main,
                        }}
                      >
                        {user?.name?.charAt(0) || <AccountCircle />}
                      </Avatar>
                    </IconButton>

                    {/* Mobile Menu for User Actions */}
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiPaper-root": {
                          mt: 1.5,
                          minWidth: 200,
                          borderRadius: 2,
                        },
                      }}
                    >
                      <Box sx={{ p: 2, pb: 1 }}>
                        <MuiTypography variant="subtitle1" fontWeight={600}>
                          {user?.name || "User"}
                        </MuiTypography>
                        <MuiTypography variant="caption" color="text.secondary">
                          {user?.email || ""}
                        </MuiTypography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      {userMenuItems.map((item) => (
                        <MenuItem
                          key={item.name}
                          component={Link}
                          href={item.href}
                          onClick={() => {
                            handleMenuClose();
                            handleDrawerToggle();
                          }}
                        >
                          <Box
                            sx={{ mr: 2, color: theme.palette.primary.main }}
                          >
                            {item.icon}
                          </Box>
                          {item.name}
                        </MenuItem>
                      ))}
                      <Divider sx={{ my: 1 }} />
                      <MenuItem onClick={handleLogout}>
                        <Box sx={{ mr: 2, color: theme.palette.error.main }}>
                          <ExitToApp fontSize="small" />
                        </Box>
                        Sign Out
                      </MenuItem>
                    </Menu>
                  </>
                )}

                {/* Desktop Menu */}
                {!isMobile && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { md: 3, lg: 2 },
                    }}
                  >
                    {!isAuthenticated ? (
                      <>
                        {menuItems.map((item) => (
                          <Button
                            key={item.name}
                            component="a"
                            href={item.href}
                            sx={{
                              color: "text.primary",
                              fontWeight: 500,
                              fontSize: { md: "0.9rem", lg: "1rem" },
                              "&:hover": {
                                color: "primary.main",
                                backgroundColor: "transparent",
                              },
                            }}
                          >
                            {item.name}
                          </Button>
                        ))}
                        <Button
                          variant="outlined"
                          component={Link}
                          href="/login"
                          sx={{
                            ml: 1,
                            fontSize: { md: "0.875rem", lg: "0.95rem" },
                          }}
                        >
                          Sign In
                        </Button>
                        <Button
                          variant="contained"
                          component={Link}
                          href="/dashboard"
                          sx={{
                            ml: 1,
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            fontSize: { md: "0.875rem", lg: "0.95rem" },
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                            },
                          }}
                        >
                          Start Free Trial
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="text"
                          component={Link}
                          href="/dashboard"
                          sx={{
                            color: "primary.main",
                            fontWeight: 500,
                            fontSize: { md: "0.9rem", lg: "1rem" },
                          }}
                        >
                          Dashboard
                        </Button>
                        <Button
                          variant="text"
                          component={Link}
                          href="/pricing"
                          sx={{
                            color: "primary.main",
                            fontWeight: 500,
                            fontSize: { md: "0.9rem", lg: "1rem" },
                          }}
                        >
                          Pricing
                        </Button>

                        {/* User Menu for Desktop */}
                        <Box sx={{ ml: 1 }}>
                          <IconButton
                            onClick={handleMenuOpen}
                            sx={{
                              p: 0.5,
                              border: `2px solid ${alpha(
                                theme.palette.primary.main,
                                0.2
                              )}`,
                              "&:hover": {
                                borderColor: theme.palette.primary.main,
                              },
                            }}
                          >
                            <Avatar
                              sx={{
                                width: { md: 36, lg: 40 },
                                height: { md: 36, lg: 40 },
                                bgcolor: theme.palette.primary.main,
                              }}
                            >
                              {user?.name?.charAt(0) || <AccountCircle />}
                            </Avatar>
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                              elevation: 3,
                              sx: {
                                mt: 1.5,
                                minWidth: 200,
                                borderRadius: 2,
                                "& .MuiMenuItem-root": {
                                  px: 2,
                                  py: 1.5,
                                  fontSize: "0.9rem",
                                },
                              },
                            }}
                          >
                            <Box sx={{ p: 2, pb: 1 }}>
                              <MuiTypography
                                variant="subtitle1"
                                fontWeight={600}
                              >
                                {user?.name || "User"}
                              </MuiTypography>
                              <MuiTypography
                                variant="caption"
                                color="text.secondary"
                              >
                                {user?.email || ""}
                              </MuiTypography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            {userMenuItems.map((item) => (
                              <MenuItem
                                key={item.name}
                                component={Link}
                                href={item.href}
                                onClick={handleMenuClose}
                              >
                                <Box
                                  sx={{
                                    mr: 2,
                                    color: theme.palette.primary.main,
                                  }}
                                >
                                  {item.icon}
                                </Box>
                                {item.name}
                              </MenuItem>
                            ))}
                            <Divider sx={{ my: 1 }} />
                            <MenuItem onClick={handleLogout}>
                              <Box
                                sx={{ mr: 2, color: theme.palette.error.main }}
                              >
                                <ExitToApp fontSize="small" />
                              </Box>
                              Sign Out
                            </MenuItem>
                          </Menu>
                        </Box>
                      </>
                    )}
                  </Box>
                )}

                {/* Mobile Menu Button */}
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{
                    display: { md: "none" },
                    ml: isAuthenticated ? 0 : 1,
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: { xs: 300, sm: 380 },
            maxHeight: 400,
            borderRadius: "12px",
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Notifications Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <MuiTypography variant="h6" fontWeight="600">
              Notifications
            </MuiTypography>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<MarkReadIcon />}
                onClick={handleMarkAllAsRead}
                disabled={notificationsLoading}
              >
                Mark all read
              </Button>
            )}
          </Box>
          {unreadCount > 0 && (
            <MuiTypography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </MuiTypography>
          )}
        </Box>

        <Divider />

        {/* Notifications List */}
        <Box sx={{ maxHeight: 300, overflow: "auto" }}>
          {notificationsLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 3,
                width: "100%",
              }}
            >
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box
              sx={{
                py: 3,
                textAlign: "center",
                width: "100%",
              }}
            >
              <MuiTypography variant="body2" color="text.secondary">
                No notifications
              </MuiTypography>
            </Box>
          ) : (
            <Box sx={{ p: 0 }}>
              {notifications.slice(0, 10).map((notification) => (
                <MenuItem
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    borderLeft: `4px solid ${getNotificationColor(
                      notification.type
                    )}`,
                    cursor: "pointer",
                    backgroundColor: notification.isRead
                      ? "transparent"
                      : alpha(theme.palette.primary.main, 0.05),
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                    py: 1.5,
                    px: 2,
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      {!notification.isRead && (
                        <CircleIcon
                          sx={{
                            fontSize: 8,
                            color: getNotificationColor(notification.type),
                            mt: 0.75,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <MuiTypography
                          variant="subtitle2"
                          fontWeight={notification.isRead ? "normal" : "600"}
                          sx={{ lineHeight: 1.3 }}
                        >
                          {notification.title}
                        </MuiTypography>
                        <MuiTypography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.4,
                            mt: 0.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {notification.message}
                        </MuiTypography>
                        <MuiTypography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {formatTime(notification.createdAt)}
                        </MuiTypography>
                      </Box>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Box>
          )}
        </Box>

        {/* View All Notifications - FIXED: Removed Fragment */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <MenuItem
              onClick={() => {
                router.push("/notifications");
                handleNotificationMenuClose();
              }}
              sx={{ justifyContent: "center" }}
            >
              <MuiTypography variant="body2" color="primary">
                View all notifications
              </MuiTypography>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { xs: "85%", sm: 320 },
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};