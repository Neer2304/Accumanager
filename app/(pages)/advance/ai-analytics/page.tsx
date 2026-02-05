// app/(pages)/advance/ai-analytics/page.tsx
'use client'

import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Slider,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  TrendingUp,
  ShowChart,
  AutoAwesome,
  Insights,
  Psychology,
  Lightbulb,
  Download,
  Refresh,
  Settings,
  Timeline,
  BarChart,
  PieChart,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

const mockPredictions = [
  { metric: 'Customer Churn Risk', value: 24, trend: 'up', confidence: 85 },
  { metric: 'Sales Conversion', value: 68, trend: 'up', confidence: 92 },
  { metric: 'Customer Lifetime Value', value: 45, trend: 'down', confidence: 78 },
  { metric: 'Product Adoption', value: 82, trend: 'up', confidence: 88 },
]

const mockInsights = [
  'Customers who use feature X are 3x more likely to upgrade',
  'Support tickets peak on Monday mornings',
  'Discounts of 15%+ have highest conversion rates',
  'Email campaigns sent at 2 PM get 40% more opens',
]

export default function AIAnalyticsPage() {
  const { currentScheme } = useAdvanceThemeContext()
  const [confidence, setConfidence] = useState(75)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Psychology sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              🤖 AI Analytics
            </Typography>
            <Typography variant="body1" color={currentScheme.colors.text.secondary}>
              Predictive insights and smart recommendations powered by AI
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Controls */}
      <Card
        sx={{
          mb: 4,
          background: currentScheme.colors.components.card,
          border: `1px solid ${currentScheme.colors.components.border}`,
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                size="small"
                sx={{
                  background: currentScheme.colors.components.input,
                  borderColor: currentScheme.colors.components.border,
                  color: currentScheme.colors.text.primary,
                }}
              >
                <MenuItem value="24h">Last 24 hours</MenuItem>
                <MenuItem value="7d">Last 7 days</MenuItem>
                <MenuItem value="30d">Last 30 days</MenuItem>
                <MenuItem value="90d">Last 90 days</MenuItem>
              </Select>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    color="primary"
                  />
                }
                label="Auto-refresh"
              />
            </Box>

            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                sx={{
                  borderColor: currentScheme.colors.components.border,
                  color: currentScheme.colors.text.primary,
                }}
              >
                Refresh Data
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{
                  borderColor: currentScheme.colors.components.border,
                  color: currentScheme.colors.text.primary,
                }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<Settings />}
                sx={{
                  background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                }}
              >
                Settings
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Left Column - Predictions */}
        <Box sx={{ flex: 2, minWidth: '300px' }}>
          <Card
            sx={{
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
              mb: 3,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  AI Predictions
                </Typography>
                <Chip
                  icon={<AutoAwesome />}
                  label="Live Predictions"
                  size="small"
                  sx={{
                    background: `${currentScheme.colors.primary}20`,
                    color: currentScheme.colors.primary,
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                    AI Confidence Threshold
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {confidence}%
                  </Typography>
                </Box>
                <Slider
                  value={confidence}
                  onChange={(_, value) => setConfidence(value as number)}
                  min={50}
                  max={95}
                  sx={{
                    color: currentScheme.colors.primary,
                  }}
                />
              </Box>

              {/* Prediction Cards */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mockPredictions.map((prediction) => (
                  <Paper
                    key={prediction.metric}
                    sx={{
                      p: 2,
                      background: currentScheme.colors.background,
                      border: `1px solid ${currentScheme.colors.components.border}`,
                      borderRadius: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="body1" fontWeight="medium">
                        {prediction.metric}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {prediction.value}%
                        </Typography>
                        <TrendingUp
                          sx={{
                            color: prediction.trend === 'up' 
                              ? currentScheme.colors.buttons.success 
                              : currentScheme.colors.buttons.error,
                            transform: prediction.trend === 'down' ? 'rotate(180deg)' : 'none',
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                          AI Confidence
                        </Typography>
                        <Typography variant="caption" fontWeight="medium">
                          {prediction.confidence}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={prediction.confidence}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          background: currentScheme.colors.components.border,
                          '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                          },
                        }}
                      />
                    </Box>
                    
                    <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                      {prediction.trend === 'up' ? 'Increasing trend detected' : 'Decreasing trend detected'}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column - Insights */}
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <Card
            sx={{
              background: currentScheme.colors.components.card,
              border: `1px solid ${currentScheme.colors.components.border}`,
              height: '100%',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Insights sx={{ color: currentScheme.colors.primary }} />
                <Typography variant="h6" fontWeight="bold">
                  Smart Insights
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mockInsights.map((insight, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      background: currentScheme.colors.background,
                      border: `1px solid ${currentScheme.colors.components.border}`,
                      borderRadius: 2,
                    }}
                  >
                    <Box display="flex" gap={1}>
                      <Lightbulb sx={{ color: currentScheme.colors.buttons.warning, mt: 0.5 }} />
                      <Typography variant="body2">
                        {insight}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      sx={{
                        mt: 1,
                        fontSize: '0.75rem',
                        color: currentScheme.colors.primary,
                      }}
                    >
                      View Analysis →
                    </Button>
                  </Paper>
                ))}
              </Box>

              {/* Chart Types */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  Visualization Tools
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {[
                    { icon: <ShowChart />, label: 'Line Chart', color: currentScheme.colors.primary },
                    { icon: <BarChart />, label: 'Bar Chart', color: currentScheme.colors.buttons.success },
                    { icon: <PieChart />, label: 'Pie Chart', color: currentScheme.colors.buttons.error },
                    { icon: <Timeline />, label: 'Timeline', color: currentScheme.colors.buttons.warning },
                  ].map((tool) => (
                    <Tooltip key={tool.label} title={tool.label}>
                      <IconButton
                        sx={{
                          background: `${tool.color}20`,
                          color: tool.color,
                          '&:hover': {
                            background: `${tool.color}30`,
                          },
                        }}
                      >
                        {tool.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
              </Box>

              {/* AI Recommendations */}
              <Box sx={{ mt: 4, p: 2, borderRadius: 2, background: `${currentScheme.colors.primary}10` }}>
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  AI Recommendation
                </Typography>
                <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                  Consider launching a targeted email campaign to customers with high churn risk. 
                  Our AI suggests a 23% reduction in churn with personalized offers.
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    mt: 2,
                    background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                  }}
                >
                  Implement Suggestion
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}