// components/batmanadminlayout/components/BatmanAdminNavItems.tsx
import React from 'react';
import {
  Dashboard, People, Settings, Description, BarChart, AnalyticsSharp,
  Article, Assessment, Campaign, Home, Feed, TrendingUp, Store
} from '@mui/icons-material';
import { NavItem } from './types';

export const menuItems: NavItem[] = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/batman-admin/dashboard', mobileText: 'Home' },
  { text: 'Users', icon: <People />, path: '/batman-admin/users', mobileText: 'Users' },
  { text: 'Analytics', icon: <BarChart />, path: '/batman-admin/analytics', mobileText: 'Analytics' },
  { text: 'Legal Docs', icon: <Description />, path: '/batman-admin/legal', mobileText: 'Legal' },
  { text: 'Analysis', icon: <AnalyticsSharp />, path: '/batman-admin/analysis', mobileText: 'Analysis' },
  { text: 'Products', icon: <Store />, path: '/batman-admin/products', mobileText: 'Products' },
  { text: 'Blogs', icon: <Article />, path: '/batman-admin/blog', mobileText: 'Blogs' },
  { text: 'Reports', icon: <Assessment />, path: '/batman-admin/reports', mobileText: 'Reports' },
  { text: 'Gotham Ads', icon: <Campaign />, path: '/batman-admin/advance', mobileText: 'Ads' },
  { text: 'Settings', icon: <Settings />, path: '/batman-admin/settings', mobileText: 'Settings' },
];

export const quickLinks: NavItem[] = [
  { text: 'Main Dashboard', icon: <Home />, path: '/dashboard', mobileText: 'Home' },
  { text: 'Recent Blogs', icon: <Feed />, path: '/batman-admin/blogs/recent', mobileText: 'Recent' },
  { text: 'Ad Performance', icon: <TrendingUp />, path: '/batman-admin/ads/performance', mobileText: 'Ads' },
];