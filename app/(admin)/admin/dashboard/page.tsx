// app/admin/dashboard/page.tsx - WITH USAGE TIME & GRAPHS
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  alpha,
  useTheme,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  AdminPanelSettings,
  People,
  Logout,
  Refresh,
  TrendingUp,
  AccountBalance,
  AccessTime,
  ShowChart,
  PieChart as PieChartIcon,
  Timeline,
  Visibility,
  Edit,
  ArrowForward,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Types
interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  trialUsers: number;
  totalProducts: number;
  revenue: number;
  recentUsers: AdminUser[];
  userGrowth?: number;
  revenueGrowth?: number;
  
  // Usage time tracking
  totalUsageHours: number;
  avgDailyUsage: number;
  peakConcurrentUsers: number;
  
  // Graph data
  dailyUsage?: DailyUsage[];
  planDistribution?: PlanDistribution[];
  revenueTrend?: RevenueTrend[];
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: string;
    features: string[];
  };
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  totalUsageHours?: number;
  lastActive?: string;
}

interface DailyUsage {
  date: string;
  hours: number;
  activeUsers: number;
  sessions: number;
}

interface PlanDistribution {
  name: string;
  users: number;
  revenue: number;
  avgUsageHours: number;
  value?: number; // For chart compatibility
}

