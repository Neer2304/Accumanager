// components/Layout/layout.tsx - FIXED WITH UNIQUE KEYS
'use client'

import React from 'react'
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
} from '@mui/material'
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
} from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/contexts/UserContext'
import { usePathname, useRouter } from 'next/navigation'

const drawerWidth = 260

interface LayoutProps {
  children: React.ReactNode
}

// Color palette for icons
const iconColors = {
  // Business Colors
  dashboard: '#4CAF50', // Green
  actions: '#FF9800',   // Orange
  analytics: '#2196F3', // Blue
  products: '#9C27B0',  // Purple
  inventory: '#795548', // Brown
  materials: '#607D8B', // Blue Grey
  customers: '#E91E63', // Pink
  employees: '#00BCD4', // Cyan
  attendance: '#FFC107', // Amber
  projects: '#3F51B5',  // Indigo
  tasks: '#8BC34A',     // Light Green
  events: '#009688',    // Teal
  messages: '#03A9F4',  // Light Blue
  billing: '#4CAF50',   // Green
  expense: '#FF5722',   // Deep Orange
  pricing: '#9C27B0',   // Purple
  reviews: '#FFD700',   // Gold
  notes: '#FF9800',     // Orange
  business: '#795548',  // Brown
  settings: '#607D8B',  // Blue Grey
  
  // Support & Legal
  support: '#2196F3',   // Blue
  contact: '#00BCD4',   // Cyan
  security: '#FF5722',  // Deep Orange
  privacy: '#4CAF50',   // Green
  cookie: '#FF9800',    // Orange
  terms: '#3F51B5',     // Indigo
  
  // Games & Community
  games: '#E91E63',     // Pink
  community: '#2196F3', // Blue
  home: '#4CAF50',      // Green
  explore: '#FF9800',   // Orange
  groups: '#00BCD4',    // Cyan
}

