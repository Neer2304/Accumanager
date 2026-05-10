// components/dpadminlayout/components/DpAdminNavItems.tsx
import React from 'react';
import {
  Dashboard, People, Settings, Description, BarChart, AnalyticsSharp,
  Article, Assessment, Campaign, Home, Feed, TrendingUp, Store
} from '@mui/icons-material';
import { NavItem } from './types';

export const menuItems: NavItem[] = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dp-admin/dashboard', mobileText: 'Home' },
  { text: 'Users', icon: <People />, path: '/dp-admin/users', mobileText: 'Users' },
  { text: 'Analytics', icon: <BarChart />, path: '/dp-admin/analytics', mobileText: 'Stats' },
  { text: 'Legal Docs', icon: <Description />, path: '/dp-admin/legal', mobileText: 'Legal' },
  { text: 'Analysis', icon: <AnalyticsSharp />, path: '/dp-admin/analysis', mobileText: 'Analysis' },
  { text: 'Products', icon: <Store />, path: '/dp-admin/products', mobileText: 'Products' },
  { text: 'Blogs', icon: <Article />, path: '/dp-admin/blog', mobileText: 'Blogs' },
  { text: 'Reports', icon: <Assessment />, path: '/dp-admin/reports', mobileText: 'Reports' },
  { text: 'Chimichanga Ads', icon: <Campaign />, path: '/dp-admin/advance', mobileText: 'Ads' },
  { text: 'Settings', icon: <Settings />, path: '/dp-admin/settings', mobileText: 'Settings' },
];

export const quickLinks: NavItem[] = [
  { text: 'Main Dashboard', icon: <Home />, path: '/dashboard', mobileText: 'Home' },
  { text: 'Recent Blogs', icon: <Feed />, path: '/dp-admin/blogs/recent', mobileText: 'Recent' },
  { text: 'Ad Performance', icon: <TrendingUp />, path: '/dp-admin/ads/performance', mobileText: 'Ads' },
];