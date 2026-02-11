'use client'

import React from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  IconButton,
  Stack,
  Avatar,
  Chip,
  InputAdornment,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  LocalOffer as LocalOfferIcon,
  QrCode as QrCodeIcon,
  Straighten as StraightenIcon,
  ColorLens as ColorLensIcon,
  Category as CategoryIcon,
  Scale as ScaleIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'

interface ProductVariationsProps {
  data: any
  onChange: (data: any) => void
}

export default function ProductVariations({ data, onChange }: ProductVariationsProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const variations = data.variations || []

  const addVariation = () => {
    const newVariation = {
      id: `var_${Date.now()}`,
      sku: `${data.name?.substring(0, 3).toUpperCase() || 'PRO'}_${variations.length + 1}`,
      size: '',
      color: '',
      material: '',
      weight: 0,
      unit: 'g',
      price: data.basePrice || 0,
      costPrice: data.baseCostPrice || 0,
      stock: 0,
      minStock: 0,
      maxStock: 100,
      barcode: '',
      images: [],
      isActive: true
    }
    
    onChange({ variations: [...variations, newVariation] })
  }

  const updateVariation = (index: number, field: string, value: any) => {
    const updatedVariations = [...variations]
    updatedVariations[index] = {
      ...updatedVariations[index],
      [field]: value
    }
    onChange({ variations: updatedVariations })
  }

  const removeVariation = (index: number) => {
    const updatedVariations = variations.filter((_: any, i: number) => i !== index)
    onChange({ variations: updatedVariations })
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              color: darkMode ? '#8ab4f8' : '#1a73e8',
            }}
          >
            <LocalOfferIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Product Variations
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Add different variants like size, color, material
            </Typography>
          </Box>
        </Stack>
        <Button
          startIcon={<AddIcon />}
          onClick={addVariation}
          variant="contained"
          sx={{
            borderRadius: '28px',
            px: 3,
            py: 1,
            backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
            color: darkMode ? '#202124' : '#ffffff',
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
              boxShadow: darkMode
                ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                : '0 4px 12px rgba(26, 115, 232, 0.3)',
            },
          }}
        >
          Add Variation
        </Button>
      </Stack>

      {variations.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            borderRadius: '16px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            textAlign: 'center',
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              margin: '0 auto 16px',
              backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
              color: darkMode ? '#9aa0a6' : '#5f6368',
            }}
          >
            <LocalOfferIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h6" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            No variations added yet
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }}>
            Add variations for different sizes, colors, or materials
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={addVariation}
            variant="outlined"
            sx={{
              borderRadius: '28px',
              px: 3,
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              textTransform: 'none',
              '&:hover': {
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              },
            }}
          >
            Add First Variation
          </Button>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {variations.map((variation: any, index: number) => (
            <Card
              key={variation.id}
              sx={{
                borderRadius: '16px',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                boxShadow: 'none',
                position: 'relative',
                '&:hover': {
                  boxShadow: darkMode
                    ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                        fontSize: '0.875rem',
                      }}
                    >
                      {index + 1}
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      Variation #{index + 1}
                    </Typography>
                    {variation.sku && (
                      <Chip
                        label={variation.sku}
                        size="small"
                        sx={{
                          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                          border: 'none',
                          fontFamily: 'monospace',
                          fontSize: '0.7rem',
                        }}
                      />
                    )}
                  </Stack>
                  <Tooltip title="Remove variation">
                    <IconButton
                      onClick={() => removeVariation(index)}
                      sx={{
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        '&:hover': {
                          color: darkMode ? '#f28b82' : '#ea4335',
                          backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="SKU"
                      placeholder="e.g. PRO_001"
                      value={variation.sku || ''}
                      onChange={(e) => updateVariation(index, 'sku', e.target.value)}
                      required
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
                    <TextField
                      fullWidth
                      label="Barcode"
                      placeholder="e.g. 890123456789"
                      value={variation.barcode || ''}
                      onChange={(e) => updateVariation(index, 'barcode', e.target.value)}
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
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Size"
                      placeholder="S, M, L, XL"
                      value={variation.size || ''}
                      onChange={(e) => updateVariation(index, 'size', e.target.value)}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StraightenIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
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
                    <TextField
                      fullWidth
                      label="Color"
                      placeholder="e.g. Black, Red"
                      value={variation.color || ''}
                      onChange={(e) => updateVariation(index, 'color', e.target.value)}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ColorLensIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
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

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Material"
                      placeholder="e.g. Cotton, Metal"
                      value={variation.material || ''}
                      onChange={(e) => updateVariation(index, 'material', e.target.value)}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CategoryIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
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
                    <TextField
                      fullWidth
                      label="Weight"
                      type="number"
                      placeholder="0.00"
                      value={variation.weight || 0}
                      onChange={(e) => updateVariation(index, 'weight', parseFloat(e.target.value) || 0)}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ScaleIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            {variation.unit || 'g'}
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
                  </Stack>

                  <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Price (₹)"
                      type="number"
                      placeholder="0.00"
                      value={variation.price || 0}
                      onChange={(e) => updateVariation(index, 'price', parseFloat(e.target.value) || 0)}
                      required
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
                    <TextField
                      fullWidth
                      label="Cost Price (₹)"
                      type="number"
                      placeholder="0.00"
                      value={variation.costPrice || 0}
                      onChange={(e) => updateVariation(index, 'costPrice', parseFloat(e.target.value) || 0)}
                      required
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
                    <TextField
                      fullWidth
                      label="Stock"
                      type="number"
                      placeholder="0"
                      value={variation.stock || 0}
                      onChange={(e) => updateVariation(index, 'stock', parseInt(e.target.value) || 0)}
                      required
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <InventoryIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                          </InputAdornment>
                        ),
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
                  </Stack>

                  {variation.stock <= 10 && variation.stock > 0 && (
                    <Paper
                      sx={{
                        p: 1.5,
                        borderRadius: '12px',
                        backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.05)',
                        border: `1px solid ${darkMode ? 'rgba(251, 188, 4, 0.2)' : 'rgba(251, 188, 4, 0.1)'}`,
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <WarningIcon sx={{ fontSize: 16, color: darkMode ? '#fdd663' : '#fbbc04' }} />
                        <Typography variant="caption" sx={{ color: darkMode ? '#fdd663' : '#fbbc04' }}>
                          Low stock! Consider adding more inventory.
                        </Typography>
                      </Stack>
                    </Paper>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  )
}