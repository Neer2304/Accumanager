// components/advance/PerformanceWidget.tsx
'use client'

import { Box, Typography, LinearProgress, Chip, Tooltip } from '@mui/material'
import { TrendingUp, EmojiEvents, Timer, Dashboard } from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

interface PerformanceWidgetProps {
  productivityScore: number
  avgSessionLength: number
  streakDays: number
  mostUsedFeature: string
}

export default function PerformanceWidget({
  productivityScore,
  avgSessionLength,
  streakDays,
  mostUsedFeature
}: PerformanceWidgetProps) {
  const { currentScheme } = useAdvanceThemeContext()

  const getProductivityLevel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'success' }
    if (score >= 60) return { label: 'Good', color: 'primary' }
    if (score >= 40) return { label: 'Average', color: 'warning' }
    return { label: 'Needs Improvement', color: 'error' }
  }

  const productivityLevel = getProductivityLevel(productivityScore)

  return (
    <Box>
      {/* Productivity Score */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="body2">Productivity Score</Typography>
          <Chip
            label={productivityLevel.label}
            size="small"
            sx={{
              bgcolor: `${currentScheme.colors.buttons[productivityLevel.color]}20`,
              color: currentScheme.colors.buttons[productivityLevel.color],
            }}
          />
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <LinearProgress
            variant="determinate"
            value={productivityScore}
            sx={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              bgcolor: `${currentScheme.colors.components.border}30`,
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                borderRadius: 4,
              },
            }}
          />
          <Typography variant="h6" fontWeight="bold">
            {productivityScore}
          </Typography>
        </Box>
      </Box>

      {/* Metrics Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        <Tooltip title="Average session length">
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: `${currentScheme.colors.primary}10`,
              textAlign: 'center',
            }}
          >
            <Timer sx={{ color: currentScheme.colors.primary, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              {avgSessionLength.toFixed(1)}h
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Avg Session
            </Typography>
          </Box>
        </Tooltip>

        <Tooltip title="Current streak">
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: `${currentScheme.colors.secondary}10`,
              textAlign: 'center',
            }}
          >
            <TrendingUp sx={{ color: currentScheme.colors.secondary, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              {streakDays}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Day Streak
            </Typography>
          </Box>
        </Tooltip>

        <Tooltip title="Most used feature">
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: `${currentScheme.colors.buttons.success}10`,
              textAlign: 'center',
              gridColumn: 'span 2',
            }}
          >
            <Dashboard sx={{ color: currentScheme.colors.buttons.success, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold" textTransform="capitalize">
              {mostUsedFeature}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Most Used Feature
            </Typography>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  )
}