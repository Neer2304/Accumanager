import { Box, Card, CardContent, Typography, Avatar } from '@mui/material'

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: string
  currentColors: any
  isMobile: boolean
  alpha: any
}

export default function StatCard({
  title,
  value,
  icon,
  color,
  currentColors,
  isMobile,
  alpha
}: StatCardProps) {
  return (
    <Card sx={{ 
      flex: isMobile ? '1 1 100%' : '1 1 calc(25% - 16px)',
      minWidth: isMobile ? '100%' : '150px',
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    }}>
      <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography 
              variant="h5" 
              fontWeight="bold"
              fontSize={isMobile ? '1.25rem' : '1.5rem'}
            >
              {value}
            </Typography>
            <Typography 
              variant="body2" 
              color={currentColors.textSecondary}
              fontSize={isMobile ? '0.75rem' : '0.875rem'}
            >
              {title}
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40,
              bgcolor: alpha(color, 0.1),
              color: color,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}