interface RevenueTrend {
  month: string;
  revenue: number;
  newUsers: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const theme = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    checkAdminAuth();
    fetchDashboardData();
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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/admin/dashboard?range=${timeRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    await fetchDashboardData();
    setRefreshLoading(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatTime = (hours: number) => {
    if (!hours || hours === 0) return '0h';
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    if (hours < 24) {
      return `${Math.round(hours)}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days}d ${remainingHours}h`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'trial': return 'info';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'yearly': return 'secondary';
      case 'quarterly': return 'primary';
      case 'monthly': return 'warning';
      case 'trial': return 'info';
      default: return 'default';
    }
  };

  // Chart color palette
  const CHART_COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  // Prepare plan distribution data for charts
  const planChartData = useMemo(() => {
    if (!stats?.planDistribution) return [];
    return stats.planDistribution.map(item => ({
      ...item,
      value: item.users, // For PieChart compatibility
    }));
  }, [stats?.planDistribution]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2 
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load dashboard data. Please try again.
        </Alert>
        <Button onClick={fetchDashboardData}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      maxWidth: '100%', 
      overflowX: 'hidden',
      backgroundColor: alpha(theme.palette.background.default, 0.5),
      minHeight: '100vh',
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 4,
        gap: 2,
      }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight="bold" 
            gutterBottom
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            <AdminPanelSettings sx={{ fontSize: 'inherit' }} />
            Admin Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time platform usage and performance metrics
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={refreshLoading}
          >
            Refresh
          </Button>
          
          <Button 
            variant="contained" 
            startIcon={<Logout />} 
            onClick={handleLogout}
            color="error"
          >
            Logout
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Usage Stats Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4,
      }}>
        {/* Total Usage Time */}
        <Card sx={{ 
          flex: '1 1 300px',
          minWidth: 250,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h3" fontWeight="bold">
                  {formatTime(stats.totalUsageHours || 0)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Usage Time
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <AccessTime sx={{ mr: 0.5, fontSize: 16 }} />
                  <Typography variant="caption">
                    Avg: {formatTime(stats.avgDailyUsage || 0)}/day
                  </Typography>
                </Box>
              </Box>
              <AccessTime sx={{ fontSize: 48, opacity: 0.2 }} />
            </Box>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card sx={{ 
          flex: '1 1 300px',
          minWidth: 250,
          background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h3" fontWeight="bold">
                  {formatCurrency(stats.revenue)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Revenue
                </Typography>
                {stats.revenueGrowth && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ mr: 0.5 }} />
                    <Typography variant="caption">
                      {stats.revenueGrowth > 0 ? '+' : ''}{stats.revenueGrowth}%
                    </Typography>
                  </Box>
                )}
              </Box>
              <AccountBalance sx={{ fontSize: 48, opacity: 0.2 }} />
            </Box>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card sx={{ 
          flex: '1 1 300px',
          minWidth: 250,
          background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h3" fontWeight="bold">
                  {formatNumber(stats.activeUsers)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Active Users
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Badge
                    variant="dot"
                    color="success"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="caption">
                    Peak: {stats.peakConcurrentUsers || 0} users
                  </Typography>
                </Box>
              </Box>
              <People sx={{ fontSize: 48, opacity: 0.2 }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Charts Section */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4,
      }}>
        {/* Daily Usage Chart */}
        <Card sx={{ 
          flex: '1 1 600px',
          minWidth: 300,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Timeline color="primary" />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Daily Usage Trends
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Platform usage over time
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={stats.dailyUsage || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
                  <XAxis 
                    dataKey="date" 
                    stroke={theme.palette.text.secondary}
                    tickFormatter={formatDate}
                  />
                  <YAxis 
                    stroke={theme.palette.text.secondary}
                    tickFormatter={(value) => `${value}h`}
                  />
                  <RechartsTooltip 
                    formatter={(value: number) => [`${value} hours`, 'Usage']}
                    labelFormatter={(label) => `Date: ${formatDate(label.toString())}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke={CHART_COLORS[0]}
                    strokeWidth={3}
                    dot={{ strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                    name="Usage Hours"
                  />
                  <Line
                    type="monotone"
                    dataKey="activeUsers"
                    stroke={CHART_COLORS[1]}
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                    name="Active Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Plan Distribution Chart */}
        <Card sx={{ 
          flex: '1 1 400px',
          minWidth: 300,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <PieChartIcon color="primary" />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Plan Distribution
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Users by subscription plan
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ width: '100%', height: 300, display: 'flex', alignItems: 'center' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={planChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // label={(entry) => `${entry.name}: ${((entry.users / stats.totalUsers) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="users"
                    nameKey="name"
                  >
                    {planChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number, name: string) => [
                      `${value} users`,
                      name === 'users' ? 'Users' : 'Revenue'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            
            {/* Plan Stats */}
            {planChartData.length > 0 && (
              <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {planChartData.slice(0, 3).map((plan, index) => (
                  <Paper
                    key={plan.name}
                    elevation={0}
                    sx={{
                      flex: '1 1 150px',
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: alpha(CHART_COLORS[index], 0.1),
                      border: `1px solid ${alpha(CHART_COLORS[index], 0.2)}`,
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      {plan.name.toUpperCase()}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {plan.users} users
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(plan.avgUsageHours || 0)} avg usage
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Revenue Trend Chart */}
        <Card sx={{ 
          flex: '1 1 100%',
          minWidth: 300,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <ShowChart color="primary" />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Revenue Trend
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly revenue growth
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={stats.revenueTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
                  <XAxis 
                    dataKey="month" 
                    stroke={theme.palette.text.secondary}
                  />
                  <YAxis 
                    stroke={theme.palette.text.secondary}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <RechartsTooltip 
                    formatter={(value: number) => [
                      formatCurrency(value),
                      'Revenue'
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill={CHART_COLORS[0]}
                    name="Revenue"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="newUsers"
                    fill={CHART_COLORS[1]}
                    name="New Users"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Users Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Recent Users
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Latest registered users with usage stats
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              endIcon={<ArrowForward />}
              onClick={() => router.push('/admin/users')}
            >
              View All Users
            </Button>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total Usage</TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.recentUsers?.map((user) => (
                  <TableRow 
                    key={user._id} 
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.action.hover, 0.05),
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: user.totalUsageHours && user.totalUsageHours > 10 
                            ? 'success.main' 
                            : 'primary.main',
                          width: 40,
                          height: 40,
                        }}>
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {user.name || 'Unknown User'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email || 'No email'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={(user.subscription?.plan || 'none').toUpperCase()} 
                        size="small" 
                        color={getPlanColor(user.subscription?.plan || 'none') as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={(user.subscription?.status || 'inactive').toUpperCase()}
                        color={getStatusColor(user.subscription?.status || 'inactive') as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight="500">
                          {formatTime(user.totalUsageHours || 0)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {user.lastActive ? (
                        <Typography variant="body2">
                          {formatDate(user.lastActive)}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Never
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => router.push(`/admin/users/${user._id}`)}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit User">
                          <IconButton 
                            size="small" 
                            color="info"
                            onClick={() => router.push(`/admin/users/${user._id}/edit`)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Platform Summary */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Platform Performance Summary
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 4,
          }}>
            <Box sx={{ flex: '1 1 250px' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                User Engagement
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Total Usage Time</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatTime(stats.totalUsageHours || 0)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Avg Daily Usage</Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    {formatTime(stats.avgDailyUsage || 0)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Peak Concurrent Users</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {stats.peakConcurrentUsers || 0} users
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: '1 1 250px' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Business Metrics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Total Revenue</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(stats.revenue)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Avg Revenue/User</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(stats.totalUsers > 0 ? stats.revenue / stats.totalUsers : 0)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Active to Trial Ratio</Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    {stats.trialUsers > 0 ? 
                      ((stats.activeUsers - stats.trialUsers) / stats.trialUsers * 100).toFixed(1) 
                      : '0'}%
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: '1 1 250px' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Platform Health
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Uptime</Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    99.9%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Avg Response Time</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {'< 200ms'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Data Points Tracked</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatNumber((stats.dailyUsage?.length || 0) * 3)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}