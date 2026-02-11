'use client'

import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  Stack,
  Avatar,
  Divider,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Store as StoreIcon,
  AttachMoney as AttachMoneyIcon,
  LocalOffer as LocalOfferIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  Save as SaveIcon,
} from '@mui/icons-material'

interface ProductReviewProps {
  data: any
  onSave: () => void
  isLoading?: boolean
}

export default function ProductReview({ data, onSave, isLoading = false }: ProductReviewProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getGSTLabel = () => {
    switch (data.gstDetails.type) {
      case 'cgst_sgst':
        return `CGST: ${data.gstDetails.cgstRate}% + SGST: ${data.gstDetails.sgstRate}%`
      case 'igst':
        return `IGST: ${data.gstDetails.igstRate}%`
      case 'utgst':
        return `UTGST: ${data.gstDetails.utgstRate}%`
      default:
        return 'No GST'
    }
  }

  const totalStock = (data.variations || []).reduce((sum: number, variation: any) => sum + (variation.stock || 0), 0) +
                    (data.batches || []).reduce((sum: number, batch: any) => sum + (batch.quantity || 0), 0)

  // Validate required fields
  const isValidProduct = data.name && data.category && data.basePrice > 0 && data.gstDetails?.hsnCode

  // Check for missing fields
  const missingFields = []
  if (!data.name) missingFields.push('Product Name')
  if (!data.category) missingFields.push('Category')
  if (!data.basePrice || data.basePrice <= 0) missingFields.push('Base Price')
  if (!data.gstDetails?.hsnCode) missingFields.push('HSN Code')

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
          <CheckCircleIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Review & Save
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Verify all information before publishing
          </Typography>
        </Box>
      </Stack>

      {!isValidProduct && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: '12px',
            backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.05)',
            border: `1px solid ${darkMode ? 'rgba(251, 188, 4, 0.2)' : 'rgba(251, 188, 4, 0.1)'}`,
            color: darkMode ? '#fdd663' : '#b45a1c',
            '& .MuiAlert-icon': {
              color: darkMode ? '#fdd663' : '#b45a1c',
            },
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            Missing required fields: {missingFields.join(', ')}
          </Typography>
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Basic Information Card */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }}
              >
                <DescriptionIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="subtitle1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Basic Information
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Product Name:
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {data.name || 'Not provided'}
                </Typography>
              </Stack>

              {data.description && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Description:
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124', maxWidth: '70%' }}>
                    {data.description.length > 100 ? `${data.description.substring(0, 100)}...` : data.description}
                  </Typography>
                </Stack>
              )}

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Category:
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {data.category || 'Not provided'}
                  {data.subCategory && ` / ${data.subCategory}`}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Brand:
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {data.brand || 'Not specified'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Base Price:
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                  ₹{data.basePrice?.toLocaleString() || 0}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Cost Price:
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  ₹{data.baseCostPrice?.toLocaleString() || 0}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Returnable:
                </Typography>
                <Chip
                  label={data.isReturnable ? `Yes (${data.returnPeriod} days)` : 'No'}
                  size="small"
                  sx={{
                    backgroundColor: data.isReturnable
                      ? darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)'
                      : darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                    color: data.isReturnable
                      ? darkMode ? '#81c995' : '#34a853'
                      : darkMode ? '#9aa0a6' : '#5f6368',
                    border: 'none',
                  }}
                />
              </Stack>

              {data.tags && data.tags.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1 }}>
                    Tags:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {data.tags.map((tag: string, index: number) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{
                          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                          border: 'none',
                          mb: 0.5,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* GST Information Card */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }}
              >
                <ReceiptIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="subtitle1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                GST Information
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  HSN Code:
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', fontFamily: 'monospace' }}>
                  {data.gstDetails?.hsnCode || 'Not provided'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  GST Type:
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {data.gstDetails?.type?.toUpperCase().replace('_', ' + ') || 'Not specified'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Tax Rates:
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                  {getGSTLabel()}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Variations Summary */}
        {data.variations && data.variations.length > 0 && (
          <Card
            sx={{
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  }}
                >
                  <LocalOfferIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Product Variations ({data.variations.length})
                </Typography>
              </Stack>

              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                      <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>SKU</TableCell>
                      <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>Variation</TableCell>
                      <TableCell align="right" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>Price</TableCell>
                      <TableCell align="right" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.variations.map((variation: any, index: number) => (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: darkMode ? '#303134' : '#ffffff',
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`, fontFamily: 'monospace' }}>
                          {variation.sku}
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          {[variation.size, variation.color, variation.material]
                            .filter(Boolean)
                            .join(' / ') || 'Base Variation'}
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`, fontWeight: 500, color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                          ₹{variation.price}
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                          {variation.stock}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Batches Summary */}
        {data.batches && data.batches.length > 0 && (
          <Card
            sx={{
              borderRadius: '16px',
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  }}
                >
                  <InventoryIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Inventory Batches ({data.batches.length})
                </Typography>
              </Stack>

              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                      <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>Batch No.</TableCell>
                      <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>MFG Date</TableCell>
                      <TableCell sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>EXP Date</TableCell>
                      <TableCell align="right" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>Quantity</TableCell>
                      <TableCell align="right" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontWeight: 500, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>Cost Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.batches.map((batch: any, index: number) => {
                      const expired = new Date(batch.expDate) < new Date();
                      const expiringSoon = !expired && new Date(batch.expDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                      
                      return (
                        <TableRow
                          key={index}
                          sx={{
                            backgroundColor: darkMode ? '#303134' : '#ffffff',
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`, fontFamily: 'monospace' }}>
                            {batch.batchNumber}
                          </TableCell>
                          <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                            {batch.mfgDate ? new Date(batch.mfgDate).toLocaleDateString() : 'Not set'}
                          </TableCell>
                          <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: expired
                                  ? darkMode ? '#f28b82' : '#ea4335'
                                  : expiringSoon
                                  ? darkMode ? '#fdd663' : '#fbbc04'
                                  : darkMode ? '#e8eaed' : '#202124',
                              }}
                            >
                              {batch.expDate ? new Date(batch.expDate).toLocaleDateString() : 'Not set'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                            {batch.quantity}
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                            ₹{batch.costPrice}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Summary Card */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                }}
              >
                <InventoryIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="subtitle1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Summary
              </Typography>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} divider={<Divider orientation="vertical" flexItem sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Total Variations
                </Typography>
                <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {data.variations?.length || 0}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Total Batches
                </Typography>
                <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {data.batches?.length || 0}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Total Stock
                </Typography>
                <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                  {totalStock} units
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={!isValidProduct || isLoading}
          startIcon={isLoading ? undefined : <SaveIcon />}
          sx={{
            borderRadius: '28px',
            px: 4,
            py: 1.25,
            backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
            color: darkMode ? '#202124' : '#ffffff',
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            minWidth: 160,
            '&:hover': {
              backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
              boxShadow: darkMode
                ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                : '0 4px 12px rgba(26, 115, 232, 0.3)',
            },
            '&:disabled': {
              backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
              color: darkMode ? '#9aa0a6' : '#5f6368',
            },
          }}
        >
          {isLoading ? 'Saving...' : 'Save Product'}
        </Button>
      </Box>
    </Box>
  )
}