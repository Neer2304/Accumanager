// components/admin-side/common/LoadingState.tsx
import { Box, CircularProgress, Typography } from '@mui/material'
import { Analytics } from '@mui/icons-material'

export const LoadingState = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      gap: 3
    }}>
      <Box sx={{
        width: 80,
        height: 80,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Analytics sx={{ fontSize: 40 }} />
      </Box>
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Loading analytics data...
      </Typography>
    </Box>
  )
}