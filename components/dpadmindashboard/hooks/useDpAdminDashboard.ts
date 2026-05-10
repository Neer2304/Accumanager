// components/dpadmindashboard/hooks/useDpAdminDashboard.ts
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
import { AdminCardItem, DashboardStats, dpColors } from '../components/types';

export const useDpAdminDashboard = () => {
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
      description: 'Maximum effort overview of your business', 
      icon: React.createElement(DashboardIcon), 
      path: '/dashboard', 
      color: dpColors.red, 
      stats: 'Home 🦸' 
    },
    { 
      id: 'users', 
      title: 'User Management', 
      description: 'Manage users, roles, and permissions (No chimichangas allowed)', 
      icon: React.createElement(PeopleIcon), 
      path: '/dp-admin/users', 
      color: dpColors.red, 
      stats: stats.totalUsers 
    },
    { 
      id: 'analytics', 
      title: 'Analytics Dashboard', 
      description: 'Real-time business insights (I\'m watching you)', 
      icon: React.createElement(BarChartIcon), 
      path: '/dp-admin/analytics', 
      color: dpColors.red, 
      stats: 'Reports 📊' 
    },
    { 
      id: 'legal', 
      title: 'Legal Documents', 
      description: 'Manage privacy policy, terms (Boring but necessary)', 
      icon: React.createElement(DescriptionIcon), 
      path: '/dp-admin/legal', 
      color: dpColors.red, 
      stats: '5 Docs 📄' 
    },
    { 
      id: 'analysis', 
      title: 'Deep Analysis', 
      description: 'In-depth data analysis (Deep thoughts with Deadpool)', 
      icon: React.createElement(AnalyticsIcon), 
      path: '/dp-admin/analysis', 
      color: dpColors.red, 
      stats: 'Reports 🔍' 
    },
    { 
      id: 'products', 
      title: 'Product Management', 
      description: 'Manage products, inventory (No chimichangas in stock?)', 
      icon: React.createElement(InventoryIcon), 
      path: '/dp-admin/products', 
      color: dpColors.red, 
      stats: stats.totalProducts 
    },
    { 
      id: 'support', 
      title: 'Support Center', 
      description: 'Manage support tickets (Don\'t be a Karen)', 
      icon: React.createElement(SupportIcon), 
      path: '/dp-admin/support', 
      color: dpColors.red, 
      stats: '3 Tickets 🎫' 
    },
    { 
      id: 'settings', 
      title: 'System Settings', 
      description: 'Configure settings (Don\'t break it!)', 
      icon: React.createElement(SettingsIcon), 
      path: '/dp-admin/settings', 
      color: dpColors.red, 
      stats: 'Config ⚙️' 
    },
    { 
      id: 'invoices', 
      title: 'Invoices', 
      description: 'Manage and track all invoices (Cha-ching!)', 
      icon: React.createElement(ReceiptIcon), 
      path: '/dp-admin/invoices', 
      color: dpColors.red, 
      stats: '₹' + stats.totalRevenue.toLocaleString() 
    },
    { 
      id: 'reports', 
      title: 'Reports', 
      description: 'Generate custom reports (Boring but somebody\'s gotta do it)', 
      icon: React.createElement(AssessmentIcon), 
      path: '/dp-admin/reports', 
      color: dpColors.red, 
      stats: 'Export 📁' 
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