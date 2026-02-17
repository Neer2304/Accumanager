// app/(pages)/advance/layout.tsx - Updated with simplified header
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
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Palette as PaletteIcon,
  Dashboard,
  ColorLens,
  AutoAwesome,
  TrendingUp,
  Business,
  Settings,
  People,
  Timeline,
  Brightness4,
  Brightness7,
  Person,
} from "@mui/icons-material";
import {
  AdvanceThemeProvider,
  useAdvanceThemeContext,
} from "@/contexts/AdvanceThemeContexts";
import AIConsentDialog from "@/components/global/AIConsentDialog";

// Google colors matching your page
const googleColors = {
  blue: "#4285F4",
  green: "#34A853",
  yellow: "#FBBC04",
  red: "#EA4335",

  light: {
    background: "#FFFFFF",
    surface: "#F8F9FA",
    textPrimary: "#202124",
    textSecondary: "#5F6368",
    border: "#DADCE0",
    card: "#FFFFFF",
    chipBackground: "#F1F3F4",
    header: "#FFFFFF",
    sidebar: "#FFFFFF",
    hover: "#F8F9FA",
    active: "#E8F0FE",
  },

  dark: {
    background: "#202124",
    surface: "#303134",
    textPrimary: "#E8EAED",
    textSecondary: "#9AA0A6",
    border: "#3C4043",
    card: "#303134",
    chipBackground: "#3C4043",
    header: "#303134",
    sidebar: "#202124",
    hover: "#3C4043",
    active: "#5F6368",
  },
};

