// app/(pages)/advance/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Box, CircularProgress, Typography, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'
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
  Timeline
} from '@mui/icons-material'
import { AdvanceThemeProvider, useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

// Sidebar Component
function AdvanceSidebar({ open, onClose, isMobile }: { open: boolean; onClose: () => void; isMobile: boolean }) {
  const { currentScheme } = useAdvanceThemeContext()

  const menuItems = [
    { icon: <Dashboard />, text: 'Dashboard', path: '/advance' },
    { icon: <ColorLens />, text: 'Theme Customizer', path: '/advance/theme-customizer' },
    { icon: <AutoAwesome />, text: 'AI Analytics', path: '/advance/ai-analytics' },
    { icon: <TrendingUp />, text: 'Marketing', path: '/advance/marketing' },
    { icon: <Business />, text: 'Field Service', path: '/advance/field-service' },
    { icon: <People />, text: 'Customer 360', path: '/advance/customer-360' },
    { icon: <Timeline />, text: 'Subscription', path: '/advance/subscription' },
    { icon: <Settings />, text: 'Settings', path: '/advance/settings' },
  ]

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          background: currentScheme.colors.components.sidebar,
          borderRight: `1px solid ${currentScheme.colors.components.border}`,
          color: currentScheme.colors.text.primary,
        },
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${currentScheme.colors.components.border}` }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight="bold">
            🚀 Advanced
          </Typography>
          {isMobile && (
            <IconButton 
              onClick={onClose} 
              size="small"
              sx={{ color: currentScheme.colors.text.secondary }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
          Enterprise Features
        </Typography>
      </Box>

      {/* Sidebar Menu */}
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: currentScheme.colors.components.hover,
                },
              }}
              href={item.path}
            >
              <ListItemIcon sx={{ color: currentScheme.colors.text.primary, minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: currentScheme.colors.components.border, my: 2 }} />

      {/* Theme Info */}
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
          Current Theme: {currentScheme.name}
        </Typography>
      </Box>
    </Drawer>
  )
}

// Main layout content with theme
function AdvanceLayoutContent({ children }: { children: React.ReactNode }) {
  const { mode, currentScheme, toggleTheme } = useAdvanceThemeContext()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: currentScheme.colors.background,
        color: currentScheme.colors.text.primary,
      }}
    >
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
          width: '100%',
          transition: (theme) => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(!isMobile && sidebarOpen && {
            width: `calc(100% - 280px)`,
            marginLeft: '280px',
          }),
        }}
      >
        {/* Header */}
        <Box
          sx={{
            height: 64,
            borderBottom: `1px solid ${currentScheme.colors.components.border}`,
            background: currentScheme.colors.components.header,
            display: 'flex',
            alignItems: 'center',
            px: 3,
            position: 'sticky',
            top: 0,
            zIndex: 10,
            width: '100%',
          }}
        >
          {(!sidebarOpen || isMobile) && (
            <IconButton
              onClick={() => setSidebarOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" fontWeight="medium" sx={{ flexGrow: 1 }}>
            Advanced CRM Features
          </Typography>

          {/* Theme Toggle */}
          <IconButton 
            onClick={toggleTheme} 
            sx={{ 
              mr: 1,
              color: currentScheme.colors.text.primary,
              backgroundColor: currentScheme.colors.components.hover,
              '&:hover': {
                backgroundColor: currentScheme.colors.components.active,
              },
            }}
            title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mode === 'dark' ? '☀️' : '🌙'}
          </IconButton>

          {/* Quick Theme Button */}
          <IconButton
            sx={{
              background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
              color: 'white',
              '&:hover': {
                background: `linear-gradient(135deg, ${currentScheme.colors.primary}CC 0%, ${currentScheme.colors.secondary}CC 100%)`,
              },
            }}
            href="/advance/theme-customizer"
            title="Theme Customizer"
          >
            <PaletteIcon />
          </IconButton>
        </Box>

        {/* Page Content */}
        <Box 
          sx={{ 
            p: { xs: 2, sm: 3 },
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

// Main Layout Component
export default function AdvanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

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
        bgcolor="background.default"
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
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  return (
    <AdvanceThemeProvider>
      <AdvanceLayoutContent>
        {children}
      </AdvanceLayoutContent>
    </AdvanceThemeProvider>
  )
}