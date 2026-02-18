// components/googlecompaniescreate/components/BasicInfoForm.tsx
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { industries, companySizes, GOOGLE_COLORS } from '../constants';

interface BasicInfoFormProps {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (event: any) => void;
  darkMode: boolean;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  formData,
  onInputChange,
  onSelectChange,
  darkMode
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={500} sx={{ mb: 3, color: darkMode ? '#e8eaed' : '#202124' }}>
        Basic Information
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          name="name"
          label="Company Name *"
          value={formData.name}
          onChange={onInputChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BusinessIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
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
            '& .MuiInputLabel-root': {
              color: darkMode ? '#9aa0a6' : '#5f6368',
            },
          }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <TextField
            fullWidth
            name="email"
            label="Company Email *"
            type="email"
            value={formData.email}
            onChange={onInputChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
            }}
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
            name="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={onInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
            }}
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
          <FormControl 
            fullWidth
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
              '& .MuiInputLabel-root': {
                color: darkMode ? '#9aa0a6' : '#5f6368',
              },
            }}
          >
            <InputLabel>Industry</InputLabel>
            <Select
              name="industry"
              value={formData.industry}
              label="Industry"
              onChange={onSelectChange}
            >
              <MenuItem value="">Select Industry</MenuItem>
              {industries.map(industry => (
                <MenuItem key={industry} value={industry}>{industry}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl 
            fullWidth
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
          >
            <InputLabel>Company Size</InputLabel>
            <Select
              name="size"
              value={formData.size}
              label="Company Size"
              onChange={onSelectChange}
              startAdornment={
                <InputAdornment position="start">
                  <GroupIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              }
            >
              {companySizes.map(size => (
                <MenuItem key={size.value} value={size.value}>{size.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          name="website"
          label="Website"
          value={formData.website}
          onChange={onInputChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LanguageIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
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
      </Box>
    </Box>
  );
};