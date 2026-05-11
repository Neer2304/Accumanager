// components/batmanprofile/components/BatmanProfileTabs.tsx
'use client';

import React from 'react';
import { Paper, Tabs, Tab } from '@mui/material';
import { Person as PersonIcon, Business as BusinessIcon, Notifications as NotificationsIcon, Security as SecurityIcon, Payment as PaymentIcon } from '@mui/icons-material';
import { batmanColors } from '../types';

interface BatmanProfileTabsProps {
  activeTab: number;
  onTabChange: (newValue: number) => void;
  isMobile?: boolean;
  darkMode?: boolean;
  children?: React.ReactNode;
}

export const BatmanProfileTabs: React.FC<BatmanProfileTabsProps> = ({ activeTab, onTabChange, isMobile, darkMode, children }) => {
  const tabs = [
    { icon: <PersonIcon />, label: isMobile ? "" : "Identity" },
    { icon: <BusinessIcon />, label: isMobile ? "" : "Enterprise" },
    { icon: <NotificationsIcon />, label: isMobile ? "" : "Alerts" },
    { icon: <SecurityIcon />, label: isMobile ? "" : "Security" },
    { icon: <PaymentIcon />, label: isMobile ? "" : "Membership" },
  ];

  return (
    <Paper sx={{ borderRadius: '20px', backgroundColor: batmanColors.surface, border: `2px solid ${batmanColors.gold}`, overflow: 'hidden' }}>
      <Tabs value={activeTab} onChange={(_, newValue) => onTabChange(newValue)} variant={isMobile ? "scrollable" : "fullWidth"} scrollButtons={isMobile ? "auto" : false} sx={{ borderBottom: `2px solid ${batmanColors.gold}`, backgroundColor: batmanColors.surface2, '& .MuiTab-root': { color: batmanColors.inkSub, fontWeight: 700, '&.Mui-selected': { color: batmanColors.gold } }, '& .MuiTabs-indicator': { backgroundColor: batmanColors.gold, height: 3 } }}>
        {tabs.map((tab, index) => (<Tab key={index} icon={tab.icon} label={tab.label} iconPosition="start" sx={{ minHeight: 64, letterSpacing: '0.05em' }} />))}
      </Tabs>
      {children}
    </Paper>
  );
};