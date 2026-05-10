// components/proadmindashboard/hooks/useProAdminDashboard.ts
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Description as DescriptionIcon,
  Analytics as AnalyticsIcon,
  Inventory as InventoryIcon,
  Support as SupportIcon,
  Settings as SettingsIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { AdminCardItem, DashboardStats } from '../components/types';

const PRO_COLORS = {
  blue: '#1a73e8',
  green: '#34a853',
  yellow: '#fbbc04',
  red: '#ea4335',
  purple: '#7c4dff',
  orange: '#fa903e',
  teal: '#00acc1',
  grey: '#5f6368'
};

export const useProAdminDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 456789,
    pendingTasks: 23
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const usersResponse = await fetch('/api/admin/users/stats', { credentials: 'include' });
        const productsResponse = await fetch('/api/admin/products/stats', { credentials: 'include' });
        
        let usersData = { totalUsers: 1250 };
        let productsData = { totalProducts: 342 };
        
        if (usersResponse.ok) {
          usersData = await usersResponse.json();
        }
        if (productsResponse.ok) {
          productsData = await productsResponse.json();
        }
        
        setStats({
          totalUsers: usersData.totalUsers || 1250,
          totalProducts: productsData.totalProducts || 342,
          totalRevenue: 456789,
          pendingTasks: 23
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({ 
          totalUsers: 1250, 
          totalProducts: 342, 
          totalRevenue: 456789, 
          pendingTasks: 23 
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const adminCards: AdminCardItem[] = [
    { 
      id: 'dashboard', 
      title: 'Main Dashboard', 
      description: 'Overview of your business metrics and performance', 
      icon: React.createElement(DashboardIcon), 
      path: '/dashboard', 
      color: PRO_COLORS.blue, 
      stats: 'Home' 
    },
    { 
      id: 'users', 
      title: 'User Management', 
      description: 'Manage users, roles, and permissions', 
      icon: React.createElement(PeopleIcon), 
      path: '/pro-admin/users', 
      color: PRO_COLORS.green, 
      stats: stats.totalUsers 
    },
    { 
      id: 'analytics', 
      title: 'Analytics Dashboard', 
      description: 'Real-time business insights and metrics', 
      icon: React.createElement(BarChartIcon), 
      path: '/pro-admin/analytics', 
      color: PRO_COLORS.purple, 
      stats: 'Reports' 
    },
    { 
      id: 'legal', 
      title: 'Legal Documents', 
      description: 'Manage privacy policy, terms, and legal docs', 
      icon: React.createElement(DescriptionIcon), 
      path: '/pro-admin/legal', 
      color: PRO_COLORS.orange, 
      stats: '5 Documents' 
    },
    { 
      id: 'analysis', 
      title: 'Deep Analysis', 
      description: 'In-depth data analysis and insights', 
      icon: React.createElement(AnalyticsIcon), 
      path: '/pro-admin/analysis', 
      color: PRO_COLORS.teal, 
      stats: 'Reports' 
    },
    { 
      id: 'products', 
      title: 'Product Management', 
      description: 'Manage products, inventory, and categories', 
      icon: React.createElement(InventoryIcon), 
      path: '/pro-admin/products', 
      color: PRO_COLORS.yellow, 
      stats: stats.totalProducts 
    },
    { 
      id: 'support', 
      title: 'Support Center', 
      description: 'Manage support tickets and inquiries', 
      icon: React.createElement(SupportIcon), 
      path: '/pro-admin/support', 
      color: PRO_COLORS.red, 
      stats: '3 Tickets' 
    },
    { 
      id: 'settings', 
      title: 'System Settings', 
      description: 'Configure application settings and preferences', 
      icon: React.createElement(SettingsIcon), 
      path: '/pro-admin/settings', 
      color: PRO_COLORS.grey, 
      stats: 'Configuration' 
    },
    { 
      id: 'invoices', 
      title: 'Invoices', 
      description: 'Manage and track all invoices', 
      icon: React.createElement(ReceiptIcon), 
      path: '/pro-admin/invoices', 
      color: PRO_COLORS.green, 
      stats: '₹' + stats.totalRevenue.toLocaleString() 
    },
    { 
      id: 'reports', 
      title: 'Reports', 
      description: 'Generate and download custom reports', 
      icon: React.createElement(AssessmentIcon), 
      path: '/pro-admin/reports', 
      color: PRO_COLORS.blue, 
      stats: 'Export Data' 
    }
  ];

  const handleCardClick = (path: string) => { 
    router.push(path); 
  };

  return { 
    loading, 
    stats, 
    adminCards, 
    handleCardClick 
  };
};