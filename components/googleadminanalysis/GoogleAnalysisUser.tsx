// components/googleadminanalysis/GoogleAnalysisUser.tsx
'use client'

import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
} from '@mui/material'
import {
  People,
  Security,
  Assessment,
} from '@mui/icons-material'
import { AnalysisData } from './types'

interface GoogleAnalysisUserProps {
  data: AnalysisData | null
  darkMode?: boolean
}

export default function GoogleAnalysisUser({ data, darkMode }: GoogleAnalysisUserProps) {
  if (!data?.userAnalysis) return null

  const totalUsers = data.systemOverview?.databaseStats?.totalUsers || 0

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
                                ? '#8ab4f8'
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
                            {Math.round((role.count / totalUsers) * 100)}%
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