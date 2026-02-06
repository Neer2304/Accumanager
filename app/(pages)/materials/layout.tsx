// app/(pages)/materials/layout.tsx
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
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Inventory,
  Dashboard,
  AddBox,
  Category,
  LowPriority,
  History,
  Settings,
  Assessment,
  Inventory2,
  LocalShipping,
  Warehouse,
  Timeline,
} from "@mui/icons-material";
import Link from "next/link";

// Sidebar Component
function MaterialsSidebar({
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
    { icon: <Dashboard />, text: "Dashboard", path: "/materials" },
    { icon: <Inventory2 />, text: "All Materials", path: "/materials/list" },
    { icon: <AddBox />, text: "Add Material", path: "/materials/create" },
    
    // Management
    { icon: <Category />, text: "Categories", path: "/materials/categories" },
    { icon: <LocalShipping />, text: "Suppliers", path: "/materials/suppliers" },
    { icon: <Warehouse />, text: "Warehouses", path: "/materials/warehouses" },
    
    // Reports & Analytics
    { icon: <LowPriority />, text: "Low Stock", path: "/materials/low-stock" },
    { icon: <History />, text: "History", path: "/materials/history" },
    { icon: <Assessment />, text: "Reports", path: "/materials/reports" },
    { icon: <Timeline />, text: "Analytics", path: "/materials/analytics" },
    
    // Settings
    { icon: <Settings />, text: "Settings", path: "/materials/settings" },
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
      {/* Sidebar Header - Google Style */}
      <Box
        sx={{
          p: 3,
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d47a1 0%, #311b92 100%)' 
            : 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
          color: 'white',
          mt: 8,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Inventory sx={{ 
              fontSize: 24,
              backgroundColor: 'rgba(255,255,255,0.2)',
              p: 0.5,
              borderRadius: '8px'
            }} />
            <Box>
              <Typography 
                variant="h6" 
                fontWeight={500}
                sx={{ 
                  fontSize: '1.1rem',
                  letterSpacing: '-0.02em'
                }}
              >
                Material Inventory
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 300,
                  fontSize: '0.75rem'
                }}
              >
                Stock & Supply Management
              </Typography>
            </Box>
          </Box>
          {isMobile && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ 
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Sidebar Menu - Google Style */}
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={item.path}
              sx={{
                borderRadius: '8px',
                py: 1.25,
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                },
              }}
            >
              <ListItemIcon
                sx={{ 
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
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
    </Drawer>
  );
}

// Main layout content
function MaterialsLayoutContent({ children }: { children: React.ReactNode }) {
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
      <MaterialsSidebar
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
        {/* REMOVED HEADER - Your page has its own header */}
        
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

      {/* Floating Menu Button for Mobile - Google Style */}
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
            boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
            borderRadius: '50%',
            width: 56,
            height: 56,
            '&:hover': {
              backgroundColor: '#3367d6',
              boxShadow: '0 6px 16px rgba(66, 133, 244, 0.4)',
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
export default function MaterialsLayout({
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
          transition: 'all 0.3s ease',
        }}
      >
        <CircularProgress
          size={isMobile ? 32 : 40}
          thickness={isMobile ? 4 : 3.6}
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
          Loading Material Management...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <MaterialsLayoutContent>{children}</MaterialsLayoutContent>;
}