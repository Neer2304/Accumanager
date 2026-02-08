import { Box, Card, CardContent, Typography } from '@mui/material'
import QuickActionButton from './components/QuickActionButton'
import { 
  Add, 
  FileCopy, 
  Assessment, 
  People,
  Notifications,
  Settings as SettingsIcon 
} from '@mui/icons-material'

interface QuickActionsPanelProps {
  currentColors: any
  googleColors: any
  mode: string
}

export default function QuickActionsPanel({
  currentColors,
  googleColors,
  mode
}: QuickActionsPanelProps) {
  const actions = [
    { icon: <Add />, label: 'New Project', color: googleColors.blue },
    { icon: <FileCopy />, label: 'Create Report', color: googleColors.green },
    { icon: <Assessment />, label: 'Run Analysis', color: googleColors.yellow },
    { icon: <People />, label: 'Invite Team', color: googleColors.red },
    { icon: <Notifications />, label: 'Set Alert', color: googleColors.blue },
    { icon: <SettingsIcon />, label: 'Configure', color: googleColors.green },
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
          Quick Actions
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2,
          justifyContent: 'center'
        }}>
          {actions.map((action, index) => (
            <Box
              key={index}
              sx={{
                flex: '1 1 calc(33.333% - 16px)',
                minWidth: '100px',
              }}
            >
              <QuickActionButton
                icon={action.icon}
                label={action.label}
                color={action.color}
                currentColors={currentColors}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}