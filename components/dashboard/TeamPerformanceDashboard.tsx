// components/dashboard/TeamPerformanceDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tabs,
  Tab,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Person,
  Task,
  Assessment,
  Timeline,
  MoreVert,
  Star,
  EmojiEvents,
  AccessTime,
  CheckCircle,
  Group,
  Refresh,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface TeamMemberPerformance {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  performance: number;
  tasksCompleted: number;
  projectsInvolved: number;
  efficiency: number;
  lastActive: string;
  workload: number;
  trends: {
    daily: Array<{ date: string; score: number }>;
    weekly: Array<{ week: string; tasks: number }>;
  };
  strengths: string[];
  areasForImprovement: string[];
}

export default function TeamPerformanceDashboard() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [teamData, setTeamData] = useState<TeamMemberPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  useEffect(() => {
    fetchTeamPerformance();
  }, [timeRange]);

  const fetchTeamPerformance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/team/performance?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setTeamData(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch team performance:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate team averages
  const teamAverages = teamData.length > 0 ? {
    performance: Math.round(teamData.reduce((sum, m) => sum + m.performance, 0) / teamData.length),
    efficiency: Math.round(teamData.reduce((sum, m) => sum + m.efficiency, 0) / teamData.length),
    workload: Math.round(teamData.reduce((sum, m) => sum + m.workload, 0) / teamData.length),
    tasksCompleted: teamData.reduce((sum, m) => sum + m.tasksCompleted, 0),
  } : null;

  // Prepare chart data
  const performanceChartData = teamData.map(member => ({
    name: member.name.split(' ')[0],
    performance: member.performance,
    efficiency: member.efficiency,
    workload: member.workload,
  }));

  const trendData = teamData.length > 0 ? teamData[0].trends.daily : [];

  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: 400 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
      {/* Summary Cards */}
      <Box sx={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: { xs: 1.5, sm: 2, md: 3 },
        '& > *': {
          flex: '1 1 calc(50% - 8px)',
          minWidth: 0,
          '@media (min-width: 600px)': {
            flex: '1 1 calc(25% - 12px)'
          }
        }
      }}>
        {/* Team Performance Card */}
        <Card sx={{ 
          borderRadius: 3,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: darkMode 
              ? `0 8px 24px ${alpha('#4285f4', 0.3)}`
              : `0 8px 24px ${alpha('#4285f4', 0.2)}`,
            borderColor: '#4285f4'
          }
        }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Team Performance
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontWeight: 600,
                    mt: 0.5
                  }}
                >
                  {teamAverages?.performance || 0}%
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                >
                  Average Score
                </Typography>
              </Box>
              <Box sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: 2,
                backgroundColor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <EmojiEvents sx={{ 
                  fontSize: { xs: 20, sm: 24 },
                  color: '#4285f4'
                }} />
              </Box>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={teamAverages?.performance || 0} 
              sx={{ 
                mt: 1,
                height: 8,
                borderRadius: 4,
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: teamAverages?.performance || 0 >= 80 ? '#34a853' : 
                                  teamAverages?.performance || 0 >= 60 ? '#4285f4' : '#ea4335'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Efficiency Card */}
        <Card sx={{ 
          borderRadius: 3,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: darkMode 
              ? `0 8px 24px ${alpha('#34a853', 0.3)}`
              : `0 8px 24px ${alpha('#34a853', 0.2)}`,
            borderColor: '#34a853'
          }
        }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Efficiency
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontWeight: 600,
                    mt: 0.5
                  }}
                >
                  {teamAverages?.efficiency || 0}%
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                >
                  Task Completion Rate
                </Typography>
              </Box>
              <Box sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: 2,
                backgroundColor: darkMode ? alpha('#34a853', 0.2) : alpha('#34a853', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Timeline sx={{ 
                  fontSize: { xs: 20, sm: 24 },
                  color: '#34a853'
                }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Completed Tasks Card */}
        <Card sx={{ 
          borderRadius: 3,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: darkMode 
              ? `0 8px 24px ${alpha('#4285f4', 0.3)}`
              : `0 8px 24px ${alpha('#4285f4', 0.2)}`,
            borderColor: '#4285f4'
          }
        }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Completed Tasks
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontWeight: 600,
                    mt: 0.5
                  }}
                >
                  {teamAverages?.tasksCompleted || 0}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                >
                  This {timeRange}
                </Typography>
              </Box>
              <Box sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: 2,
                backgroundColor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CheckCircle sx={{ 
                  fontSize: { xs: 20, sm: 24 },
                  color: '#4285f4'
                }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Workload Card */}
        <Card sx={{ 
          borderRadius: 3,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: darkMode 
              ? `0 8px 24px ${alpha('#fbbc04', 0.3)}`
              : `0 8px 24px ${alpha('#fbbc04', 0.2)}`,
            borderColor: '#fbbc04'
          }
        }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Workload
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontWeight: 600,
                    mt: 0.5
                  }}
                >
                  {teamAverages?.workload || 0}%
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    color: darkMode ? '#9aa0a6' : '#5f6368'
                  }}
                >
                  Average Capacity
                </Typography>
              </Box>
              <Box sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: 2,
                backgroundColor: darkMode ? alpha('#fbbc04', 0.2) : alpha('#fbbc04', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <AccessTime sx={{ 
                  fontSize: { xs: 20, sm: 24 },
                  color: '#fbbc04'
                }} />
              </Box>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={teamAverages?.workload || 0} 
              sx={{ 
                mt: 1,
                height: 8,
                borderRadius: 4,
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: (teamAverages?.workload || 0) > 80 ? '#ea4335' : 
                                  (teamAverages?.workload || 0) > 60 ? '#fbbc04' : '#34a853'
                }
              }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Charts */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, sm: 3 }
      }}>
        {/* Team Performance Chart */}
        <Card sx={{ 
          flex: 1,
          borderRadius: 3,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <CardContent sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            p: { xs: 1.5, sm: 2 } 
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2 
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontWeight: 600
                }}
              >
                Team Performance Comparison
              </Typography>
              <Tooltip title="Refresh data">
                <IconButton 
                  size="small" 
                  onClick={fetchTeamPerformance}
                  disabled={loading}
                  sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                >
                  <Refresh fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ flex: 1, minHeight: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceChartData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={darkMode ? '#3c4043' : '#e0e0e0'} 
                  />
                  <XAxis 
                    dataKey="name" 
                    tick={{ 
                      fontSize: isMobile ? 10 : 12,
                      fill: darkMode ? '#9aa0a6' : '#5f6368'
                    }}
                  />
                  <YAxis 
                    tick={{ 
                      fontSize: isMobile ? 10 : 12,
                      fill: darkMode ? '#9aa0a6' : '#5f6368'
                    }}
                  />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      borderRadius: 8,
                      color: darkMode ? '#e8eaed' : '#202124'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="performance" 
                    fill="#4285f4" 
                    name="Performance Score" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="efficiency" 
                    fill="#34a853" 
                    name="Efficiency %" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Performance Trend Chart */}
        <Card sx={{ 
          flex: { md: 0.7 },
          borderRadius: 3,
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <CardContent sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            p: { xs: 1.5, sm: 2 } 
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                color: darkMode ? '#e8eaed' : '#202124',
                fontWeight: 600,
                mb: 2
              }}
            >
              Performance Trend
            </Typography>
            <Box sx={{ flex: 1, minHeight: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={darkMode ? '#3c4043' : '#e0e0e0'} 
                  />
                  <XAxis 
                    dataKey="date" 
                    tick={{ 
                      fontSize: isMobile ? 10 : 12,
                      fill: darkMode ? '#9aa0a6' : '#5f6368'
                    }}
                  />
                  <YAxis 
                    tick={{ 
                      fontSize: isMobile ? 10 : 12,
                      fill: darkMode ? '#9aa0a6' : '#5f6368'
                    }}
                  />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      borderRadius: 8,
                      color: darkMode ? '#e8eaed' : '#202124'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4285f4" 
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Team Member List */}
      <Card sx={{ 
        borderRadius: 3,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
            mb: 3
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                color: darkMode ? '#e8eaed' : '#202124',
                fontWeight: 600
              }}
            >
              Team Member Performance
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-end' }
            }}>
              {(['week', 'month', 'quarter'] as const).map((range) => (
                <Button
                  key={range}
                  size="small"
                  onClick={() => setTimeRange(range)}
                  variant={timeRange === range ? "contained" : "outlined"}
                  sx={{
                    minWidth: isMobile ? 70 : 80,
                    textTransform: 'capitalize',
                    borderRadius: 2,
                    backgroundColor: timeRange === range 
                      ? (darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1))
                      : 'transparent',
                    color: timeRange === range 
                      ? (darkMode ? '#8ab4f8' : '#4285f4')
                      : (darkMode ? '#9aa0a6' : '#5f6368'),
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    '&:hover': {
                      borderColor: darkMode ? '#4285f4' : '#4285f4',
                      backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.05),
                    }
                  }}
                >
                  {range}
                </Button>
              ))}
            </Box>
          </Box>

          <List sx={{ width: '100%' }}>
            {teamData.map((member, index) => (
              <React.Fragment key={member.id}>
                <ListItem sx={{ 
                  py: { xs: 1.5, sm: 2 },
                  px: 0,
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: { xs: 2, sm: 0 }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' }
                  }}>
                    <ListItemAvatar sx={{ minWidth: 'auto' }}>
                      <Avatar 
                        src={member.avatar}
                        sx={{ 
                          width: { xs: 48, sm: 56 },
                          height: { xs: 48, sm: 56 },
                          border: `2px solid ${darkMode ? '#3c4043' : '#f1f3f4'}`
                        }}
                      >
                        {member.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.95rem', sm: '1rem' },
                          color: darkMode ? '#e8eaed' : '#202124',
                          mb: 0.5
                        }}
                      >
                        {member.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={member.role} 
                          size="small" 
                          sx={{ 
                            backgroundColor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
                            color: darkMode ? '#8ab4f8' : '#4285f4',
                            fontWeight: 500,
                            fontSize: '0.7rem'
                          }}
                        />
                        <Chip 
                          label={member.department} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            borderColor: darkMode ? '#3c4043' : '#dadce0',
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                            fontWeight: 500,
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    flex: 1,
                    ml: { sm: 3 },
                    width: { xs: '100%', sm: 'auto' }
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mt: { xs: 1, sm: 0 },
                      mb: 1,
                      flexWrap: 'wrap',
                      gap: { xs: 1, sm: 2 }
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          color: darkMode ? '#9aa0a6' : '#5f6368'
                        }}
                      >
                        <TrendingUp sx={{ 
                          fontSize: 14, 
                          mr: 0.5, 
                          color: member.performance >= 80 ? '#34a853' : member.performance >= 60 ? '#4285f4' : '#ea4335'
                        }} />
                        Performance: {member.performance}%
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          color: darkMode ? '#9aa0a6' : '#5f6368'
                        }}
                      >
                        <Task sx={{ fontSize: 14, mr: 0.5 }} />
                        Tasks: {member.tasksCompleted}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          color: darkMode ? '#9aa0a6' : '#5f6368'
                        }}
                      >
                        <AccessTime sx={{ fontSize: 14, mr: 0.5 }} />
                        Workload: {member.workload}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={member.performance} 
                      sx={{ 
                        width: { xs: '100%', sm: '80%' },
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: member.performance >= 80 ? '#34a853' : 
                                          member.performance >= 60 ? '#4285f4' : '#ea4335'
                        }
                      }}
                    />
                  </Box>
                </ListItem>
                {index < teamData.length - 1 && (
                  <Divider 
                    variant="inset" 
                    component="li" 
                    sx={{ 
                      ml: { xs: 0, sm: 9 },
                      borderColor: darkMode ? '#3c4043' : '#dadce0'
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}