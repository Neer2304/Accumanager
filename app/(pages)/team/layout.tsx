"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
  useTheme,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Groups,
  Dashboard,
  PersonAdd,
  People,
  Timeline,
  Assessment,
  Settings,
  Star,
  TrendingUp,
  CalendarToday,
  Assignment,
  EmojiEvents,
  Speed,
} from "@mui/icons-material";
import Link from "next/link";

// Sidebar Component
function TeamSidebar({
  open,
  onClose,
  isMobile,
  darkMode,
}: {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
  darkMode: boolean;
}) {
  const menuItems = [
    // Main Pages
    { icon: <Dashboard />, text: "Team Dashboard", path: "/team/dashboard" },
    { icon: <People />, text: "All Members", path: "/team/members" },
    { icon: <PersonAdd />, text: "Add Member", path: "/team/members/add" },
    { icon: <Timeline />, text: "Activities", path: "/team/activities" },
    
    // Team Management
    { icon: <Groups />, text: "Team Groups", path: "/team/groups" },
    { icon: <Assignment />, text: "Roles & Permissions", path: "/team/roles" },
    { icon: <CalendarToday />, text: "Team Calendar", path: "/team/calendar" },
    
    // Performance & Analytics
    { icon: <TrendingUp />, text: "Performance", path: "/team/performance" },
    { icon: <Assessment />, text: "Reports", path: "/team/reports" },
    { icon: <EmojiEvents />, text: "Achievements", path: "/team/achievements" },
    { icon: <Speed />, text: "Analytics", path: "/team/analytics" },
    
    // Settings
    { icon: <Settings />, text: "Team Settings", path: "/team/settings" },
  ];

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          background: darkMode ? '#202124' : '#ffffff',
          borderRight: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          color: darkMode ? '#e8eaed' : '#202124',
          top: 0,
          height: "100vh",
          position: "fixed",
        },
      }}
    >
      {/* Sidebar Header - Clean Design */}
      <Box
        sx={{
          p: 3,
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? '#202124' 
            : '#ffffff',
          mt: 8,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Groups sx={{ 
              fontSize: 24,
              color: '#4285f4',
            }} />
            <Box>
              <Typography 
                variant="h6" 
                fontWeight={500}
                sx={{ 
                  fontSize: '1.1rem',
                  letterSpacing: '-0.02em',
                  color: darkMode ? '#e8eaed' : '#202124',
                }}
              >
                Team Management
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 300,
                  fontSize: '0.75rem'
                }}
              >
                Manage your team members
              </Typography>
            </Box>
          </Box>
          {isMobile && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ 
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Sidebar Menu - Clean Design */}
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={item.path}
              onClick={isMobile ? onClose : undefined}
              sx={{
                borderRadius: '8px',
                py: 1.25,
                '&:hover': {
                  backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                },
              }}
            >
              <ListItemIcon
                sx={{ 
                  color: '#4285f4',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: darkMode ? '#e8eaed' : '#202124',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ 
        my: 2,
        borderColor: darkMode ? '#3c4043' : '#dadce0'
      }} />

      {/* Quick Actions - Only Essential */}
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontWeight: 500,
            mb: 1,
            display: 'block'
          }}
        >
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            icon={<PersonAdd />}
            label="Add Member"
            size="small"
            sx={{
              backgroundColor: darkMode ? '#303134' : '#f8f9fa',
              color: darkMode ? '#e8eaed' : '#202124',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              '&:hover': {
                backgroundColor: darkMode ? '#3c4043' : '#e8f0fe',
              },
            }}
            clickable
            onClick={() => window.location.href = '/team/members/add'}
          />
        </Box>
      </Box>
    </Drawer>
  );
}

// Main layout content
function TeamLayoutContent({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Sidebar */}
      <TeamSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
        darkMode={darkMode}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          transition: (theme) =>
            theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ...(!isMobile &&
            sidebarOpen && {
              width: `calc(100% - 280px)`,
              marginLeft: "280px",
            }),
          pt: 0,
        }}
      >
        {/* Page Content */}
        <Box
          sx={{
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Floating Menu Button for Mobile */}
      {isMobile && !sidebarOpen && (
        <IconButton
          onClick={() => setSidebarOpen(true)}
          sx={{
            position: "fixed",
            bottom: 20,
            left: 20,
            zIndex: 1000,
            backgroundColor: '#4285f4',
            color: 'white',
            borderRadius: '50%',
            width: 56,
            height: 56,
            '&:hover': {
              backgroundColor: '#3367d6',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </Box>
  );
}

// Main Layout Component
export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: 2,
          px: isMobile ? 2 : 4,
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          color: darkMode ? '#e8eaed' : '#202124',
        }}
      >
        <CircularProgress
          size={isMobile ? 32 : 40}
          sx={{ color: '#4285f4' }}
        />
        <Typography
          variant={isMobile ? "body2" : "body1"}
          sx={{
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontWeight: 300,
            fontSize: isMobile ? '0.85rem' : '1rem'
          }}
          align="center"
        >
          Loading Team Management...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <TeamLayoutContent>{children}</TeamLayoutContent>;
}