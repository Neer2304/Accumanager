// app/(pages)/live-activity/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person,
  AccessTime,
  TrendingUp,
  LocationOn,
  Computer,
  Phone,
  MeetingRoom,
  Coffee,
  Wifi,
  Videocam,
  Refresh,
  Upgrade,
  Lock,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';

interface LiveEmployee {
  _id: string;
  employeeId: string;
  employeeName: string;
  avatar: string;
  status: 'online' | 'offline' | 'meeting' | 'break' | 'focus' | 'away';
  device: 'desktop' | 'mobile' | 'tablet';
  location: 'office' | 'remote' | 'hybrid';
  currentActivity: string;
  lastActive: string;
  productivity: number;
}

interface RealTimeEvent {
  _id: string;
  employeeId: string;
  employeeName: string;
  type: 'login' | 'logout' | 'meeting_start' | 'meeting_end' | 'break_start' | 'break_end' | 'task_start' | 'task_complete' | 'status_change';
  description: string;
  createdAt: string;
}

interface SubscriptionStatus {
  isActive: boolean;
  plan: 'trial' | 'monthly' | 'quarterly' | 'yearly';
  status: string;
  features: any;
  limits: {
    employees: number;
    activityHistory: number;
    realTimeTracking: boolean;
  };
}

const PRICING_PLANS = {
  monthly: {
    name: 'Monthly Pro',
    price: 999,
    features: [
      'Up to 50 employees tracking',
      '30 days activity history',
      'Real-time monitoring',
      'Productivity analytics',
      'Team distribution insights'
    ]
  },
  quarterly: {
    name: 'Quarterly Business',
    price: 2599,
    features: [
      'Up to 200 employees tracking',
      '90 days activity history',
      'Advanced analytics',
      'Custom reports',
      'Priority support'
    ]
  },
  yearly: {
    name: 'Yearly Enterprise',
    price: 8999,
    features: [
      'Unlimited employees tracking',
      '1 year activity history',
      'AI-powered insights',
      'Custom integrations',
      'Dedicated support'
    ]
  }
};

