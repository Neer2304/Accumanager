// components/admin-side/analysis/UserAnalysis.tsx - UPDATED RESPONSIVE
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, alpha } from '@mui/material'
import { People, Security, Assessment } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { AnalysisData } from '../types'

interface UserAnalysisProps {
  data: AnalysisData | null
}

export const UserAnalysis = ({ data }: UserAnalysisProps) => {
  const theme = useTheme()

  if (!data?.userAnalysis) return null

  return (
    <Box>
      {/* Cards Container */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: { xs: 2, sm: 3 },
        mb: { xs: 3, sm: 4 }
      }}>
        {/* Users by Role Card */}
        <Box sx={{ 
          flex: {
            xs: '1 1 100%',  // Full width on mobile
            md: '1 1 calc(50% - 12px)' // Half width on desktop
          },
          minWidth: {
            xs: '100%',
            md: 'calc(50% - 12px)'
          }
        }}>
          <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <People />
                Users by Role
              </Typography>
              <TableContainer sx={{ maxHeight: 300, overflow: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Role</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.userAnalysis.usersByRole?.map((role, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip 
                            label={role._id || 'Unknown'} 
                            size="small"
                            sx={{ 
                              fontSize: { xs: '0.7rem', sm: '0.8rem' },
                              height: { xs: 20, sm: 24 }
                            }}
                            color={
                              role._id === 'admin' ? 'primary' : 
                              role._id === 'user' ? 'secondary' : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                            {role.count}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
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

        {/* Users by Status Card */}
        <Box sx={{ 
          flex: {
            xs: '1 1 100%',  // Full width on mobile
            md: '1 1 calc(50% - 12px)' // Half width on desktop
          },
          minWidth: {
            xs: '100%',
            md: 'calc(50% - 12px)'
          }
        }}>
          <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Security />
                Users by Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {data.userAnalysis.usersByStatus?.map((status, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: { xs: 1.25, sm: 1.5 },
                      borderRadius: 1,
                      backgroundColor: alpha(
                        status._id ? theme.palette.success.main : theme.palette.error.main, 
                        0.1
                      )
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: status._id ? theme.palette.success.main : theme.palette.error.main
                        }}
                      />
                      <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                        {status._id ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                    <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      {status.count} users
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Daily User Signups - Full width */}
      {data.userAnalysis.newUsersByDay && (
        <Box sx={{ width: '100%' }}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Assessment />
                Daily User Signups (Last 14 Days)
              </Typography>
              <Box sx={{ 
                height: { xs: 150, sm: 200 }, 
                display: 'flex', 
                alignItems: 'flex-end', 
                gap: 1, 
                p: { xs: 1, sm: 2 },
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                  height: 6
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: alpha(theme.palette.divider, 0.1),
                  borderRadius: 3
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.3),
                  borderRadius: 3
                }
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
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 1,
                        mb: 1,
                        minHeight: 4,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark
                        }
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        transform: { xs: 'rotate(-90deg)', sm: 'rotate(-45deg)' },
                        whiteSpace: 'nowrap'
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