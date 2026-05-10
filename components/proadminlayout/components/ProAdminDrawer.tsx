// components/proadminlayout/components/ProAdminDrawer.tsx
import React from 'react';
import {
  Drawer,
  Toolbar,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  alpha,
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import Link from 'next/link';
import { User, NavItem, proColors } from './types';
import GoogleAMLogo from '@/components/GoogleAMLogo';

interface ProAdminDrawerProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  menuItems: NavItem[];
  quickLinks: NavItem[];
  pathname: string;
  isMobile: boolean;
  darkMode: boolean;
  onNavigate: (path: string) => void;
}

export const ProAdminDrawer: React.FC<ProAdminDrawerProps> = ({
  open,
  onClose,
  user,
  menuItems,
  quickLinks,
  pathname,
  isMobile,
  darkMode,
  onNavigate
}) => {
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 280 },
          maxWidth: { xs: '100%', sm: 280 },
          boxSizing: 'border-box',
          backgroundColor: darkMode ? proColors.grey900 : 'white',
          borderRight: `1px solid ${darkMode ? proColors.grey800 : proColors.grey200}`,
          boxShadow: isMobile ? 'none' : '4px 0 20px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${darkMode ? proColors.grey800 : proColors.grey200}`,
        minHeight: { xs: 56, sm: 64 },
        px: { xs: 2, sm: 3 },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <GoogleAMLogo size={28} darkMode={darkMode} />
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: darkMode ? proColors.grey200 : proColors.grey900,
              fontWeight: 500,
              fontSize: { xs: '1rem', sm: '1.125rem' },
            }}
          >
            Admin Panel
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: darkMode ? proColors.grey500 : proColors.grey600 }}>
          <ChevronLeft />
        </IconButton>
      </Toolbar>
      
      <Box sx={{ overflow: 'auto', height: 'calc(100vh - 64px)', pb: isMobile ? 8 : 0 }}>
        {user && (
          <Box sx={{ p: { xs: 2.5, sm: 3 }, borderBottom: `1px solid ${darkMode ? proColors.grey800 : proColors.grey200}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ width: { xs: 44, sm: 48 }, height: { xs: 44, sm: 48 }, backgroundColor: proColors.primary, fontSize: { xs: 16, sm: 18 }, fontWeight: 600 }}>
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ color: darkMode ? proColors.grey200 : proColors.grey900, fontWeight: 600, fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? proColors.grey500 : proColors.grey600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
            <Chip label="Administrator" size="small" sx={{ backgroundColor: alpha(proColors.primary, 0.1), color: proColors.primary, fontWeight: 500, border: `1px solid ${alpha(proColors.primary, 0.3)}` }} />
          </Box>
        )}

        <List sx={{ p: { xs: 1.5, sm: 2 } }}>
          <ListItem sx={{ p: 0, mb: 1 }}>
            <Typography variant="caption" sx={{ px: 2, color: darkMode ? proColors.grey500 : proColors.grey600, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
              Main Navigation
            </Typography>
          </ListItem>
          
          {menuItems.map((item) => {
            const isSelected = pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  selected={isSelected}
                  onClick={(e) => { e.preventDefault(); onNavigate(item.path); }}
                  sx={{
                    borderRadius: '12px',
                    py: { xs: 1.25, sm: 1.5 },
                    '&.Mui-selected': {
                      backgroundColor: alpha(proColors.primary, darkMode ? 0.2 : 0.1),
                      '&:hover': { backgroundColor: alpha(proColors.primary, darkMode ? 0.25 : 0.15) },
                    },
                    '&:hover': { backgroundColor: darkMode ? proColors.grey800 : proColors.grey100 },
                  }}
                >
                  <ListItemIcon sx={{ color: isSelected ? proColors.primary : (darkMode ? proColors.grey400 : proColors.grey600), minWidth: { xs: 36, sm: 40 } }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isSelected ? 600 : 400, color: isSelected ? proColors.primary : (darkMode ? proColors.grey300 : proColors.grey700), fontSize: { xs: '0.875rem', sm: '0.95rem' } }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ borderColor: darkMode ? proColors.grey800 : proColors.grey200, my: { xs: 2, sm: 2 } }} />

        <List sx={{ p: { xs: 1.5, sm: 2 } }}>
          <ListItem sx={{ p: 0, mb: 1 }}>
            <Typography variant="caption" sx={{ px: 2, color: darkMode ? proColors.grey500 : proColors.grey600, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
              Quick Links
            </Typography>
          </ListItem>
          {quickLinks.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={(e) => { e.preventDefault(); onNavigate(item.path); }} sx={{ borderRadius: '12px', py: { xs: 1.25, sm: 1.5 }, '&:hover': { backgroundColor: darkMode ? proColors.grey800 : proColors.grey100 } }}>
                <ListItemIcon sx={{ color: darkMode ? proColors.grey400 : proColors.grey600, minWidth: { xs: 36, sm: 40 } }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ color: darkMode ? proColors.grey300 : proColors.grey700, fontSize: { xs: '0.875rem', sm: '0.95rem' } }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};