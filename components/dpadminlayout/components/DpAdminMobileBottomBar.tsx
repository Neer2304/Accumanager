// components/dpadminlayout/components/DpAdminMobileBottomBar.tsx
import React from 'react';
import { Box, IconButton, Typography, Link } from '@mui/material';
import { NavItem, dpColors } from './types';

interface DpAdminMobileBottomBarProps {
  menuItems: NavItem[];
  pathname: string;
  darkMode: boolean;
  onNavigate: (path: string) => void;
}

export const DpAdminMobileBottomBar: React.FC<DpAdminMobileBottomBarProps> = ({ menuItems, pathname, darkMode, onNavigate }) => {
  return (
    <Box sx={{ 
      position: 'fixed', bottom: 0, left: 0, right: 0, 
      backgroundColor: darkMode ? dpColors.surface : dpColors.surfaceLight, 
      borderTop: `2px solid ${darkMode ? dpColors.border : dpColors.borderLight}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around', py: 1, zIndex: 1000,
    }}>
      {menuItems.slice(0, 5).map((item, index) => {
        const isSelected = pathname === item.path;
        return (
          <IconButton key={index} component={Link} href={item.path} onClick={(e) => { e.preventDefault(); onNavigate(item.path); }} sx={{ color: isSelected ? dpColors.red : (darkMode ? dpColors.inkSub : dpColors.inkMuted), flexDirection: 'column', borderRadius: 2, p: 1, minWidth: 64 }}>
            {item.icon}
            <Typography variant="caption" sx={{ fontSize: '0.65rem', mt: 0.5, color: isSelected ? dpColors.red : (darkMode ? dpColors.inkSub : dpColors.inkMuted), fontWeight: isSelected ? 700 : 400 }}>{item.mobileText || item.text}</Typography>
          </IconButton>
        );
      })}
    </Box>
  );
};