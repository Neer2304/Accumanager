import React from 'react'
import { Stack, Typography, TextField } from '@mui/material'
import { Business as BusinessIcon } from '@mui/icons-material'
import { BusinessInfoStepProps } from './BusinessInfoStep.types'
import { businessSetupContent } from '@/data/businessSetupContent'

export const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({ formData, onInputChange }) => {
  const { businessInfo } = businessSetupContent
  const { fields } = businessInfo

  return (
    <Stack spacing={3}>
      <Typography variant="h6" color="primary" sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        fontWeight: 600
      }}>
        <BusinessIcon />
        {businessInfo.title}
      </Typography>
      
      <TextField
        fullWidth
        label={fields.businessName.label}
        value={formData.businessName}
        onChange={(e) => onInputChange('businessName', e.target.value)}
        placeholder={fields.businessName.placeholder}
        helperText={fields.businessName.helperText}
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
      />
      
      <TextField
        fullWidth
        label={fields.gstNumber.label}
        value={formData.gstNumber}
        onChange={(e) => onInputChange('gstNumber', e.target.value.toUpperCase())}
        placeholder={fields.gstNumber.placeholder}
        helperText={fields.gstNumber.helperText}
        inputProps={{ maxLength: fields.gstNumber.maxLength }}
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
      />
      
      <TextField
        fullWidth
        label={fields.logo.label}
        value={formData.logo || ''}
        onChange={(e) => onInputChange('logo', e.target.value)}
        placeholder={fields.logo.placeholder}
        helperText={fields.logo.helperText}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
      />
    </Stack>
  )
}