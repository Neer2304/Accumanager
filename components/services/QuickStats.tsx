// components/services/QuickStats.tsx
import { Card, CardContent, Typography, Box } from '@mui/material'

interface QuickStatsProps {
  stats: any[]
}

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Overview
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1.5,
          mt: 2,
        }}>
          {stats.map((stat, index) => (
            <Box key={index} sx={{ 
              p: 1.5,
              borderRadius: '8px',
              backgroundColor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  backgroundColor: `${stat.color}.main`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}