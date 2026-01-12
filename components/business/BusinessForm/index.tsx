import React from 'react'
import { Box, Button } from '@mui/material'
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import { BusinessFormProps } from './BusinessForm.types'
import { BusinessInfoStep } from '../BusinessInfoStep'
import { AddressStep } from '../AddressStep'
import { ContactStep } from '../ContactStep'
import { businessSetupContent } from '@/data/businessSetupContent'

export const BusinessForm: React.FC<BusinessFormProps> = ({
  activeStep,
  formData,
  onInputChange,
  onBack,
  onNext,
  onSubmit,
  isLoading,
  hasBusiness
}) => {
  const { buttons } = businessSetupContent

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <BusinessInfoStep formData={formData} onInputChange={onInputChange} />
      case 1:
        return <AddressStep formData={formData} onInputChange={onInputChange} />
      case 2:
        return <ContactStep formData={formData} onInputChange={onInputChange} />
      default:
        return null
    }
  }

  return (
    <Box>
      {renderStepContent()}

      {/* Navigation Buttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mt: 4,
        pt: 3,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Button
          onClick={onBack}
          disabled={activeStep === 0}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          {buttons.back}
        </Button>

        {activeStep === businessSetupContent?.steps?.length - 1 ? (
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            variant="contained"
            size="large"
            startIcon={isLoading ? null : <CheckCircleIcon />}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            {isLoading ? buttons.saving : (hasBusiness ? buttons.update : buttons.save)}
          </Button>
        ) : (
          <Button 
            onClick={onNext} 
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            {buttons.next}
          </Button>
        )}
      </Box>
    </Box>
  )
}