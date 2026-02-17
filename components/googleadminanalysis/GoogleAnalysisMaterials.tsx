// components/googleadminanalysis/GoogleAnalysisMaterials.tsx
'use client'

import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  alpha,
  CircularProgress,
} from '@mui/material'
import {
  Inventory,
  Category,
  Assessment,
  Person,
  CheckCircle,
  Warning,
  AttachMoney,
  Storage,
} from '@mui/icons-material'
import { MaterialsAnalysisData } from './types'

interface GoogleAnalysisMaterialsProps {
  data: MaterialsAnalysisData | null
  loading: boolean
  totalUsers: number
  darkMode?: boolean
}

export default function GoogleAnalysisMaterials({ 
  data, 
  loading, 
  totalUsers,
  darkMode 
}: GoogleAnalysisMaterialsProps) {
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
                  <Typography variant="h5" fontWeight="bold" color={
                    item.color === 'success' ? '#34a853' :
                    item.color === 'warning' ? '#fbbc04' :
                    item.color === 'error' ? '#ea4335' : '#5f6368'
                  }>
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