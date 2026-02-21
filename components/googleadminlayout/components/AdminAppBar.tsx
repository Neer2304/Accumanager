// components/googleadminlayout/components/AdminAppBar.tsx
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
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  AdminPanelSettings,
  Logout,
  MoreVert
} from '@mui/icons-material';
import { User, googleColors } from './types';

interface AdminAppBarProps {
  user: User | null;
  isMobile: boolean;
  darkMode: boolean;
  onMenuClick: () => void;
  onMobileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onLogout: () => void;
}

export const AdminAppBar: React.FC<AdminAppBarProps> = ({
  user,
  isMobile,
  darkMode,
  onMenuClick,
  onMobileMenuOpen,
  onLogout
}) => {
  const theme = useTheme();

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        zIndex: 1300,
        backgroundColor: darkMode ? googleColors.grey900 : 'white',
        borderBottom: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
        boxShadow: isMobile 
          ? '0 1px 2px rgba(0,0,0,0.1)'
          : '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <Toolbar sx={{ 
        px: { xs: 1.5, sm: 2, md: 3 },
        minHeight: { xs: 56, sm: 64 },
      }}>
        {/* Mobile Menu Button */}
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ 
            mr: { xs: 1, sm: 2 },
            color: darkMode ? googleColors.grey300 : googleColors.grey700,
            display: { xs: 'flex', md: 'flex' },
            '&:hover': {
              backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey100,
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Logo/Brand */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2 },
          flex: 1,
        }}>
          <AdminPanelSettings sx={{ 
            color: googleColors.primary,
            fontSize: { xs: 20, sm: 24, md: 28 },
          }} />
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: darkMode ? googleColors.grey200 : googleColors.grey900,
              fontWeight: 500,
              fontSize: { 
                xs: '1rem', 
                sm: '1.125rem', 
                md: '1.25rem' 
              },
              lineHeight: 1.2,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: darkMode ? googleColors.grey200 : googleColors.grey900,
              fontWeight: 500,
              fontSize: '1rem',
              display: { xs: 'block', sm: 'none' },
            }}
          >
            Admin
          </Typography>
        </Box>
        
        {/* Desktop User Info */}
        {user && !isMobile && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 },
          }}>
            <Chip
              label="Admin"
              size="small"
              sx={{
                backgroundColor: alpha(googleColors.primary, 0.1),
                color: googleColors.primary,
                fontWeight: 500,
                border: `1px solid ${alpha(googleColors.primary, 0.3)}`,
                display: { xs: 'none', sm: 'flex' },
              }}
            />
            
            <Avatar
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                backgroundColor: googleColors.primary,
                fontSize: { xs: 12, sm: 14 },
                fontWeight: 500,
              }}
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? googleColors.grey300 : googleColors.grey700,
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
                  color: darkMode ? googleColors.grey500 : googleColors.grey600,
                  '&:hover': {
                    backgroundColor: darkMode ? googleColors.grey800 : googleColors.grey100,
                    color: googleColors.error,
                  },
                }}
              >
                <Logout fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        
        {/* Mobile User Menu Button */}
        {user && isMobile && (
          <IconButton
            onClick={onMobileMenuOpen}
            sx={{
              color: darkMode ? googleColors.grey300 : googleColors.grey700,
            }}
          >
            <MoreVert />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};