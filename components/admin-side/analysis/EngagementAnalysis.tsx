// components/admin-side/analysis/EngagementAnalysis.tsx
import { 
  Stack, 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  LinearProgress,
  alpha 
} from '@mui/material'
import { 
  Timeline,
  TrendingUp,
  TrendingDown,
  Assessment,
  People,
  Equalizer,
  BarChart,
  EmojiEvents
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { AnalysisData } from '../types'

interface EngagementAnalysisProps {
  data: AnalysisData | null
}

export const EngagementAnalysis = ({ data }: EngagementAnalysisProps) => {
  const theme = useTheme()

  if (!data?.engagementAnalysis || !data?.summary) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 8,
        textAlign: 'center'
      }}>
        <Timeline sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Engagement Data Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Engagement analytics will appear here once users start creating content
        </Typography>
      </Box>
    )
  }

  const {
    engagementScore,
    growthRate,
    notesPerActiveUser,
    activeUserPercentage
  } = data.summary

  const usersWithNoNotes = data.engagementAnalysis.usersWithNoNotes?.[0]?.count || 0
  const usersWithManyNotes = data.engagementAnalysis.usersWithManyNotes?.[0]?.count || 0
  const activeUsers = data.systemOverview?.databaseStats?.activeUsers || 0

  // Calculate regular users
  const regularUsers = activeUsers - usersWithNoNotes - usersWithManyNotes

  // Engagement metrics
  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'success.main', emoji: '🏆' }
    if (score >= 60) return { level: 'Good', color: 'warning.main', emoji: '👍' }
    return { level: 'Needs Improvement', color: 'error.main', emoji: '📈' }
  }

  const engagementLevel = getEngagementLevel(engagementScore)

  return (
    <Stack spacing={3}>
      {/* Engagement Score Card */}
      <Card elevation={1} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Equalizer />
            Overall Engagement Score
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
            {/* Circular Progress */}
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={engagementScore}
                size={160}
                thickness={4}
                sx={{
                  color: engagementLevel.color
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
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h1" component="div" fontWeight="bold">
                  {engagementScore}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  /100
                </Typography>
              </Box>
            </Box>

            {/* Engagement Details */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {engagementLevel.emoji} {engagementLevel.level}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Based on active users, note creation rate, and user participation metrics.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Active Users
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={activeUserPercentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        backgroundColor: theme.palette.primary.main
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {activeUsers} active users
                    </Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {activeUserPercentage}%
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Notes per User
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(notesPerActiveUser * 10, 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        backgroundColor: theme.palette.success.main
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Average notes per user
                    </Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {notesPerActiveUser.toFixed(1)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Growth and Performance Metrics */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 3
        }}
      >
        {/* Growth Rate */}
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(
                growthRate >= 0 ? theme.palette.success.main : theme.palette.error.main, 
                0.1
              ),
              color: growthRate >= 0 ? theme.palette.success.main : theme.palette.error.main,
              margin: '0 auto 16px'
            }}>
              {growthRate >= 0 ? <TrendingUp /> : <TrendingDown />}
            </Box>
            <Typography variant="h3" component="div" fontWeight="bold" color={
              growthRate >= 0 ? 'success.main' : 'error.main'
            }>
              {growthRate}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              User Growth Rate
            </Typography>
          </CardContent>
        </Card>

        {/* Active Users Percentage */}
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              margin: '0 auto 16px'
            }}>
              <People />
            </Box>
            <Typography variant="h3" component="div" fontWeight="bold" color="primary.main">
              {activeUserPercentage}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Users
            </Typography>
          </CardContent>
        </Card>

        {/* Notes per User */}
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
              margin: '0 auto 16px'
            }}>
              <Assessment />
            </Box>
            <Typography variant="h3" component="div" fontWeight="bold" color="success.main">
              {notesPerActiveUser.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Notes per User
            </Typography>
          </CardContent>
        </Card>

        {/* Engagement Score */}
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(engagementLevel.color, 0.1),
              color: engagementLevel.color,
              margin: '0 auto 16px'
            }}>
              <EmojiEvents />
            </Box>
            <Typography variant="h3" component="div" fontWeight="bold" color={engagementLevel.color}>
              {engagementScore}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Engagement Score
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* User Engagement Tiers */}
      <Card elevation={1} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <BarChart />
            User Engagement Tiers
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Beginners - No notes */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main
                  }}>
                    👶
                  </Box>
                  Beginners (No notes)
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {usersWithNoNotes} users
                </Typography>
              </Box>
              <Box sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.info.main, 0.1),
                overflow: 'hidden'
              }}>
                <Box
                  sx={{
                    height: '100%',
                    width: `${(usersWithNoNotes / activeUsers) * 100}%`,
                    backgroundColor: theme.palette.info.main,
                    borderRadius: 4
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {activeUsers > 0 ? Math.round((usersWithNoNotes / activeUsers) * 100) : 0}% of active users
              </Typography>
            </Box>

            {/* Regular Users */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main
                  }}>
                    👤
                  </Box>
                  Regular Users (1-19 notes)
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {regularUsers} users
                </Typography>
              </Box>
              <Box sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                overflow: 'hidden'
              }}>
                <Box
                  sx={{
                    height: '100%',
                    width: `${(regularUsers / activeUsers) * 100}%`,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 4
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {activeUsers > 0 ? Math.round((regularUsers / activeUsers) * 100) : 0}% of active users
              </Typography>
            </Box>

            {/* Power Users */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main
                  }}>
                    🏆
                  </Box>
                  Power Users (20+ notes)
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {usersWithManyNotes} users
                </Typography>
              </Box>
              <Box sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                overflow: 'hidden'
              }}>
                <Box
                  sx={{
                    height: '100%',
                    width: `${(usersWithManyNotes / activeUsers) * 100}%`,
                    backgroundColor: theme.palette.success.main,
                    borderRadius: 4
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {activeUsers > 0 ? Math.round((usersWithManyNotes / activeUsers) * 100) : 0}% of active users
              </Typography>
            </Box>
          </Box>

          {/* Legend */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3,
            mt: 4,
            flexWrap: 'wrap'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'info.main' }} />
              <Typography variant="caption">Beginners</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }} />
              <Typography variant="caption">Regular Users</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main' }} />
              <Typography variant="caption">Power Users</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  )
}