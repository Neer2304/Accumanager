// components/googleadminanalysis/GoogleAnalysisNotes.tsx
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
} from '@mui/material'
import {
  Notes,
  Category,
  Assessment,
  TrendingUp,
  Person,
  BarChart,
} from '@mui/icons-material'
import { AnalysisData } from './types'

interface GoogleAnalysisNotesProps {
  data: AnalysisData | null
  darkMode?: boolean
}

export default function GoogleAnalysisNotes({ data, darkMode }: GoogleAnalysisNotesProps) {
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
    { title: 'Recent Notes', value: recentNotes, color: 'success' as const, icon: TrendingUp },
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
                <card.icon sx={{ 
                  color: 
                    card.color === 'primary' ? (darkMode ? '#8ab4f8' : '#1a73e8') :
                    card.color === 'success' ? '#34a853' :
                    card.color === 'warning' ? '#fbbc04' : '#5f6368',
                  fontSize: { xs: 28, sm: 32 },
                  mb: 1
                }} />
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  color={
                    card.color === 'primary' ? (darkMode ? '#8ab4f8' : '#1a73e8') :
                    card.color === 'success' ? '#34a853' :
                    card.color === 'warning' ? '#fbbc04' : '#5f6368'
                  }
                  sx={{ 
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } 
                  }}
                >
                  {card.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  color={darkMode ? '#9aa0a6' : '#5f6368'}
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, mt: 0.5 }}
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