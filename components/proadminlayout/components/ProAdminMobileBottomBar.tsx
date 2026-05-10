// components/proadminlayout/components/ProAdminMobileBottomBar.tsx
import React from 'react';
import { Box, IconButton, Typography, Link } from '@mui/material';
import { NavItem, proColors } from './types';

interface ProAdminMobileBottomBarProps {
  menuItems: NavItem[];
  pathname: string;
  darkMode: boolean;
  onNavigate: (path: string) => void;
}

export const ProAdminMobileBottomBar: React.FC<ProAdminMobileBottomBarProps> = ({ menuItems, pathname, darkMode, onNavigate }) => {
  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: darkMode ? proColors.grey900 : 'white', borderTop: `1px solid ${darkMode ? proColors.grey800 : proColors.grey200}`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', py: 1, zIndex: 1000 }}>
      {menuItems.slice(0, 5).map((item, index) => {
        const isSelected = pathname === item.path;
        return (
          <IconButton key={index} component={Link} href={item.path} onClick={(e) => { e.preventDefault(); onNavigate(item.path); }} sx={{ color: isSelected ? proColors.primary : (darkMode ? proColors.grey400 : proColors.grey600), flexDirection: 'column', borderRadius: 2, p: 1, minWidth: 64 }}>
            {item.icon}
            <Typography variant="caption" sx={{ fontSize: '0.65rem', mt: 0.5, color: isSelected ? proColors.primary : (darkMode ? proColors.grey500 : proColors.grey600) }}>{item.mobileText || item.text}</Typography>
          </IconButton>
        );
      })}
    </Box>
  );
};