"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Container,
  Button,
  Chip,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { alpha } from '@mui/material/styles';
import { ServiceCard } from '@/components/system-health/ServiceCard';
import { AlertsPanel, SystemAlert } from '@/components/system-health/AlertsPanel';
import { UserStatsPanel } from '@/components/system-health/UserStatsPanel';
import { StatsCard } from '@/components/system-health/StatsCard';
import { ServiceType } from '@/components/system-health/ServiceCard';
import { COMMON_WORDS } from '@/contexts/commonWords';

interface SystemService {
  id: string;
  name: string;
  type: ServiceType;
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

interface UserStats {
  totalDocuments: number;
  storageUsage: number;
  collectionsUsed: number;
  recentErrors?: number;
}

export default function SystemHealthPage() {
  const { SYSTEM_HEALTH, UI, MESSAGES, PRODUCT, NAVIGATION } = COMMON_WORDS;
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
  const [isOnline, setIsOnline] = useState(true);

  const fetchSystemHealth = async () => {
    try {
      setError(null);
      const response = await fetch('/api/system-health');
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(MESSAGES.AUTH_REQUIRED);
        }
        throw new Error(MESSAGES.FETCH_FAILED);
      }
      
      const data = await response.json();
      setServices(data.services || []);
      setAlerts(data.alerts || []);
      setUserStats(data.userStats || null);
      setLastUpdated(new Date().toISOString());
      setIsOnline(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(MESSAGES.FETCH_FAILED);
      }
      setIsOnline(false);
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

  const refreshData = () => {
    setLoading(true);
    fetchSystemHealth();
    fetchDetailedStats();
  };

  const handleBack = () => {
    window.history.back();
  };

  const criticalAlerts = alerts.filter(alert => !alert.resolved && (alert.severity === 'high' || alert.severity === 'critical'));
  const activeAlerts = alerts.filter(alert => !alert.resolved);

  if (loading) {
    return (
      <MainLayout title={SYSTEM_HEALTH.PAGE_TITLE}>
        <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" gutterBottom>
              {SYSTEM_HEALTH.PAGE_TITLE}
            </Typography>
            <CircularProgress sx={{ color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              {UI.LOADING} {PRODUCT.NAME} {SYSTEM_HEALTH.PAGE_TITLE.toLowerCase()} {UI.PROCESSING.toLowerCase()}
            </Typography>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={SYSTEM_HEALTH.PAGE_TITLE}>
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header - Same style as Events page */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
            size="small"
          >
            Back to Dashboard
          </Button>

          <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
              {NAVIGATION.DASHBOARD}
            </MuiLink>
            <Typography color="text.primary">{SYSTEM_HEALTH.PAGE_TITLE}</Typography>
          </Breadcrumbs>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {SYSTEM_HEALTH.HEADER_TITLE}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Monitor and manage all your system services, resources, and alerts in real-time
              </Typography>
            </Box>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={1}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {!isOnline && (
                <Chip 
                  label={UI.OFFLINE} 
                  size="small" 
                  color="warning" 
                  variant="outlined"
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                />
              )}
              <Chip 
                label={`${activeAlerts.length} ${SYSTEM_HEALTH.ACTIVE_ALERTS}`} 
                size="small" 
                color={activeAlerts.length > 0 ? 'error' : 'success'}
                variant="outlined"
                sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
              />
              <Chip 
                label={`${services.filter(s => s.status === SYSTEM_HEALTH.STATUS.HEALTHY).length}/${services.length} ${SYSTEM_HEALTH.HEALTHY_SERVICES}`} 
                size="small" 
                color="success"
                variant="outlined"
                sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
              />
            </Stack>
          </Box>

          {/* Auto Refresh Control */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              mb: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {UI.AUTO_REFRESH} • {UI.LAST_UPDATED}: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                System data refreshes every 10 seconds when auto-refresh is enabled
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip 
                label={autoRefresh ? UI.AUTO_REFRESH : UI.MANUAL_REFRESH}
                size="small"
                color={autoRefresh ? 'primary' : 'default'}
                onClick={() => setAutoRefresh(!autoRefresh)}
                sx={{ cursor: 'pointer' }}
              />
              <Button 
                variant="outlined" 
                size="small"
                onClick={refreshData}
                disabled={loading}
              >
                {loading ? UI.PROCESSING : UI.REFRESH_DATA}
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              bgcolor: theme => alpha(theme.palette.error.main, 0.1),
              border: theme => `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Critical Alerts Banner */}
        {criticalAlerts.length > 0 && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              border: theme => `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
              '& .MuiAlert-icon': { alignItems: 'center' }
            }}
            icon={<></>}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  {criticalAlerts.length} {SYSTEM_HEALTH.CRITICAL_ALERTS}
                </Typography>
                <Chip 
                  label="CRITICAL" 
                  size="small" 
                  color="error" 
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <Typography variant="body2">
                Immediate attention required. Some services may be affected.
              </Typography>
            </Box>
          </Alert>
        )}

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3 
        }}>
          {/* Main Content - Services Status */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 3,
              background: 'background.paper',
              boxShadow: theme => theme.shadows[2],
              border: theme => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              height: '100%'
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 3
              }}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  {SYSTEM_HEALTH.YOUR_SERVICES_STATUS}
                </Typography>
                <Chip 
                  label={`${services.length} ${SYSTEM_HEALTH.TOTAL_SERVICES.toLowerCase()}`} 
                  size="small" 
                  variant="outlined"
                />
              </Box>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { 
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)'
                },
                gap: { xs: 1.5, sm: 2 }
              }}>
                {services.map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    {...service} 
                    // compact={isMobile}
                  />
                ))}
              </Box>

              {services.length === 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  py: 6,
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {UI.NO_RESULTS}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No services are currently being monitored
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>

          {/* Sidebar */}
          <Box sx={{ 
            width: { xs: '100%', lg: 380 },
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            {/* User Stats */}
            <UserStatsPanel
              stats={userStats}
              storageLimit={50}
            />

            {/* Alerts Panel */}
            <AlertsPanel
              alerts={alerts}
              onResolveAlert={resolveAlert}
              maxHeight={isMobile ? 250 : 300}
              title={`${alerts.length} ${SYSTEM_HEALTH.ALL_ALERTS.toLowerCase()}`}
            />

            {/* System Summary */}
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 3,
              background: 'background.paper',
              boxShadow: theme => theme.shadows[2],
              border: theme => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}>
              <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
                {SYSTEM_HEALTH.SYSTEM_SUMMARY}
              </Typography>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
                mt: 2
              }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {SYSTEM_HEALTH.TOTAL_SERVICES}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    {services.length}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.success.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {SYSTEM_HEALTH.HEALTHY_SERVICES}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="success.main">
                    {services.filter(s => s.status === SYSTEM_HEALTH.STATUS.HEALTHY).length}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.error.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {SYSTEM_HEALTH.ACTIVE_ALERTS}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="error.main">
                    {activeAlerts.length}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.warning.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {SYSTEM_HEALTH.RECENT_ERRORS}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="warning.main">
                    {userStats?.recentErrors || 0}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Quick Stats Cards */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
            }}>
              <StatsCard
                title={SYSTEM_HEALTH.TOTAL_SERVICES}
                value={services.length}
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                // size={isMobile ? 'small' : 'medium'}
              />
              <StatsCard
                title={SYSTEM_HEALTH.ACTIVE_ALERTS}
                value={activeAlerts.length}
                gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                // size={isMobile ? 'small' : 'medium'}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
}