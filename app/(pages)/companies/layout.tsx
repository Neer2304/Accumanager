// app/(pages)/companies/layout.tsx
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
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Business,
  Dashboard,
  AddBusiness,
  People,
  ContactMail,
  Assessment,
  Settings,
  Timeline,
  AccountBalance,
  LocationOn,
  AttachMoney,
  WorkHistory,
} from "@mui/icons-material";
import Link from "next/link";
import { CompanyProvider } from '@/lib/companyContext';

// Sidebar Component
function CompaniesSidebar({
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
    { icon: <Dashboard />, text: "Dashboard", path: "/companies" },
    { icon: <AddBusiness />, text: "Add Company", path: "/companies/create" },
    { icon: <Business />, text: "All Companies", path: "/companies/list" },
    
    // Management
    { icon: <People />, text: "Employees", path: "/companies/employees" },
    { icon: <ContactMail />, text: "Contacts", path: "/companies/contacts" },
    { icon: <LocationOn />, text: "Branches", path: "/companies/branches" },
    { icon: <AccountBalance />, text: "Departments", path: "/companies/departments" },
    
    // Financial
    { icon: <AttachMoney />, text: "Financials", path: "/companies/financials" },
    { icon: <WorkHistory />, text: "Projects", path: "/companies/projects" },
    
    // Reports & Analytics
    { icon: <Assessment />, text: "Reports", path: "/companies/reports" },
    { icon: <Timeline />, text: "Analytics", path: "/companies/analytics" },
    
    // Settings
    { icon: <Settings />, text: "Settings", path: "/companies/settings" },
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
          zIndex: 1200,
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
            <Business sx={{ 
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
                Companies
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 300,
                  fontSize: '0.75rem'
                }}
              >
                Business & Organization Management
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
              onClick={() => {
                if (isMobile) {
                  onClose();
                }
              }}
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
function CompaniesLayoutContent({ children }: { children: React.ReactNode }) {
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
    <CompanyProvider>
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
        <CompaniesSidebar
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
    </CompanyProvider>
  );
}

// Main Layout Component
export default function CompaniesLayout({
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
          Loading Companies Management...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <CompaniesLayoutContent>{children}</CompaniesLayoutContent>;
}