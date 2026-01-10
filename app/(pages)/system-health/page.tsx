// app/(pages)/system-health/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Storage,
  Cloud,
  Security,
  Speed,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  NetworkCheck,
  Dataset,
  Api,
  Person,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';

interface SystemService {
  id: string;
  name: string;
  type: 'database' | 'api' | 'storage' | 'authentication' | 'cache';
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  responseTime: number;
  uptime: number;
  lastChecked: string;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
  };
  details?: any;
}

interface SystemAlert {
  id: string;
  serviceId: string;
  serviceName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
}

interface UserStats {
  totalDocuments: number;
  storageUsage: number;
  collectionsUsed: number;
  recentErrors?: number;
}

// Professional Color Theme
const colorTheme = {
  primary: {
    main: '#0d9488',
    light: '#5eead4',
    dark: '#115e59',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #2563eb 100%)',
  },
  secondary: {
    main: '#f59e0b',
    light: '#fde68a',
    dark: '#d97706',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
  success: {
    main: '#10b981',
    light: '#a7f3d0',
    dark: '#047857',
  },
  error: {
    main: '#f43f5e',
    light: '#fecdd3',
    dark: '#be123c',
  },
  warning: {
    main: '#f97316',
    light: '#fed7aa',
    dark: '#c2410c',
  },
  info: {
    main: '#0ea5e9',
    light: '#bae6fd',
    dark: '#0369a1',
  },
  background: {
    light: '#f8fafc',
    paper: '#ffffff',
    dark: '#1e293b',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    disabled: '#94a3b8',
    white: '#ffffff',
  }
};

export default function SystemHealthPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [services, setServices] = useState<SystemService[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const fetchSystemHealth = async () => {
    try {
      setError(null);
      const response = await fetch('/api/system-health');
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view system health');
        }
        throw new Error('Failed to fetch system health data');
      }
      
      const data = await response.json();
      setServices(data.services || []);
      setAlerts(data.alerts || []);
      setUserStats(data.userStats || null);
      setLastUpdated(new Date().toISOString());
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch system health');
      }
      console.error('Error fetching system health:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedStats = async () => {
    try {
      const response = await fetch('/api/system-health/stats');
      if (response.ok) {
        const data = await response.json();
        setUserStats(data.user || null);
      }
    } catch (err) {
      console.error('Error fetching detailed stats:', err);
    }
  };

  useEffect(() => {
    fetchSystemHealth();
    fetchDetailedStats();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchSystemHealth();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (status: SystemService['status']) => {
    switch (status) {
      case 'healthy': return colorTheme.success.main;
      case 'degraded': return colorTheme.warning.main;
      case 'down': return colorTheme.error.main;
      case 'maintenance': return colorTheme.info.main;
      default: return colorTheme.text.secondary;
    }
  };

  const getStatusIcon = (status: SystemService['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle />;
      case 'degraded': return <Warning />;
      case 'down': return <Error />;
      case 'maintenance': return <Speed />;
      default: return <Warning />;
    }
  };

  const getServiceIcon = (type: SystemService['type']) => {
    switch (type) {
      case 'database': return <Dataset />;
      case 'api': return <Api />;
      case 'storage': return <Storage />;
      case 'authentication': return <Security />;
      case 'cache': return <Cloud />;
      default: return <Storage />;
    }
  };

  const getAlertColor = (severity: SystemAlert['severity']) => {
    switch (severity) {
      case 'low': return colorTheme.info.main;
      case 'medium': return colorTheme.warning.main;
      case 'high': return colorTheme.error.main;
      case 'critical': return colorTheme.error.main;
      default: return colorTheme.info.main;
    }
  };

  const refreshData = () => {
    setLoading(true);
    fetchSystemHealth();
    fetchDetailedStats();
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/system-health/alerts/${alertId}/resolve`, {
        method: 'POST',
      });

      if (response.ok) {
        setAlerts(prev => 
          prev.map(alert => 
            alert.id === alertId ? { ...alert, resolved: true } : alert
          )
        );
      }
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  const criticalAlerts = alerts.filter(alert => !alert.resolved && (alert.severity === 'high' || alert.severity === 'critical'));
  const activeAlerts = alerts.filter(alert => !alert.resolved);

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" gutterBottom>
            System Health
          </Typography>
          <CircularProgress sx={{ color: colorTheme.primary.main }} />
          <Typography variant="body2" color="text.secondary">
            Loading your system health data...
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: 4,
          gap: 2
        }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ color: colorTheme.text.primary }}>
              System Health Dashboard
            </Typography>
            <Typography variant="body1" color={colorTheme.text.secondary}>
              Monitoring your account services and performance
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Auto refresh every 10 seconds">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  color="primary"
                />
                <Typography variant="body2">Auto Refresh</Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Refresh now">
              <IconButton 
                onClick={refreshData} 
                disabled={loading}
                sx={{
                  background: colorTheme.primary.gradient,
                  color: 'white',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${colorTheme.primary.dark} 0%, ${colorTheme.primary.main} 100%)`,
                  }
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              bgcolor: alpha(colorTheme.error.main, 0.1),
              color: colorTheme.error.main,
              border: `1px solid ${alpha(colorTheme.error.main, 0.2)}`,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              border: `1px solid ${alpha(colorTheme.error.main, 0.3)}`,
            }}
          >
            <Typography variant="h6">
              {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}
            </Typography>
            <List dense>
              {criticalAlerts.map(alert => (
                <ListItem key={alert.id}>
                  <ListItemText
                    primary={alert.message}
                    secondary={`${alert.serviceName} - ${formatDate(alert.timestamp)}`}
                  />
                </ListItem>
              ))}
            </List>
          </Alert>
        )}

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3 
        }}>
          {/* Main Content - Services Status */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              background: colorTheme.background.paper,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: `1px solid ${alpha(colorTheme.text.disabled, 0.1)}`,
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: colorTheme.text.primary,
                mb: 3
              }}>
                <NetworkCheck />
                Your Services Status
              </Typography>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { 
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)'
                },
                gap: 2
              }}>
                {services.map((service) => (
                  <Card 
                    key={service.id} 
                    sx={{ 
                      borderRadius: 2,
                      border: `1px solid ${alpha(getStatusColor(service.status), 0.2)}`,
                      background: alpha(getStatusColor(service.status), 0.05),
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 24px ${alpha(getStatusColor(service.status), 0.15)}`,
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {getServiceIcon(service.type)}
                        </ListItemIcon>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                          {service.name}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(service.status)}
                          label={service.status.toUpperCase()}
                          sx={{
                            bgcolor: alpha(getStatusColor(service.status), 0.1),
                            color: getStatusColor(service.status),
                            fontWeight: 600,
                            borderRadius: 1.5,
                          }}
                          size="small"
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color={colorTheme.text.secondary} gutterBottom>
                          Response Time: {service.responseTime}ms
                        </Typography>
                        <Typography variant="body2" color={colorTheme.text.secondary} gutterBottom>
                          Uptime: {service.uptime}%
                        </Typography>
                        {service.details && (
                          <Typography variant="caption" color={colorTheme.text.secondary} display="block">
                            {service.details.connectionState && `Status: ${service.details.connectionState}`}
                            {service.details.userDocuments && ` • Your Documents: ${service.details.userDocuments}`}
                            {service.details.estimatedUsage && ` • Usage: ${service.details.estimatedUsage}`}
                          </Typography>
                        )}
                        <Typography variant="caption" color={colorTheme.text.secondary} display="block">
                          Last checked: {formatDate(service.lastChecked)}
                        </Typography>
                      </Box>

                      {/* Resource Usage */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color={colorTheme.text.secondary} display="block" gutterBottom>
                          CPU: {service.resources.cpu}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={service.resources.cpu}
                          sx={{ 
                            mb: 1, 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: alpha(colorTheme.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: service.resources.cpu > 80 
                                ? colorTheme.error.main 
                                : service.resources.cpu > 60 
                                  ? colorTheme.warning.main 
                                  : colorTheme.success.main,
                            }
                          }}
                        />

                        <Typography variant="caption" color={colorTheme.text.secondary} display="block" gutterBottom>
                          Memory: {service.resources.memory}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={service.resources.memory}
                          sx={{ 
                            mb: 1, 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: alpha(colorTheme.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: service.resources.memory > 80 
                                ? colorTheme.error.main 
                                : service.resources.memory > 60 
                                  ? colorTheme.warning.main 
                                  : colorTheme.success.main,
                            }
                          }}
                        />

                        <Typography variant="caption" color={colorTheme.text.secondary} display="block" gutterBottom>
                          Disk: {service.resources.disk}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={service.resources.disk}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: alpha(colorTheme.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: service.resources.disk > 90 
                                ? colorTheme.error.main 
                                : service.resources.disk > 80 
                                  ? colorTheme.warning.main 
                                  : colorTheme.success.main,
                            }
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Box>

          {/* Sidebar */}
          <Box sx={{ width: { xs: '100%', md: 320 } }}>
            {/* User Stats */}
            <Paper sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 3,
              background: colorTheme.background.paper,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: `1px solid ${alpha(colorTheme.text.disabled, 0.1)}`,
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: colorTheme.text.primary
              }}>
                <Person />
                Your Account Stats
              </Typography>
              
              {userStats ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color={colorTheme.text.secondary}>Your Documents:</Typography>
                    <Typography variant="body2" fontWeight="medium" color={colorTheme.text.primary}>
                      {userStats.totalDocuments}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color={colorTheme.text.secondary}>Storage Used:</Typography>
                    <Typography variant="body2" fontWeight="medium" color={colorTheme.text.primary}>
                      {(userStats.storageUsage || 0).toFixed(2)} MB
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color={colorTheme.text.secondary}>Collections Used:</Typography>
                    <Typography variant="body2" fontWeight="medium" color={colorTheme.text.primary}>
                      {userStats.collectionsUsed}
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, ((userStats.storageUsage || 0) / 50) * 100)}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: alpha(colorTheme.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: (userStats.storageUsage || 0) > 40 
                          ? colorTheme.error.main 
                          : (userStats.storageUsage || 0) > 30 
                            ? colorTheme.warning.main 
                            : colorTheme.success.main,
                      }
                    }}
                  />
                  <Typography variant="caption" color={colorTheme.text.secondary} display="block" textAlign="center" sx={{ mt: 1 }}>
                    {(((userStats.storageUsage || 0) / 50) * 100).toFixed(1)}% of your storage limit
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color={colorTheme.text.secondary}>
                  Loading your stats...
                </Typography>
              )}
            </Paper>

            {/* Alerts Panel */}
            <Paper sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 3,
              background: colorTheme.background.paper,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: `1px solid ${alpha(colorTheme.text.disabled, 0.1)}`,
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: colorTheme.text.primary
              }}>
                <Warning />
                Your Active Alerts ({activeAlerts.length})
              </Typography>

              {activeAlerts.length === 0 ? (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  No active alerts - all systems operational
                </Alert>
              ) : (
                <List dense>
                  {activeAlerts.map((alert) => {
                    const alertColor = getAlertColor(alert.severity);
                    return (
                      <ListItem
                        key={alert.id}
                        sx={{
                          borderLeft: 4,
                          borderColor: alertColor,
                          mb: 1,
                          borderRadius: 1,
                          backgroundColor: alpha(alertColor, 0.05),
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight="medium" color={colorTheme.text.primary}>
                              {alert.message}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="caption" display="block" color={colorTheme.text.secondary}>
                                {alert.serviceName}
                              </Typography>
                              <Typography variant="caption" color={colorTheme.text.disabled}>
                                {formatDate(alert.timestamp)}
                              </Typography>
                            </Box>
                          }
                        />
                        <IconButton
                          size="small"
                          onClick={() => resolveAlert(alert.id)}
                          title="Mark as resolved"
                          sx={{
                            color: colorTheme.success.main,
                            '&:hover': {
                              bgcolor: alpha(colorTheme.success.main, 0.1),
                            }
                          }}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Paper>

            {/* System Summary */}
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              background: colorTheme.background.paper,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: `1px solid ${alpha(colorTheme.text.disabled, 0.1)}`,
            }}>
              <Typography variant="h6" gutterBottom color={colorTheme.text.primary}>
                System Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color={colorTheme.text.secondary}>Total Services:</Typography>
                <Typography variant="body2" fontWeight="medium" color={colorTheme.text.primary}>
                  {services.length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color={colorTheme.text.secondary}>Healthy Services:</Typography>
                <Typography variant="body2" fontWeight="medium" color={colorTheme.success.main}>
                  {services.filter(s => s.status === 'healthy').length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color={colorTheme.text.secondary}>Active Alerts:</Typography>
                <Typography 
                  variant="body2" 
                  fontWeight="medium" 
                  color={activeAlerts.length > 0 ? colorTheme.error.main : colorTheme.success.main}
                >
                  {activeAlerts.length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color={colorTheme.text.secondary}>Last Updated:</Typography>
                <Typography variant="body2" color={colorTheme.text.secondary}>
                  {lastUpdated ? formatDate(lastUpdated) : 'Never'}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}