// Sidebar Component (keep as is)
function AdvanceSidebar({
  open,
  onClose,
  isMobile,
}: {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}) {
  const { mode, toggleTheme } = useAdvanceThemeContext();
  const currentColors =
    mode === "dark" ? googleColors.dark : googleColors.light;

  const menuItems = [
    { icon: <Dashboard />, text: "Dashboard", path: "/advance", badge: null },
    {
      icon: <ColorLens />,
      text: "Theme Customizer",
      path: "/advance/theme-customizer",
      badge: "Beta",
    },
    {
      icon: <AutoAwesome />,
      text: "AI Analytics",
      path: "/advance/ai-analytics",
      badge: "Soon",
    },
    {
      icon: <TrendingUp />,
      text: "Marketing-Automation",
      path: "/advance/marketing",
      badge: "Soon",
    },
    {
      icon: <Business />,
      text: "Field Service",
      path: "/advance/field-service",
      badge: "Soon",
    },
    {
      icon: <People />,
      text: "Customer 360",
      path: "/advance/customer-360",
      badge: "Beta",
    },
    {
      icon: <Timeline />,
      text: "Subscription-Analytics",
      path: "/advance/subscription-analytics",
      badge: "Soon",
    },
    {
      icon: <Timeline />,
      text: "Subscription-Billing",
      path: "/advance/subscription-billing",
      badge: "Soon",
    },
    { icon: <Settings />, text: "Settings", path: "/advance/settings" },
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
          background: currentColors.sidebar,
          borderRight: `1px solid ${currentColors.border}`,
          color: currentColors.textPrimary,
          boxShadow:
            mode === "dark"
              ? "0 2px 4px rgba(0,0,0,0.4)"
              : "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
          transition: "background-color 0.3s ease, border-color 0.3s ease",
        },
      }}
    >
      {/* Sidebar Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${currentColors.border}`,
          background: `linear-gradient(135deg, ${alpha(googleColors.blue, 0.05)} 0%, ${alpha(googleColors.green, 0.05)} 100%)`,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${googleColors.blue} 0%, ${googleColors.green} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(66,133,244,0.4)",
              }}
            >
              <PaletteIcon sx={{ fontSize: 20, color: "white" }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
                color={currentColors.textPrimary}
              >
                Advanced
              </Typography>
              <Typography variant="caption" color={currentColors.textSecondary}>
                Enterprise Features
              </Typography>
            </Box>
          </Box>
          {isMobile && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: currentColors.textSecondary,
                background: currentColors.chipBackground,
                "&:hover": {
                  background: currentColors.hover,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Sidebar Menu */}
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => {
          const isActive = false;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  background: isActive
                    ? `linear-gradient(135deg, ${alpha(googleColors.blue, 0.1)} 0%, ${alpha(googleColors.green, 0.1)} 100%)`
                    : "transparent",
                  border: isActive
                    ? `1px solid ${alpha(googleColors.blue, 0.3)}`
                    : "1px solid transparent",
                  "&:hover": {
                    backgroundColor: currentColors.hover,
                  },
                  transition: "all 0.2s ease",
                }}
                href={item.path}
              >
                <ListItemIcon
                  sx={{
                    color: isActive
                      ? googleColors.blue
                      : currentColors.textPrimary,
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                      ? googleColors.blue
                      : currentColors.textPrimary,
                  }}
                />
                {item.badge && (
                  <Box
                    sx={{
                      ml: 1,
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      background:
                        item.badge === "Beta"
                          ? googleColors.green
                          : item.badge === "Soon"
                            ? googleColors.red
                            : googleColors.yellow,
                      color: "white",
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: currentColors.border, my: 2 }} />

      {/* Theme Info and Toggle */}
      <Box sx={{ p: 2 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Typography variant="caption" color={currentColors.textSecondary}>
            Theme
          </Typography>
          <IconButton
            onClick={toggleTheme}
            size="small"
            sx={{
              color: currentColors.textSecondary,
              background: currentColors.chipBackground,
              "&:hover": {
                background: currentColors.hover,
              },
            }}
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
        <Typography
          variant="caption"
          color={currentColors.textSecondary}
          sx={{ display: "block" }}
        >
          Mode: {mode === "dark" ? "Dark" : "Light"}
        </Typography>
      </Box>
    </Drawer>
  );
}

// Main layout content with theme
function AdvanceLayoutContent({ children }: { children: React.ReactNode }) {
  const { mode, toggleTheme } = useAdvanceThemeContext();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const currentColors =
    mode === "dark" ? googleColors.dark : googleColors.light;

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: currentColors.background,
        color: currentColors.textPrimary,
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Header - Simplified */}
      <Box
        sx={{
          height: 64,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          borderBottom: `1px solid ${currentColors.border}`,
          background: currentColors.header,
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          px: 3,
          boxShadow:
            mode === "dark"
              ? "0 2px 4px rgba(0,0,0,0.4)"
              : "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
        }}
      >
        {/* Left Section */}
        <Box display="flex" alignItems="center" gap={2}>
          {(!sidebarOpen || isMobile) && (
            <IconButton
              onClick={() => setSidebarOpen(true)}
              sx={{
                color: currentColors.textPrimary,
                background: currentColors.chipBackground,
                "&:hover": {
                  background: currentColors.hover,
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              background: `linear-gradient(135deg, ${googleColors.blue} 0%, ${googleColors.green} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Advanced CRM
          </Typography>
        </Box>

        {/* Center Spacer */}
        <Box flex={1} />

        {/* Right Section - Simplified */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* Theme Toggle */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: currentColors.textSecondary,
              background: currentColors.chipBackground,
              "&:hover": {
                background: currentColors.hover,
              },
            }}
            title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Theme Customizer */}
          <IconButton
            sx={{
              background: `conic-gradient(from 135deg at 50% 50%, ${googleColors.blue}, ${googleColors.red},${googleColors.yellow}, ${googleColors.green}, ${googleColors.blue})`,
              color: "white",
              "&:hover": {
                background: `linear-gradient(135deg, ${googleColors.blue} 0%, ${googleColors.red} 33%, ${googleColors.yellow} 66%, ${googleColors.green} 100% )`,
              },
            }}
            href="/advance/theme-customizer"
            title="Theme Customizer"
          >
            <PaletteIcon />
          </IconButton>

          {/* Simple User Avatar */}
          <IconButton
            onClick={handleClick}
            sx={{
              ml: 1,
              p: 0.5,
              "&:hover": {
                background: currentColors.hover,
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: currentColors.chipBackground,
                color: currentColors.textPrimary,
                border: `1px solid ${currentColors.border}`,
                fontSize: "1rem",
              }}
            >
              <Person />
            </Avatar>
          </IconButton>

          {/* Profile Menu - Keep this simple too */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                background: currentColors.card,
                border: `1px solid ${currentColors.border}`,
                borderRadius: 2,
                minWidth: 180,
                mt: 1.5,
                boxShadow:
                  mode === "dark"
                    ? "0 2px 8px rgba(0,0,0,0.4)"
                    : "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider sx={{ my: 1, borderColor: currentColors.border }} />
            <MenuItem
              onClick={handleClose}
              sx={{
                py: 1.5,
                color: googleColors.red,
                "&:hover": {
                  background: alpha(googleColors.red, 0.1),
                },
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Sidebar */}
      <AdvanceSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          transition: (theme) =>
            theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ...(!isMobile &&
            sidebarOpen && {
              marginLeft: "280px",
              width: `calc(100% - 280px)`,
            }),
          pt: "64px", // Offset for fixed header
        }}
      >
        {/* Page Content */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Dialogs */}
          <AIConsentDialog />

          {/* Children Content */}
          {children}
        </Box>
      </Box>
    </Box>
  );
}

// Main Layout Component
export default function AdvanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
        px={isMobile ? 2 : 4}
        bgcolor={googleColors.light.background}
        color={googleColors.light.textPrimary}
        sx={{
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <CircularProgress
          size={isMobile ? 32 : 40}
          thickness={isMobile ? 4 : 3.6}
        />
        <Typography
          variant={isMobile ? "body2" : "body1"}
          color="text.secondary"
          align="center"
        >
          Loading Advanced Features...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdvanceThemeProvider>
      <AdvanceLayoutContent>{children}</AdvanceLayoutContent>
    </AdvanceThemeProvider>
  );
}
