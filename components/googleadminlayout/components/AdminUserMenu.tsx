// components/googleadminlayout/components/AdminUserMenu.tsx
import React from 'react';
import {
  Avatar,
  Box,
  Chip,
  Typography,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  alpha,
  useTheme
} from '@mui/material';
import {
  Dashboard,
  Settings,
  Logout
} from '@mui/icons-material';
import { User, googleColors } from './types';

interface AdminUserMenuProps {
  user: User;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onDashboard: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

export const AdminUserMenu: React.FC<AdminUserMenuProps> = ({
  user,
  anchorEl,
  open,
  onClose,
  onDashboard,
  onSettings,
  onLogout
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: darkMode ? googleColors.grey900 : 'white',
          border: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
          borderRadius: '12px',
          minWidth: 200,
          mt: 1,
        },
      }}
    >
      <MenuItem 
        sx={{ 
          py: 1.5,
          borderBottom: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: googleColors.primary,
              fontSize: 14,
            }}
          >
            {user.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ 
              color: darkMode ? googleColors.grey200 : googleColors.grey900,
              fontWeight: 500,
            }}>
              {user.name}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: darkMode ? googleColors.grey500 : googleColors.grey600,
            }}>
              {user.email}
            </Typography>
          </Box>
        </Box>
      </MenuItem>
      <MenuItem 
        onClick={() => {
          onDashboard();
          onClose();
        }}
        sx={{ py: 1.5 }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          <Dashboard fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Dashboard</Typography>
      </MenuItem>
      <MenuItem 
        onClick={() => {
          onSettings();
          onClose();
        }}
        sx={{ py: 1.5 }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          <Settings fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Settings</Typography>
      </MenuItem>
      <Divider sx={{ 
        borderColor: darkMode ? googleColors.grey800 : googleColors.grey200,
        my: 1,
      }} />
      <MenuItem 
        onClick={() => {
          onLogout();
          onClose();
        }}
        sx={{ 
          py: 1.5,
          color: googleColors.error,
        }}
      >
        <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
          <Logout fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Logout</Typography>
      </MenuItem>
    </Menu>
  );
};