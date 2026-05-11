// components/dpprofile/components/DpProfileTabs.tsx
'use client';

import React from 'react';
import { Paper, Tabs, Tab } from '@mui/material';
import { Person as PersonIcon, Business as BusinessIcon, Notifications as NotificationsIcon, Security as SecurityIcon, Payment as PaymentIcon } from '@mui/icons-material';
import { dpColors } from '../types';

interface DpProfileTabsProps {
  activeTab: number;
  onTabChange: (newValue: number) => void;
  isMobile?: boolean;
  darkMode?: boolean;
  children?: React.ReactNode;
}

export const DpProfileTabs: React.FC<DpProfileTabsProps> = ({ activeTab, onTabChange, isMobile, children }) => {
  const tabs = [
    { icon: <PersonIcon />, label: isMobile ? "" : "Personal Info" },
    { icon: <BusinessIcon />, label: isMobile ? "" : "Business Details" },
    { icon: <NotificationsIcon />, label: isMobile ? "" : "Notifications" },
    { icon: <SecurityIcon />, label: isMobile ? "" : "Security" },
    { icon: <PaymentIcon />, label: isMobile ? "" : "Subscription" },
  ];

  return (
    <Paper sx={{ borderRadius: '20px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.border}`, overflow: 'hidden' }}>
      <Tabs value={activeTab} onChange={(_, newValue) => onTabChange(newValue)} variant={isMobile ? "scrollable" : "fullWidth"} scrollButtons={isMobile ? "auto" : false} sx={{ borderBottom: `2px solid ${dpColors.border}`, backgroundColor: dpColors.surface2, '& .MuiTab-root': { color: dpColors.inkSub, '&.Mui-selected': { color: dpColors.red } }, '& .MuiTabs-indicator': { backgroundColor: dpColors.red, height: 3 } }}>
        {tabs.map((tab, index) => (<Tab key={index} icon={tab.icon} label={tab.label} iconPosition="start" sx={{ minHeight: 64, fontWeight: 700 }} />))}
      </Tabs>
      {children}
    </Paper>
  );
};