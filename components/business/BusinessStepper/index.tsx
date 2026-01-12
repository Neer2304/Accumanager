import React from 'react'
import { Card, CardContent, Stepper, Step, StepLabel } from '@mui/material'
import { businessSetupContent } from '@/data/businessSetupContent'

interface BusinessStepperProps {
  activeStep: number
}

export const BusinessStepper: React.FC<BusinessStepperProps> = ({ activeStep }) => {
  return (
    <Card sx={{ 
      mb: 3,
      borderRadius: 2,
      backgroundColor: 'background.paper'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{
            '& .MuiStepLabel-label': {
              fontWeight: 500,
              color: 'text.primary'
            },
            '& .MuiStepLabel-label.Mui-active': {
              fontWeight: 600,
              color: 'primary.main'
            },
            '& .MuiStepLabel-label.Mui-completed': {
              color: 'success.main'
            }
          }}
        >
          {businessSetupContent?.steps?.map((step) => (
            <Step key={step.id}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </CardContent>
    </Card>
  )
}