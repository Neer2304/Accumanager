// components/googleadmindashboard/hooks/useAdminDashboard.ts
import { useState, useEffect } from 'react';
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

// Google Material Design Colors
const GOOGLE_COLORS = {
  blue: '#1a73e8',
  green: '#34a853',
  yellow: '#fbbc04',
  red: '#ea4335',
  purple: '#7c4dff',
  orange: '#fa903e',
  teal: '#00acc1',
  grey: '#5f6368'
};

export const useAdminDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 456789,
    pendingTasks: 23
  });

  // Fetch actual data from APIs
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch users count
        const usersResponse = await fetch('/api/admin/users/stats', {
          credentials: 'include',
        });
        
        // Fetch products count  
        const productsResponse = await fetch('/api/admin/products/stats', {
          credentials: 'include',
        });

        const usersData = await usersResponse.json();
        const productsData = await productsResponse.json();

        setStats({
          totalUsers: usersData.totalUsers || 1250,
          totalProducts: productsData.totalProducts || 342,
          totalRevenue: 456789,
          pendingTasks: 23
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to mock data
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

  // Admin cards with their paths
  const adminCards: AdminCardItem[] = [
    {
      id: 'dashboard',
      title: 'Main Dashboard',
      description: 'Overview of your business metrics and performance',
      icon: <DashboardIcon />,
      path: '/dashboard',
      color: GOOGLE_COLORS.blue,
      stats: 'Home'
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: <PeopleIcon />,
      path: '/admin/users',
      color: GOOGLE_COLORS.green,
      stats: stats.totalUsers
    },
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      description: 'Real-time business insights and metrics',
      icon: <BarChartIcon />,
      path: '/admin/analytics',
      color: GOOGLE_COLORS.purple,
      stats: 'Reports'
    },
    {
      id: 'legal',
      title: 'Legal Documents',
      description: 'Manage privacy policy, terms, and legal docs',
      icon: <DescriptionIcon />,
      path: '/admin/legal',
      color: GOOGLE_COLORS.orange,
      stats: '5 Documents'
    },
    {
      id: 'analysis',
      title: 'Deep Analysis',
      description: 'In-depth data analysis and insights',
      icon: <AnalyticsIcon />,
      path: '/admin/analysis',
      color: GOOGLE_COLORS.teal,
      stats: 'Reports'
    },
    {
      id: 'products',
      title: 'Product Management',
      description: 'Manage products, inventory, and categories',
      icon: <InventoryIcon />,
      path: '/admin/products',
      color: GOOGLE_COLORS.yellow,
      stats: stats.totalProducts
    },
    {
      id: 'support',
      title: 'Support Center',
      description: 'Manage support tickets and inquiries',
      icon: <SupportIcon />,
      path: '/admin/support',
      color: GOOGLE_COLORS.red,
      stats: '3 Tickets'
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'Configure application settings and preferences',
      icon: <SettingsIcon />,
      path: '/admin/settings',
      color: GOOGLE_COLORS.grey,
      stats: 'Configuration'
    },
    {
      id: 'invoices',
      title: 'Invoices',
      description: 'Manage and track all invoices',
      icon: <ReceiptIcon />,
      path: '/admin/invoices',
      color: GOOGLE_COLORS.green,
      stats: '₹' + stats.totalRevenue.toLocaleString()
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Generate and download custom reports',
      icon: <AssessmentIcon />,
      path: '/admin/reports',
      color: GOOGLE_COLORS.blue,
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