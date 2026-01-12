import React from 'react'
import { Stack, Typography, TextField, Box } from '@mui/material'
import { LocationOn as LocationIcon } from '@mui/icons-material'
import { AddressStepProps } from './AddressStep.types'
import { businessSetupContent } from '@/data/businessSetupContent'

export const AddressStep: React.FC<AddressStepProps> = ({ formData, onInputChange }) => {
  const { addressDetails } = businessSetupContent
  const { fields } = addressDetails

  return (
    <Stack spacing={3}>
      <Typography variant="h6" color="primary" sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        fontWeight: 600
      }}>
        <LocationIcon />
        {addressDetails.title}
      </Typography>
      
      <TextField
        fullWidth
        label={fields.address.label}
        value={formData.address}
        onChange={(e) => onInputChange('address', e.target.value)}
        placeholder={fields.address.placeholder}
        multiline={fields.address.multiline}
        rows={fields.address.rows}
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
      />
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        gap: 2 
      }}>
        <TextField
          fullWidth
          label={fields.city.label}
          value={formData.city}
          onChange={(e) => onInputChange('city', e.target.value)}
          placeholder={fields.city.placeholder}
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
        
        <TextField
          fullWidth
          label={fields.state.label}
          value={formData.state}
          onChange={(e) => onInputChange('state', e.target.value)}
          placeholder={fields.state.placeholder}
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        gap: 2 
      }}>
        <TextField
          fullWidth
          label={fields.pincode.label}
          value={formData.pincode}
          onChange={(e) => onInputChange('pincode', e.target.value.replace(/\D/g, ''))}
          placeholder={fields.pincode.placeholder}
          inputProps={{ maxLength: fields.pincode.maxLength }}
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
        
        <TextField
          fullWidth
          label={fields.country.label}
          value={formData.country}
          onChange={(e) => onInputChange('country', e.target.value)}
          placeholder={fields.country.placeholder}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      </Box>
    </Stack>
  )
}