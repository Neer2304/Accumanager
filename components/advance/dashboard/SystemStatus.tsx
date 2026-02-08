import { Box, Card, CardContent, Typography, Divider, List } from '@mui/material'
import { alpha } from '@mui/material/styles'
import StatusItem from './components/StatusItem'
import { CheckCircle, Warning, Error as ErrorIcon } from '@mui/icons-material'

interface SystemStatusProps {
  currentColors: any
  googleColors: any
  mode: string
  alpha: any
}

export default function SystemStatus({
  currentColors,
  googleColors,
  mode,
  alpha
}: SystemStatusProps) {
  const statusItems = [
    {
      icon: <CheckCircle sx={{ color: googleColors.green }} />,
      title: 'API Server',
      status: 'Operational',
      statusColor: googleColors.green,
    },
    {
      icon: <CheckCircle sx={{ color: googleColors.green }} />,
      title: 'Database',
      status: 'Healthy',
      statusColor: googleColors.green,
    },
    {
      icon: <Warning sx={{ color: googleColors.yellow }} />,
      title: 'Email Service',
      status: 'Degraded',
      statusColor: googleColors.yellow,
    },
    {
      icon: <CheckCircle sx={{ color: googleColors.green }} />,
      title: 'Payment Gateway',
      status: 'Operational',
      statusColor: googleColors.green,
    },
  ]

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
        <Typography variant="h6" fontWeight="bold" mb={3}>
          System Status
        </Typography>
        
        <List disablePadding>
          {statusItems.map((item, index) => (
            <StatusItem
              key={index}
              icon={item.icon}
              title={item.title}
              status={item.status}
              statusColor={item.statusColor}
              currentColors={currentColors}
            />
          ))}
        </List>
        
        <Divider sx={{ 
          my: 2, 
          borderColor: currentColors.border 
        }} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography variant="body2" color={currentColors.textSecondary}>
            Last updated
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            Just now
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}