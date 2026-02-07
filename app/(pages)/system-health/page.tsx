"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Container,
  alpha,
  Breadcrumbs,
} from '@mui/material';
import {
  Home as HomeIcon,
} from "@mui/icons-material";
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
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
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';
  
  const [services, setServices] = useState<SystemService[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isOnline, setIsOnline] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter services based on search term
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalAlerts = alerts.filter(alert => !alert.resolved && (alert.severity === 'high' || alert.severity === 'critical'));
  const activeAlerts = alerts.filter(alert => !alert.resolved);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <MainLayout title={SYSTEM_HEALTH.PAGE_TITLE}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
              Loading system health...
            </Typography>
            <CircularProgress sx={{ color: '#4285f4' }} />
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="System Health">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              System Health
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              System Health Dashboard
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Monitor your account services, performance, and system status
            </Typography>
          </Box>

          {/* Stats Chips */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            mt: 3,
          }}>
            <Chip
              label={`${services.length} Total Services`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                borderColor: alpha('#4285f4', 0.3),
                color: darkMode ? '#8ab4f8' : '#4285f4',
              }}
            />
            <Chip
              label={`${services.filter(s => s.status === 'healthy').length} Healthy`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08),
                borderColor: alpha('#34a853', 0.3),
                color: darkMode ? '#81c995' : '#34a853',
              }}
            />
            <Chip
              label={`${activeAlerts.length} Active Alerts`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.08),
                borderColor: alpha('#ea4335', 0.3),
                color: darkMode ? '#f28b82' : '#ea4335',
              }}
            />
            {!isOnline && (
              <Chip
                label="Offline Mode"
                variant="outlined"
                sx={{
                  backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
                  borderColor: alpha('#fbbc04', 0.3),
                  color: darkMode ? '#fdd663' : '#fbbc04',
                }}
              />
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              title="Error Loading System Health"
              message={error}
              dismissible
              onDismiss={() => setError(null)}
              action={
                <Button
                  variant="text"
                  onClick={fetchSystemHealth}
                  size="small"
                  sx={{ color: darkMode ? '#8ab4f8' : '#4285f4' }}
                >
                  Retry
                </Button>
              }
              sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
            />
          )}

          {/* Critical Alerts Banner */}
          {criticalAlerts.length > 0 && (
            <Alert
              severity="error"
              title={`${criticalAlerts.length} Critical Alert${criticalAlerts.length > 1 ? 's' : ''}`}
              message="Immediate attention required. Some services may be affected."
              dismissible={false}
              sx={{ 
                mb: { xs: 2, sm: 3, md: 4 },
                backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.08),
                borderColor: alpha('#ea4335', 0.3),
              }}
            />
          )}

          {/* Search and Controls */}
          <Card
            title="System Health Overview"
            subtitle={`Last updated: ${lastUpdated ? formatDate(lastUpdated) : 'Never'}`}
            action={
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Chip
                  label={autoRefresh ? "Auto Refresh ON" : "Auto Refresh OFF"}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  variant={autoRefresh ? 'filled' : 'outlined'}
                  sx={{
                    backgroundColor: autoRefresh ? '#34a853' : 'transparent',
                    color: autoRefresh ? 'white' : darkMode ? '#e8eaed' : '#202124',
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={refreshData}
                  disabled={loading}
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Refresh Now
                </Button>
              </Box>
            }
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', sm: 'center' },
              mt: 2,
            }}>
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flex: 1 }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="medium"
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Filter Status
                </Button>
              </Box>
            </Box>
          </Card>

          {/* Main Content Layout */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 3,
          }}>
            {/* Left Column - Services */}
            <Box sx={{ flex: 1 }}>
              {/* Stats Cards */}
              <Box sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 1.5, sm: 2, md: 3 },
                mb: { xs: 2, sm: 3, md: 4 },
              }}>
                {[
                  { 
                    title: 'Total Services', 
                    value: services.length, 
                    color: '#4285f4',
                    description: 'All monitored services' 
                  },
                  { 
                    title: 'Healthy Services', 
                    value: services.filter(s => s.status === 'healthy').length, 
                    color: '#34a853',
                    description: 'Operating normally' 
                  },
                  { 
                    title: 'Active Alerts', 
                    value: activeAlerts.length, 
                    color: '#ea4335',
                    description: 'Requiring attention' 
                  },
                  { 
                    title: 'Recent Errors', 
                    value: userStats?.recentErrors || 0, 
                    color: '#fbbc04',
                    description: 'Last 24 hours' 
                  },
                  { 
                    title: 'Storage Used', 
                    value: `${userStats?.storageUsage?.toFixed(1) || 0}MB`, 
                    color: '#8ab4f8',
                    description: 'Your usage' 
                  },
                  { 
                    title: 'Documents', 
                    value: userStats?.totalDocuments || 0, 
                    color: '#81c995',
                    description: 'Your documents' 
                  },
                ].map((stat, index) => (
                  <Card 
                    key={`stat-${index}`}
                    hover
                    sx={{ 
                      flex: '1 1 calc(33.333% - 16px)', 
                      minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 16px)' },
                      p: { xs: 1.5, sm: 2, md: 3 }, 
                      borderRadius: '16px', 
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      border: `1px solid ${alpha(stat.color, 0.2)}`,
                      background: darkMode 
                        ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                        : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'translateY(-2px)', 
                        boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368', 
                          fontWeight: 400,
                          fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                          display: 'block',
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography 
                        variant={isMobile ? "h5" : "h4"}
                        sx={{ 
                          color: stat.color, 
                          fontWeight: 600,
                          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                          display: 'block',
                        }}
                      >
                        {stat.description}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Box>

              {/* Services Grid */}
              <Card
                title="Service Status"
                subtitle={`${filteredServices.length} service${filteredServices.length !== 1 ? 's' : ''} found`}
                hover
                sx={{ 
                  mb: 3,
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(2, 1fr)', 
                    lg: 'repeat(2, 1fr)' 
                  },
                  gap: 3,
                  mt: 2,
                }}>
                  {filteredServices.length === 0 ? (
                    <Box sx={{ 
                      gridColumn: '1 / -1',
                      p: 4,
                      textAlign: 'center',
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2,
                          color: darkMode ? '#e8eaed' : '#202124',
                        }}
                      >
                        No Services Found
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 3,
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                        }}
                      >
                        {searchTerm 
                          ? 'Try adjusting your search terms'
                          : 'No services are currently being monitored'}
                      </Typography>
                    </Box>
                  ) : (
                    filteredServices.map((service, index) => (
                      <ServiceCard
                        key={service.id}
                        {...service}
                        sx={{
                          animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                          '@keyframes fadeInUp': {
                            from: {
                              opacity: 0,
                              transform: 'translateY(20px)',
                            },
                            to: {
                              opacity: 1,
                              transform: 'translateY(0)',
                            },
                          },
                        }}
                      />
                    ))
                  )}
                </Box>
              </Card>
            </Box>

            {/* Right Column - Sidebar */}
            <Box sx={{ 
              width: { xs: '100%', lg: 380 },
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
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
                title={`Active Alerts (${activeAlerts.length})`}
              />

              {/* Quick Actions */}
              <Card
                title="Quick Actions"
                hover
                sx={{ 
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 2,
                  mt: 2,
                }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                      justifyContent: 'flex-start',
                    }}
                  >
                    View Detailed Reports
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                      justifyContent: 'flex-start',
                    }}
                  >
                    Export System Logs
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                      justifyContent: 'flex-start',
                    }}
                  >
                    Contact Support
                  </Button>
                </Box>
              </Card>

              {/* System Info */}
              <Card
                title="System Information"
                hover
                sx={{ 
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 1.5,
                  mt: 2,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Last Check
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {lastUpdated ? formatDate(lastUpdated) : 'Never'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Refresh Interval
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {autoRefresh ? '10 seconds' : 'Manual'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Connection Status
                    </Typography>
                    <Chip
                      label={isOnline ? "Online" : "Offline"}
                      size="small"
                      sx={{
                        backgroundColor: isOnline 
                          ? darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08)
                          : darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
                        color: isOnline ? '#34a853' : '#fbbc04',
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      API Version
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      v2.1.0
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Box>

          {/* Offline Indicator */}
          {!isOnline && (
            <Box sx={{ 
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 1000,
            }}>
              <Alert
                severity="warning"
                title="Offline Mode"
                message="You are currently offline. System data may not be up to date."
                dismissible={false}
                sx={{
                  maxWidth: 300,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              />
            </Box>
          )}
        </Container>
      </Box>
    </MainLayout>
  );
}