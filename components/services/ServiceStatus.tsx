// components/services/ServiceStatus.tsx
import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'

interface ServiceStatusProps {
  services: any[]
  categories: any[]
}

export default function ServiceStatus({ services, categories }: ServiceStatusProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Service Status
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {categories.map((category) => {
            const categoryServices = services.filter(s => s.category === category.id)
            const availableServices = categoryServices.filter(s => s.status === 'available')
            
            return (
              <Box key={category.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: '50%',
                  backgroundColor: `${category.color}.main`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}>
                  {category.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight="medium">
                      {category.name}
                    </Typography>
                    <Chip
                      label={`${availableServices.length}/${categoryServices.length}`}
                      size="small"
                      color="success"
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {availableServices.length === categoryServices.length 
                      ? 'All services available' 
                      : `${availableServices.length} of ${categoryServices.length} available`}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </CardContent>
    </Card>
  )
}