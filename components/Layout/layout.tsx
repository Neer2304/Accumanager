// components/Layout/layout.tsx - FIXED BACKGROUND
"use client";

import React from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingBag as ProductsIcon,
  People as CustomersIcon,
  Receipt as BillingIcon,
  Schedule as AttendanceIcon,
  Logout as LogoutIcon,
  Badge as EmployeesIcon,
  Assignment as ProjectsIcon,
  Event as EventsIcon,
  Analytics as AnalyticsIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  Construction as MaterialsIcon,
  TouchApp as ActionsIcon,
  SupportAgent as SupportIcon,
  ContactSupport as ContactIcon,
  Cookie as CookieIcon,
  Warehouse as InventoryIcon,
  PriceCheck as ExpenseIcon,
  LiveHelp as HelpIcon,
  StickyNote2 as NoteIcon,
  LocalOffer as PricingIcon,
  Email as MessageIcon,
  Policy as PrivacyIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  TaskAlt as TaskIcon,
  Gavel as TermsIcon,
  SportsEsports as GamesIcon,
  // Community Icons
  Forum as CommunityIcon,
  Home as HomeIcon,
  Search as ExploreIcon,
  Group as GroupsIcon,
  ChatBubble as ChatIcon,
  Notifications as NotificationsIcon,
  Bookmark as BookmarkIcon,
  PersonAdd as FollowIcon,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/contexts/UserContext";
import { usePathname, useRouter } from "next/navigation";
import GoogleAMLogo from "../GoogleAMLogo";

const drawerWidth = 260;

interface LayoutProps {
  children: React.ReactNode;
}

// Google Material Colors for icons
const iconColors = {
  // Primary Colors
  dashboard: "#4285f4", // Google Blue
  actions: "#34a853", // Google Green
  analytics: "#ea4335", // Google Red
  products: "#fbbc04", // Google Yellow

  // Secondary Colors
  inventory: "#8ab4f8", // Light Blue
  materials: "#81c995", // Light Green
  customers: "#f28b82", // Light Red
  employees: "#fdd663", // Light Yellow

  // Neutral Colors
  attendance: "#5f6368", // Dark Gray
  projects: "#9aa0a6", // Medium Gray
  tasks: "#80868b", // Light Gray
  events: "#dadce0", // Very Light Gray

  // Business Colors
  messages: "#4285f4",
  billing: "#34a853",
  expense: "#ea4335",
  pricing: "#fbbc04",
  reviews: "#8ab4f8",
  notes: "#81c995",
  business: "#5f6368",
  settings: "#9aa0a6",

  // Support & Legal
  support: "#4285f4",
  contact: "#34a853",
  security: "#ea4335",
  privacy: "#fbbc04",
  cookie: "#8ab4f8",
  terms: "#81c995",

  // Games & Community
  games: "#34a853",
  community: "#4285f4",
  home: "#ea4335",
  explore: "#fbbc04",
  groups: "#8ab4f8",
};

