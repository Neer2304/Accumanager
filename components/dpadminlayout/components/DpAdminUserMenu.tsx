// components/dpadminlayout/components/DpAdminUserMenu.tsx
import React from 'react';
import { Avatar, Box, Typography, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import { Dashboard, Settings, Logout } from '@mui/icons-material';
import { User, dpColors } from './types';

interface DpAdminUserMenuProps {
  user: User;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onDashboard: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

export const DpAdminUserMenu: React.FC<DpAdminUserMenuProps> = ({ user, anchorEl, open, onClose, onDashboard, onSettings, onLogout }) => {
  const darkMode = false;
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose} sx={{ '& .MuiPaper-root': { backgroundColor: darkMode ? dpColors.surface : dpColors.surfaceLight, border: `2px solid ${darkMode ? dpColors.border : dpColors.borderLight}`, borderRadius: '16px', minWidth: 200, mt: 1 } }}>
      <MenuItem sx={{ py: 1.5, borderBottom: `2px solid ${darkMode ? dpColors.border : dpColors.borderLight}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Avatar sx={{ width: 32, height: 32, backgroundColor: dpColors.red, fontSize: 14, fontWeight: 700 }}>{user.name?.charAt(0)?.toUpperCase()}</Avatar>
          <Box sx={{ flex: 1 }}><Typography variant="subtitle2" sx={{ color: darkMode ? dpColors.ink : dpColors.inkSub, fontWeight: 700 }}>{user.name}</Typography><Typography variant="caption" sx={{ color: darkMode ? dpColors.inkSub : dpColors.inkMuted }}>{user.email}</Typography></Box>
        </Box>
      </MenuItem>
      <MenuItem onClick={() => { onDashboard(); onClose(); }} sx={{ py: 1.5 }}><ListItemIcon sx={{ minWidth: 36, color: dpColors.inkSub }}><Dashboard fontSize="small" /></ListItemIcon><Typography variant="body2" sx={{ color: dpColors.ink }}>Dashboard</Typography></MenuItem>
      <MenuItem onClick={() => { onSettings(); onClose(); }} sx={{ py: 1.5 }}><ListItemIcon sx={{ minWidth: 36, color: dpColors.inkSub }}><Settings fontSize="small" /></ListItemIcon><Typography variant="body2" sx={{ color: dpColors.ink }}>Settings</Typography></MenuItem>
      <Divider sx={{ borderColor: darkMode ? dpColors.border : dpColors.borderLight, my: 1 }} />
      <MenuItem onClick={() => { onLogout(); onClose(); }} sx={{ py: 1.5, color: dpColors.error }}><ListItemIcon sx={{ minWidth: 36, color: dpColors.error }}><Logout fontSize="small" /></ListItemIcon><Typography variant="body2">Logout</Typography></MenuItem>
    </Menu>
  );
};