export default function LiveActivityPage() {
  const [employees, setEmployees] = useState<LiveEmployee[]>([]);
  const [recentEvents, setRecentEvents] = useState<RealTimeEvent[]>([]);
  const [stats, setStats] = useState({
    onlineCount: 0,
    inMeetingCount: 0,
    onBreakCount: 0,
    avgProductivity: 0,
    totalEmployees: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // Fetch subscription status
  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscription/status', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptionStatus(data.data);
        
        // Check if feature is available in current plan
        if (!data.data.isActive) {
          setAccessDenied(true);
          setLoading(false);
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return false;
    }
  };

  // Fetch live activity data
  const fetchLiveActivity = async () => {
    try {
      setError(null);
      const response = await fetch('/api/activity/live', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 402) {
          setAccessDenied(true);
          return;
        }
        throw new Error('Failed to fetch live activity');
      }
      
      const data = await response.json();
      setEmployees(data.employees || []);
      setStats(data.stats || {
        onlineCount: 0,
        inMeetingCount: 0,
        onBreakCount: 0,
        avgProductivity: 0,
        totalEmployees: 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent events
  const fetchRecentEvents = async () => {
    try {
      const response = await fetch('/api/activity/events', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setRecentEvents(data.events || []);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    const initializeData = async () => {
      const hasAccess = await fetchSubscriptionStatus();
      if (hasAccess) {
        await fetchLiveActivity();
        await fetchRecentEvents();
      }
    };
    
    initializeData();
  }, []);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh || !subscriptionStatus?.isActive) return;

    const interval = setInterval(() => {
      fetchLiveActivity();
      fetchRecentEvents();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, subscriptionStatus]);

  const refreshData = () => {
    if (!subscriptionStatus?.isActive) {
      setUpgradeDialogOpen(true);
      return;
    }
    
    setLoading(true);
    fetchLiveActivity();
    fetchRecentEvents();
  };

  const handleUpgradePlan = async (plan: string) => {
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ plan }),
      });

      if (response.ok) {
        const result = await response.json();
        const paymentData = result.data;
        
        // Open UPI payment URL
        window.open(paymentData.upiUrl, '_blank');
        
        // Show success message
        setError(null);
        
        setUpgradeDialogOpen(false);
        
        // Poll for payment status
        checkPaymentStatus(paymentData.paymentId);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      setError(error instanceof Error ? error.message : 'Failed to initiate payment');
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    const maxAttempts = 30;
    let attempts = 0;
    
    const poll = setInterval(async () => {
      attempts++;
      
      try {
        const response = await fetch(`/api/payments/status?paymentId=${paymentId}`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const result = await response.json();
          const status = result.status;
          
          if (status === 'completed') {
            clearInterval(poll);
            
            // Verify payment
            await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                paymentId,
                upiTransactionId: result.upiTransactionId
              }),
            });
            
            // Refresh subscription status
            await fetchSubscriptionStatus();
            setAccessDenied(false);
            
            // Reload activity data
            await fetchLiveActivity();
            await fetchRecentEvents();
          } else if (status === 'failed') {
            clearInterval(poll);
            setError('Payment failed. Please try again.');
          }
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(poll);
          setError('Payment verification timeout. Please check your payment status manually.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 10000);
  };

  const getStatusColor = (status: LiveEmployee['status']) => {
    switch (status) {
      case 'online': return 'success';
      case 'offline': return 'default';
      case 'meeting': return 'primary';
      case 'break': return 'warning';
      case 'focus': return 'info';
      case 'away': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: LiveEmployee['status']) => {
    switch (status) {
      case 'online': return <Wifi color="success" />;
      case 'meeting': return <Videocam color="primary" />;
      case 'break': return <Coffee color="warning" />;
      case 'focus': return <TrendingUp color="info" />;
      case 'away': return <Person color="secondary" />;
      default: return <Person color="disabled" />;
    }
  };

  const getDeviceIcon = (device: LiveEmployee['device']) => {
    switch (device) {
      case 'desktop': return <Computer />;
      case 'mobile': return <Phone />;
      case 'tablet': return <MeetingRoom />;
      default: return <Computer />;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  // Subscription-limited content
  if (accessDenied) {
    return (
      <MainLayout title="Live Activity">
        <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <Paper sx={{ p: 6, mt: 4 }}>
            <Lock sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom color="error">
              Premium Feature Locked
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Live Activity Monitoring requires an active subscription
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Upgrade your plan to access real-time employee tracking, productivity analytics, 
              and team activity monitoring features.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Upgrade />}
              onClick={() => setUpgradeDialogOpen(true)}
              sx={{ px: 4, py: 1.5 }}
            >
              Upgrade to Unlock
            </Button>
          </Paper>
        </Box>

        {/* Upgrade Dialog */}
        <Dialog 
          open={upgradeDialogOpen} 
          onClose={() => setUpgradeDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5" component="div" fontWeight="bold">
              Upgrade Your Plan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose the plan that best fits your business needs
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {Object.entries(PRICING_PLANS).map(([planKey, plan]) => (
                <Grid item xs={12} md={4} key={planKey}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      border: 1,
                      borderColor: 'divider',
                      position: 'relative',
                    }}
                  >
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {plan.name}
                      </Typography>
                      <Typography variant="h4" gutterBottom color="primary.main">
                        ₹{plan.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {planKey === 'monthly' && 'per month'}
                        {planKey === 'quarterly' && 'per quarter'}
                        {planKey === 'yearly' && 'per year'}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <List dense sx={{ flex: 1 }}>
                        {plan.features.map((feature: string, index: number) => (
                          <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <TrendingUp color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={feature} 
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                      
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleUpgradePlan(planKey)}
                        sx={{ mt: 2 }}
                      >
                        Upgrade to {plan.name}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpgradeDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout title="Live Activity">
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Live Activity">
      <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
        
        {/* Header */}
        <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                📊 Live Activity Dashboard
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Real-time monitoring of team activity and productivity
                {subscriptionStatus && (
                  <Chip 
                    label={subscriptionStatus.plan} 
                    size="small" 
                    sx={{ ml: 2, bgcolor: 'white', color: '#667eea' }} 
                  />
                )}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Refresh data">
                <IconButton onClick={refreshData} sx={{ color: 'white' }} disabled={loading}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              error.includes('subscription') && (
                <Button color="inherit" size="small" onClick={() => setUpgradeDialogOpen(true)}>
                  Upgrade
                </Button>
              )
            }
          >
            {error}
          </Alert>
        )}

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {stats.onlineCount}
                </Typography>
                <Typography color="text.secondary">Active Now</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {stats.inMeetingCount}
                </Typography>
                <Typography color="text.secondary">In Meetings</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {stats.onBreakCount}
                </Typography>
                <Typography color="text.secondary">On Break</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {stats.avgProductivity}%
                </Typography>
                <Typography color="text.secondary">Avg Productivity</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Employee Activity List */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person />
                    Team Activity ({stats.totalEmployees} employees)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Auto Refresh</Typography>
                    <Switch
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      size="small"
                    />
                  </Box>
                </Box>
                
                {employees.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No employee activity data available
                  </Typography>
                ) : (
                  <List>
                    {employees.map((employee) => (
                      <ListItem key={employee._id} divider>
                        <ListItemAvatar>
                          <Avatar src={employee.avatar} sx={{ bgcolor: 'primary.main' }}>
                            {employee.employeeName?.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {employee.employeeName}
                              </Typography>
                              <Chip
                                icon={getStatusIcon(employee.status)}
                                label={employee.status}
                                size="small"
                                color={getStatusColor(employee.status)}
                                variant="outlined"
                              />
                              <Tooltip title={employee.device}>
                                <IconButton size="small">
                                  {getDeviceIcon(employee.device)}
                                </IconButton>
                              </Tooltip>
                              <Chip
                                label={employee.location}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {employee.currentActivity}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Productivity: {employee.productivity}%
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={employee.productivity}
                                  color={
                                    employee.productivity > 80 ? "success" :
                                    employee.productivity > 60 ? "warning" : "error"
                                  }
                                  sx={{ mt: 0.5, height: 6 }}
                                />
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                Last active: {formatTime(employee.lastActive)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Events */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime />
                  Recent Events
                </Typography>
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {recentEvents.length === 0 ? (
                    <ListItem>
                      <ListItemText
                        primary="No recent events"
                        secondary="Activity events will appear here"
                      />
                    </ListItem>
                  ) : (
                    recentEvents.map((event) => (
                      <ListItem key={event._id} divider>
                        <ListItemIcon>
                          {event.type.includes('meeting') && <Videocam color="primary" />}
                          {event.type.includes('break') && <Coffee color="warning" />}
                          {event.type.includes('login') && <TrendingUp color="success" />}
                          {event.type.includes('logout') && <Person color="disabled" />}
                          {event.type.includes('task') && <TrendingUp color="info" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={event.description}
                          secondary={formatTime(event.createdAt)}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </CardContent>
            </Card>

            {/* Location Distribution */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Team Distribution
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {['office', 'remote', 'hybrid'].map((location) => {
                    const count = employees.filter(emp => emp.location === location).length;
                    const percentage = employees.length > 0 ? (count / employees.length) * 100 : 0;
                    return (
                      <Box key={location}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" textTransform="capitalize">
                            {location}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {count} ({percentage.toFixed(0)}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          color="primary"
                          sx={{ height: 6 }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}