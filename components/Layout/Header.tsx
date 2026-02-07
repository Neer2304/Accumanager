// components/layout/Header.tsx - GOOGLE THEMED
"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  List,
  ListItem,
  Typography as MuiTypography,
  Button,
  CircularProgress,
  alpha,
  Badge as MuiBadge,
  Chip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Dashboard,
  HelpCenter,
  MarkEmailRead as MarkReadIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import GoogleAMLogo from "../GoogleAMLogo";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
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

export const Header: React.FC<HeaderProps> = ({
  title = "Dashboard",
  onMenuClick,
}) => {
  const { mode, toggleTheme } = useTheme();
  const { user: authUser, logout } = useAuth();
  const { user: contextUser, isLoading } = useUser();
  const router = useRouter();
  const darkMode = mode === "dark";

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const user = contextUser || authUser;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
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
            (n: Notification) => !n.isRead,
          ).length;
          setUnreadCount(unread);
        } else {
          console.error("Failed to fetch notifications:", result.message);
        }
      } else if (res.status === 401) {
        console.log("Unauthorized - user might be logged out");
      } else {
        console.error("Failed to fetch notifications:", res.status);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
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
          setNotifications((prev) =>
            prev.map((n) =>
              n._id === notificationId ? { ...n, isRead: true } : n,
            ),
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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      logout();
      handleProfileMenuClose();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      info: "#4285f4", // Google Blue
      success: "#34a853", // Google Green
      warning: "#fbbc04", // Google Yellow
      error: "#ea4335", // Google Red
    };
    return colors[type as keyof typeof colors] || "#4285f4";
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

  const getAvatarLetter = () => {
    if (!user) return "U";
    if (user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    if (!user) return "User";
    return user.name || user.email?.split("@")[0] || "User";
  };

  const renderNotificationsContent = () => {
    return [
      <Box key="header" sx={{ p: 2, pb: 1 }}>
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
              disabled={loading}
              sx={{
                color: "#4285f4",
                "&:hover": {
                  backgroundColor: alpha("#4285f4", 0.08),
                },
              }}
            >
              Mark all read
            </Button>
          )}
        </Box>
        {unreadCount > 0 && (
          <MuiTypography
            variant="body2"
            sx={{ mt: 0.5, color: darkMode ? "#9aa0a6" : "#5f6368" }}
          >
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </MuiTypography>
        )}
      </Box>,

      <Divider key="divider1" />,

      <Box key="list" sx={{ maxHeight: 300, overflow: "auto" }}>
        {loading ? (
          <MenuItem key="loading" disabled>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                py: 2,
              }}
            >
              <CircularProgress size={24} sx={{ color: "#4285f4" }} />
            </Box>
          </MenuItem>
        ) : notifications.length === 0 ? (
          <MenuItem key="empty" disabled>
            <Box sx={{ textAlign: "center", width: "100%", py: 3 }}>
              <NotificationsIcon
                sx={{
                  fontSize: 40,
                  mb: 1,
                  color: darkMode ? "#5f6368" : "#9aa0a6",
                }}
              />
              <MuiTypography
                variant="body2"
                sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
              >
                No notifications
              </MuiTypography>
            </Box>
          </MenuItem>
        ) : (
          <List key="notifications-list" sx={{ p: 0 }}>
            {notifications.slice(0, 10).map((notification) => (
              <ListItem
                key={notification._id}
                sx={{
                  borderLeft: `4px solid ${getNotificationColor(notification.type)}`,
                  cursor: "pointer",
                  backgroundColor: notification.isRead
                    ? "transparent"
                    : darkMode
                      ? alpha("#4285f4", 0.1)
                      : alpha("#4285f4", 0.05),
                  "&:hover": {
                    backgroundColor: darkMode
                      ? alpha("#ffffff", 0.08)
                      : alpha("#000000", 0.04),
                  },
                  py: 1.5,
                  px: 2,
                }}
                onClick={() => handleNotificationClick(notification)}
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
                        sx={{
                          lineHeight: 1.3,
                          color: darkMode ? "#e8eaed" : "#202124",
                        }}
                      >
                        {notification.title}
                      </MuiTypography>
                      <MuiTypography
                        variant="body2"
                        sx={{
                          lineHeight: 1.4,
                          mt: 0.5,
                          color: darkMode ? "#9aa0a6" : "#5f6368",
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
                        sx={{
                          mt: 0.5,
                          display: "block",
                          color: darkMode ? "#5f6368" : "#9aa0a6",
                        }}
                      >
                        {formatTime(notification.createdAt)}
                      </MuiTypography>
                    </Box>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>,

      ...(notifications.length > 0
        ? [
            <Divider key="divider2" />,
            <MenuItem
              key="view-all"
              onClick={() => {
                router.push("/notifications");
                handleNotificationMenuClose();
              }}
              sx={{
                justifyContent: "center",
                color: "#4285f4",
                "&:hover": {
                  backgroundColor: alpha("#4285f4", 0.08),
                },
              }}
            >
              <MuiTypography variant="body2" fontWeight={500}>
                View all notifications
              </MuiTypography>
            </MenuItem>,
          ]
        : []),
    ];
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: darkMode ? "#202124" : "#ffffff",
        color: darkMode ? "#e8eaed" : "#202124",
        borderBottom: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
      }}
    >
      <Toolbar
        sx={{ justifyContent: "space-between", px: { xs: 1, sm: 2, md: 3 } }}
      >
        {/* Left Side - Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GoogleAMLogo size={40} darkMode={darkMode} />
          </Box>
          <Typography
            variant="h6"
            component="h1"
            fontWeight={500}
            sx={{
              letterSpacing: "-0.02em",
              background: darkMode
                ? "linear-gradient(135deg, #e8eaed 0%, #9aa0a6 100%)"
                : "linear-gradient(135deg, #202124 0%, #5f6368 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Right Side - Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Theme Toggle */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              borderRadius: "50%",
              backgroundColor: darkMode
                ? alpha("#ffffff", 0.1)
                : alpha("#000000", 0.04),
              color: darkMode ? "#e8eaed" : "#202124",
              "&:hover": {
                backgroundColor: darkMode
                  ? alpha("#ffffff", 0.15)
                  : alpha("#000000", 0.08),
              },
            }}
          >
            {darkMode ? <LightIcon /> : <DarkIcon />}
          </IconButton>

          {/* Notifications */}
          <IconButton
            onClick={handleNotificationMenuOpen}
            sx={{
              borderRadius: "50%",
              backgroundColor: darkMode
                ? alpha("#ffffff", 0.1)
                : alpha("#000000", 0.04),
              color: darkMode ? "#e8eaed" : "#202124",
              "&:hover": {
                backgroundColor: darkMode
                  ? alpha("#ffffff", 0.15)
                  : alpha("#000000", 0.08),
              },
            }}
          >
            <MuiBadge
              badgeContent={unreadCount}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#ea4335",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                },
              }}
            >
              <NotificationsIcon />
            </MuiBadge>
          </IconButton>

          {/* User Profile */}
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "#4285f4" }} />
          ) : (
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                borderRadius: "50%",
                p: 0.5,
                "&:hover": {
                  backgroundColor: darkMode
                    ? alpha("#ffffff", 0.1)
                    : alpha("#000000", 0.04),
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#4285f4",
                  fontSize: "1rem",
                  fontWeight: 600,
                  border: `2px solid ${darkMode ? "#303134" : "#ffffff"}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {getAvatarLetter()}
              </Avatar>
            </IconButton>
          )}

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                width: 380,
                maxHeight: 400,
                borderRadius: "16px",
                backgroundColor: darkMode ? "#202124" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                boxShadow: darkMode
                  ? "0 4px 24px rgba(0, 0, 0, 0.5)"
                  : "0 4px 24px rgba(0, 0, 0, 0.1)",
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {renderNotificationsContent()}
          </Menu>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: "16px",
                backgroundColor: darkMode ? "#202124" : "#ffffff",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                boxShadow: darkMode
                  ? "0 4px 24px rgba(0, 0, 0, 0.5)"
                  : "0 4px 24px rgba(0, 0, 0, 0.1)",
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {getDisplayName()}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
              >
                {user?.email || "user@example.com"}
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              onClick={() => {
                router.push("/profile");
                handleProfileMenuClose();
              }}
              sx={{
                py: 1.5,
                "&:hover": {
                  backgroundColor: darkMode
                    ? alpha("#4285f4", 0.1)
                    : alpha("#4285f4", 0.08),
                },
              }}
            >
              <AccountIcon
                sx={{
                  mr: 2,
                  fontSize: 20,
                  color: darkMode ? "#e8eaed" : "#202124",
                }}
              />
              <Typography variant="body2">Profile</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push("/settings");
                handleProfileMenuClose();
              }}
              sx={{
                py: 1.5,
                "&:hover": {
                  backgroundColor: darkMode
                    ? alpha("#4285f4", 0.1)
                    : alpha("#4285f4", 0.08),
                },
              }}
            >
              <SettingsIcon
                sx={{
                  mr: 2,
                  fontSize: 20,
                  color: darkMode ? "#e8eaed" : "#202124",
                }}
              />
              <Typography variant="body2">Settings</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push("/dashboard");
                handleProfileMenuClose();
              }}
              sx={{
                py: 1.5,
                "&:hover": {
                  backgroundColor: darkMode
                    ? alpha("#4285f4", 0.1)
                    : alpha("#4285f4", 0.08),
                },
              }}
            >
              <Dashboard
                sx={{
                  mr: 2,
                  fontSize: 20,
                  color: darkMode ? "#e8eaed" : "#202124",
                }}
              />
              <Typography variant="body2">Dashboard</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push("/help-support");
                handleProfileMenuClose();
              }}
              sx={{
                py: 1.5,
                "&:hover": {
                  backgroundColor: darkMode
                    ? alpha("#4285f4", 0.1)
                    : alpha("#4285f4", 0.08),
                },
              }}
            >
              <HelpCenter
                sx={{
                  mr: 2,
                  fontSize: 20,
                  color: darkMode ? "#e8eaed" : "#202124",
                }}
              />
              <Typography variant="body2">Help & Support</Typography>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1.5,
                color: "#ea4335",
                "&:hover": {
                  backgroundColor: alpha("#ea4335", 0.1),
                },
              }}
            >
              <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
              <Typography variant="body2" fontWeight={500}>
                Logout
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
