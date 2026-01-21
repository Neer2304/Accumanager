// components/Layout/layout.tsx - UPDATED
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
  useMediaQuery
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
  SportsEsports
} from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/contexts/UserContext' // Add this import
import { usePathname, useRouter } from 'next/navigation'

const drawerWidth = 240

interface LayoutProps {
  children: React.ReactNode
}

const menuItems = [
  // --- Core Business ---
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'All Actions', icon: <ActionsIcon />, path: '/dashboard/all-actions' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  
  // --- Inventory & Resources ---
  { text: 'Products', icon: <ProductsIcon />, path: '/products' },
  { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Materials', icon: <MaterialsIcon />, path: '/materials' },
  
  // --- CRM & People ---
  { text: 'Customers', icon: <CustomersIcon />, path: '/customers' },
  { text: 'Employees', icon: <EmployeesIcon />, path: '/employees' },
  { text: 'Attendance', icon: <AttendanceIcon />, path: '/attendance' },
  
  // --- Operations ---
  { text: 'Projects', icon: <ProjectsIcon />, path: '/projects' },
  { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
  { text: 'Events', icon: <EventsIcon />, path: '/events' },
  { text: 'Messages', icon: <MessageIcon />, path: '/messages' },
  
  // --- Finance ---
  { text: 'Billing', icon: <BillingIcon />, path: '/billing' },
  { text: 'Expense', icon: <ExpenseIcon />, path: '/expense' },
  { text: 'Pricing', icon: <PricingIcon />, path: '/pricing' },
  
  // --- Feedback & Setup ---
  { text: 'Reviews', icon: <StarIcon />, path: '/reviews' },
  { text: 'Notes', icon: <NoteIcon />, path: '/note' },
  { text: 'Business Setup', icon: <BusinessIcon />, path: '/business-setup' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },

  // --- Support & Help ---
  { text: 'Help & Support', icon: <HelpIcon />, path: '/help-support' },
  { text: 'Support Request', icon: <SupportIcon />, path: '/dashboard/support' },
  { text: 'Contact', icon: <ContactIcon />, path: '/contact' },

  // --- Legal & Security ---
  { text: 'Security', icon: <SecurityIcon />, path: '/security' },
  { text: 'Privacy Policy', icon: <PrivacyIcon />, path: '/privacy-policy' },
  { text: 'Cookie Policy', icon: <CookieIcon />, path: '/cookie-policy' },
  { text: 'Terms of Service', icon: <TermsIcon />, path: '/terms-of-service' },

  // --- Games --- 
  { text: 'Breakroom', icon: <SportsEsports />, path: '/breakroom' },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { user: authUser, logout } = useAuth()
  const { user: contextUser, isLoading } = useUser() // Get user from context
  const pathname = usePathname()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Use context user first, then auth user as fallback
  const user = contextUser || authUser

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    logout()
  }

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Business Manager
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === pathname)?.text || 'Business Manager'}
          </Typography>
          {isLoading ? (
            <Typography variant="body2">Loading...</Typography>
          ) : (
            <Typography variant="body2">
              Welcome, {user?.name || 'User'}
            </Typography>
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}