import React from 'react'
import { Stack, Typography, TextField } from '@mui/material'
import { ContactPhone as ContactIcon } from '@mui/icons-material'
import { ContactStepProps } from './ContactStep.types'
import { businessSetupContent } from '@/data/businessSetupContent'

export const ContactStep: React.FC<ContactStepProps> = ({ formData, onInputChange }) => {
  const { contactInfo } = businessSetupContent
  const { fields } = contactInfo

  return (
    <Stack spacing={3}>
      <Typography variant="h6" color="primary" sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        fontWeight: 600
      }}>
        <ContactIcon />
        {contactInfo.title}
      </Typography>
      
      <TextField
        fullWidth
        label={fields.phone.label}
        value={formData.phone}
        onChange={(e) => onInputChange('phone', e.target.value.replace(/\D/g, ''))}
        placeholder={fields.phone.placeholder}
        inputProps={{ maxLength: fields.phone.maxLength }}
        helperText={fields.phone.helperText}
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
      />
      
      <TextField
        fullWidth
        label={fields.email.label}
        type={fields.email.type}
        value={formData.email}
        onChange={(e) => onInputChange('email', e.target.value)}
        placeholder={fields.email.placeholder}
        helperText={fields.email.helperText}
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
      />
    </Stack>
  )
}