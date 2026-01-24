// components/admin-side/analysis/NotesAnalysis.tsx - UPDATED RESPONSIVE
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, alpha } from '@mui/material'
import { 
  Notes, 
  Assessment,
  Category,
  TrendingUp,
  InsertChart,
  BarChart
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { AnalysisData } from '../types'

interface NotesAnalysisProps {
  data: AnalysisData | null
}

export const NotesAnalysis = ({ data }: NotesAnalysisProps) => {
  const theme = useTheme()

  if (!data?.notesAnalysis) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: { xs: 4, sm: 6, md: 8 },
        textAlign: 'center'
      }}>
        <Notes sx={{ fontSize: { xs: 48, sm: 56, md: 64 }, color: theme.palette.text.disabled, mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          No Notes Data Available
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
          Notes analytics will appear here once notes are created by users
        </Typography>
      </Box>
    )
  }

  // Calculate summary stats
  const totalNotes = data.systemOverview?.databaseStats?.totalNotes || 0
  const recentNotes = data.systemOverview?.databaseStats?.recentNotes || 0
  const sharedNotes = data.systemOverview?.databaseStats?.sharedNotes || 0
  const notesPerUser = data.summary?.notesPerActiveUser || 0

  // Categories data
  const notesByCategory = data.notesAnalysis.notesByCategory || []
  const topUsersByNotes = data.notesAnalysis.topUsersByNotes || []

  // Calculate percentages for categories
  const categoriesWithPercentages = notesByCategory.map(category => ({
    ...category,
    percentage: totalNotes > 0 ? Math.round((category.count / totalNotes) * 100) : 0
  }))

  // Summary cards
  const summaryCards = [
    { title: 'Total Notes', value: totalNotes, color: 'primary' },
    { title: 'Recent Notes', value: recentNotes, color: 'success' },
    { title: 'Shared Notes', value: sharedNotes, color: 'info' },
    { title: 'Avg per User', value: notesPerUser, color: 'warning' }
  ]

  return (
    <Box>
      {/* Summary Stats - Responsive Flex Layout */}
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
                xs: '1 1 calc(50% - 12px)',  // 2 per row on mobile
                sm: '1 1 calc(50% - 16px)',   // 2 per row on tablet
                md: '1 1 calc(25% - 18px)'    // 4 per row on desktop
              },
              minWidth: {
                xs: 'calc(50% - 12px)',
                sm: 'calc(50% - 16px)',
                md: 'calc(25% - 18px)'
              }
            }}
          >
            <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                p: { xs: 1.5, sm: 2 }
              }}>
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  color={`${card.color}.main`}
                  sx={{ 
                    fontSize: { 
                      xs: '1.5rem', 
                      sm: '1.75rem', 
                      md: '2rem',
                      lg: '2.25rem'
                    } 
                  }}
                >
                  {card.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
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

      {/* Main Content Area */}
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
            xs: '1 1 100%',  // Full width on mobile
            lg: '1 1 calc(50% - 12px)' // Half width on desktop
          },
          minWidth: {
            xs: '100%',
            lg: 'calc(50% - 12px)'
          }
        }}>
          <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 3,
                fontSize: { xs: '0.95rem', sm: '1rem' }
              }}>
                <Category />
                Notes by Category
              </Typography>
              
              {categoriesWithPercentages.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {categoriesWithPercentages.map((category, index) => (
                    <Box key={index}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 0.5,
                        flexWrap: 'wrap',
                        gap: 0.5
                      }}>
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          sx={{ 
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            maxWidth: '60%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {category._id || 'Uncategorized'}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          fontWeight="bold"
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          {category.count} ({category.percentage}%)
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        overflow: 'hidden'
                      }}>
                        <Box
                          sx={{
                            height: '100%',
                            width: `${category.percentage}%`,
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: 3,
                            transition: 'width 0.5s ease'
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  py: { xs: 3, sm: 4 }
                }}>
                  <InsertChart sx={{ 
                    fontSize: { xs: 40, sm: 48 }, 
                    color: theme.palette.text.disabled, 
                    mb: 1.5 
                  }} />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    No categories data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Top Users by Notes */}
        <Box sx={{ 
          flex: {
            xs: '1 1 100%',  // Full width on mobile
            lg: '1 1 calc(50% - 12px)' // Half width on desktop
          },
          minWidth: {
            xs: '100%',
            lg: 'calc(50% - 12px)'
          }
        }}>
          <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 3,
                fontSize: { xs: '0.95rem', sm: '1rem' }
              }}>
                <Assessment />
                Top Users by Notes
              </Typography>
              
              {topUsersByNotes.length > 0 ? (
                <TableContainer sx={{ maxHeight: { xs: 250, sm: 300 } }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>User</TableCell>
                        <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Notes</TableCell>
                        <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Last Created</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topUsersByNotes.slice(0, 5).map((user, index) => (
                        <TableRow 
                          key={index}
                          sx={{
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.02)
                            }
                          }}
                        >
                          <TableCell>
                            <Box>
                              <Typography 
                                variant="body2" 
                                fontWeight="medium" 
                                noWrap
                                sx={{ 
                                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                  maxWidth: { xs: 100, sm: 150 }
                                }}
                              >
                                {user.name || user.email}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="text.secondary" 
                                noWrap
                                sx={{ 
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                  maxWidth: { xs: 100, sm: 150 }
                                }}
                              >
                                {user.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={user.noteCount} 
                              size="small" 
                              color="primary"
                              sx={{ 
                                fontWeight: 'bold',
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                height: { xs: 20, sm: 24 }
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            >
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
                  py: { xs: 3, sm: 4 }
                }}>
                  <BarChart sx={{ 
                    fontSize: { xs: 40, sm: 48 }, 
                    color: theme.palette.text.disabled, 
                    mb: 1.5 
                  }} />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    No users data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Category Distribution Visualization */}
      {categoriesWithPercentages.length > 0 && (
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontSize: { xs: '0.95rem', sm: '1rem' }
            }}>
              <TrendingUp />
              Category Distribution
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row',
              flexWrap: 'wrap', 
              gap: { xs: 1.5, sm: 2 },
              justifyContent: 'center',
              mt: 2
            }}>
              {categoriesWithPercentages.map((category, index) => {
                const colors = [
                  theme.palette.primary.main,
                  theme.palette.secondary.main,
                  theme.palette.success.main,
                  theme.palette.warning.main,
                  theme.palette.error.main,
                  theme.palette.info.main
                ]
                
                const color = colors[index % colors.length]
                
                return (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      flex: {
                        xs: '1 1 calc(33.333% - 10px)', // 3 per row on mobile
                        sm: '1 1 calc(25% - 16px)',     // 4 per row on tablet
                        md: '1 1 calc(20% - 16px)',     // 5 per row on medium
                        lg: '1 1 calc(16.666% - 20px)'  // 6 per row on large
                      },
                      minWidth: {
                        xs: 'calc(33.333% - 10px)',
                        sm: 'calc(25% - 16px)',
                        md: 'calc(20% - 16px)',
                        lg: 'calc(16.666% - 20px)'
                      },
                      maxWidth: {
                        xs: 'calc(33.333% - 10px)',
                        sm: 'calc(25% - 16px)',
                        md: 'calc(20% - 16px)',
                        lg: 'calc(16.666% - 20px)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 45, sm: 50, md: 55, lg: 60 },
                        height: { xs: 45, sm: 50, md: 55, lg: 60 },
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: alpha(color, 0.1),
                        color: color,
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.3rem' },
                        fontWeight: 'bold'
                      }}
                    >
                      {category.count}
                    </Box>
                    <Typography 
                      variant="body2" 
                      align="center" 
                      noWrap
                      sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {category._id || 'Uncategorized'}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    >
                      {category.percentage}%
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}