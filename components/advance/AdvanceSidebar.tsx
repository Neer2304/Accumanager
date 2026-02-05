// components/advance/AdvanceSidebar.tsx
'use client'

import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Badge,
} from '@mui/material'
import {
  Dashboard,
  People,
  Palette,
  TrendingUp,
  BusinessCenter,
  Timeline,
  SmartToy,
  Settings,
  ChevronLeft,
} from '@mui/icons-material'
import { useThemeContext } from '@/contexts/ThemeContexts'

interface AdvanceSidebarProps {
  open: boolean
  onClose: () => void
  isMobile: boolean
}

export default function AdvanceSidebar({ open, onClose, isMobile }: AdvanceSidebarProps) {
  const { currentScheme } = useThemeContext()

  const menuItems = [
    { icon: <Dashboard />, text: 'Dashboard', path: '/advance', badge: null },
    { icon: <People />, text: 'Customer 360°', path: '/advance/customer-360', badge: 'New' },
    { icon: <SmartToy />, text: 'AI Analytics', path: '/advance/ai-analytics', badge: 'Beta' },
    { icon: <TrendingUp />, text: 'Marketing Automation', path: '/advance/marketing-automation', badge: null },
    { icon: <Palette />, text: 'Theme Customizer', path: '/advance/theme-customizer', badge: null },
    { icon: <BusinessCenter />, text: 'Field Service', path: '/advance/field-service', badge: 'Soon' },
    { icon: <Timeline />, text: 'Subscription Billing', path: '/advance/subscription-billing', badge: null },
  ]

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          background: currentScheme.colors.components.sidebar,
          borderRight: `1px solid ${currentScheme.colors.components.border}`,
          color: currentScheme.colors.text.primary,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
              }}
            >
              A
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Advanced CRM
              </Typography>
              <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                Enterprise Features
              </Typography>
            </Box>
          </Box>
          {isMobile && (
            <ChevronLeft 
              onClick={onClose}
              sx={{ 
                cursor: 'pointer',
                color: currentScheme.colors.text.secondary,
              }}
            />
          )}
        </Box>
      </Box>

      <Divider sx={{ borderColor: currentScheme.colors.components.border }} />

      {/* Menu */}
      <List sx={{ p: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&:hover': {
                  background: currentScheme.colors.components.hover,
                },
              }}
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
              {item.badge && (
                <Badge
                  badgeContent={item.badge}
                  color={
                    item.badge === 'New' ? 'success' :
                    item.badge === 'Beta' ? 'warning' : 'info'
                  }
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem',
                      height: 16,
                      minWidth: 16,
                    },
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: currentScheme.colors.components.border, my: 2 }} />

      {/* Bottom Section */}
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
          🚀 Powered by your custom theme system
        </Typography>
      </Box>
    </Drawer>
  )
}