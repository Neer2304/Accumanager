// components/admin-side/analysis/MaterialsAnalysis.tsx
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
  LinearProgress,
  alpha,
  CircularProgress
} from '@mui/material'
import { 
  Inventory,
  Assessment,
  Category,
  AttachMoney,
  Warning,
  CheckCircle,
  Storage,
  TrendingUp,
  Person
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { MaterialsAnalysisData } from '../types'

interface MaterialsAnalysisProps {
  data: MaterialsAnalysisData | null
  loading: boolean
  totalUsers: number
}

export const MaterialsAnalysis = ({ data, loading, totalUsers }: MaterialsAnalysisProps) => {
  const theme = useTheme()

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 8
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
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
        py: 8,
        textAlign: 'center'
      }}>
        <Inventory sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Materials Data Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Materials analytics will appear here once materials are added
        </Typography>
      </Box>
    )
  }

  const {
    totalMaterials,
    recentMaterials,
    totalStockValue,
    lowStockItems,
    outOfStockItems,
    avgMaterialsPerUser,
    activeMaterialUsers
  } = data.summary

  const materialsByCategory = data.materialAnalysis?.materialsByCategory || []
  const topUsersByMaterials = data.materialAnalysis?.topUsersByMaterials || []

  // Stock health percentage
  const inStockItems = totalMaterials - lowStockItems - outOfStockItems
  const stockHealthPercentage = totalMaterials > 0 
    ? Math.round((inStockItems / totalMaterials) * 100) 
    : 0

  // User engagement stats
  const usersWithNoMaterials = data.userEngagement?.usersWithNoMaterials?.[0]?.count || 0
  const usersWithManyMaterials = data.userEngagement?.usersWithManyMaterials?.[0]?.count || 0
  const regularUsers = totalUsers - usersWithNoMaterials - usersWithManyMaterials

  return (
    <Stack spacing={3}>
      {/* Stock Health Overview */}
      <Card elevation={1} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Storage />
            Stock Health Overview
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Overall Stock Health
              </Typography>
              <Typography variant="body2" fontWeight="bold" color={
                stockHealthPercentage >= 80 ? 'success.main' :
                stockHealthPercentage >= 60 ? 'warning.main' : 'error.main'
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
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: 
                    stockHealthPercentage >= 80 ? theme.palette.success.main :
                    stockHealthPercentage >= 60 ? theme.palette.warning.main : theme.palette.error.main
                }
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(3, 1fr)'
              },
              gap: 2
            }}
          >
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              textAlign: 'center'
            }}>
              <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {inStockItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Stock
              </Typography>
            </Box>

            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              textAlign: 'center'
            }}>
              <Warning sx={{ color: theme.palette.warning.main, fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" color="warning.main">
                {lowStockItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low Stock
              </Typography>
            </Box>

            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              textAlign: 'center'
            }}>
              <Warning sx={{ color: theme.palette.error.main, fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" color="error.main">
                {outOfStockItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Out of Stock
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

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
        {/* Materials by Category */}
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Category />
              Materials by Category
            </Typography>
            
            {materialsByCategory.length > 0 ? (
              <Stack spacing={2}>
                {materialsByCategory.map((category, index) => {
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
                          />
                          <Typography variant="body2" fontWeight="medium">
                            {category.count}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {percentage}%
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                        overflow: 'hidden'
                      }}>
                        <Box
                          sx={{
                            height: '100%',
                            width: `${percentage}%`,
                            backgroundColor: theme.palette.info.main,
                            borderRadius: 3
                          }}
                        />
                      </Box>
                    </Box>
                  )
                })}
              </Stack>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                py: 4
              }}>
                <Category sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No categories data available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Top Users by Materials */}
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Assessment />
              Top Users by Materials
            </Typography>
            
            {topUsersByMaterials.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell align="right">Materials</TableCell>
                      <TableCell align="right">Total Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topUsersByMaterials.slice(0, 5).map((user, index) => (
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
                              {user.company || 'No company'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={user.materialCount} 
                            size="small" 
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                            <AttachMoney fontSize="small" color="success" />
                            <Typography variant="body2" fontWeight="bold">
                              {user.totalInventoryValue?.toLocaleString() || '0'}
                            </Typography>
                          </Box>
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
                <Person sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No users data available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* User Engagement with Materials */}
      <Card elevation={1} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <TrendingUp />
            User Engagement with Materials
          </Typography>
          
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(3, 1fr)'
              },
              gap: 3
            }}
          >
            {/* Beginners - No materials */}
            <Box sx={{ 
              p: 3, 
              borderRadius: 2, 
              backgroundColor: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              textAlign: 'center'
            }}>
              <Typography variant="h2" fontWeight="bold" color="info.main" gutterBottom>
                👶
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="info.main" gutterBottom>
                {usersWithNoMaterials}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Beginners
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Users with no materials
              </Typography>
            </Box>

            {/* Regular Users */}
            <Box sx={{ 
              p: 3, 
              borderRadius: 2, 
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              textAlign: 'center'
            }}>
              <Typography variant="h2" fontWeight="bold" color="primary.main" gutterBottom>
                👤
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                {regularUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Regular Users
              </Typography>
              <Typography variant="caption" color="text.secondary">
                1-49 materials
              </Typography>
            </Box>

            {/* Power Users */}
            <Box sx={{ 
              p: 3, 
              borderRadius: 2, 
              backgroundColor: alpha(theme.palette.success.main, 0.05),
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              textAlign: 'center'
            }}>
              <Typography variant="h2" fontWeight="bold" color="success.main" gutterBottom>
                🏆
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main" gutterBottom>
                {usersWithManyMaterials}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Power Users
              </Typography>
              <Typography variant="caption" color="text.secondary">
                50+ materials
              </Typography>
            </Box>
          </Box>

          {/* Engagement Progress Bar */}
          {totalUsers > 0 && (
            <Box sx={{ mt: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 1,
                flexWrap: 'wrap',
                gap: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'info.main' }} />
                  <Typography variant="caption">Beginners</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  <Typography variant="caption">Regular</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main' }} />
                  <Typography variant="caption">Power Users</Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.divider, 0.5),
                overflow: 'hidden',
                display: 'flex'
              }}>
                <Box
                  sx={{
                    height: '100%',
                    width: `${(usersWithNoMaterials / totalUsers) * 100}%`,
                    backgroundColor: theme.palette.info.main
                  }}
                />
                <Box
                  sx={{
                    height: '100%',
                    width: `${(regularUsers / totalUsers) * 100}%`,
                    backgroundColor: theme.palette.primary.main
                  }}
                />
                <Box
                  sx={{
                    height: '100%',
                    width: `${(usersWithManyMaterials / totalUsers) * 100}%`,
                    backgroundColor: theme.palette.success.main
                  }}
                />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  )
}