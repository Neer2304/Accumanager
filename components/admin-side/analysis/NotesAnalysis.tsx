// components/admin-side/analysis/NotesAnalysis.tsx
import { 
  Stack, 
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
  alpha 
} from '@mui/material'
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
        py: 8,
        textAlign: 'center'
      }}>
        <Notes sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Notes Data Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
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

  return (
    <Stack spacing={3}>
      {/* Summary Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 2
        }}
      >
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {totalNotes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Notes
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" fontWeight="bold" color="success.main">
              {recentNotes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recent Notes
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" fontWeight="bold" color="info.main">
              {sharedNotes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Shared Notes
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" fontWeight="bold" color="warning.main">
              {notesPerUser}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg per User
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(2, 1fr)'
          },
          gap: 3
        }}
      >
        {/* Notes by Category */}
        <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Category />
              Notes by Category
            </Typography>
            
            {categoriesWithPercentages.length > 0 ? (
              <Stack spacing={2}>
                {categoriesWithPercentages.map((category, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {category._id || 'Uncategorized'}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
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
                          borderRadius: 3
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                py: 4
              }}>
                <InsertChart sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No categories data available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Top Users by Notes */}
        <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Assessment />
              Top Users by Notes
            </Typography>
            
            {topUsersByNotes.length > 0 ? (
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
                            <Typography variant="body2" fontWeight="medium" noWrap>
                              {user.name || user.email}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {user.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={user.noteCount} 
                            size="small" 
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption" color="text.secondary">
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
                <BarChart sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No users data available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Category Distribution Visualization */}
      {categoriesWithPercentages.length > 0 && (
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp />
              Category Distribution
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
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
                      width: { xs: '45%', sm: '30%', md: '20%', lg: '15%' }
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: alpha(color, 0.1),
                        color: color,
                        mb: 1,
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {category.count}
                    </Box>
                    <Typography variant="body2" align="center" noWrap>
                      {category._id || 'Uncategorized'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category.percentage}%
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </CardContent>
        </Card>
      )}
    </Stack>
  )
}