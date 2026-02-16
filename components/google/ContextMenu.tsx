// components/google/ContextMenu.tsx
"use client";

import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
  SxProps,
  Theme,
} from '@mui/material';

interface MenuAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
  divider?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  actions: MenuAction[];
  sx?: SxProps<Theme>;
}

export function ContextMenu({
  anchorEl,
  open,
  onClose,
  actions,
  sx,
}: ContextMenuProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  // Helper function to convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '66, 133, 244'; // fallback to Google blue
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode
            ? '0 8px 16px rgba(0, 0, 0, 0.4)'
            : '0 8px 16px rgba(0, 0, 0, 0.08)',
          mt: 1,
          minWidth: 180,
          ...sx,
        },
      }}
    >
      {actions.map((action, index) => {
        const menuItems = [];
        
        // Add the menu item
        menuItems.push(
          <MenuItem
            key={`item-${index}`}
            onClick={() => {
              action.onClick();
              onClose();
            }}
            disabled={action.disabled}
            sx={{
              py: 1.5,
              px: 2.5,
              color: action.color || (darkMode ? '#e8eaed' : '#202124'),
              '&:hover': {
                backgroundColor: action.color
                  ? darkMode
                    ? `rgba(${hexToRgb(action.color)}, 0.1)`
                    : `rgba(${hexToRgb(action.color)}, 0.05)`
                  : darkMode
                  ? 'rgba(138, 180, 248, 0.1)'
                  : 'rgba(26, 115, 232, 0.05)',
              },
            }}
          >
            <ListItemIcon>
              {React.cloneElement(action.icon as React.ReactElement, {
                // sx: {
                //   fontSize: 'small',
                //   color: action.color || (darkMode ? '#8ab4f8' : '#1a73e8'),
                // },
              })}
            </ListItemIcon>
            <ListItemText>
              <Typography
                variant="body2"
                fontWeight={action.color ? 500 : 400}
                sx={{ color: 'inherit' }}
              >
                {action.label}
              </Typography>
            </ListItemText>
          </MenuItem>
        );

        // Add divider if needed and not the last item
        if (action.divider && index < actions.length - 1) {
          menuItems.push(
            <Divider 
              key={`divider-${index}`} 
              sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} 
            />
          );
        }

        return menuItems;
      }).flat()}
    </Menu>
  );
}