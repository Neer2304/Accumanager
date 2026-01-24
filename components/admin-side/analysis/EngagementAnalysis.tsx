// components/admin-side/analysis/EngagementAnalysis.tsx - FIXED VERSION
import React from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  alpha,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Stack
} from '@mui/material'
import { 
  TrendingUp, 
  People, 
  AccessTime, 
  NoteAdd,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material'
import { AnalysisData } from '../types'

interface EngagementAnalysisProps {
  data: AnalysisData | null
}

const EngagementAnalysis: React.FC<EngagementAnalysisProps> = ({ data }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (!data?.engagement) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No engagement data available
        </Typography>
      </Box>
    )
  }

  const engagement = data.engagement
  
  // Calculate metrics safely
  const activeUsers = data.systemOverview?.databaseStats?.activeUsers || 0
  const totalNotes = data.systemOverview?.databaseStats?.totalNotes || 0
  
  // Safely calculate notes per active user
  const notesPerActiveUser = activeUsers > 0 ? totalNotes / activeUsers : 0
  
  // Convert to numbers and format safely
  const formatNumber = (value: any, decimals: number = 1): string => {
    const num = Number(value)
    return isNaN(num) ? '0.0' : num.toFixed(decimals)
  }

  const metrics = [
    {
      label: 'Avg. Engagement Rate',
      value: `${formatNumber(engagement.averageEngagementRate)}%`,
      icon: <TrendingUp />,
      color: theme.palette.primary.main,
      progress: Number(engagement.averageEngagementRate) || 0
    },
    {
      label: 'Avg. Session Duration',
      value: `${formatNumber(engagement.averageSessionDuration)}m`,
      icon: <AccessTime />,
      color: theme.palette.success.main,
      progress: Math.min((Number(engagement.averageSessionDuration) || 0) / 10 * 100, 100)
    },
    {
      label: 'Daily Active Users',
      value: engagement.dailyActiveUsers?.toLocaleString() || '0',
      icon: <People />,
      color: theme.palette.info.main,
      progress: Math.min((engagement.dailyActiveUsers || 0) / 1000 * 100, 100)
    },
    {
      label: 'Notes per Active User',
      value: formatNumber(notesPerActiveUser),
      icon: <NoteAdd />,
      color: theme.palette.warning.main,
      progress: Math.min(notesPerActiveUser / 5 * 100, 100)
    }
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Engagement Metrics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          User interaction and activity patterns
        </Typography>
      </Box>

      {/* Metrics Grid - Using Stack instead of Grid */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        flexWrap: 'wrap',
        gap: 2,
        mb: 4
      }}>
        {metrics.map((metric, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: 2,
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 24px)' },
              minWidth: { xs: '100%', sm: '200px' },
              border: `1px solid ${alpha(metric.color, 0.1)}`,
              background: alpha(metric.color, 0.03),
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${alpha(metric.color, 0.15)}`
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {metric.label}
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ 
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  color: metric.color
                }}>
                  {metric.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1.5,
                  background: alpha(metric.color, 0.1),
                  color: metric.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {metric.icon}
              </Box>
            </Box>
            
            <LinearProgress
              variant="determinate"
              value={metric.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(metric.color, 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: metric.color,
                  borderRadius: 3
                }
              }}
            />
          </Paper>
        ))}
      </Box>

      {/* Detailed Stats */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          background: alpha(theme.palette.primary.main, 0.02),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Performance Indicators
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          {/* Retention Rate */}
          <Box sx={{ 
            flex: 1,
            p: { xs: 1.5, sm: 2 },
            borderRadius: 1.5,
            background: alpha(theme.palette.success.main, 0.05),
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
          }}>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              30-day Retention Rate
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                {formatNumber(engagement.retentionRate)}%
              </Typography>
              {Number(engagement.retentionRate) > 50 ? (
                <ArrowUpward sx={{ color: 'success.main', fontSize: { xs: 16, sm: 20 } }} />
              ) : (
                <ArrowDownward sx={{ color: 'error.main', fontSize: { xs: 16, sm: 20 } }} />
              )}
            </Box>
          </Box>

          {/* Bounce Rate */}
          <Box sx={{ 
            flex: 1,
            p: { xs: 1.5, sm: 2 },
            borderRadius: 1.5,
            background: alpha(theme.palette.error.main, 0.05),
            border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`
          }}>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Bounce Rate
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                {formatNumber(engagement.bounceRate)}%
              </Typography>
              {Number(engagement.bounceRate) < 30 ? (
                <ArrowDownward sx={{ color: 'success.main', fontSize: { xs: 16, sm: 20 } }} />
              ) : (
                <ArrowUpward sx={{ color: 'error.main', fontSize: { xs: 16, sm: 20 } }} />
              )}
            </Box>
          </Box>
        </Box>

        {/* Summary */}
        {engagement.summary && (
          <Box sx={{ 
            mt: 3, 
            p: { xs: 1.5, sm: 2 },
            borderRadius: 1.5,
            background: alpha(theme.palette.info.main, 0.05),
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
          }}>
            <Typography variant="body2" sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              color: theme.palette.info.main,
              fontStyle: 'italic'
            }}>
              {engagement.summary}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default EngagementAnalysis