const menuItems = [
  // --- Core Business ---
  { text: 'Dashboard', icon: <DashboardIcon sx={{ color: iconColors.dashboard }} />, path: '/dashboard' },
  { text: 'All Actions', icon: <ActionsIcon sx={{ color: iconColors.actions }} />, path: '/dashboard/all-actions' },
  { text: 'Analytics', icon: <AnalyticsIcon sx={{ color: iconColors.analytics }} />, path: '/analytics' },
  
  // --- Inventory & Resources ---
  { text: 'Products', icon: <ProductsIcon sx={{ color: iconColors.products }} />, path: '/products' },
  { text: 'Inventory', icon: <InventoryIcon sx={{ color: iconColors.inventory }} />, path: '/inventory' },
  { text: 'Materials', icon: <MaterialsIcon sx={{ color: iconColors.materials }} />, path: '/materials' },
  
  // --- CRM & People ---
  { text: 'Customers', icon: <CustomersIcon sx={{ color: iconColors.customers }} />, path: '/customers' },
  { text: 'Employees', icon: <EmployeesIcon sx={{ color: iconColors.employees }} />, path: '/employees' },
  { text: 'Attendance', icon: <AttendanceIcon sx={{ color: iconColors.attendance }} />, path: '/attendance' },
  
  // --- Operations ---
  { text: 'Projects', icon: <ProjectsIcon sx={{ color: iconColors.projects }} />, path: '/projects' },
  { text: 'Tasks', icon: <TaskIcon sx={{ color: iconColors.tasks }} />, path: '/tasks' },
  { text: 'Events', icon: <EventsIcon sx={{ color: iconColors.events }} />, path: '/events' },
  // { text: 'Messages', icon: <MessageIcon sx={{ color: iconColors.messages }} />, path: '/messages' },
  
  // --- Finance ---
  { text: 'Billing', icon: <BillingIcon sx={{ color: iconColors.billing }} />, path: '/billing' },
  { text: 'Expense', icon: <ExpenseIcon sx={{ color: iconColors.expense }} />, path: '/expense' },
  { text: 'Pricing', icon: <PricingIcon sx={{ color: iconColors.pricing }} />, path: '/pricing' },
  
  // --- Feedback & Setup ---
  { text: 'Reviews', icon: <StarIcon sx={{ color: iconColors.reviews }} />, path: '/reviews' },
  { text: 'Notes', icon: <NoteIcon sx={{ color: iconColors.notes }} />, path: '/note' },
  { text: 'Business Setup', icon: <BusinessIcon sx={{ color: iconColors.business }} />, path: '/business-setup' },
  { text: 'Settings', icon: <SettingsIcon sx={{ color: iconColors.settings }} />, path: '/settings' },

  // --- Support & Help ---
  { text: 'Help & Support', icon: <HelpIcon sx={{ color: iconColors.support }} />, path: '/help-support' },
  { text: 'Support Request', icon: <SupportIcon sx={{ color: iconColors.support }} />, path: '/dashboard/support' },
  { text: 'Contact', icon: <ContactIcon sx={{ color: iconColors.contact }} />, path: '/contact' },

  // --- Legal & Security ---
  { text: 'Security', icon: <SecurityIcon sx={{ color: iconColors.security }} />, path: '/security' },
  { text: 'Privacy Policy', icon: <PrivacyIcon sx={{ color: iconColors.privacy }} />, path: '/privacy-policy' },
  { text: 'Cookie Policy', icon: <CookieIcon sx={{ color: iconColors.cookie }} />, path: '/cookie-policy' },
  { text: 'Terms of Service', icon: <TermsIcon sx={{ color: iconColors.terms }} />, path: '/terms-of-service' },

  // --- Community Section ---
  { text: 'Community Home', icon: <HomeIcon sx={{ color: iconColors.home }} />, path: '/community' },
  { text: 'Explore Users', icon: <ExploreIcon sx={{ color: iconColors.explore }} />, path: '/community/explore' },
  { text: 'My Profile', icon: <Avatar sx={{ width: 24, height: 24, bgcolor: iconColors.home, fontSize: '0.875rem' }}>P</Avatar>, path: '/community/profile' },
  { text: 'Groups', icon: <GroupsIcon sx={{ color: iconColors.groups }} />, path: '/community/groups' },
  { text: 'Messages', icon: <ChatIcon sx={{ color: iconColors.messages }} />, path: '/community/messages' },
  { text: 'Notifications', icon: <NotificationsIcon sx={{ color: iconColors.explore }} />, path: '/notifications' },
  { text: 'Community Settings', icon: <SettingsIcon sx={{ color: iconColors.settings }} />, path: '/community/settings' },

  // --- Games --- 
  { text: 'Breakroom Games', icon: <GamesIcon sx={{ color: iconColors.games }} />, path: '/breakroom' },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { user: authUser, logout } = useAuth()
  const { user: contextUser, isLoading } = useUser()
  const pathname = usePathname()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const user = contextUser || authUser

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    logout()
  }

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
          Business Manager
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          // FIXED: Using combination of text and path for unique key
          <ListItem key={`${item.text}-${item.path}`} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  borderLeft: '3px solid',
                  borderColor: 'primary.main',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: pathname === item.path ? 600 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ color: 'error.main' }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {menuItems.find(item => item.path === pathname)?.text || 'Business Manager'}
          </Typography>
          {isLoading ? (
            <Typography variant="body2">Loading...</Typography>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                icon={<DashboardIcon fontSize="small" />}
                label="Live"
                color="success"
                size="small"
                variant="outlined"
              />
              <Typography variant="body2">
                Welcome, {user?.name?.split(' ')[0] || 'User'}
              </Typography>
              <Avatar
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: 'primary.main',
                  cursor: 'pointer'
                }}
                onClick={() => router.push('/community/profile')}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
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
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8, // This pushes content below the header
        }}
      >
        {children}
      </Box>
    </Box>
  )
}