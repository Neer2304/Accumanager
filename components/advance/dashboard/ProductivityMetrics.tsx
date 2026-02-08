import { Box, Card, CardContent, Typography, Divider } from '@mui/material'
import PerformanceWidget from '@/components/advance/PerformanceWidget'

interface ProductivityMetricsProps {
  engagementMetrics: any
  currentColors: any
  googleColors: any
  mode: string
}

export default function ProductivityMetrics({
  engagementMetrics,
  currentColors,
  googleColors,
  mode
}: ProductivityMetricsProps) {
  return (
    <Card
      sx={{
        flex: '1 1 50%',
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '16px',
        transition: 'all 0.3s ease',
        boxShadow: mode === 'dark' 
          ? '0 2px 4px rgba(0,0,0,0.4)' 
          : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Productivity Metrics
        </Typography>
        
        <PerformanceWidget
          productivityScore={engagementMetrics.productivityScore}
          avgSessionLength={engagementMetrics.avgSessionLength}
          streakDays={engagementMetrics.streakDays}
          mostUsedFeature={engagementMetrics.mostUsedFeature}
        />
        
        <Divider sx={{ 
          my: 2, 
          borderColor: currentColors.border 
        }} />
        
        <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
          Time Distribution
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Object.entries(engagementMetrics.timeDistribution || {}).map(([key, value]: [string, any]) => (
            <Box key={key} sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <Typography variant="caption" textTransform="capitalize" color={currentColors.textSecondary}>
                {key}
              </Typography>
              <Typography variant="caption" fontWeight="medium">
                {(value || 0).toFixed(1)}h
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}