import React from 'react'
import { Card, CardContent, Typography, Stack } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import { businessSetupContent } from '@/data/businessSetupContent'

export const BenefitsCard: React.FC = () => {
  const { benefits } = businessSetupContent

  return (
    <Card sx={{ 
      mt: 3,
      borderRadius: 2,
      backgroundColor: 'success.light',
      color: 'success.contrastText',
      border: 'none'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {benefits.title}
        </Typography>
        <Stack spacing={1}>
          {benefits.items.map((item, index) => (
            <Typography 
              key={index} 
              variant="body2"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
              }}
            >
              <CheckCircle sx={{ fontSize: '1rem' }} />
              {item}
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}