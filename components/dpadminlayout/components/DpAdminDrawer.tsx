// components/dpadminlayout/components/DpAdminDrawer.tsx
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
import { User, NavItem, dpColors } from './types';
import GoogleAMLogo from '@/components/GoogleAMLogo';

interface DpAdminDrawerProps {
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

export const DpAdminDrawer: React.FC<DpAdminDrawerProps> = ({
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
          backgroundColor: darkMode ? dpColors.surface : dpColors.surfaceLight,
          borderRight: `2px solid ${darkMode ? dpColors.border : dpColors.borderLight}`,
          boxShadow: isMobile ? 'none' : `4px 0 20px ${dpColors.redGlow}`,
        },
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `2px solid ${darkMode ? dpColors.border : dpColors.borderLight}`,
        minHeight: { xs: 56, sm: 64 },
        px: { xs: 2, sm: 3 },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <GoogleAMLogo size={28} darkMode={darkMode} />
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: dpColors.ink,
              fontWeight: 800,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              textTransform: 'uppercase',
            }}
          >
            Deadpool Panel
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: dpColors.red }}>
          <ChevronLeft />
        </IconButton>
      </Toolbar>
      
      <Box sx={{ overflow: 'auto', height: 'calc(100vh - 64px)', pb: isMobile ? 8 : 0 }}>
        {user && (
          <Box sx={{ p: { xs: 2.5, sm: 3 }, borderBottom: `2px solid ${darkMode ? dpColors.border : dpColors.borderLight}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ width: { xs: 44, sm: 48 }, height: { xs: 44, sm: 48 }, backgroundColor: dpColors.red, fontSize: { xs: 16, sm: 18 }, fontWeight: 800, border: `2px solid ${dpColors.red}` }}>
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ color: dpColors.ink, fontWeight: 700, fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ color: dpColors.inkSub, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
            <Chip label="🦸 MERC WITH A MOUTH" size="small" sx={{ backgroundColor: alpha(dpColors.red, 0.15), color: dpColors.red, fontWeight: 700, border: `1px solid ${alpha(dpColors.red, 0.3)}` }} />
          </Box>
        )}

        <List sx={{ p: { xs: 1.5, sm: 2 } }}>
          <ListItem sx={{ p: 0, mb: 1 }}>
            <Typography variant="caption" sx={{ px: 2, color: dpColors.red, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
              MAIN NAVIGATION
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
                      backgroundColor: alpha(dpColors.red, 0.15),
                      '&:hover': { backgroundColor: alpha(dpColors.red, 0.2) },
                    },
                    '&:hover': { backgroundColor: darkMode ? alpha(dpColors.red, 0.05) : alpha(dpColors.red, 0.03) },
                  }}
                >
                  <ListItemIcon sx={{ color: isSelected ? dpColors.red : (darkMode ? dpColors.inkSub : dpColors.inkMuted), minWidth: { xs: 36, sm: 40 } }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isSelected ? 700 : 500, color: isSelected ? dpColors.red : (darkMode ? dpColors.ink : dpColors.inkSub), fontSize: { xs: '0.875rem', sm: '0.95rem' } }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ borderColor: darkMode ? dpColors.border : dpColors.borderLight, my: { xs: 2, sm: 2 } }} />

        <List sx={{ p: { xs: 1.5, sm: 2 } }}>
          <ListItem sx={{ p: 0, mb: 1 }}>
            <Typography variant="caption" sx={{ px: 2, color: dpColors.red, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
              QUICK LINKS
            </Typography>
          </ListItem>
          {quickLinks.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={(e) => { e.preventDefault(); onNavigate(item.path); }} sx={{ borderRadius: '12px', py: { xs: 1.25, sm: 1.5 }, '&:hover': { backgroundColor: darkMode ? alpha(dpColors.red, 0.05) : alpha(dpColors.red, 0.03) } }}>
                <ListItemIcon sx={{ color: darkMode ? dpColors.inkSub : dpColors.inkMuted, minWidth: { xs: 36, sm: 40 } }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ color: darkMode ? dpColors.ink : dpColors.inkSub, fontSize: { xs: '0.875rem', sm: '0.95rem' } }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Deadpool Quote */}
        <Box sx={{ p: 2, mt: 2, textAlign: 'center', borderTop: `1px solid ${darkMode ? dpColors.border : dpColors.borderLight}` }}>
          <Typography variant="caption" sx={{ color: dpColors.red, fontStyle: 'italic', fontSize: '0.7rem' }}>
            &quot;Maximum effort, minimum bugs!&quot; 🦸
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};