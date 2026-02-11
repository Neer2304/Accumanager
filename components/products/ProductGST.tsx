'use client'

import React from 'react'
import {
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Stack,
  Avatar,
  InputAdornment,
  Paper,
  FormControl,
  FormLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Receipt as ReceiptIcon,
  QrCode as QrCodeIcon,
  Percent as PercentIcon,
} from '@mui/icons-material'

interface ProductGSTProps {
  data: any
  onChange: (data: any) => void
}

export default function ProductGST({ data, onChange }: ProductGSTProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Ensure all GST fields have proper initial values
  const gstData = {
    type: data.gstDetails?.type || 'cgst_sgst',
    hsnCode: data.gstDetails?.hsnCode || '',
    cgstRate: data.gstDetails?.cgstRate || 0,
    sgstRate: data.gstDetails?.sgstRate || 0,
    igstRate: data.gstDetails?.igstRate || 0,
    utgstRate: data.gstDetails?.utgstRate || 0,
  }

  const handleGSTChange = (field: string, value: any) => {
    onChange({
      gstDetails: {
        ...gstData,
        [field]: value
      }
    })
  }

  const handleTypeChange = (type: string) => {
    const newGstDetails = {
      ...gstData,
      type
    }
    
    // Reset rates when type changes
    if (type === 'igst') {
      newGstDetails.cgstRate = 0
      newGstDetails.sgstRate = 0
      newGstDetails.utgstRate = 0
    } else {
      newGstDetails.igstRate = 0
    }
    
    onChange({ gstDetails: newGstDetails })
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
            color: darkMode ? '#8ab4f8' : '#1a73e8',
          }}
        >
          <ReceiptIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            GST & Tax Information
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Configure tax details for your product
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3}>
        {/* HSN Code */}
        <Box>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
          >
            HSN Code <span style={{ color: darkMode ? '#f28b82' : '#ea4335' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. 851712"
            value={gstData.hsnCode}
            onChange={(e) => handleGSTChange('hsnCode', e.target.value)}
            required
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <QrCodeIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                color: darkMode ? '#e8eaed' : '#202124',
                '&:hover': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                },
                '&.Mui-focused': {
                  borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                  boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                },
              },
            }}
          />
        </Box>

        {/* GST Type */}
        <Paper
          sx={{
            p: 2,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}
        >
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{
                color: darkMode ? '#e8eaed' : '#202124',
                '&.Mui-focused': {
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                },
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                GST Type
              </Typography>
            </FormLabel>
            <RadioGroup
              value={gstData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              row={!isMobile}
              sx={{ mt: 1 }}
            >
              <FormControlLabel
                value="cgst_sgst"
                control={
                  <Radio
                    sx={{
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      '&.Mui-checked': {
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    CGST + SGST
                  </Typography>
                }
              />
              <FormControlLabel
                value="igst"
                control={
                  <Radio
                    sx={{
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      '&.Mui-checked': {
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    IGST
                  </Typography>
                }
              />
              <FormControlLabel
                value="utgst"
                control={
                  <Radio
                    sx={{
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      '&.Mui-checked': {
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    UTGST
                  </Typography>
                }
              />
            </RadioGroup>
          </FormControl>
        </Paper>

        {/* Tax Rates */}
        {gstData.type === 'cgst_sgst' && (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
              >
                CGST Rate (%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="9"
                value={gstData.cgstRate}
                onChange={(e) => handleGSTChange('cgstRate', parseFloat(e.target.value) || 0)}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PercentIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    </InputAdornment>
                  ),
                  inputProps: { min: 0, max: 100, step: 0.1 },
                  sx: {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
              >
                SGST Rate (%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="9"
                value={gstData.sgstRate}
                onChange={(e) => handleGSTChange('sgstRate', parseFloat(e.target.value) || 0)}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PercentIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    </InputAdornment>
                  ),
                  inputProps: { min: 0, max: 100, step: 0.1 },
                  sx: {
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                    },
                    '&.Mui-focused': {
                      borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                      boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                    },
                  },
                }}
              />
            </Box>
          </Stack>
        )}

        {gstData.type === 'igst' && (
          <Box sx={{ maxWidth: { xs: '100%', sm: '50%' } }}>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
            >
              IGST Rate (%)
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="18"
              value={gstData.igstRate}
              onChange={(e) => handleGSTChange('igstRate', parseFloat(e.target.value) || 0)}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PercentIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
                inputProps: { min: 0, max: 100, step: 0.1 },
                sx: {
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                  },
                  '&.Mui-focused': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                  },
                },
              }}
            />
          </Box>
        )}

        {gstData.type === 'utgst' && (
          <Box sx={{ maxWidth: { xs: '100%', sm: '50%' } }}>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
            >
              UTGST Rate (%)
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="9"
              value={gstData.utgstRate}
              onChange={(e) => handleGSTChange('utgstRate', parseFloat(e.target.value) || 0)}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PercentIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
                inputProps: { min: 0, max: 100, step: 0.1 },
                sx: {
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  color: darkMode ? '#e8eaed' : '#202124',
                  '&:hover': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                  },
                  '&.Mui-focused': {
                    borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                  },
                },
              }}
            />
          </Box>
        )}
      </Stack>
    </Box>
  )
}