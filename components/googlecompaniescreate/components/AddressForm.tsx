// components/googlecompaniescreate/components/AddressForm.tsx
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  useTheme
} from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';

interface AddressFormProps {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  darkMode: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  formData,
  onInputChange,
  darkMode
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={500} sx={{ mb: 3, color: darkMode ? '#e8eaed' : '#202124' }}>
        Address Information
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          name="address.street"
          label="Street Address"
          value={formData.address.street}
          onChange={onInputChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              '&:hover': {
                backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
              },
            },
          }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <TextField
            fullWidth
            name="address.city"
            label="City"
            value={formData.address.city}
            onChange={onInputChange}
            sx={{
              flex: '1 1 calc(50% - 12px)',
              minWidth: { xs: '100%', sm: 'calc(50% - 12px)' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                },
              },
            }}
          />

          <TextField
            fullWidth
            name="address.state"
            label="State"
            value={formData.address.state}
            onChange={onInputChange}
            sx={{
              flex: '1 1 calc(50% - 12px)',
              minWidth: { xs: '100%', sm: 'calc(50% - 12px)' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                },
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <TextField
            fullWidth
            name="address.country"
            label="Country"
            value={formData.address.country}
            onChange={onInputChange}
            sx={{
              flex: '1 1 calc(50% - 12px)',
              minWidth: { xs: '100%', sm: 'calc(50% - 12px)' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                },
              },
            }}
          />

          <TextField
            fullWidth
            name="address.zipCode"
            label="ZIP / Postal Code"
            value={formData.address.zipCode}
            onChange={onInputChange}
            sx={{
              flex: '1 1 calc(50% - 12px)',
              minWidth: { xs: '100%', sm: 'calc(50% - 12px)' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                '&:hover': {
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};