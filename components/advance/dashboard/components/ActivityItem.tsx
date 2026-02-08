import { Box, Typography, Avatar, alpha } from '@mui/material'
import { 
  CheckCircle, 
  Warning, 
  Error as ErrorIcon,
  Info,
  TrendingUp,
  People,
  ShoppingCart,
  Inventory 
} from '@mui/icons-material'

interface ActivityItemProps {
  activity: any
  currentColors: any
  googleColors: any
}

export default function ActivityItem({ activity, currentColors, googleColors }: ActivityItemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle sx={{ color: googleColors.green }} />
      case 'warning': return <Warning sx={{ color: googleColors.yellow }} />
      case 'error': return <ErrorIcon sx={{ color: googleColors.red }} />
      case 'info': return <Info sx={{ color: googleColors.blue }} />
      case 'sale': return <ShoppingCart sx={{ color: googleColors.green }} />
      case 'user': return <People sx={{ color: googleColors.blue }} />
      case 'growth': return <TrendingUp sx={{ color: googleColors.green }} />
      default: return <Inventory sx={{ color: googleColors.yellow }} />
    }
  }

  const getTimeColor = (time?: string) => {
    if (!time) return currentColors.textSecondary
    if (time.includes('just now') || time.includes('min')) return googleColors.green
    if (time.includes('hour')) return googleColors.yellow
    return currentColors.textSecondary
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      gap: 2, 
      p: 1,
      borderRadius: '8px',
      '&:hover': {
        backgroundColor: currentColors.hover,
      }
    }}>
      <Avatar
        sx={{
          width: 40,
          height: 40,
          backgroundColor: alpha(googleColors.blue, 0.1),
          border: `1px solid ${alpha(googleColors.blue, 0.2)}`,
        }}
      >
        {getIcon(activity?.type || 'info')}
      </Avatar>
      
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight="medium" color={currentColors.textPrimary}>
          {activity?.title || 'Activity'}
        </Typography>
        <Typography variant="caption" color={currentColors.textSecondary} sx={{ mt: 0.5 }}>
          {activity?.description || 'No description available'}
        </Typography>
      </Box>
      
      <Typography 
        variant="caption" 
        fontWeight="medium"
        sx={{ color: getTimeColor(activity?.time) }}
      >
        {activity?.time || 'Just now'}
      </Typography>
    </Box>
  )
}