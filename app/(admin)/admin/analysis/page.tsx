// app/admin/analysis/page.tsx - COMPLETE VERSION
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  alpha,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  Stack,
} from '@mui/material'
import {
  People,
  Notes,
  Inventory,
  TrendingUp,
  TrendingDown,
  Equalizer,
  Timeline,
  Refresh,
  Visibility,
  Person,
  Assessment,
  Analytics,
  Category,
  AttachMoney,
  Storage,
  Warning,
  CheckCircle,
  Security,
  Email,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'

interface AnalysisData {
  systemOverview: {
    databaseStats: {
      totalUsers: number
      totalNotes: number
      activeUsers: number
      recentNotes: number
      sharedNotes: number
    }
  }
  userAnalysis: any
  notesAnalysis: any
  engagementAnalysis: any
  summary: {
    activeUserPercentage: number
    notesPerActiveUser: number
    growthRate: number
    engagementScore: number
  }
}

interface MaterialsAnalysisData {
  materialAnalysis: any
  userEngagement: any
  summary: {
    totalMaterials: number
    recentMaterials: number
    totalStockValue: number
    lowStockItems: number
    outOfStockItems: number
    avgMaterialsPerUser: number
    materialGrowthRate: number
    activeMaterialUsers: number
  }
}

export default function AdminAnalysissPage() {
  const theme = useTheme()
  const router = useRouter()
  
  const [timeframe, setTimeframe] = useState('30')
  const [loading, setLoading] = useState(true)
  const [materialsLoading, setMaterialsLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<AnalysisData | null>(null)
  const [materialsData, setMaterialsData] = useState<MaterialsAnalysisData | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  const fetchAnalysisData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/admin/analysis?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch analysis data')
      }
      
      setData(result.data)
    } catch (err: any) {
      setError(err.message || 'Failed to load analysis data')
      console.error('Error fetching analysis:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMaterialsAnalysis = async () => {
    try {
      setMaterialsLoading(true)
      
      const response = await fetch(`/api/admin/analysis/materials?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch materials analysis')
      }
      
      setMaterialsData(result.data)
    } catch (err: any) {
      console.error('Error fetching materials analysis:', err)
    } finally {
      setMaterialsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysisData()
    fetchMaterialsAnalysis()
  }, [timeframe])

  const handleRefresh = () => {
    fetchAnalysisData()
    fetchMaterialsAnalysis()
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Function to render overview cards without Grid
  const renderOverviewCards = () => {
    const cards = [
      {
        title: 'Total Users',
        value: data?.systemOverview.databaseStats.totalUsers || 0,
        icon: <People sx={{ fontSize: 48, color: alpha(theme.palette.primary.main, 0.2) }} />,
        color: theme.palette.primary.main
      },
      {
        title: 'Active Users',
        value: data?.systemOverview.databaseStats.activeUsers || 0,
        subValue: `${data?.summary.activeUserPercentage || 0}%`,
        icon: <Person sx={{ fontSize: 48, color: alpha(theme.palette.secondary.main, 0.2) }} />,
        color: theme.palette.secondary.main
      },
      {
        title: 'Total Notes',
        value: data?.systemOverview.databaseStats.totalNotes || 0,
        icon: <Notes sx={{ fontSize: 48, color: alpha(theme.palette.success.main, 0.2) }} />,
        color: theme.palette.success.main
      },
      {
        title: 'Total Materials',
        value: materialsData?.summary.totalMaterials || 0,
        subValue: `${materialsData?.summary.recentMaterials || 0} recent`,
        icon: <Inventory sx={{ fontSize: 48, color: alpha(theme.palette.warning.main, 0.2) }} />,
        color: theme.palette.warning.main
      },
      {
        title: 'Stock Value',
        value: `₹${(materialsData?.summary.totalStockValue || 0).toLocaleString()}`,
        icon: <AttachMoney sx={{ fontSize: 48, color: alpha(theme.palette.info.main, 0.2) }} />,
        color: theme.palette.info.main
      },
      {
        title: 'Engagement Score',
        value: data?.summary.engagementScore || 0,
        icon: <Equalizer sx={{ fontSize: 48, color: alpha(theme.palette.error.main, 0.2) }} />,
        color: theme.palette.error.main
      }
    ]

    return (
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)'
          },
          gap: 3,
          mb: 4
        }}
      >
        {cards.map((card, index) => (
          <Card 
            key={index} 
            elevation={3} 
            sx={{ 
              borderRadius: 3, 
              overflow: 'hidden',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: card.color }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.title}
                  </Typography>
                  {card.subValue && (
                    <Typography variant="caption" color="text.secondary">
                      {card.subValue}
                    </Typography>
                  )}
                </Box>
                {card.icon}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    )
  }

  // Function to render user analysis
  const renderUserAnalysis = () => {
    if (!data?.userAnalysis) return null

    return (
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)'
            },
            gap: 3
          }}
        >
          {/* Users by Role */}
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <People />
                Users by Role
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Role</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.userAnalysis.usersByRole?.map((role: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip 
                            label={role._id || 'Unknown'} 
                            size="small"
                            color={
                              role._id === 'admin' ? 'primary' : 
                              role._id === 'user' ? 'secondary' : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell align="right">{role.count}</TableCell>
                        <TableCell align="right">
                          {Math.round((role.count / data.systemOverview.databaseStats.totalUsers) * 100)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Users by Status */}
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security />
                Users by Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {data.userAnalysis.usersByStatus?.map((status: any, index: number) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: status._id ? theme.palette.success.main : theme.palette.error.main
                        }}
                      />
                      <Typography>{status._id ? 'Active' : 'Inactive'}</Typography>
                    </Box>
                    <Typography fontWeight="bold">{status.count} users</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Daily User Signups */}
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment />
              Daily User Signups (Last 14 Days)
            </Typography>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 1, p: 2 }}>
              {data.userAnalysis.newUsersByDay?.slice(-14).map((day: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: '80%',
                      height: `${Math.min(day.count * 20, 150)}px`,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 1,
                      mb: 1,
                    }}
                  />
                  <Typography variant="caption" sx={{ transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>
                    {day._id.split('-')[2]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Stack>
    )
  }

  // Function to render notes analysis
  const renderNotesAnalysis = () => {
    if (!data?.notesAnalysis) return null

    return (
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)'
            },
            gap: 3
          }}
        >
          {/* Notes by Category */}
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notes />
                Notes by Category
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {data.notesAnalysis.notesByCategory?.map((category: any, index: number) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }}
                  >
                    <Chip label={category._id || 'Uncategorized'} size="small" />
                    <Typography fontWeight="bold">{category.count} notes</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Top Users by Notes */}
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment />
                Top Users by Notes
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell align="right">Notes</TableCell>
                      <TableCell align="right">Last Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.notesAnalysis.topUsersByNotes?.slice(0, 5).map((user: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {user.name || user.email}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={user.noteCount} size="small" color="primary" />
                        </TableCell>
                        <TableCell align="right">
                          {new Date(user.lastCreated).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    )
  }

  // Function to render materials analysis
  const renderMaterialsAnalysis = () => {
    if (materialsLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )
    }

    if (!materialsData) return null

    return (
      <Stack spacing={3}>
        {/* Stock Status Cards */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 3
          }}
        >
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Storage color="primary" />
                <Box>
                  <Typography variant="h6">{materialsData.summary.totalMaterials}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Materials</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircle color="success" />
                <Box>
                  <Typography variant="h6">
                    {materialsData.summary.totalMaterials - materialsData.summary.lowStockItems - materialsData.summary.outOfStockItems}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">In Stock Items</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Warning color="warning" />
                <Box>
                  <Typography variant="h6">{materialsData.summary.lowStockItems}</Typography>
                  <Typography variant="body2" color="text.secondary">Low Stock Items</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Warning color="error" />
                <Box>
                  <Typography variant="h6">{materialsData.summary.outOfStockItems}</Typography>
                  <Typography variant="body2" color="text.secondary">Out of Stock</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Materials by Category */}
        {materialsData.materialAnalysis?.materialsByCategory?.length > 0 && (
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Category />
                Materials by Category
              </Typography>
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)'
                  },
                  gap: 2
                }}
              >
                {materialsData.materialAnalysis.materialsByCategory.map((category: any, index: number) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }}
                  >
                    <Chip label={category._id || 'Uncategorized'} size="small" />
                    <Typography fontWeight="bold">{category.count} items</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Top Users by Materials */}
        {materialsData.materialAnalysis?.topUsersByMaterials?.length > 0 && (
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment />
                Top Users by Materials
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell align="right">Materials</TableCell>
                      <TableCell align="right">Total Value</TableCell>
                      <TableCell align="right">Avg Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {materialsData.materialAnalysis.topUsersByMaterials.slice(0, 5).map((user: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {user.name || user.email}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.company || 'No company'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={user.materialCount} size="small" color="primary" />
                        </TableCell>
                        <TableCell align="right">
                          ₹{user.totalInventoryValue?.toLocaleString() || '0'}
                        </TableCell>
                        <TableCell align="right">
                          ₹{user.avgUnitCost?.toFixed(2) || '0.00'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* User Engagement Tiers */}
        {materialsData.userEngagement && (
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Engagement with Materials
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {materialsData.userEngagement.usersWithNoMaterials?.[0] && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      👶 Beginners (No materials)
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1, height: 8, bgcolor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            // width: `${(materialsData.userEngagement.usersWithNoMaterials[0].count / data?.systemOverview.databaseStats.totalUsers || 1) * 100}%`,
                            height: '100%',
                            bgcolor: theme.palette.info.main,
                          }}
                        />
                      </Box>
                      <Typography fontWeight="bold">
                        {materialsData.userEngagement.usersWithNoMaterials[0].count} users
                      </Typography>
                    </Box>
                  </Box>
                )}

                {materialsData.userEngagement.usersWithManyMaterials?.[0] && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      🏆 Power Users (50+ materials)
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1, height: 8, bgcolor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            // width: `${(materialsData.userEngagement.usersWithManyMaterials[0].count / data?.systemOverview.databaseStats.totalUsers || 1) * 100}%`,
                            height: '100%',
                            bgcolor: theme.palette.success.main,
                          }}
                        />
                      </Box>
                      <Typography fontWeight="bold">
                        {materialsData.userEngagement.usersWithManyMaterials[0].count} users
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Stack>
    )
  }

  // Function to render engagement analysis
  const renderEngagementAnalysis = () => {
    if (!data?.engagementAnalysis) return null

    return (
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)'
            },
            gap: 3
          }}
        >
          {/* User Engagement Tiers */}
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Engagement Tiers
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {data.engagementAnalysis.usersWithNoNotes?.[0] && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      👶 Beginners (No notes)
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1, height: 8, bgcolor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            width: `${(data.engagementAnalysis.usersWithNoNotes[0].count / data.systemOverview.databaseStats.activeUsers) * 100}%`,
                            height: '100%',
                            bgcolor: theme.palette.info.main,
                          }}
                        />
                      </Box>
                      <Typography fontWeight="bold">
                        {data.engagementAnalysis.usersWithNoNotes[0].count} users
                      </Typography>
                    </Box>
                  </Box>
                )}

                {data.engagementAnalysis.usersWithManyNotes?.[0] && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      🏆 Power Users (20+ notes)
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1, height: 8, bgcolor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            width: `${(data.engagementAnalysis.usersWithManyNotes[0].count / data.systemOverview.databaseStats.activeUsers) * 100}%`,
                            height: '100%',
                            bgcolor: theme.palette.success.main,
                          }}
                        />
                      </Box>
                      <Typography fontWeight="bold">
                        {data.engagementAnalysis.usersWithManyNotes[0].count} users
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Engagement Score Breakdown */}
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Engagement Score Breakdown
              </Typography>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    mb: 2,
                  }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={data?.summary.engagementScore || 0}
                    size={120}
                    thickness={4}
                    sx={{
                      color: 
                        (data?.summary.engagementScore || 0) >= 70 ? theme.palette.success.main :
                        (data?.summary.engagementScore || 0) >= 40 ? theme.palette.warning.main :
                        theme.palette.error.main
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {data?.summary.engagementScore || 0}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Based on active users and note creation rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Growth Metrics */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)'
            },
            gap: 3
          }}
        >
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {data?.summary.growthRate >= 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
                Growth Rate
              </Typography>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h1" component="div" fontWeight="bold" color={data?.summary.growthRate >= 0 ? 'success.main' : 'error.main'}>
                  {data?.summary.growthRate || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  User growth in the last {timeframe} days
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notes per Active User
              </Typography>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h1" component="div" fontWeight="bold" color="primary">
                  {data?.summary.notesPerActiveUser || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average notes created per active user
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Analytics sx={{ fontSize: 36, color: theme.palette.primary.main }} />
                Admin Analytics Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Monitor user engagement and platform usage
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Timeframe</InputLabel>
                <Select
                  value={timeframe}
                  label="Timeframe"
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <MenuItem value="7">Last 7 days</MenuItem>
                  <MenuItem value="30">Last 30 days</MenuItem>
                  <MenuItem value="90">Last 90 days</MenuItem>
                  <MenuItem value="180">Last 6 months</MenuItem>
                  <MenuItem value="365">Last year</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={loading || materialsLoading}
              >
                Refresh
              </Button>
            </Box>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
        </Box>

        {/* Overview Cards */}
        {renderOverviewCards()}

        {/* Tabs for Detailed Analysis */}
        <Paper sx={{ mb: 4, borderRadius: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="User Analysis" icon={<People />} iconPosition="start" />
            <Tab label="Notes Analysis" icon={<Notes />} iconPosition="start" />
            <Tab label="Materials Analysis" icon={<Inventory />} iconPosition="start" />
            <Tab label="Engagement" icon={<Timeline />} iconPosition="start" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {/* User Analysis Tab */}
            {activeTab === 0 && (
              renderUserAnalysis()
            )}

            {/* Notes Analysis Tab */}
            {activeTab === 1 && (
              renderNotesAnalysis()
            )}

            {/* Materials Analysis Tab */}
            {activeTab === 2 && (
              renderMaterialsAnalysis()
            )}

            {/* Engagement Tab */}
            {activeTab === 3 && (
              renderEngagementAnalysis()
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}