// components/dpadminlayout/components/DpAdminAppBar.tsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
  Tooltip,
  alpha,
} from '@mui/material';
import { Menu as MenuIcon, Logout, MoreVert } from '@mui/icons-material';
import { User, dpColors } from './types';
import GoogleAMLogo from '@/components/GoogleAMLogo';

interface DpAdminAppBarProps {
  user: User | null;
  isMobile: boolean;
  darkMode: boolean;
  onMenuClick: () => void;
  onMobileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onLogout: () => void;
}

export const DpAdminAppBar: React.FC<DpAdminAppBarProps> = ({
  user,
  isMobile,
  darkMode,
  onMenuClick,
  onMobileMenuOpen,
  onLogout
}) => {
  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        zIndex: 1300,
        backgroundColor: darkMode ? dpColors.surface : dpColors.surfaceLight,
        borderBottom: `2px solid ${darkMode ? dpColors.border : dpColors.borderLight}`,
        boxShadow: isMobile ? `0 2px 8px ${dpColors.redGlow}` : `0 2px 8px ${dpColors.redGlow}`,
      }}
    >
      <Toolbar sx={{ 
        px: { xs: 1.5, sm: 2, md: 3 },
        minHeight: { xs: 56, sm: 64 },
      }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ 
            mr: { xs: 1, sm: 2 },
            color: dpColors.red,
            display: { xs: 'flex', md: 'flex' },
            '&:hover': {
              backgroundColor: alpha(dpColors.red, 0.1),
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flex: 1 }}>
          <GoogleAMLogo size={32} darkMode={darkMode} />
          <Typography 
            variant="h6" 
            sx={{ 
              color: dpColors.ink,
              fontWeight: 800,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              display: { xs: 'none', sm: 'block' },
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            Deadpool Admin
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: dpColors.ink,
              fontWeight: 800,
              fontSize: '1rem',
              display: { xs: 'block', sm: 'none' },
            }}
          >
            DP Admin
          </Typography>
        </Box>
        
        {user && !isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Chip
              label="MAXIMUM EFFORT"
              size="small"
              sx={{
                backgroundColor: alpha(dpColors.red, 0.15),
                color: dpColors.red,
                fontWeight: 700,
                border: `1px solid ${alpha(dpColors.red, 0.3)}`,
                display: { xs: 'none', sm: 'flex' },
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            />
            <Avatar
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                backgroundColor: dpColors.red,
                fontSize: { xs: 12, sm: 14 },
                fontWeight: 800,
                border: `2px solid ${dpColors.red}`,
              }}
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography 
              variant="body2" 
              sx={{ 
                color: dpColors.inkSub,
                fontWeight: 600,
                display: { xs: 'none', md: 'block' },
              }}
            >
              {user.name}
            </Typography>
            <Tooltip title="Logout (Don't go!)">
              <IconButton
                onClick={onLogout}
                size="small"
                sx={{
                  color: dpColors.inkMuted,
                  '&:hover': {
                    backgroundColor: alpha(dpColors.red, 0.1),
                    color: dpColors.red,
                  },
                }}
              >
                <Logout fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        
        {user && isMobile && (
          <IconButton onClick={onMobileMenuOpen} sx={{ color: dpColors.red }}>
            <MoreVert />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};