// components/admin-side/analysis/StatsCard.tsx
import { Card, CardContent, Typography, Box, Chip, alpha, LinearProgress } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { SvgIconComponent } from '@mui/icons-material'

interface StatsCardProps {
  title: string
  value: string | number
  subValue?: string
  icon: SvgIconComponent
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  trend?: number
  showTrend?: boolean
  showProgress?: boolean
  compact?: boolean
}

export const StatsCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  color,
  trend = 0,
  showTrend = false,
  showProgress = false,
  compact = false
}: StatsCardProps) => {
  const theme = useTheme()

  const getTrendColor = (trendValue: number) => {
    return trendValue >= 0 ? theme.palette.success.main : theme.palette.error.main
  }

  const getTrendIcon = (trendValue: number) => {
    return trendValue >= 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />
  }

  return (
    <Card 
      elevation={2} 
      sx={{ 
        borderRadius: 3, 
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(theme.palette[color].main, 0.1)}`
        }
      }}
    >
      {/* Top accent bar */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, ${theme.palette[color].main} 0%, ${alpha(theme.palette[color].main, 0.7)} 100%)`
      }} />

      <CardContent sx={{ 
        p: compact ? 2 : { xs: 2, sm: 3 },
        '&:last-child': { pb: compact ? 2 : { xs: 2, sm: 3 } }
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: compact ? 1 : 2
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h3" 
              component="div"
              fontWeight="bold" 
              sx={{ 
                color: theme.palette[color].main,
                fontSize: compact ? '1.5rem' : { xs: '1.75rem', sm: '2rem' }
              }}
            >
              {value}
              {subValue && (
                <Typography 
                  component="span" 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ ml: 0.5 }}
                >
                  {subValue}
                </Typography>
              )}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: compact ? '0.75rem' : '0.875rem' }}
            >
              {title}
            </Typography>
          </Box>

          <Box sx={{
            width: compact ? 36 : { xs: 40, sm: 48 },
            height: compact ? 36 : { xs: 40, sm: 48 },
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].main, 0.2)} 100%)`,
            color: theme.palette[color].main
          }}>
            <Icon sx={{ fontSize: compact ? 20 : { xs: 24, sm: 28 } }} />
          </Box>
        </Box>

        {/* Trend Indicator */}
        {showTrend && trend !== 0 && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            mt: 1
          }}>
            {getTrendIcon(trend)}
            <Typography 
              variant="caption" 
              fontWeight="medium"
              sx={{ color: getTrendColor(trend) }}
            >
              {Math.abs(trend)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              from last period
            </Typography>
          </Box>
        )}

        {/* Progress Bar */}
        {showProgress && typeof value === 'number' && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Score
              </Typography>
              <Typography variant="caption" fontWeight="bold">
                {value}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={value}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette[color].main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${theme.palette[color].light} 0%, ${theme.palette[color].main} 100%)`
                }
              }}
            />
          </Box>
        )}

        {/* Compact chip for small trend */}
        {compact && showTrend && trend !== 0 && (
          <Chip
            icon={getTrendIcon(trend)}
            label={`${Math.abs(trend)}%`}
            size="small"
            sx={{
              mt: 1,
              backgroundColor: getTrendColor(trend),
              color: 'white',
              fontSize: '0.7rem',
              height: 20
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}