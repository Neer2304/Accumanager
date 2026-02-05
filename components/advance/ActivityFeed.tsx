// components/advance/ActivityFeed.tsx
'use client'

import { Box, Typography, Avatar, Chip, Divider } from '@mui/material'
import {
  ShoppingCart,
  PersonAdd,
  Inventory,
  AccessTime,
  TrendingUp,
  Settings,
  Notifications,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'

interface ActivityFeedProps {
  activities: any[]
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const { currentScheme } = useAdvanceThemeContext()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart />
      case 'customer':
        return <PersonAdd />
      case 'product':
        return <Inventory />
      case 'session':
        return <AccessTime />
      case 'growth':
        return <TrendingUp />
      case 'settings':
        return <Settings />
      default:
        return <Notifications />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
      case 'paid':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
      case 'failed':
        return 'error'
      default:
        return 'default'
    }
  }

  const formatTime = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60))
    
    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
    return activityTime.toLocaleDateString()
  }

  if (!activities?.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No recent activity
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {activities.map((activity, index) => (
        <Box key={index}>
          <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: `${currentScheme.colors.primary}20`,
                color: currentScheme.colors.primary,
              }}
            >
              {getActivityIcon(activity.type)}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                {activity.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {activity.description}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(activity.timestamp)}
                </Typography>
                
                {activity.status && (
                  <Chip
                    label={activity.status}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      bgcolor: `${currentScheme.colors.buttons[getStatusColor(activity.status)]}20`,
                      color: currentScheme.colors.buttons[getStatusColor(activity.status)],
                    }}
                  />
                )}
                
                {activity.amount && (
                  <Typography variant="caption" fontWeight="medium" sx={{ ml: 'auto' }}>
                    ₹{activity.amount}
                  </Typography>
                )}
                
                {activity.duration && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {activity.duration.toFixed(0)}m
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          
          {index < activities.length - 1 && (
            <Divider sx={{ borderColor: `${currentScheme.colors.components.border}50` }} />
          )}
        </Box>
      ))}
    </Box>
  )
}