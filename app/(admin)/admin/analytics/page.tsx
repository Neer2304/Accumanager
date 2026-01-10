// app/admin/analytics/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  Assessment as AnalyticsIcon,
  TrendingUp as TrendingIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface AnalyticsData {
  stats: {
    totalRevenue: number;
    monthlyRevenue: number;
    activeSubscriptions: number;
    trialUsers: number;
    totalUsers: number;
    paymentCount: number;
  };
  monthlyData: Array<{
    month: string;
    revenue: number;
    users: number;
    payments: number;
  }>;
  planDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  topUsers: Array<{
    name: string;
    email: string;
    plan: string;
    joined: string;
    revenue: number;
  }>;
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('monthly');

  useEffect(() => {
    checkAdminAuth();
    fetchAnalyticsData();
  }, [timeRange]);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/me');
      if (!response.ok) {
        router.push('/admin/login');
      }
    } catch (err) {
      router.push('/admin/login');
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/admin/analytics');
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to load analytics');
      }

      setData(result);
    } catch (err: any) {
      console.error('Analytics error:', err);
      setError(err.message || 'Failed to load analytics data');
      
      // Fallback to empty data structure if API fails
      setData({
        stats: {
          totalRevenue: 0,
          monthlyRevenue: 0,
          activeSubscriptions: 0,
          trialUsers: 0,
          totalUsers: 0,
          paymentCount: 0,
        },
        monthlyData: [],
        planDistribution: [],
        topUsers: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (!data) return;
    
    // Create CSV data
    const csvRows = [];
    
    // Add stats
    csvRows.push(['Statistic', 'Value']);
    csvRows.push(['Total Revenue', data.stats.totalRevenue]);
    csvRows.push(['Monthly Revenue', data.stats.monthlyRevenue]);
    csvRows.push(['Active Subscriptions', data.stats.activeSubscriptions]);
    csvRows.push(['Trial Users', data.stats.trialUsers]);
    csvRows.push(['Total Users', data.stats.totalUsers]);
    csvRows.push(['Payment Count', data.stats.paymentCount]);
    csvRows.push([]);
    
    // Add monthly data
    csvRows.push(['Month', 'Revenue', 'Users', 'Payments']);
    data.monthlyData.forEach(item => {
      csvRows.push([item.month, item.revenue, item.users, item.payments]);
    });
    csvRows.push([]);
    
    // Add top users
    csvRows.push(['Top Users', 'Email', 'Plan', 'Joined', 'Revenue']);
    data.topUsers.forEach(user => {
      csvRows.push([user.name, user.email, user.plan, user.joined, user.revenue]);
    });
    
    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '-') return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Unable to load analytics data
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Please try refreshing the page or check your connection
        </Typography>
        <Button 
          variant="contained" 
          onClick={fetchAnalyticsData}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            <AnalyticsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time business insights and performance metrics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
              size="small"
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
            disabled={!data || data.monthlyData.length === 0}
          >
            Export Data
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4,
        '& > *': {
          flex: '1 1 calc(25% - 24px)',
          minWidth: 250
        }
      }}>
        {/* Total Revenue Card */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle2" color="text.secondary">
                Total Revenue
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold">
              {formatCurrency(data.stats.totalRevenue)}
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingIcon fontSize="small" /> Based on completed payments
            </Typography>
          </CardContent>
        </Card>

        {/* Active Users Card */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon sx={{ mr: 1, color: 'secondary.main' }} />
              <Typography variant="subtitle2" color="text.secondary">
                Active Users
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold">
              {data.stats.activeSubscriptions}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {data.stats.trialUsers} trial users
            </Typography>
          </CardContent>
        </Card>

        {/* Monthly Revenue Card */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PaymentIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="subtitle2" color="text.secondary">
                Monthly Revenue
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold">
              {formatCurrency(data.stats.monthlyRevenue)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last 30 days
            </Typography>
          </CardContent>
        </Card>

        {/* Total Payments Card */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="subtitle2" color="text.secondary">
                Total Payments
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold">
              {data.stats.paymentCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Successful transactions
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Charts Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {/* Revenue Chart */}
        <Box sx={{ flex: '1 1 100%', minWidth: 0, '@media (min-width: 900px)': { flex: '1 1 calc(66.666% - 12px)' } }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Revenue Trends (Last 6 Months)
              </Typography>
              <Box sx={{ height: 300 }}>
                {data.monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `₹${value}`} />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="text.secondary">
                      No revenue data available
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Plan Distribution */}
        <Box sx={{ flex: '1 1 100%', minWidth: 0, '@media (min-width: 900px)': { flex: '1 1 calc(33.333% - 12px)' } }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Plan Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                {data.planDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.planDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.planDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Users']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="text.secondary">
                      No plan distribution data
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* User Growth Chart */}
        <Box sx={{ flex: '1 1 100%' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Growth (Last 6 Months)
              </Typography>
              <Box sx={{ height: 300 }}>
                {data.monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="users" fill="#82ca9d" name="New Users" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="text.secondary">
                      No user growth data available
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Top Users Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Top Customers by Revenue
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Based on total payments
            </Typography>
          </Box>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="right">Total Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.topUsers.length > 0 ? (
                  data.topUsers.map((user, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Typography fontWeight="medium">{user.name}</Typography>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Box sx={{ 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1, 
                          display: 'inline-block',
                          bgcolor: user.plan === 'yearly' ? '#e3f2fd' : 
                                  user.plan === 'quarterly' ? '#e8f5e9' : 
                                  user.plan === 'monthly' ? '#fff3e0' : '#f5f5f5',
                          color: user.plan === 'yearly' ? '#1976d2' : 
                                user.plan === 'quarterly' ? '#2e7d32' : 
                                user.plan === 'monthly' ? '#ed6c02' : '#757575',
                        }}>
                          {user.plan || 'No Plan'}
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(user.joined)}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold" color="primary">
                          {formatCurrency(user.revenue)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">
                        No customer data available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Data Last Updated */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Data last updated: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}