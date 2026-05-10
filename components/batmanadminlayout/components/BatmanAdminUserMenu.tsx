// components/batmanadminlayout/components/BatmanAdminUserMenu.tsx
import React from 'react';
import { Avatar, Box, Typography, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import { Dashboard, Settings, Logout } from '@mui/icons-material';
import { User, batmanColors } from './types';

interface BatmanAdminUserMenuProps {
  user: User;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onDashboard: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

export const BatmanAdminUserMenu: React.FC<BatmanAdminUserMenuProps> = ({ user, anchorEl, open, onClose, onDashboard, onSettings, onLogout }) => {
  const darkMode = false;
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose} sx={{ '& .MuiPaper-root': { backgroundColor: darkMode ? batmanColors.surface : batmanColors.surfaceLight, border: `2px solid ${batmanColors.gold}`, borderRadius: '16px', minWidth: 200, mt: 1 } }}>
      <MenuItem sx={{ py: 1.5, borderBottom: `2px solid ${batmanColors.gold}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Avatar sx={{ width: 32, height: 32, backgroundColor: batmanColors.gold, color: darkMode ? '#0a0a0a' : '#fff', fontSize: 14, fontWeight: 700 }}>{user.name?.charAt(0)?.toUpperCase()}</Avatar>
          <Box sx={{ flex: 1 }}><Typography variant="subtitle2" sx={{ color: darkMode ? batmanColors.ink : batmanColors.inkLight, fontWeight: 700 }}>{user.name}</Typography><Typography variant="caption" sx={{ color: darkMode ? batmanColors.inkSub : batmanColors.inkSubLight }}>{user.email}</Typography></Box>
        </Box>
      </MenuItem>
      <MenuItem onClick={() => { onDashboard(); onClose(); }} sx={{ py: 1.5 }}><ListItemIcon sx={{ minWidth: 36, color: batmanColors.inkSub }}><Dashboard fontSize="small" /></ListItemIcon><Typography variant="body2" sx={{ color: darkMode ? batmanColors.ink : batmanColors.inkLight }}>Dashboard</Typography></MenuItem>
      <MenuItem onClick={() => { onSettings(); onClose(); }} sx={{ py: 1.5 }}><ListItemIcon sx={{ minWidth: 36, color: batmanColors.inkSub }}><Settings fontSize="small" /></ListItemIcon><Typography variant="body2" sx={{ color: darkMode ? batmanColors.ink : batmanColors.inkLight }}>Settings</Typography></MenuItem>
      <Divider sx={{ borderColor: batmanColors.gold, my: 1 }} />
      <MenuItem onClick={() => { onLogout(); onClose(); }} sx={{ py: 1.5, color: batmanColors.error }}><ListItemIcon sx={{ minWidth: 36, color: batmanColors.error }}><Logout fontSize="small" /></ListItemIcon><Typography variant="body2">Secure Logout</Typography></MenuItem>
    </Menu>
  );
};