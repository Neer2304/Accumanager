// components/proadminlayout/components/ProAdminNavItems.tsx
import React from 'react';
import {
  Dashboard, People, Settings, Description, BarChart, AnalyticsSharp,
  Article, Assessment, Campaign, Home, Feed, TrendingUp, Store
} from '@mui/icons-material';
import { NavItem } from './types';

export const menuItems: NavItem[] = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/pro-admin/dashboard', mobileText: 'Home' },
  { text: 'Users', icon: <People />, path: '/pro-admin/users', mobileText: 'Users' },
  { text: 'Analytics', icon: <BarChart />, path: '/pro-admin/analytics', mobileText: 'Analytics' },
  { text: 'Legal Docs', icon: <Description />, path: '/pro-admin/legal', mobileText: 'Legal' },
  { text: 'Analysis', icon: <AnalyticsSharp />, path: '/pro-admin/analysis', mobileText: 'Analysis' },
  { text: 'Products', icon: <Store />, path: '/pro-admin/products', mobileText: 'Products' },
  { text: 'Blogs', icon: <Article />, path: '/pro-admin/blog', mobileText: 'Blogs' },
  { text: 'Reports', icon: <Assessment />, path: '/pro-admin/reports', mobileText: 'Reports' },
  { text: 'Advance Ads', icon: <Campaign />, path: '/pro-admin/advance', mobileText: 'Ads' },
  { text: 'Settings', icon: <Settings />, path: '/pro-admin/settings', mobileText: 'Settings' },
];

export const quickLinks: NavItem[] = [
  { text: 'Main Dashboard', icon: <Home />, path: '/dashboard', mobileText: 'Home' },
  { text: 'Recent Blogs', icon: <Feed />, path: '/pro-admin/blogs/recent', mobileText: 'Recent Blogs' },
  { text: 'Ad Performance', icon: <TrendingUp />, path: '/pro-admin/ads/performance', mobileText: 'Ad Performance' },
];

export const menuGroups = { main: menuItems.slice(0, 5), content: menuItems.slice(5, 8), marketing: menuItems.slice(8, 9), system: menuItems.slice(9) };