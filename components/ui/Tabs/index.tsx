// components/ui/Tabs/index.tsx - FIXED
"use client";

import React from 'react';
import { 
  Tabs as MuiTabs, 
  Tab as MuiTab, 
  TabsProps as MuiTabsProps, 
  TabProps as MuiTabProps,
  Box,
  alpha,
  useTheme,
  Typography,
} from '@mui/material';

interface TabsProps extends MuiTabsProps {
  tabs: Array<{
    label: string;
    icon?: React.ReactNode;
    count?: number;
    disabled?: boolean;
    badgeColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  }>;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  centered?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  onChange,
  variant = 'scrollable',
  centered = false,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const getBadgeColor = (badgeColor?: string) => {
    switch (badgeColor) {
      case 'primary': return '#4285f4';
      case 'secondary': return '#34a853';
      case 'error': return '#ea4335';
      case 'warning': return '#fbbc04';
      case 'info': return '#8ab4f8';
      case 'success': return '#34a853';
      default: return '#34a853';
    }
  };

  return (
    <MuiTabs
      value={value}
      onChange={onChange}
      variant={variant}
      centered={centered}
      sx={{
        minHeight: 48,
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        '& .MuiTabs-indicator': {
          height: 3,
          borderRadius: '3px 3px 0 0',
          backgroundColor: '#4285f4',
        },
        '& .MuiTabs-scroller': {
          overflow: 'visible !important',
        },
        ...sx,
      }}
      {...props}
    >
      {tabs.map((tab, index) => {
        const badgeColor = getBadgeColor(tab.badgeColor);
        
        return (
          <MuiTab
            key={index}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {tab.icon && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {tab.icon}
                  </Box>
                )}
                <Typography component="span" variant="body2">
                  {tab.label}
                </Typography>
                {tab.count !== undefined && (
                  <Box
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      backgroundColor: alpha(badgeColor, 0.1),
                      color: badgeColor,
                    }}
                  >
                    {tab.count}
                  </Box>
                )}
              </Box>
            }
            iconPosition="start"
            disabled={tab.disabled}
            sx={{
              minHeight: 48,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              minWidth: 'auto',
              px: 2,
              color: darkMode ? '#9aa0a6' : '#5f6368',
              opacity: 1,
              '&.Mui-selected': {
                color: darkMode ? '#e8eaed' : '#202124',
                fontWeight: 600,
              },
              '&.Mui-disabled': {
                color: darkMode ? '#5f6368' : '#9aa0a6',
                opacity: 0.5,
              },
            }}
          />
        );
      })}
    </MuiTabs>
  );
};

export const Tab: React.FC<MuiTabProps> = (props) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <MuiTab
      {...props}
      sx={{
        textTransform: 'none',
        minHeight: 48,
        fontSize: '0.875rem',
        fontWeight: 500,
        color: darkMode ? '#9aa0a6' : '#5f6368',
        '&.Mui-selected': {
          color: darkMode ? '#e8eaed' : '#202124',
          fontWeight: 600,
        },
        ...props.sx,
      }}
    />
  );
};