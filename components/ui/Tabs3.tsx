// components/ui/Tab.tsx
"use client";

import React from 'react';
import {
  Tabs as MuiTabs,
  Tab as MuiTab,
  Box,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';

interface TabItem {
  label: string;
  icon?: React.ReactNode;
  count?: number;
  disabled?: boolean;
  badgeColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

interface TabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  tabs: TabItem[];
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  orientation?: 'horizontal' | 'vertical';
  centered?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  onChange,
  tabs,
  variant = 'standard',
  orientation = 'horizontal',
  centered = false,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        width: '100%',
        '& .MuiTabs-root': {
          minHeight: 48,
        },
        '& .MuiTab-root': {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 48,
          color: darkMode ? '#9aa0a6' : '#5f6368',
          '&.Mui-selected': {
            color: darkMode ? '#8ab4f8' : '#1a73e8',
            fontWeight: 600,
          },
          '&:hover': {
            backgroundColor: darkMode
              ? 'rgba(138, 180, 248, 0.08)'
              : 'rgba(26, 115, 232, 0.04)',
          },
        },
        '& .MuiTabs-indicator': {
          backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      }}
    >
      <MuiTabs
        value={value}
        onChange={onChange}
        variant={isMobile ? 'scrollable' : variant}
        scrollButtons={isMobile ? 'auto' : false}
        orientation={orientation}
        centered={centered}
        sx={{
          borderBottom: darkMode
            ? '1px solid #3c4043'
            : '1px solid #dadce0',
        }}
      >
        {tabs.map((tab, index) => (
          <MuiTab
            key={index}
            label={
              tab.count !== undefined ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{tab.label}</span>
                  <Badge
                    badgeContent={tab.count}
                    color={tab.badgeColor || 'primary'}
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.6rem',
                        height: '18px',
                        minWidth: '18px',
                      },
                    }}
                  />
                </Box>
              ) : (
                tab.label
              )
            }
            // icon={tab.icon}
            iconPosition="start"
            disabled={tab.disabled}
          />
        ))}
      </MuiTabs>
    </Box>
  );
};