// components/advance/AdvanceHeader.tsx
'use client'

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Notifications,
  Brightness4,
  Brightness7,
  Person,
  ExitToApp,
  Settings,
} from '@mui/icons-material'
import { useState } from 'react'
import { useThemeContext } from '@/contexts/ThemeContexts'

interface AdvanceHeaderProps {
  onMenuClick: () => void
  onThemeToggle: () => void
  themeMode: 'light' | 'dark'
}

export default function AdvanceHeader({ onMenuClick, onThemeToggle, themeMode }: AdvanceHeaderProps) {
  const { currentScheme } = useThemeContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        background: currentScheme.colors.components.header,
        borderBottom: `1px solid ${currentScheme.colors.components.border}`,
        boxShadow: 'none',
        ml: { xs: 0, sm: 0 },
        width: { xs: '100%', sm: `calc(100% - 280px)` },
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* Theme Toggle */}
        <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
          <IconButton onClick={onThemeToggle} sx={{ mr: 1 }}>
            {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <IconButton sx={{ mr: 1 }}>
          <Badge badgeContent={3} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        {/* Profile */}
        <Tooltip title="Account settings">
          <IconButton onClick={handleProfileMenuOpen}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
              }}
            >
              A
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          PaperProps={{
            sx: {
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
              mt: 1.5,
            },
          }}
        >
          <MenuItem onClick={handleProfileMenuClose}>
            <Person sx={{ mr: 2, fontSize: 20 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>
            <Settings sx={{ mr: 2, fontSize: 20 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>
            <ExitToApp sx={{ mr: 2, fontSize: 20 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}