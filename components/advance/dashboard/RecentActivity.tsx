import { Box, Card, CardContent, Typography, Button } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ActivityItem from './components/ActivityItem'

interface RecentActivityProps {
  activities: any[]
  currentColors: any
  googleColors: any
  mode: string
}

export default function RecentActivity({
  activities = [],
  currentColors,
  googleColors,
  mode
}: RecentActivityProps) {
  
  // Default activities if none provided
  const defaultActivities = [
    {
      type: 'success',
      title: 'System Updated',
      description: 'Dashboard refreshed successfully',
      time: 'Just now'
    },
    {
      type: 'info',
      title: 'New User Registered',
      description: 'John Doe joined the platform',
      time: '5 min ago'
    },
    {
      type: 'sale',
      title: 'New Sale',
      description: 'Order #1234 completed',
      time: '1 hour ago'
    }
  ]

  const displayActivities = activities.length > 0 ? activities : defaultActivities

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
            Recent Activity
          </Typography>
          <Button
            size="small"
            sx={{ 
              color: googleColors.blue,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: alpha(googleColors.blue, 0.04),
              }
            }}
          >
            View All
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {displayActivities.map((activity: any, index: number) => (
            <ActivityItem
              key={index}
              activity={activity}
              currentColors={currentColors}
              googleColors={googleColors}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}