const menuItems = [
  // --- Core Business ---
  {
    text: "Dashboard",
    icon: <DashboardIcon sx={{ color: iconColors.dashboard }} />,
    path: "/dashboard",
  },
  {
    text: "All Actions",
    icon: <ActionsIcon sx={{ color: iconColors.actions }} />,
    path: "/dashboard/all-actions",
  },
  {
    text: "Analytics",
    icon: <AnalyticsIcon sx={{ color: iconColors.analytics }} />,
    path: "/analytics",
  },

  // --- Inventory & Resources ---
  {
    text: "Products",
    icon: <ProductsIcon sx={{ color: iconColors.products }} />,
    path: "/products",
  },
  {
    text: "Inventory",
    icon: <InventoryIcon sx={{ color: iconColors.inventory }} />,
    path: "/inventory",
  },
  {
    text: "Materials",
    icon: <MaterialsIcon sx={{ color: iconColors.materials }} />,
    path: "/materials",
  },

  // --- CRM & People ---
  {
    text: "Customers",
    icon: <CustomersIcon sx={{ color: iconColors.customers }} />,
    path: "/customers",
  },
  {
    text: "Employees",
    icon: <EmployeesIcon sx={{ color: iconColors.employees }} />,
    path: "/employees",
  },
  {
    text: "Attendance",
    icon: <AttendanceIcon sx={{ color: iconColors.attendance }} />,
    path: "/attendance",
  },

  // --- Operations ---
  {
    text: "Projects",
    icon: <ProjectsIcon sx={{ color: iconColors.projects }} />,
    path: "/projects",
  },
  {
    text: "Tasks",
    icon: <TaskIcon sx={{ color: iconColors.tasks }} />,
    path: "/tasks",
  },
  {
    text: "Events",
    icon: <EventsIcon sx={{ color: iconColors.events }} />,
    path: "/events",
  },

  // --- Finance ---
  {
    text: "Billing",
    icon: <BillingIcon sx={{ color: iconColors.billing }} />,
    path: "/billing",
  },
  {
    text: "Expense",
    icon: <ExpenseIcon sx={{ color: iconColors.expense }} />,
    path: "/expense",
  },
  {
    text: "Pricing",
    icon: <PricingIcon sx={{ color: iconColors.pricing }} />,
    path: "/pricing",
  },

  // --- Feedback & Setup ---
  {
    text: "Reviews",
    icon: <StarIcon sx={{ color: iconColors.reviews }} />,
    path: "/reviews",
  },
  {
    text: "Notes",
    icon: <NoteIcon sx={{ color: iconColors.notes }} />,
    path: "/note",
  },
  {
    text: "Business Setup",
    icon: <BusinessIcon sx={{ color: iconColors.business }} />,
    path: "/business-setup",
  },
  {
    text: "Settings",
    icon: <SettingsIcon sx={{ color: iconColors.settings }} />,
    path: "/settings",
  },

  // --- Support & Help ---
  {
    text: "Help & Support",
    icon: <HelpIcon sx={{ color: iconColors.support }} />,
    path: "/help-support",
  },
  {
    text: "Support Request",
    icon: <SupportIcon sx={{ color: iconColors.support }} />,
    path: "/dashboard/support",
  },
  {
    text: "Contact",
    icon: <ContactIcon sx={{ color: iconColors.contact }} />,
    path: "/contact",
  },

  // --- Legal & Security ---
  {
    text: "Security",
    icon: <SecurityIcon sx={{ color: iconColors.security }} />,
    path: "/security",
  },
  {
    text: "Privacy Policy",
    icon: <PrivacyIcon sx={{ color: iconColors.privacy }} />,
    path: "/privacy-policy",
  },
  {
    text: "Cookie Policy",
    icon: <CookieIcon sx={{ color: iconColors.cookie }} />,
    path: "/cookie-policy",
  },
  {
    text: "Terms of Service",
    icon: <TermsIcon sx={{ color: iconColors.terms }} />,
    path: "/terms-of-service",
  },

  // --- Community Section ---
  {
    text: "Community Home",
    icon: <HomeIcon sx={{ color: iconColors.home }} />,
    path: "/community",
  },
  {
    text: "Explore Users",
    icon: <ExploreIcon sx={{ color: iconColors.explore }} />,
    path: "/community/explore",
  },
  {
    text: "My Profile",
    icon: (
      <Avatar
        sx={{
          width: 24,
          height: 24,
          bgcolor: iconColors.home,
          fontSize: "0.875rem",
        }}
      >
        P
      </Avatar>
    ),
    path: "/community/profile",
  },
  {
    text: "Groups",
    icon: <GroupsIcon sx={{ color: iconColors.groups }} />,
    path: "/community/groups",
  },
  {
    text: "Messages",
    icon: <ChatIcon sx={{ color: iconColors.messages }} />,
    path: "/community/messages",
  },
  {
    text: "Notifications",
    icon: <NotificationsIcon sx={{ color: iconColors.explore }} />,
    path: "/notifications",
  },
  {
    text: "Community Settings",
    icon: <SettingsIcon sx={{ color: iconColors.settings }} />,
    path: "/community/settings",
  },

  // --- Games ---
  {
    text: "Breakroom Games",
    icon: <GamesIcon sx={{ color: iconColors.games }} />,
    path: "/breakroom",
  },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user: authUser, logout } = useAuth();
  const { user: contextUser, isLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const darkMode = theme.palette.mode === "dark";

  const user = contextUser || authUser;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const drawer = (
    <Box
      sx={{
        height: "100vh", // Changed from 100% to 100vh
        backgroundColor: darkMode ? "#202124" : "#ffffff",
        color: darkMode ? "#e8eaed" : "#202124",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Section */}
      <Box>
        <Toolbar
          sx={{
            bgcolor: darkMode ? "#0d3064" : "#1a73e8",
            background: darkMode
              ? "linear-gradient(135deg, #0d3064 0%, #202124 100%)"
              : "linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)",
            color: "white",
            gap: 2,
          }}
        >
          <GoogleAMLogo size={40} darkMode={darkMode} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 600 }}
          >
            AccuManager
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: darkMode ? "#3c4043" : "#dadce0" }} />
      </Box>

      {/* Scrollable Menu Section */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          backgroundColor: darkMode ? "#202124" : "#ffffff", // Ensure background here too
        }}
      >
        <List
          sx={{
            px: 1,
            py: 2,
            backgroundColor: darkMode ? "#202124" : "#ffffff",
          }}
        >
          {menuItems.map((item) => (
            <ListItem
              key={`${item.text}-${item.path}`}
              disablePadding
              sx={{
                mb: 0.5,
                backgroundColor: darkMode ? "#202124" : "#ffffff", // Explicit background
              }}
            >
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: "8px",
                  py: 1,
                  backgroundColor: darkMode ? "#202124" : "#ffffff", // Base background
                  "&.Mui-selected": {
                    bgcolor: darkMode
                      ? alpha("#4285f4", 0.2)
                      : alpha("#4285f4", 0.1),
                    color: darkMode ? "#8ab4f8" : "#1a73e8",
                    borderLeft: "3px solid",
                    borderColor: "#4285f4",
                    "&:hover": {
                      bgcolor: darkMode
                        ? alpha("#4285f4", 0.25)
                        : alpha("#4285f4", 0.15),
                    },
                  },
                  "&:hover": {
                    bgcolor: darkMode
                      ? alpha("#ffffff", 0.08)
                      : alpha("#000000", 0.04),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color:
                      pathname === item.path
                        ? darkMode
                          ? "#8ab4f8"
                          : "#1a73e8"
                        : darkMode
                          ? "#e8eaed"
                          : "#202124",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: pathname === item.path ? 600 : 400,
                    color: "inherit", // Ensure text color inherits from button
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Fixed Footer Section */}
      <Box
        sx={{
          backgroundColor: darkMode ? "#202124" : "#ffffff", // Explicit background
          borderTop: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
        }}
      >
        <List
          sx={{
            px: 1,
            py: 2,
            backgroundColor: darkMode ? "#202124" : "#ffffff", // Explicit background
          }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: "8px",
                py: 1,
                color: "#ea4335",
                backgroundColor: darkMode ? "#202124" : "#ffffff", // Base background
                "&:hover": {
                  bgcolor: alpha("#ea4335", 0.1),
                },
              }}
            >
              <ListItemIcon sx={{ color: "#ea4335", minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "inherit", // Ensure text color inherits
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: darkMode ? "#202124" : "#ffffff",
          color: darkMode ? "#e8eaed" : "#202124",
          borderBottom: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { md: "none" },
              borderRadius: "50%",
              backgroundColor: darkMode
                ? alpha("#ffffff", 0.1)
                : alpha("#000000", 0.04),
              "&:hover": {
                backgroundColor: darkMode
                  ? alpha("#ffffff", 0.15)
                  : alpha("#000000", 0.08),
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {menuItems.find((item) => item.path === pathname)?.text ||
              "Business Manager"}
          </Typography>
          {isLoading ? (
            <Typography variant="body2">Loading...</Typography>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Chip
                icon={<DashboardIcon fontSize="small" />}
                label="Live"
                size="small"
                sx={{
                  backgroundColor: alpha("#34a853", 0.1),
                  color: "#34a853",
                  border: `1px solid ${alpha("#34a853", 0.3)}`,
                  fontWeight: 500,
                  "& .MuiChip-icon": {
                    color: "#34a853",
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
              >
                Welcome, {user?.name?.split(" ")[0] || "User"}
              </Typography>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#4285f4",
                  cursor: "pointer",
                  border: `2px solid ${darkMode ? "#303134" : "#ffffff"}`,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
                onClick={() => router.push("/community/profile")}
              >
                {user?.name?.charAt(0) || "U"}
              </Avatar>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
          "& .MuiDrawer-paper": {
            backgroundColor: darkMode ? "#202124" : "#ffffff", // Apply to drawer paper too
          },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: darkMode ? "#202124" : "#ffffff", // Mobile drawer background
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
              backgroundColor: darkMode ? "#202124" : "#ffffff", // Desktop drawer background
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: darkMode ? "#202124" : "#ffffff",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
