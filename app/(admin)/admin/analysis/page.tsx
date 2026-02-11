// app/admin/analysis/page.tsx - GOOGLE MATERIAL DESIGN THEME
'use client'

import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Paper, 
  alpha, 
  useMediaQuery,
  Typography,
  Chip,
  Fade,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Avatar,
  Stack,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { 
  Refresh, 
  TrendingUp, 
  Timeline,
  DashboardCustomize,
  Schedule,
  People,
  Person,
  Notes,
  Inventory,
  AttachMoney,
  Equalizer,
  CheckCircle,
  Warning,
  Security,
  Assessment,
  Category,
  InsertChart,
  BarChart,
  Storage,
  TrendingUp as TrendingUpIcon,
  AccessTime,
  NoteAdd,
  ArrowUpward,
  ArrowDownward,
  Analytics,
  FilterAlt,
  TrendingDown,
  ArrowBack,
  Description,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
} from '@mui/icons-material'
import Link from 'next/link'

// Types
interface DatabaseStats {
  totalUsers: number
  totalNotes: number
  activeUsers: number
  recentNotes: number
  sharedNotes: number
  recentUsers?: number
}

interface SystemOverview {
  databaseStats: DatabaseStats
}

interface AnalysisData {
  systemOverview: SystemOverview
  userAnalysis: {
    usersByRole: Array<{ _id: string; count: number }>
    usersByStatus: Array<{ _id: boolean; count: number }>
    newUsersByDay: Array<{ _id: string; count: number }>
  }
  notesAnalysis: {
    notesByCategory: Array<{ _id: string; count: number }>
    topUsersByNotes: Array<{
      name: string
      email: string
      noteCount: number
      lastCreated: string
    }>
  }
  engagementAnalysis: {
    usersWithNoNotes: Array<{ count: number }>
    usersWithManyNotes: Array<{ count: number }>
  }
  summary: {
    activeUserPercentage: number
    notesPerActiveUser: number
    growthRate: number
    engagementScore: number
    lastUpdated?: string
  }
  engagement: {
    averageEngagementRate?: number
    averageSessionDuration?: number
    dailyActiveUsers?: number
    retentionRate?: number
    bounceRate?: number
    summary?: string
  }
}

interface MaterialsAnalysisData {
  materialAnalysis: {
    materialsByCategory: Array<{ _id: string; count: number }>
    topUsersByMaterials: Array<{
      name: string
      email: string
      company: string
      materialCount: number
      totalInventoryValue: number
      avgUnitCost: number
    }>
  }
  userEngagement: {
    usersWithNoMaterials: Array<{ count: number }>
    usersWithManyMaterials: Array<{ count: number }>
  }
  summary: {
    totalMaterials: number
    recentMaterials: number
    totalStockValue: number
    lowStockItems: number
    outOfStockItems: number
    avgMaterialsPerUser: number
    materialGrowthRate: number
    activeMaterialUsers: number
    lastUpdated?: string
  }
}

// Loading Component
const LoadingState = () => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '80vh',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
  }}>
    <CircularProgress size={60} sx={{ color: '#1a73e8' }} />
    <Typography variant="h6" color="#5f6368" sx={{ mt: 3 }}>
      Loading analytics dashboard...
    </Typography>
    <Typography variant="body2" color="#5f6368" sx={{ mt: 1 }}>
      Please wait while we fetch your data
    </Typography>
  </Box>
)

// Error Alert Component
const ErrorAlert = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <Alert 
    severity="error" 
    onClose={onClose}
    sx={{ 
      borderRadius: '12px',
      mb: 3,
      backgroundColor: '#ffffff',
      border: '1px solid #ea4335',
      color: '#202124',
      '& .MuiAlert-icon': { color: '#ea4335' },
      '& .MuiAlert-message': {
        width: '100%'
      }
    }}
  >
    <AlertTitle>Error</AlertTitle>
    {message}
  </Alert>
)

// Stats Card Component
interface StatsCardProps {
  title: string
  value: string | number
  subValue?: string
  icon: React.ElementType
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  trend?: number
  showTrend?: boolean
  showProgress?: boolean
  compact?: boolean
}

const StatsCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  color,
  trend = 0,
  showTrend = false,
  showProgress = false,
  compact = false
}: StatsCardProps) => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  const colorMap = {
    primary: { main: '#1a73e8', light: '#8ab4f8' },
    success: { main: '#34a853', light: '#81c995' },
    warning: { main: '#fbbc04', light: '#fdd663' },
    error: { main: '#ea4335', light: '#f28b82' },
    info: { main: '#5f6368', light: '#9aa0a6' },
    secondary: { main: '#8ab4f8', light: '#aecbfa' }
  }

  const getColor = (colorType: keyof typeof colorMap) => {
    return darkMode ? colorMap[colorType].light : colorMap[colorType].main
  }

  const getTrendColor = (trendValue: number) => {
    return trendValue >= 0 ? '#34a853' : '#ea4335'
  }

  const getTrendIcon = (trendValue: number) => {
    return trendValue >= 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />
  }

  return (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: '16px', 
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        position: 'relative',
        height: '100%',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(getColor(color), 0.1)}`
        }
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, ${getColor(color)} 0%, ${alpha(getColor(color), 0.7)} 100%)`
      }} />

      <CardContent sx={{ 
        p: compact ? 2 : { xs: 2, sm: 2.5 },
        '&:last-child': { pb: compact ? 2 : { xs: 2, sm: 2.5 } }
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: compact ? 1 : 1.5
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h3" 
              component="div"
              fontWeight="bold" 
              sx={{ 
                color: getColor(color),
                fontSize: compact ? '1.5rem' : { xs: '1.75rem', sm: '2rem' },
                lineHeight: 1
              }}
            >
              {value}
              {subValue && (
                <Typography 
                  component="span" 
                  variant="body1" 
                  color={darkMode ? '#9aa0a6' : '#5f6368'}
                  sx={{ ml: 0.5, fontSize: '0.875rem' }}
                >
                  {subValue}
                </Typography>
              )}
            </Typography>
            <Typography 
              variant="body2" 
              color={darkMode ? '#9aa0a6' : '#5f6368'}
              sx={{ 
                fontSize: compact ? '0.75rem' : { xs: '0.8rem', sm: '0.875rem' },
                mt: 0.5
              }}
            >
              {title}
            </Typography>
          </Box>

          <Box sx={{
            width: compact ? 36 : { xs: 40, sm: 44 },
            height: compact ? 36 : { xs: 40, sm: 44 },
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: alpha(getColor(color), 0.1),
            color: getColor(color),
            flexShrink: 0
          }}>
            <Icon sx={{ fontSize: compact ? 20 : { xs: 22, sm: 24 } }} />
          </Box>
        </Box>

        {showTrend && trend !== 0 && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            mt: 1,
            flexWrap: 'wrap'
          }}>
            {getTrendIcon(trend)}
            <Typography 
              variant="caption" 
              fontWeight="medium"
              sx={{ 
                color: getTrendColor(trend),
                fontSize: compact ? '0.7rem' : '0.75rem'
              }}
            >
              {Math.abs(trend)}%
            </Typography>
            {!compact && (
              <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'} sx={{ fontSize: '0.75rem' }}>
                from last period
              </Typography>
            )}
          </Box>
        )}

        {showProgress && typeof value === 'number' && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                Score
              </Typography>
              <Typography variant="caption" fontWeight="bold">
                {value}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={value}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(getColor(color), 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${alpha(getColor(color), 0.3)} 0%, ${getColor(color)} 100%)`
                }
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

// Compact Analysis Header Component
interface CompactAnalysisHeaderProps {
  timeframe: string
  onTimeframeChange: (value: string) => void
  onRefresh: () => void
  loading: boolean
  compact?: boolean
}

const CompactAnalysisHeader = ({ 
  timeframe, 
  onTimeframeChange, 
  onRefresh, 
  loading,
  compact = false 
}: CompactAnalysisHeaderProps) => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={timeframe}
            onChange={(e) => onTimeframeChange(e.target.value)}
            displayEmpty
            size="small"
            sx={{ 
              '& .MuiSelect-select': { py: 0.75 },
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
            }}
          >
            <MenuItem value="7">7 days</MenuItem>
            <MenuItem value="30">30 days</MenuItem>
            <MenuItem value="90">90 days</MenuItem>
            <MenuItem value="365">1 year</MenuItem>
          </Select>
        </FormControl>
        
        <IconButton
          onClick={onRefresh}
          disabled={loading}
          size="small"
          sx={{
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '8px',
            p: 0.75,
            color: darkMode ? '#e8eaed' : '#202124',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            '&:hover': {
              backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
            }
          }}
        >
          <Refresh fontSize="small" />
        </IconButton>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' }, 
      alignItems: { xs: 'stretch', sm: 'center' }, 
      gap: 2,
      width: '100%'
    }}>
      <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 140 } }}>
        <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Timeframe</InputLabel>
        <Select
          value={timeframe}
          label="Timeframe"
          onChange={(e) => onTimeframeChange(e.target.value)}
          size="small"
          sx={{
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
            borderRadius: '8px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? '#3c4043' : '#dadce0',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? '#5f6368' : '#bdc1c6',
            }
          }}
        >
          <MenuItem value="7">Last 7 days</MenuItem>
          <MenuItem value="30">Last 30 days</MenuItem>
          <MenuItem value="90">Last 90 days</MenuItem>
          <MenuItem value="365">Last year</MenuItem>
        </Select>
      </FormControl>
      
      <Button
        variant="outlined"
        startIcon={<Refresh />}
        onClick={onRefresh}
        disabled={loading}
        size="small"
        sx={{
          borderRadius: '8px',
          borderWidth: 2,
          borderColor: darkMode ? '#5f6368' : '#dadce0',
          color: darkMode ? '#e8eaed' : '#202124',
          '&:hover': { 
            borderWidth: 2,
            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
          },
          minHeight: { xs: 40, sm: 36 }
        }}
      >
        Refresh
      </Button>
    </Box>
  )
}

// Analysis Tabs Component
interface AnalysisTabsProps {
  activeTab: number
  onTabChange: (value: number) => void
}

const AnalysisTabs = ({ activeTab, onTabChange }: AnalysisTabsProps) => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue)
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: darkMode ? '#3c4043' : '#dadce0' }}>
      <Tabs 
        value={activeTab} 
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            minHeight: { xs: 48, sm: 56 },
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            fontWeight: 500,
            textTransform: 'none',
            px: { xs: 1, sm: 2 },
            minWidth: 'auto',
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '&.Mui-selected': {
              color: darkMode ? '#8ab4f8' : '#1a73e8',
            }
          },
          '& .MuiTabs-indicator': {
            backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
            height: 3,
            borderRadius: '3px 3px 0 0',
          }
        }}
      >
        <Tab 
          icon={<People sx={{ fontSize: { xs: 18, sm: 20 } }} />} 
          iconPosition="start" 
          label="Users" 
        />
        <Tab 
          icon={<Notes sx={{ fontSize: { xs: 18, sm: 20 } }} />} 
          iconPosition="start" 
          label="Notes" 
        />
        <Tab 
          icon={<Inventory sx={{ fontSize: { xs: 18, sm: 20 } }} />} 
          iconPosition="start" 
          label="Materials" 
        />
        <Tab 
          icon={<Timeline sx={{ fontSize: { xs: 18, sm: 20 } }} />} 
          iconPosition="start" 
          label="Engagement" 
        />
      </Tabs>
    </Box>
  )
}

// User Analysis Component
const UserAnalysisContent = ({ data }: { data: AnalysisData | null }) => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (!data?.userAnalysis) return null

  return (
    <Box>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: { xs: 2, sm: 3 },
        mb: { xs: 3, sm: 4 }
      }}>
        {/* Users by Role */}
        <Box sx={{ 
          flex: {
            xs: '1 1 100%',
            md: '1 1 calc(50% - 12px)'
          },
          minWidth: {
            xs: '100%',
            md: 'calc(50% - 12px)'
          }
        }}>
          <Card elevation={0} sx={{ 
            borderRadius: '16px', 
            height: '100%',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <People sx={{ 
                  fontSize: 24,
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Users by Role
                </Typography>
              </Box>
              <TableContainer sx={{ maxHeight: 300, overflow: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                      <TableCell sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontWeight: 500,
                        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      }}>
                        Role
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontWeight: 500,
                        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      }}>
                        Count
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        fontWeight: 500,
                        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      }}>
                        Percentage
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.userAnalysis.usersByRole?.map((role, index) => (
                      <TableRow 
                        key={index}
                        sx={{ 
                          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          '&:hover': {
                            backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
                          }
                        }}
                      >
                        <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <Chip 
                            label={role._id || 'Unknown'} 
                            size="small"
                            sx={{ 
                              fontSize: { xs: '0.7rem', sm: '0.8rem' },
                              height: { xs: 20, sm: 24 },
                              backgroundColor: role._id === 'admin' 
                                ? (darkMode ? 'rgba(26, 115, 232, 0.1)' : 'rgba(26, 115, 232, 0.1)')
                                : (darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(138, 180, 248, 0.1)'),
                              color: role._id === 'admin' 
                                ? (darkMode ? '#8ab4f8' : '#1a73e8')
                                : (darkMode ? '#aecbfa' : '#5f6368'),
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: darkMode ? '#e8eaed' : '#202124' }}>
                            {role.count}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: darkMode ? '#e8eaed' : '#202124' }}>
                            {Math.round((role.count / data.systemOverview.databaseStats.totalUsers) * 100)}%
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Users by Status */}
        <Box sx={{ 
          flex: {
            xs: '1 1 100%',
            md: '1 1 calc(50% - 12px)'
          },
          minWidth: {
            xs: '100%',
            md: 'calc(50% - 12px)'
          }
        }}>
          <Card elevation={0} sx={{ 
            borderRadius: '16px', 
            height: '100%',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Security sx={{ 
                  fontSize: 24,
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Users by Status
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {data.userAnalysis.usersByStatus?.map((status, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: { xs: 1.25, sm: 1.5 },
                      borderRadius: '8px',
                      backgroundColor: status._id 
                        ? alpha('#34a853', darkMode ? 0.1 : 0.08)
                        : alpha('#ea4335', darkMode ? 0.1 : 0.08),
                      border: `1px solid ${status._id 
                        ? alpha('#34a853', darkMode ? 0.2 : 0.15)
                        : alpha('#ea4335', darkMode ? 0.2 : 0.15)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: status._id ? '#34a853' : '#ea4335'
                        }}
                      />
                      <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' }, color: darkMode ? '#e8eaed' : '#202124' }}>
                        {status._id ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                    <Typography fontWeight="bold" sx={{ 
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      color: status._id ? '#34a853' : '#ea4335'
                    }}>
                      {status.count} users
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Daily User Signups */}
      {data.userAnalysis.newUsersByDay && (
        <Box sx={{ width: '100%' }}>
          <Card elevation={0} sx={{ 
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Assessment sx={{ 
                  fontSize: 24,
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Daily User Signups (Last 14 Days)
                </Typography>
              </Box>
              <Box sx={{ 
                height: { xs: 150, sm: 200 }, 
                display: 'flex', 
                alignItems: 'flex-end', 
                gap: 1, 
                p: { xs: 1, sm: 2 },
                overflowX: 'auto'
              }}>
                {data.userAnalysis.newUsersByDay.slice(-14).map((day, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: { xs: 35, sm: 40, md: 45 }
                    }}
                  >
                    <Box
                      sx={{
                        width: '70%',
                        height: `${Math.min(day.count * 15, 130)}px`,
                        backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        borderRadius: '4px 4px 0 0',
                        mb: 1,
                        minHeight: 4
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        transform: { xs: 'rotate(-90deg)', sm: 'rotate(-45deg)' },
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      }}
                    >
                      {day._id.split('-')[2]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  )
}

// Notes Analysis Component
const NotesAnalysisContent = ({ data }: { data: AnalysisData | null }) => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  if (!data?.notesAnalysis) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: { xs: 4, sm: 6, md: 8 }
      }}>
        <Notes sx={{ fontSize: { xs: 48, sm: 56, md: 64 }, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
        <Typography variant="h6" color={darkMode ? '#9aa0a6' : '#5f6368'} gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          No Notes Data Available
        </Typography>
        <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
          Notes analytics will appear here once notes are created by users
        </Typography>
      </Box>
    )
  }

  const totalNotes = data.systemOverview?.databaseStats?.totalNotes || 0
  const recentNotes = data.systemOverview?.databaseStats?.recentNotes || 0
  const sharedNotes = data.systemOverview?.databaseStats?.sharedNotes || 0
  const notesPerUser = data.summary?.notesPerActiveUser || 0

  const notesByCategory = data.notesAnalysis.notesByCategory || []
  const categoriesWithPercentages = notesByCategory.map(category => ({
    ...category,
    percentage: totalNotes > 0 ? Math.round((category.count / totalNotes) * 100) : 0
  }))

  const summaryCards = [
    { title: 'Total Notes', value: totalNotes, color: 'primary' as const, icon: Notes },
    { title: 'Recent Notes', value: recentNotes, color: 'success' as const, icon: TrendingUpIcon },
    { title: 'Shared Notes', value: sharedNotes, color: 'info' as const, icon: BarChart },
    { title: 'Avg per User', value: notesPerUser, color: 'warning' as const, icon: Person }
  ]

  return (
    <Box>
      {/* Summary Stats */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: { xs: 1.5, sm: 2 },
        mb: { xs: 3, sm: 4 }
      }}>
        {summaryCards.map((card, index) => (
          <Box 
            key={index}
            sx={{ 
              flex: {
                xs: '1 1 calc(50% - 12px)',
                sm: '1 1 calc(50% - 16px)',
                md: '1 1 calc(25% - 18px)'
              },
              minWidth: {
                xs: 'calc(50% - 12px)',
                sm: 'calc(50% - 16px)',
                md: 'calc(25% - 18px)'
              }
            }}
          >
            <Card elevation={0} sx={{ 
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              height: '100%'
            }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                p: { xs: 1.5, sm: 2 }
              }}>
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  color={card.color === 'primary' ? (darkMode ? '#8ab4f8' : '#1a73e8') : 
                         card.color === 'success' ? '#34a853' : 
                         card.color === 'warning' ? '#fbbc04' : '#5f6368'}
                  sx={{ 
                    fontSize: { 
                      xs: '1.5rem', 
                      sm: '1.75rem', 
                      md: '2rem'
                    } 
                  }}
                >
                  {card.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  color={darkMode ? '#9aa0a6' : '#5f6368'}
                  sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    mt: 0.5
                  }}
                >
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: { xs: 2, sm: 3 },
        mb: { xs: 3, sm: 4 }
      }}>
        {/* Notes by Category */}
        <Box sx={{ 
          flex: {
            xs: '1 1 100%',
            lg: '1 1 calc(50% - 12px)'
          },
          minWidth: {
            xs: '100%',
            lg: 'calc(50% - 12px)'
          }
        }}>
          <Card elevation={0} sx={{ 
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Category sx={{ 
                  fontSize: 24,
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Notes by Category
                </Typography>
              </Box>
              
              {categoriesWithPercentages.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {categoriesWithPercentages.map((category, index) => (
                    <Box key={index}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        mb: 0.5
                      }}>
                        <Typography variant="body2" fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>
                          {category._id || 'Uncategorized'}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                          {category.count} ({category.percentage}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={category.percentage}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: alpha(darkMode ? '#8ab4f8' : '#1a73e8', 0.1),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8'
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  py: 4
                }}>
                  <InsertChart sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    No categories data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Top Users */}
        <Box sx={{ 
          flex: {
            xs: '1 1 100%',
            lg: '1 1 calc(50% - 12px)'
          },
          minWidth: {
            xs: '100%',
            lg: 'calc(50% - 12px)'
          }
        }}>
          <Card elevation={0} sx={{ 
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Assessment sx={{ 
                  fontSize: 24,
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Top Users by Notes
                </Typography>
              </Box>
              
              {data.notesAnalysis.topUsersByNotes.length > 0 ? (
                <TableContainer sx={{ maxHeight: 300 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                        <TableCell sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          fontWeight: 500,
                          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}>
                          User
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          fontWeight: 500,
                          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}>
                          Notes
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          fontWeight: 500,
                          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}>
                          Last Created
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.notesAnalysis.topUsersByNotes.slice(0, 5).map((user, index) => (
                        <TableRow 
                          key={index}
                          sx={{ 
                            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            '&:hover': {
                              backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
                            }
                          }}
                        >
                          <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                            <Box>
                              <Typography variant="body2" fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>
                                {user.name || user.email}
                              </Typography>
                              <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                                {user.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                            <Chip 
                              label={user.noteCount} 
                              size="small" 
                              sx={{
                                backgroundColor: darkMode ? 'rgba(26, 115, 232, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                                color: darkMode ? '#8ab4f8' : '#1a73e8',
                                fontWeight: 500,
                                border: 'none',
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                            <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                              {new Date(user.lastCreated).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  py: 4
                }}>
                  <BarChart sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    No users data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}

// Materials Analysis Component
const MaterialsAnalysisContent = ({ 
  data, 
  loading, 
  totalUsers 
}: { 
  data: MaterialsAnalysisData | null
  loading: boolean
  totalUsers: number 
}) => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 8
      }}>
        <CircularProgress size={60} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
        <Typography variant="h6" color={darkMode ? '#9aa0a6' : '#5f6368'} sx={{ mt: 2 }}>
          Loading materials analysis...
        </Typography>
      </Box>
    )
  }

  if (!data) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 8
      }}>
        <Inventory sx={{ fontSize: 64, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
        <Typography variant="h6" color={darkMode ? '#9aa0a6' : '#5f6368'} gutterBottom>
          No Materials Data Available
        </Typography>
        <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
          Materials analytics will appear here once materials are added
        </Typography>
      </Box>
    )
  }

  const { totalMaterials, lowStockItems, outOfStockItems, totalStockValue } = data.summary
  const inStockItems = totalMaterials - lowStockItems - outOfStockItems
  const stockHealthPercentage = totalMaterials > 0 
    ? Math.round((inStockItems / totalMaterials) * 100) 
    : 0

  return (
    <Box>
      {/* Stock Health */}
      <Card elevation={0} sx={{ 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        mb: 3 
      }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 3,
            pb: 2,
            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <Storage sx={{ 
              fontSize: 24,
              color: darkMode ? '#8ab4f8' : '#1a73e8',
            }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 500,
                color: darkMode ? '#e8eaed' : '#202124',
              }}
            >
              Stock Health Overview
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                Overall Stock Health
              </Typography>
              <Typography variant="body2" fontWeight="bold" color={
                stockHealthPercentage >= 80 ? '#34a853' :
                stockHealthPercentage >= 60 ? '#fbbc04' : '#ea4335'
              }>
                {stockHealthPercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={stockHealthPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha('#1a73e8', 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: 
                    stockHealthPercentage >= 80 ? '#34a853' :
                    stockHealthPercentage >= 60 ? '#fbbc04' : '#ea4335'
                }
              }}
            />
          </Box>

          <Box sx={{ 
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 2
          }}>
            {[
              { value: inStockItems, label: 'In Stock', color: 'success' as const, icon: CheckCircle },
              { value: lowStockItems, label: 'Low Stock', color: 'warning' as const, icon: Warning },
              { value: outOfStockItems, label: 'Out of Stock', color: 'error' as const, icon: Warning },
              { value: totalStockValue, label: 'Stock Value', color: 'info' as const, icon: AttachMoney, format: (v: number) => `₹${v.toLocaleString()}` }
            ].map((item, index) => (
              <Box 
                key={index}
                sx={{ 
                  flex: {
                    xs: '1 1 calc(50% - 8px)',
                    sm: '1 1 calc(25% - 12px)'
                  },
                  minWidth: {
                    xs: 'calc(50% - 8px)',
                    sm: 'calc(25% - 12px)'
                  }
                }}
              >
                <Box sx={{ 
                  p: 2, 
                  borderRadius: '12px', 
                  backgroundColor: alpha(
                    item.color === 'success' ? '#34a853' :
                    item.color === 'warning' ? '#fbbc04' :
                    item.color === 'error' ? '#ea4335' : '#5f6368',
                    darkMode ? 0.1 : 0.08
                  ),
                  border: `1px solid ${alpha(
                    item.color === 'success' ? '#34a853' :
                    item.color === 'warning' ? '#fbbc04' :
                    item.color === 'error' ? '#ea4335' : '#5f6368',
                    darkMode ? 0.2 : 0.15
                  )}`,
                  textAlign: 'center'
                }}>
                  <item.icon sx={{ 
                    color: item.color === 'success' ? '#34a853' :
                          item.color === 'warning' ? '#fbbc04' :
                          item.color === 'error' ? '#ea4335' : '#5f6368', 
                    fontSize: 32, mb: 1 
                  }} />
                  <Typography variant="h5" fontWeight="bold" color={item.color === 'success' ? '#34a853' :
                    item.color === 'warning' ? '#fbbc04' :
                    item.color === 'error' ? '#ea4335' : '#5f6368'}>
                    {item.format ? item.format(item.value) : item.value}
                  </Typography>
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    {item.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Categories and Top Users */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 3,
        mb: 3
      }}>
        {/* Categories */}
        <Box sx={{ 
          flex: {
            xs: '1 1 100%',
            lg: '1 1 calc(50% - 12px)'
          },
          minWidth: {
            xs: '100%',
            lg: 'calc(50% - 12px)'
          }
        }}>
          <Card elevation={0} sx={{ 
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Category sx={{ 
                  fontSize: 24,
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Materials by Category
                </Typography>
              </Box>
              
              {data.materialAnalysis.materialsByCategory.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {data.materialAnalysis.materialsByCategory.map((category, index) => {
                    const percentage = totalMaterials > 0 
                      ? Math.round((category.count / totalMaterials) * 100) 
                      : 0
                    
                    return (
                      <Box key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={category._id || 'Uncategorized'} 
                              size="small" 
                              variant="outlined"
                              sx={{
                                color: darkMode ? '#e8eaed' : '#202124',
                                borderColor: darkMode ? '#5f6368' : '#dadce0',
                              }}
                            />
                            <Typography variant="body2" fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>
                              {category.count}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                            {percentage}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: alpha(darkMode ? '#8ab4f8' : '#1a73e8', 0.1),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8'
                            }
                          }}
                        />
                      </Box>
                    )
                  })}
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  py: 4
                }}>
                  <Category sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    No categories data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Top Users */}
        <Box sx={{ 
          flex: {
            xs: '1 1 100%',
            lg: '1 1 calc(50% - 12px)'
          },
          minWidth: {
            xs: '100%',
            lg: 'calc(50% - 12px)'
          }
        }}>
          <Card elevation={0} sx={{ 
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Assessment sx={{ 
                  fontSize: 24,
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Top Users by Materials
                </Typography>
              </Box>
              
              {data.materialAnalysis.topUsersByMaterials.length > 0 ? (
                <TableContainer sx={{ maxHeight: 300 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                        <TableCell sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          fontWeight: 500,
                          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}>
                          User
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          fontWeight: 500,
                          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}>
                          Materials
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          fontWeight: 500,
                          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}>
                          Total Value
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.materialAnalysis.topUsersByMaterials.slice(0, 5).map((user, index) => (
                        <TableRow 
                          key={index}
                          sx={{ 
                            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            '&:hover': {
                              backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
                            }
                          }}
                        >
                          <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                            <Box>
                              <Typography variant="body2" fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>
                                {user.name || user.email}
                              </Typography>
                              <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                                {user.company || 'No company'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                            <Chip 
                              label={user.materialCount} 
                              size="small" 
                              sx={{
                                backgroundColor: darkMode ? 'rgba(26, 115, 232, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                                color: darkMode ? '#8ab4f8' : '#1a73e8',
                                fontWeight: 500,
                                border: 'none',
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                            <Typography variant="body2" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                              ₹{user.totalInventoryValue?.toLocaleString() || '0'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  py: 4
                }}>
                  <Person sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    No users data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}

// Engagement Analysis Component
const EngagementAnalysisContent = ({ data }: { data: AnalysisData | null }) => {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (!data?.engagement) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color={darkMode ? '#9aa0a6' : '#5f6368'}>
          No engagement data available
        </Typography>
      </Box>
    )
  }

  const engagement = data.engagement
  const activeUsers = data.systemOverview?.databaseStats?.activeUsers || 0
  const totalNotes = data.systemOverview?.databaseStats?.totalNotes || 0
  const notesPerActiveUser = activeUsers > 0 ? totalNotes / activeUsers : 0

  const formatNumber = (value: any, decimals: number = 1): string => {
    const num = Number(value)
    return isNaN(num) ? '0.0' : num.toFixed(decimals)
  }

  const metrics = [
    {
      label: 'Avg. Engagement Rate',
      value: `${formatNumber(engagement.averageEngagementRate)}%`,
      icon: TrendingUpIcon,
      color: darkMode ? '#8ab4f8' : '#1a73e8',
      progress: Number(engagement.averageEngagementRate) || 0
    },
    {
      label: 'Avg. Session Duration',
      value: `${formatNumber(engagement.averageSessionDuration)}m`,
      icon: AccessTime,
      color: '#34a853',
      progress: Math.min((Number(engagement.averageSessionDuration) || 0) / 10 * 100, 100)
    },
    {
      label: 'Daily Active Users',
      value: engagement.dailyActiveUsers?.toLocaleString() || '0',
      icon: People,
      color: '#5f6368',
      progress: Math.min((engagement.dailyActiveUsers || 0) / 1000 * 100, 100)
    },
    {
      label: 'Notes per Active User',
      value: formatNumber(notesPerActiveUser),
      icon: NoteAdd,
      color: '#fbbc04',
      progress: Math.min(notesPerActiveUser / 5 * 100, 100)
    }
  ]

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom color={darkMode ? '#e8eaed' : '#202124'}>
          Engagement Metrics
        </Typography>
        <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
          User interaction and activity patterns
        </Typography>
      </Box>

      {/* Metrics */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        mb: 4
      }}>
        {metrics.map((metric, index) => (
          <Box 
            key={index}
            sx={{ 
              flex: {
                xs: '1 1 calc(50% - 8px)',
                sm: '1 1 calc(50% - 8px)',
                md: '1 1 calc(25% - 12px)'
              },
              minWidth: {
                xs: 'calc(50% - 8px)',
                sm: 'calc(50% - 8px)',
                md: 'calc(25% - 12px)'
              }
            }}
          >
            <Card elevation={0} sx={{ 
              p: 2.5,
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${alpha(metric.color, 0.1)}`,
              height: '100%'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                <Box>
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    {metric.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: metric.color }}>
                    {metric.value}
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: '12px', 
                  background: alpha(metric.color, 0.1), 
                  color: metric.color 
                }}>
                  <metric.icon />
                </Box>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={metric.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: alpha(metric.color, 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: metric.color,
                    borderRadius: 3
                  }
                }}
              />
            </Card>
          </Box>
        ))}
      </Box>

      {/* Detailed Stats */}
      <Card elevation={0} sx={{ 
        p: 3, 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom color={darkMode ? '#e8eaed' : '#202124'}>
          Performance Indicators
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 2
        }}>
          {/* Retention Rate */}
          <Box sx={{ 
            flex: {
              xs: '1 1 calc(50% - 8px)',
              sm: '1 1 calc(50% - 8px)'
            },
            minWidth: {
              xs: 'calc(50% - 8px)',
              sm: 'calc(50% - 8px)'
            }
          }}>
            <Box sx={{ 
              p: 2,
              borderRadius: '12px',
              background: alpha('#34a853', darkMode ? 0.1 : 0.05),
              border: `1px solid ${alpha('#34a853', darkMode ? 0.2 : 0.1)}`
            }}>
              <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} gutterBottom>
                30-day Retention Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h5" fontWeight={700} color="#34a853">
                  {formatNumber(engagement.retentionRate)}%
                </Typography>
                {Number(engagement.retentionRate) > 50 ? (
                  <ArrowUpward sx={{ color: '#34a853' }} />
                ) : (
                  <ArrowDownward sx={{ color: '#ea4335' }} />
                )}
              </Box>
            </Box>
          </Box>

          {/* Bounce Rate */}
          <Box sx={{ 
            flex: {
              xs: '1 1 calc(50% - 8px)',
              sm: '1 1 calc(50% - 8px)'
            },
            minWidth: {
              xs: 'calc(50% - 8px)',
              sm: 'calc(50% - 8px)'
            }
          }}>
            <Box sx={{ 
              p: 2,
              borderRadius: '12px',
              background: alpha('#ea4335', darkMode ? 0.1 : 0.05),
              border: `1px solid ${alpha('#ea4335', darkMode ? 0.2 : 0.1)}`
            }}>
              <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} gutterBottom>
                Bounce Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h5" fontWeight={700} color="#ea4335">
                  {formatNumber(engagement.bounceRate)}%
                </Typography>
                {Number(engagement.bounceRate) < 30 ? (
                  <ArrowDownward sx={{ color: '#34a853' }} />
                ) : (
                  <ArrowUpward sx={{ color: '#ea4335' }} />
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {engagement.summary && (
          <Box sx={{ 
            mt: 3, 
            p: 2,
            borderRadius: '12px',
            background: alpha(darkMode ? '#8ab4f8' : '#1a73e8', darkMode ? 0.1 : 0.05),
            border: `1px solid ${alpha(darkMode ? '#8ab4f8' : '#1a73e8', darkMode ? 0.2 : 0.1)}`
          }}>
            <Typography variant="body2" sx={{ 
              color: darkMode ? '#8ab4f8' : '#1a73e8', 
              fontStyle: 'italic' 
            }}>
              {engagement.summary}
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  )
}

// Main Component
export default function AdminAnalysisPage() {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'))
  
  const [timeframe, setTimeframe] = useState('30')
  const [loading, setLoading] = useState(true)
  const [materialsLoading, setMaterialsLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<AnalysisData | null>(null)
  const [materialsData, setMaterialsData] = useState<MaterialsAnalysisData | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  // Data fetching functions
  const fetchAnalysisData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/admin/analysis?timeframe=${timeframe}`, {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      })
      
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`)
      
      const result = await response.json()
      if (!result.success) throw new Error(result.message || 'Failed to load data')
      
      setData(result.data)
      
    } catch (err: any) {
      console.error('Fetch error:', err)
      setError(err.message || 'Failed to load analysis data')
    } finally {
      setLoading(false)
    }
  }

  const fetchMaterialsAnalysis = async () => {
    try {
      setMaterialsLoading(true)
      
      const response = await fetch(`/api/admin/analysis/materials?timeframe=${timeframe}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setMaterialsData(result.data)
        }
      }
    } catch (err: any) {
      console.error('Error fetching materials:', err)
    } finally {
      setMaterialsLoading(false)
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchAnalysisData()
      await fetchMaterialsAnalysis()
    }
    
    fetchAllData()
  }, [timeframe])

  const handleRefresh = () => {
    setRefreshing(true)
    setData(null)
    setMaterialsData(null)
    fetchAnalysisData()
    fetchMaterialsAnalysis()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue)
  }

  if (loading && !data) {
    return <LoadingState />
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 0:
        return <UserAnalysisContent data={data} />
      case 1:
        return <NotesAnalysisContent data={data} />
      case 2:
        return <MaterialsAnalysisContent 
          data={materialsData} 
          loading={materialsLoading}
          totalUsers={data?.systemOverview?.databaseStats?.totalUsers || 0}
        />
      case 3:
        return <EngagementAnalysisContent data={data} />
      default:
        return null
    }
  }

  // Main cards data
  const mainCards = [
    {
      title: 'Total Users',
      value: data?.systemOverview?.databaseStats?.totalUsers || 0,
      icon: People,
      color: 'primary' as const,
      trend: data?.summary?.growthRate || 0,
      showTrend: true
    },
    {
      title: 'Active Users',
      value: data?.systemOverview?.databaseStats?.activeUsers || 0,
      subValue: `${data?.summary?.activeUserPercentage || 0}%`,
      icon: Person,
      color: 'secondary' as const
    },
    {
      title: 'Total Notes',
      value: data?.systemOverview?.databaseStats?.totalNotes || 0,
      icon: Notes,
      color: 'success' as const,
      showTrend: true
    },
    {
      title: 'Total Materials',
      value: materialsData?.summary?.totalMaterials || 0,
      subValue: `${materialsData?.summary?.recentMaterials || 0} recent`,
      icon: Inventory,
      color: 'warning' as const,
      trend: materialsData?.summary?.materialGrowthRate || 0,
      showTrend: true
    },
    {
      title: 'Stock Value',
      value: `₹${(materialsData?.summary?.totalStockValue || 0).toLocaleString()}`,
      icon: AttachMoney,
      color: 'info' as const
    },
    {
      title: 'Engagement Score',
      value: data?.summary?.engagementScore || 0,
      subValue: '/100',
      icon: Equalizer,
      color: 'error' as const,
      showProgress: true
    }
  ]

  const stockStatusCards = [
    {
      title: 'In Stock Items',
      value: materialsData?.summary ? 
        materialsData.summary.totalMaterials - materialsData.summary.lowStockItems - materialsData.summary.outOfStockItems 
        : 0,
      icon: CheckCircle,
      color: 'success' as const
    },
    {
      title: 'Low Stock',
      value: materialsData?.summary?.lowStockItems || 0,
      icon: Warning,
      color: 'warning' as const
    },
    {
      title: 'Out of Stock',
      value: materialsData?.summary?.outOfStockItems || 0,
      icon: Warning,
      color: 'error' as const
    },
    {
      title: 'Stock Value',
      value: `₹${(materialsData?.summary?.totalStockValue || 0).toLocaleString()}`,
      icon: AttachMoney,
      color: 'info' as const
    }
  ]

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
          <Button
            component={Link}
            href="/admin/dashboard"
            startIcon={<ArrowBack />}
            sx={{ 
              mb: 2,
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.08)',
              },
            }}
          >
            Back to Dashboard
          </Button>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                borderRadius: '16px',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}>
                <Analytics sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Box>
              <Box>
                <Typography 
                  variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
                  sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#e8eaed' : '#202124',
                    lineHeight: 1.2,
                  }}
                >
                  Analytics Dashboard
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    mt: 0.5,
                  }}
                >
                  Real-time insights and performance metrics
                </Typography>
              </Box>
            </Box>
            
            <CompactAnalysisHeader
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              onRefresh={handleRefresh}
              loading={loading || materialsLoading || refreshing}
              compact={isMobile}
            />
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <ErrorAlert 
            message={error}
            onClose={() => setError('')}
          />
        )}

        {/* Performance Overview */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Card sx={{ 
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
            mb: 3,
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'space-between',
                gap: 1,
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight={600} 
                  sx={{ 
                    fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Performance Overview
                </Typography>
                {data?.summary?.growthRate !== undefined && (
                  <Chip
                    icon={<TrendingUp sx={{ fontSize: { xs: '14px !important', sm: '16px !important' } }} />}
                    label={`${Number(data.summary.growthRate) > 0 ? '+' : ''}${Number(data.summary.growthRate).toFixed(1)}%`}
                    sx={{
                      backgroundColor: Number(data.summary.growthRate) > 0 
                        ? (darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)')
                        : (darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)'),
                      color: Number(data.summary.growthRate) > 0 
                        ? (darkMode ? '#34a853' : '#34a853')
                        : (darkMode ? '#ea4335' : '#ea4335'),
                      border: 'none',
                      fontWeight: 500,
                    }}
                    size={isMobile ? "small" : "medium"}
                    // sx={{ 
                    //   fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                    // }}
                  />
                )}
              </Box>
              
              {/* Main Cards */}
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: { xs: 1.5, sm: 2, md: 3 },
                mb: { xs: 3, sm: 4 }
              }}>
                {mainCards.map((card, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      flex: {
                        xs: '1 1 calc(50% - 12px)',
                        sm: '1 1 calc(33.333% - 16px)',
                        md: '1 1 calc(25% - 18px)',
                        lg: '1 1 calc(16.666% - 20px)'
                      },
                      minWidth: {
                        xs: 'calc(50% - 12px)',
                        sm: 'calc(33.333% - 16px)',
                        md: 'calc(25% - 18px)',
                        lg: 'calc(16.666% - 20px)'
                      }
                    }}
                  >
                    <StatsCard
                      title={card.title}
                      value={card.value}
                      subValue={card.subValue}
                      icon={card.icon}
                      color={card.color}
                      trend={card.trend}
                      showTrend={card.showTrend}
                      showProgress={card.showProgress}
                    />
                  </Box>
                ))}
              </Box>

              {/* Stock Status Cards */}
              {materialsData && (
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: { xs: 1.5, sm: 2, md: 3 }
                }}>
                  {stockStatusCards.map((card, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        flex: {
                          xs: '1 1 calc(50% - 12px)',
                          sm: '1 1 calc(50% - 16px)',
                          md: '1 1 calc(25% - 18px)'
                        },
                        minWidth: {
                          xs: 'calc(50% - 12px)',
                          sm: 'calc(50% - 16px)',
                          md: 'calc(25% - 18px)'
                        }
                      }}
                    >
                      <StatsCard
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        color={card.color}
                        compact
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Card sx={{ 
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
          }}>
            {/* Tabs */}
            <Box sx={{
              px: { xs: 2, sm: 3 },
              pt: { xs: 2, sm: 3 },
              pb: 0,
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <AnalysisTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </Box>
            
            {/* Tab Content */}
            <Box sx={{ 
              p: { xs: 2, sm: 3 },
              minHeight: { xs: '350px', sm: '450px', md: '500px' }
            }}>
              {data && renderActiveTabContent()}
            </Box>
          </Card>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: 1,
          pt: 2,
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
        }}>
          <Typography 
            variant="caption" 
            color={darkMode ? '#9aa0a6' : '#5f6368'} 
            sx={{ 
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }}
          >
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
          <Typography 
            variant="caption" 
            color={darkMode ? '#9aa0a6' : '#5f6368'} 
            sx={{ 
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }}
          >
            {data?.summary?.lastUpdated && `Data as of ${new Date(data.summary.lastUpdated).toLocaleDateString()}`}
          </Typography>
        </Box>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && data && (
          <Box 
            sx={{ 
              mt: 3, 
              p: { xs: 1, sm: 1.5 }, 
              borderRadius: '12px',
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`
            }}
          >
            <details>
              <summary style={{ 
                cursor: 'pointer', 
                color: darkMode ? '#8ab4f8' : '#1a73e8',
                fontWeight: 500,
                outline: 'none',
                fontSize: isMobile ? '0.8rem' : '0.875rem'
              }}>
                Debug Information
              </summary>
              <Box 
                sx={{ 
                  mt: 1, 
                  p: 1, 
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  maxHeight: '150px',
                  overflow: 'auto'
                }}
              >
                <pre style={{ 
                  margin: 0, 
                  fontSize: isMobile ? '10px' : '11px',
                  color: darkMode ? '#e8eaed' : '#202124'
                }}>
                  {JSON.stringify(data.systemOverview?.databaseStats, null, 2)}
                </pre>
              </Box>
            </details>
          </Box>
        )}
      </Container>
    </Box>
  )
}