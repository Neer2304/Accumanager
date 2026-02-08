// components/services/ServiceCard.tsx
import { Card, CardContent, Typography, Box, Chip, IconButton, alpha, useTheme } from '@mui/material'
import { ArrowForward, CheckCircle } from '@mui/icons-material'
import Link from 'next/link'

interface ServiceCardProps {
  service: any
  viewMode: 'grid' | 'list'
}

export default function ServiceCard({ service, viewMode }: ServiceCardProps) {
  const theme = useTheme()
  
  // Get the actual color value from theme
  const getColorValue = (colorName: string) => {
    return theme.palette[colorName as keyof typeof theme.palette]?.main || theme.palette.primary.main
  }
  
  const colorValue = getColorValue(service.color)

  if (viewMode === 'list') {
    return (
      <Card component={Link} href={service.path} sx={{ 
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: alpha(colorValue, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colorValue,
                flexShrink: 0,
              }}
            >
              {service.icon}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {service.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {service.description}
                  </Typography>
                </Box>
                <IconButton size="small">
                  <ArrowForward />
                </IconButton>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                flexWrap: 'wrap',
                mt: 1,
              }}>
                <Chip
                  label={service.status}
                  size="small"
                  icon={<CheckCircle fontSize="small" />}
                  color="success"
                  variant="outlined"
                />
                
                {service.features.slice(0, 2).map((feature: string, index: number) => (
                  <Chip
                    key={index}
                    label={feature}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    )
  }

  // Grid View
  return (
    <Card 
      component={Link}
      href={service.path}
      sx={{ 
        textDecoration: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 2, flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: alpha(colorValue, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colorValue,
            }}
          >
            {service.icon}
          </Box>
          
          <Chip
            label={service.status}
            size="small"
            icon={<CheckCircle fontSize="small" />}
            color="success"
          />
        </Box>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {service.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {service.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Key Features:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
            {service.features.slice(0, 3).map((feature: string, index: number) => (
              <Chip
                key={index}
                label={feature}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            Click to explore →
          </Typography>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <ArrowForward fontSize="small" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}