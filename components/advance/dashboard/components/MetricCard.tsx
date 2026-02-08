import { Box, Typography, Paper, alpha } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'

interface MetricCardProps {
  title: string
  value: string
  change?: number
  icon: React.ReactNode
  color: string
  currentColors: any
  alpha?: any // Remove this from props since we're importing it
}

export default function MetricCard({
  title,
  value,
  change,
  icon,
  color,
  currentColors
}: MetricCardProps) {
  return (
    <Paper sx={{ 
      p: 3, 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transform: 'translateY(-2px)',
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: alpha(color, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${alpha(color, 0.2)}`,
          }}
        >
          <Box sx={{ color: color, fontSize: 24 }}>
            {icon}
          </Box>
        </Box>
        
        {change !== undefined && (
          <Typography
            variant="caption"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: change >= 0 ? '#34A853' : '#EA4335',
              fontWeight: 600,
              backgroundColor: alpha(change >= 0 ? '#34A853' : '#EA4335', 0.1),
              padding: '4px 8px',
              borderRadius: '12px',
            }}
          >
            {change >= 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
            {Math.abs(change)}%
          </Typography>
        )}
      </Box>
      
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {value}
      </Typography>
      
      <Typography variant="body2" color={currentColors.textSecondary}>
        {title}
      </Typography>
    </Paper>
  )
}