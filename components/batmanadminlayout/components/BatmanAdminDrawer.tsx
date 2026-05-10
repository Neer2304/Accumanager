// components/batmanadminlayout/components/BatmanAdminDrawer.tsx
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
import { ChevronLeft, Shield } from '@mui/icons-material';
import Link from 'next/link';
import { User, NavItem, batmanColors } from './types';
import GoogleAMLogo from '@/components/GoogleAMLogo';

interface BatmanAdminDrawerProps {
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

export const BatmanAdminDrawer: React.FC<BatmanAdminDrawerProps> = ({
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
          backgroundColor: darkMode ? batmanColors.surface : batmanColors.surfaceLight,
          borderRight: `2px solid ${batmanColors.gold}`,
          boxShadow: isMobile ? 'none' : `4px 0 20px ${batmanColors.goldGlow}`,
        },
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `2px solid ${batmanColors.gold}`,
        minHeight: { xs: 56, sm: 64 },
        px: { xs: 2, sm: 3 },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <GoogleAMLogo size={28} darkMode={darkMode} />
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: batmanColors.gold,
              fontWeight: 800,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              letterSpacing: '0.1em',
            }}
          >
            GOTHAM ADMIN
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: batmanColors.gold }}>
          <ChevronLeft />
        </IconButton>
      </Toolbar>
      
      <Box sx={{ overflow: 'auto', height: 'calc(100vh - 64px)', pb: isMobile ? 8 : 0 }}>
        {user && (
          <Box sx={{ p: { xs: 2.5, sm: 3 }, borderBottom: `2px solid ${batmanColors.gold}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ width: { xs: 44, sm: 48 }, height: { xs: 44, sm: 48 }, backgroundColor: batmanColors.gold, color: darkMode ? '#0a0a0a' : '#fff', fontSize: { xs: 16, sm: 18 }, fontWeight: 800, border: `2px solid ${batmanColors.gold}` }}>
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ color: darkMode ? batmanColors.ink : batmanColors.inkLight, fontWeight: 700, fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? batmanColors.inkSub : batmanColors.inkSubLight, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
            <Chip icon={<Shield sx={{ fontSize: 14 }} />} label="AUTHORIZED PERSONNEL" size="small" sx={{ backgroundColor: alpha(batmanColors.gold, 0.15), color: batmanColors.gold, fontWeight: 700, border: `1px solid ${alpha(batmanColors.gold, 0.3)}` }} />
          </Box>
        )}

        <List sx={{ p: { xs: 1.5, sm: 2 } }}>
          <ListItem sx={{ p: 0, mb: 1 }}>
            <Typography variant="caption" sx={{ px: 2, color: batmanColors.gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
              🦇 MAIN PROTOCOLS
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
                      backgroundColor: alpha(batmanColors.gold, 0.15),
                      '&:hover': { backgroundColor: alpha(batmanColors.gold, 0.2) },
                    },
                    '&:hover': { backgroundColor: darkMode ? alpha(batmanColors.gold, 0.05) : alpha(batmanColors.gold, 0.03) },
                  }}
                >
                  <ListItemIcon sx={{ color: isSelected ? batmanColors.gold : (darkMode ? batmanColors.inkSub : batmanColors.inkSubLight), minWidth: { xs: 36, sm: 40 } }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isSelected ? 700 : 500, color: isSelected ? batmanColors.gold : (darkMode ? batmanColors.ink : batmanColors.inkLight), fontSize: { xs: '0.875rem', sm: '0.95rem' } }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ borderColor: batmanColors.gold, my: { xs: 2, sm: 2 } }} />

        <List sx={{ p: { xs: 1.5, sm: 2 } }}>
          <ListItem sx={{ p: 0, mb: 1 }}>
            <Typography variant="caption" sx={{ px: 2, color: batmanColors.gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
              QUICK EXTRACTION
            </Typography>
          </ListItem>
          {quickLinks.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={(e) => { e.preventDefault(); onNavigate(item.path); }} sx={{ borderRadius: '12px', py: { xs: 1.25, sm: 1.5 }, '&:hover': { backgroundColor: darkMode ? alpha(batmanColors.gold, 0.05) : alpha(batmanColors.gold, 0.03) } }}>
                <ListItemIcon sx={{ color: darkMode ? batmanColors.inkSub : batmanColors.inkSubLight, minWidth: { xs: 36, sm: 40 } }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ color: darkMode ? batmanColors.ink : batmanColors.inkLight, fontSize: { xs: '0.875rem', sm: '0.95rem' } }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Batman Quote */}
        <Box sx={{ p: 2, mt: 2, textAlign: 'center', borderTop: `2px solid ${batmanColors.gold}` }}>
          <Typography variant="caption" sx={{ color: batmanColors.gold, fontStyle: 'italic', fontSize: '0.7rem', letterSpacing: '0.03em' }}>
            🦇 &quot;I am vengeance. I am the night. I am Batman!&quot; 🦇
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};