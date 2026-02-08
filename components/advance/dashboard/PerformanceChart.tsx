import { Box, Card, CardContent, Typography, Chip } from '@mui/material'
import { alpha } from '@mui/material/styles'
import DashboardChart from '@/components/advance/DashboardChart'

interface PerformanceChartProps {
  monthlyTrends: any
  currentColors: any
  googleColors: any
  mode: string
  alpha: any
}

export default function PerformanceChart({
  monthlyTrends,
  currentColors,
  googleColors,
  mode,
  alpha
}: PerformanceChartProps) {
  return (
    <Card
      sx={{
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
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3 
        }}>
          <Typography variant="h6" fontWeight="bold">
            Performance Overview
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label="Revenue" 
              size="small" 
              sx={{
                backgroundColor: alpha(googleColors.blue, 0.1),
                color: googleColors.blue,
                border: `1px solid ${alpha(googleColors.blue, 0.3)}`,
                fontWeight: 500,
              }}
            />
            <Chip 
              label="Customers" 
              size="small"
              sx={{
                backgroundColor: alpha(googleColors.green, 0.1),
                color: googleColors.green,
                border: `1px solid ${alpha(googleColors.green, 0.3)}`,
                fontWeight: 500,
              }}
            />
            <Chip 
              label="Engagement" 
              size="small"
              sx={{
                backgroundColor: alpha(googleColors.yellow, 0.1),
                color: googleColors.yellow,
                border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
                fontWeight: 500,
              }}
            />
          </Box>
        </Box>
        
        <Box sx={{ height: 300 }}>
          <DashboardChart data={monthlyTrends} />
        </Box>
      </CardContent>
    </Card>
  )
}