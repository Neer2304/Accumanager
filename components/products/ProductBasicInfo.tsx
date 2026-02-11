'use client'

import React, { useState } from 'react'
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  Typography,
  Stack,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Store as StoreIcon,
  AttachMoney as AttachMoneyIcon,
  LocalOffer as LocalOfferIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material'

interface ProductBasicInfoProps {
  data: any
  onChange: (data: any) => void
}

const categories = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Books',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Automotive',
  'Toys & Games',
  'Other'
]

const brands = [
  'Nike',
  'Samsung',
  'Apple',
  'Sony',
  'LG',
  'Philips',
  'Puma',
  'Adidas',
  'Microsoft',
  'Other'
]

export default function ProductBasicInfo({ data, onChange }: ProductBasicInfoProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [tagInput, setTagInput] = useState('');

  // Ensure all fields have proper initial values
  const formData = {
    name: data.name || '',
    description: data.description || '',
    category: data.category || '',
    subCategory: data.subCategory || '',
    brand: data.brand || '',
    basePrice: data.basePrice || 0,
    baseCostPrice: data.baseCostPrice || 0,
    tags: data.tags || [],
    isReturnable: data.isReturnable || false,
    returnPeriod: data.returnPeriod || 0,
  }

  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value })
  }

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      onChange({ tags: [...formData.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    onChange({ tags: formData.tags.filter((tag: string) => tag !== tagToRemove) })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTagAdd()
    }
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
          <DescriptionIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Basic Information
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Enter the core details about your product
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3}>
        {/* Product Name */}
        <Box>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
          >
            Product Name <span style={{ color: darkMode ? '#f28b82' : '#ea4335' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. Samsung Galaxy S21 Ultra"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InventoryIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
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

        {/* Description */}
        <Box>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
          >
            Description
          </Typography>
          <TextField
            fullWidth
            placeholder="Describe your product in detail..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={3}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                  <DescriptionIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
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

        {/* Category and SubCategory */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
            >
              Category <span style={{ color: darkMode ? '#f28b82' : '#ea4335' }}>*</span>
            </Typography>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <Select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                displayEmpty
                sx={{
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
                  '& .MuiSelect-select': {
                    py: 1.5,
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select category</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CategoryIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      <span>{category}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
            >
              Sub Category
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Mobile Phones"
              value={formData.subCategory}
              onChange={(e) => handleChange('subCategory', e.target.value)}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiOutlinedInput-root': {
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

        {/* Brand */}
        <Box>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
          >
            Brand
          </Typography>
          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <Select
              value={formData.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              displayEmpty
              sx={{
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
              }}
            >
              <MenuItem value="" disabled>
                <em>Select brand</em>
              </MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <StoreIcon sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    <span>{brand}</span>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Prices */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
            >
              Base Price (₹) <span style={{ color: darkMode ? '#f28b82' : '#ea4335' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="0.00"
              value={formData.basePrice}
              onChange={(e) => handleChange('basePrice', parseFloat(e.target.value) || 0)}
              required
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
                inputProps: { min: 0, step: 0.01 },
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
              Cost Price (₹) <span style={{ color: darkMode ? '#f28b82' : '#ea4335' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="0.00"
              value={formData.baseCostPrice}
              onChange={(e) => handleChange('baseCostPrice', parseFloat(e.target.value) || 0)}
              required
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
                inputProps: { min: 0, step: 0.01 },
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

        {/* Tags */}
        <Box>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
          >
            Tags
          </Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              placeholder="Add tags and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalOfferIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                  </InputAdornment>
                ),
                endAdornment: tagInput && (
                  <InputAdornment position="end">
                    <Tooltip title="Add tag">
                      <IconButton
                        size="small"
                        onClick={handleTagAdd}
                        sx={{
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
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
          </Stack>
          {formData.tags.length > 0 && (
            <Paper
              sx={{
                mt: 2,
                p: 2,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {formData.tags.map((tag: string, index: number) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleTagRemove(tag)}
                    deleteIcon={<CloseIcon />}
                    size="small"
                    sx={{
                      mb: 1,
                      mr: 1,
                      backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                      border: 'none',
                      '& .MuiChip-deleteIcon': {
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                        '&:hover': {
                          color: darkMode ? '#f28b82' : '#ea4335',
                        },
                      },
                    }}
                  />
                ))}
              </Stack>
            </Paper>
          )}
        </Box>

        {/* Returnable Settings */}
        <Paper
          sx={{
            p: 2,
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}
        >
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isReturnable}
                  onChange={(e) => handleChange('isReturnable', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Product is returnable
                </Typography>
              }
            />

            {formData.isReturnable && (
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
                >
                  Return Period (Days)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="30"
                  value={formData.returnPeriod}
                  onChange={(e) => handleChange('returnPeriod', parseInt(e.target.value) || 0)}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  InputProps={{
                    inputProps: { min: 0 },
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
        </Paper>
      </Stack>
    </Box>
  )
}