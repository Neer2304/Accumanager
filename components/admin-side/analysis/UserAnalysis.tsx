// components/admin-side/analysis/UserAnalysis.tsx
import { Stack, Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, alpha } from '@mui/material'
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
        <Card elevation={1} sx={{ borderRadius: 2 }}>
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
                  {data.userAnalysis.usersByRole?.map((role, index) => (
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
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Security />
              Users by Status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {data.userAnalysis.usersByStatus?.map((status, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1.5,
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
      {data.userAnalysis.newUsersByDay && (
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment />
              Daily User Signups (Last 14 Days)
            </Typography>
            <Box sx={{ 
              height: 200, 
              display: 'flex', 
              alignItems: 'flex-end', 
              gap: 1, 
              p: 2,
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
                    minWidth: 40
                  }}
                >
                  <Box
                    sx={{
                      width: '80%',
                      height: `${Math.min(day.count * 20, 150)}px`,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 1,
                      mb: 1,
                      minHeight: 4
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
      )}
    </Stack>
  )
}