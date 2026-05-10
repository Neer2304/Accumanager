// components/batmanadminlayout/components/BatmanAdminAppBar.tsx
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
import { Menu as MenuIcon, Logout, MoreVert, Shield } from '@mui/icons-material';
import { User, batmanColors } from './types';
import GoogleAMLogo from '@/components/GoogleAMLogo';

interface BatmanAdminAppBarProps {
  user: User | null;
  isMobile: boolean;
  darkMode: boolean;
  onMenuClick: () => void;
  onMobileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onLogout: () => void;
}

export const BatmanAdminAppBar: React.FC<BatmanAdminAppBarProps> = ({
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
        backgroundColor: darkMode ? batmanColors.surface : batmanColors.surfaceLight,
        borderBottom: `2px solid ${darkMode ? batmanColors.gold : batmanColors.gold}`,
        boxShadow: darkMode ? `0 4px 20px ${batmanColors.goldGlow}` : `0 2px 8px ${batmanColors.goldSoft}`,
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
            color: batmanColors.gold,
            display: { xs: 'flex', md: 'flex' },
            '&:hover': {
              backgroundColor: alpha(batmanColors.gold, 0.1),
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
              color: darkMode ? batmanColors.ink : batmanColors.inkLight,
              fontWeight: 800,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              display: { xs: 'none', sm: 'block' },
              letterSpacing: '0.1em',
            }}
          >
            BATCOMPUTER
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: darkMode ? batmanColors.ink : batmanColors.inkLight,
              fontWeight: 800,
              fontSize: '1rem',
              display: { xs: 'block', sm: 'none' },
            }}
          >
            ADMIN
          </Typography>
        </Box>
        
        {user && !isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Chip
              icon={<Shield sx={{ fontSize: 16 }} />}
              label="PROTECTED"
              size="small"
              sx={{
                backgroundColor: alpha(batmanColors.gold, 0.15),
                color: batmanColors.gold,
                fontWeight: 700,
                border: `1px solid ${alpha(batmanColors.gold, 0.3)}`,
                display: { xs: 'none', sm: 'flex' },
                letterSpacing: '0.05em',
              }}
            />
            <Avatar
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                backgroundColor: batmanColors.gold,
                color: darkMode ? '#0a0a0a' : '#fff',
                fontSize: { xs: 12, sm: 14 },
                fontWeight: 800,
                border: `2px solid ${batmanColors.gold}`,
              }}
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? batmanColors.inkSub : batmanColors.inkSubLight,
                fontWeight: 600,
                display: { xs: 'none', md: 'block' },
              }}
            >
              {user.name}
            </Typography>
            <Tooltip title="Secure Logout">
              <IconButton
                onClick={onLogout}
                size="small"
                sx={{
                  color: batmanColors.inkMuted,
                  '&:hover': {
                    backgroundColor: alpha(batmanColors.gold, 0.1),
                    color: batmanColors.gold,
                  },
                }}
              >
                <Logout fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        
        {user && isMobile && (
          <IconButton onClick={onMobileMenuOpen} sx={{ color: batmanColors.gold }}>
            <MoreVert />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};