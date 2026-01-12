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
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { alpha } from '@mui/material/styles';
import { ServiceCard } from '@/components/system-health/ServiceCard';
import { AlertsPanel, SystemAlert } from '@/components/system-health/AlertsPanel';
import { UserStatsPanel } from '@/components/system-health/UserStatsPanel';
import { StatsCard } from '@/components/system-health/StatsCard';
import { SystemHealthHeader } from '@/components/system-health/SystemHealthHeader';
import { ServiceType } from '@/components/system-health/ServiceCard';

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

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" gutterBottom>
            System Health
          </Typography>
          <CircularProgress sx={{ color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary">
            Loading your system health data...
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  const criticalAlerts = alerts.filter(alert => !alert.resolved && (alert.severity === 'high' || alert.severity === 'critical'));
  const activeAlerts = alerts.filter(alert => !alert.resolved);

  return (
    <MainLayout>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <SystemHealthHeader
          autoRefresh={autoRefresh}
          onAutoRefreshChange={setAutoRefresh}
          onRefresh={refreshData}
          loading={loading}
          lastUpdated={lastUpdated}
        />

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

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              border: theme => `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
            }}
          >
            <Typography variant="h6">
              {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}
            </Typography>
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
              background: 'background.paper',
              boxShadow: theme => theme.shadows[2],
              border: theme => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'text.primary',
                mb: 3
              }}>
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
                  <ServiceCard key={service.id} {...service} />
                ))}
              </Box>
            </Paper>
          </Box>

          {/* Sidebar */}
          <Box sx={{ width: { xs: '100%', md: 320 } }}>
            {/* User Stats */}
            <UserStatsPanel
              stats={userStats}
              storageLimit={50}
            />

            {/* Alerts Panel */}
            <Box sx={{ mb: 3 }}>
              <AlertsPanel
                alerts={alerts}
                onResolveAlert={resolveAlert}
                maxHeight={300}
              />
            </Box>

            {/* System Summary */}
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              background: 'background.paper',
              boxShadow: theme => theme.shadows[2],
              border: theme => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}>
              <Typography variant="h6" gutterBottom color="text.primary">
                System Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Total Services:</Typography>
                <Typography variant="body2" fontWeight="medium" color="text.primary">
                  {services.length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Healthy Services:</Typography>
                <Typography variant="body2" fontWeight="medium" color="success.main">
                  {services.filter(s => s.status === 'healthy').length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Active Alerts:</Typography>
                <Typography 
                  variant="body2" 
                  fontWeight="medium" 
                  color={activeAlerts.length > 0 ? 'error.main' : 'success.main'}
                >
                  {activeAlerts.length}
                </Typography>
              </Box>
            </Paper>

            {/* Quick Stats Cards */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mt: 2,
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Box sx={{ flex: 1 }}>
                <StatsCard
                  title="Total Services"
                  value={services.length}
                  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <StatsCard
                  title="Active Alerts"
                  value={activeAlerts.length}
                  gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}