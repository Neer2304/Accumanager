import { Card, CardContent, Typography, Box, Avatar, alpha } from '@mui/material'
import { Person, SystemUpdateAlt, CheckCircle, Warning } from '@mui/icons-material'

interface RecentActivityProps {
  activities: any[]
  currentColors: any
}

export default function RecentActivity({ activities, currentColors }: RecentActivityProps) {
  const getActivityIcon = (user: string) => {
    if (user === 'System') return <SystemUpdateAlt sx={{ fontSize: 16 }} />
    return <Person sx={{ fontSize: 16 }} />
  }

  const getActivityColor = (action: string) => {
    if (action.includes('completed') || action.includes('created')) return '#34A853'
    if (action.includes('alert') || action.includes('warning')) return '#FBBC04'
    return '#4285F4'
  }

  return (
    <Card sx={{ 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Recent Activity
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
          {activities.map((activity, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: currentColors.hover,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: alpha(getActivityColor(activity.action), 0.1),
                  color: getActivityColor(activity.action),
                  fontSize: 14,
                }}
              >
                {getActivityIcon(activity.user)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="medium">
                  {activity.service}
                </Typography>
                <Typography variant="caption" color={currentColors.textSecondary}>
                  {activity.action}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color={currentColors.textSecondary}>
                  {activity.time}
                </Typography>
                <Typography variant="caption" color={currentColors.textSecondary} sx={{ display: 'block' }}>
                  {activity.user}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}