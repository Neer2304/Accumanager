// components/googleadminlayout/components/AdminNavItems.tsx
import React from 'react';
import {
  Dashboard,
  People,
  Settings,
  Store,
  Description,
  BarChart,
  AnalyticsSharp,
  Home,
} from '@mui/icons-material';
import { ProductIcon } from '@/components/common';
import { Support } from '@/assets/icons/HelpSupportIcons';
import { NavItem } from './types';

export const menuItems: NavItem[] = [
  { 
    text: 'Dashboard', 
    icon: <Dashboard />, 
    path: '/admin/dashboard',
    mobileText: 'Dashboard'
  },
  { 
    text: 'Users', 
    icon: <People />, 
    path: '/admin/users',
    mobileText: 'Users'
  },
  { 
    text: 'Analytics', 
    icon: <BarChart />, 
    path: '/admin/analytics',
    mobileText: 'Analytics'
  },
  { 
    text: 'Legal Docs', 
    icon: <Description />, 
    path: '/admin/legal',
    mobileText: 'Legal'
  },
  {
    text: 'Analysis',
    icon: <AnalyticsSharp />,
    path: '/admin/analysis',
    mobileText: 'Analysis'
  },
  {
    text: 'Products',
    icon: <ProductIcon />,
    path: '/admin/products',
    mobileText: 'Products'
  },
  {
    text: 'Support',
    icon: <Support/>,
    path: '/admin/support',
    mobileText: 'Support'
  },
  { 
    text: 'Settings', 
    icon: <Settings />, 
    path: '/admin/settings',
    mobileText: 'Settings'
  },
];

export const quickLinks: NavItem[] = [
  {
    text: 'Main Dashboard',
    icon: <Home />,
    path: '/dashboard',
    mobileText: 'Home'
  }
];