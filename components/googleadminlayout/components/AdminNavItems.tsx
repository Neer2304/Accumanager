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
  SupportAgent,
  Report,
  Article,
  Campaign,
  Assessment,
  Feed,
  Newspaper,
  TrendingUp,
  BusinessCenter,
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
    text: 'Blogs',
    icon: <Article />,
    path: '/admin/blog',
    mobileText: 'Blogs',
  },
  {
    text: 'Reports',
    icon: <Assessment />,
    path: '/admin/reports',
    mobileText: 'Reports',
  },
  {
    text: 'Advance Ads',
    icon: <Campaign />,
    path: '/admin/advance',
    mobileText: 'Ads',
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
  },
  {
    text: 'Recent Blogs',
    icon: <Feed />,
    path: '/admin/blogs/recent',
    mobileText: 'Recent Blogs'
  },
  {
    text: 'Ad Performance',
    icon: <TrendingUp />,
    path: '/admin/ads/performance',
    mobileText: 'Ad Performance'
  }
];

// Optional: Grouped menu items for better organization
export const menuGroups = {
  main: menuItems.slice(0, 5), // First 5 items
  content: menuItems.slice(5, 8), // Products, Blogs, Reports
  marketing: menuItems.slice(8, 9), // Ads
  system: menuItems.slice(9), // Support, Settings
};