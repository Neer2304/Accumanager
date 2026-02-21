// components/googleadminlayout/components/AdminMobileBottomBar.tsx
import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Link,
  useTheme
} from '@mui/material';
import { NavItem, googleColors } from './types';

interface AdminMobileBottomBarProps {
  menuItems: NavItem[];
  pathname: string;
  darkMode: boolean;
  onNavigate: (path: string) => void;
}

export const AdminMobileBottomBar: React.FC<AdminMobileBottomBarProps> = ({
  menuItems,
  pathname,
  darkMode,
  onNavigate
}) => {
  const theme = useTheme();

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: darkMode ? googleColors.grey900 : 'white',
      borderTop: `1px solid ${darkMode ? googleColors.grey800 : googleColors.grey200}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      py: 1,
      zIndex: 1000,
    }}>
      {menuItems.slice(0, 4).map((item, index) => {
        const isSelected = pathname === item.path;
        return (
          <IconButton
            key={index}
            component={Link}
            href={item.path}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.path);
            }}
            sx={{
              color: isSelected ? googleColors.primary : (darkMode ? googleColors.grey400 : googleColors.grey600),
              flexDirection: 'column',
              borderRadius: 2,
              p: 1,
              minWidth: 64,
            }}
          >
            {item.icon}
            <Typography variant="caption" sx={{ 
              fontSize: '0.65rem',
              mt: 0.5,
              color: isSelected ? googleColors.primary : (darkMode ? googleColors.grey500 : googleColors.grey600),
            }}>
              {item.mobileText}
            </Typography>
          </IconButton>
        );
      })}
    </Box>
  );
};