import { Box, Card, CardContent, Typography, LinearProgress } from '@mui/material'
import { alpha } from '@mui/material/styles'

interface GoalsProgressProps {
  goals: any
  currentColors: any
  googleColors: any
  mode: string
  alpha: any
}

export default function GoalsProgress({
  goals,
  currentColors,
  googleColors,
  mode,
  alpha
}: GoalsProgressProps) {
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
          Daily Goals
        </Typography>
        
        {/* Screen Time Goal */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 1 
          }}>
            <Typography variant="body2">Screen Time</Typography>
            <Typography variant="body2" fontWeight="bold">
              {goals.currentDailyProgress?.toFixed(1) || '0'}h / {goals.dailyScreenTimeGoal || 8}h
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={((goals.currentDailyProgress || 0) / (goals.dailyScreenTimeGoal || 8)) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: currentColors.chipBackground,
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${googleColors.blue} 0%, ${googleColors.green} 100%)`,
                borderRadius: 4,
              },
            }}
          />
        </Box>
        
        {/* Revenue Goal */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 1 
          }}>
            <Typography variant="body2">Monthly Revenue</Typography>
            <Typography variant="body2" fontWeight="bold">
              ₹{(goals.revenueGoal?.current || 0).toLocaleString()} / ₹{(goals.revenueGoal?.target || 100000).toLocaleString()}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={goals.revenueGoal?.progress || 0}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: currentColors.chipBackground,
              '& .MuiLinearProgress-bar': {
                backgroundColor: googleColors.green,
                borderRadius: 4,
              },
            }}
          />
        </Box>
        
        {/* Customer Goal */}
        <Box>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 1 
          }}>
            <Typography variant="body2">New Customers</Typography>
            <Typography variant="body2" fontWeight="bold">
              {goals.customerGoal?.current || 0} / {goals.customerGoal?.target || 100}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={goals.customerGoal?.progress || 0}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: currentColors.chipBackground,
              '& .MuiLinearProgress-bar': {
                backgroundColor: googleColors.blue,
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}