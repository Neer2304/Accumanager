// components/proadminlayout/components/ProAdminAppBar.tsx
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
import { User, proColors } from './types';
import GoogleAMLogo from '@/components/GoogleAMLogo';

interface ProAdminAppBarProps {
  user: User | null;
  isMobile: boolean;
  darkMode: boolean;
  onMenuClick: () => void;
  onMobileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onLogout: () => void;
}

export const ProAdminAppBar: React.FC<ProAdminAppBarProps> = ({
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
        backgroundColor: darkMode ? proColors.grey900 : 'white',
        borderBottom: `1px solid ${darkMode ? proColors.grey800 : proColors.grey200}`,
        boxShadow: isMobile ? '0 1px 2px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
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
            color: darkMode ? proColors.grey300 : proColors.grey700,
            display: { xs: 'flex', md: 'flex' },
            '&:hover': {
              backgroundColor: darkMode ? proColors.grey800 : proColors.grey100,
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
              color: darkMode ? proColors.grey200 : proColors.grey900,
              fontWeight: 500,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: darkMode ? proColors.grey200 : proColors.grey900,
              fontWeight: 500,
              fontSize: '1rem',
              display: { xs: 'block', sm: 'none' },
            }}
          >
            Admin
          </Typography>
        </Box>
        
        {user && !isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Chip
              label="Admin"
              size="small"
              sx={{
                backgroundColor: alpha(proColors.primary, 0.1),
                color: proColors.primary,
                fontWeight: 500,
                border: `1px solid ${alpha(proColors.primary, 0.3)}`,
                display: { xs: 'none', sm: 'flex' },
              }}
            />
            <Avatar
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                backgroundColor: proColors.primary,
                fontSize: { xs: 12, sm: 14 },
                fontWeight: 500,
              }}
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? proColors.grey300 : proColors.grey700,
                fontWeight: 500,
                display: { xs: 'none', md: 'block' },
              }}
            >
              {user.name}
            </Typography>
            <Tooltip title="Logout">
              <IconButton
                onClick={onLogout}
                size="small"
                sx={{
                  color: darkMode ? proColors.grey500 : proColors.grey600,
                  '&:hover': {
                    backgroundColor: darkMode ? proColors.grey800 : proColors.grey100,
                    color: proColors.error,
                  },
                }}
              >
                <Logout fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        
        {user && isMobile && (
          <IconButton onClick={onMobileMenuOpen} sx={{ color: darkMode ? proColors.grey300 : proColors.grey700 }}>
            <MoreVert />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};