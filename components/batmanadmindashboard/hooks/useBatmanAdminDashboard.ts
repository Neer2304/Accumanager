// components/batmanadmindashboard/hooks/useBatmanAdminDashboard.ts
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
import { AdminCardItem, DashboardStats, batmanColors } from '../components/types';

export const useBatmanAdminDashboard = () => {
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
      title: 'Batcomputer', 
      description: 'Overview of Gotham\'s business metrics and performance', 
      icon: React.createElement(DashboardIcon), 
      path: '/dashboard', 
      color: batmanColors.gold, 
      stats: 'Home 🦇' 
    },
    { 
      id: 'users', 
      title: 'Citizen Records', 
      description: 'Manage users, roles, and permissions in Gotham', 
      icon: React.createElement(PeopleIcon), 
      path: '/batman-admin/users', 
      color: batmanColors.gold, 
      stats: stats.totalUsers 
    },
    { 
      id: 'analytics', 
      title: 'Gotham Analytics', 
      description: 'Real-time business insights and crime statistics', 
      icon: React.createElement(BarChartIcon), 
      path: '/batman-admin/analytics', 
      color: batmanColors.gold, 
      stats: 'Reports' 
    },
    { 
      id: 'legal', 
      title: 'Legal Vault', 
      description: 'Manage privacy policy, terms, and legal documents', 
      icon: React.createElement(DescriptionIcon), 
      path: '/batman-admin/legal', 
      color: batmanColors.gold, 
      stats: '5 Documents' 
    },
    { 
      id: 'analysis', 
      title: 'Deep Analysis', 
      description: 'In-depth data analysis and insights', 
      icon: React.createElement(AnalyticsIcon), 
      path: '/batman-admin/analysis', 
      color: batmanColors.gold, 
      stats: 'Reports 🔍' 
    },
    { 
      id: 'products', 
      title: 'Wayne Products', 
      description: 'Manage products, inventory, and categories', 
      icon: React.createElement(InventoryIcon), 
      path: '/batman-admin/products', 
      color: batmanColors.gold, 
      stats: stats.totalProducts 
    },
    { 
      id: 'support', 
      title: 'Gotham Support', 
      description: 'Manage support tickets and inquiries', 
      icon: React.createElement(SupportIcon), 
      path: '/batman-admin/support', 
      color: batmanColors.gold, 
      stats: '3 Tickets' 
    },
    { 
      id: 'settings', 
      title: 'Bat-Settings', 
      description: 'Configure application settings and preferences', 
      icon: React.createElement(SettingsIcon), 
      path: '/batman-admin/settings', 
      color: batmanColors.gold, 
      stats: 'Configuration' 
    },
    { 
      id: 'invoices', 
      title: 'Wayne Invoices', 
      description: 'Manage and track all invoices', 
      icon: React.createElement(ReceiptIcon), 
      path: '/batman-admin/invoices', 
      color: batmanColors.gold, 
      stats: '₹' + stats.totalRevenue.toLocaleString() 
    },
    { 
      id: 'reports', 
      title: 'Bat-Reports', 
      description: 'Generate and download custom reports', 
      icon: React.createElement(AssessmentIcon), 
      path: '/batman-admin/reports', 
      color: batmanColors.gold, 
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