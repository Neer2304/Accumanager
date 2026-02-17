// components/googleadminproduct/GoogleProductOverview.tsx
'use client'

import React from 'react'
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  alpha,
  Box,
} from '@mui/material'
import {
  Inventory,
  LocalOffer,
  ShoppingCart,
} from '@mui/icons-material'
import { ProductOverviewProps } from './types'
import { Avatar } from '../ui/Avatar'

export default function GoogleProductOverview({
  product,
  darkMode,
  isMobile,
  calculateTotalStock,
  formatCurrency,
  getStockStatus,
}: ProductOverviewProps) {
  if (!product) return null

  const totalStock = calculateTotalStock(product)
  const stockStatus = getStockStatus(totalStock)

  return (
    <Card sx={{ 
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: darkMode ? '#e8eaed' : '#202124',
          mb: 3,
        }}>
          <Inventory /> Product Overview
        </Typography>

        <Stack spacing={3}>
          {/* Basic Info */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Card sx={{ 
              flex: 1, 
              minWidth: 200,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} gutterBottom>
                  Base Price
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                  {formatCurrency(product.basePrice)}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Selling Price
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ 
              flex: 1, 
              minWidth: 200,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} gutterBottom>
                  Cost Price
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {formatCurrency(product.baseCostPrice)}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Unit Cost
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ 
              flex: 1, 
              minWidth: 200,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} gutterBottom>
                  Profit Margin
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#34a853' }}>
                  {(((product.basePrice - product.baseCostPrice) / product.baseCostPrice) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  {formatCurrency(product.basePrice - product.baseCostPrice)} profit per unit
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          {/* Stock Status */}
          <Card sx={{ 
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Stock Summary
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="space-around">
                <Box sx={{ textAlign: 'center' }}>
                  <Chip 
                    label={stockStatus.label}
                    sx={{
                      backgroundColor: alpha(stockStatus.color, 0.1),
                      color: stockStatus.color,
                      border: 'none',
                      fontWeight: 500,
                      mb: 1,
                    }}
                  />
                  <Typography variant="h4" fontWeight="bold" sx={{ color: stockStatus.color }}>
                    {totalStock}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Total Units
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Chip 
                    label="Low Stock Threshold"
                    sx={{
                      backgroundColor: alpha('#fbbc04', 0.1),
                      color: '#fbbc04',
                      border: 'none',
                      fontWeight: 500,
                      mb: 1,
                    }}
                  />
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#fbbc04' }}>
                    10
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Units
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Variations & Batches Summary */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Card sx={{ 
              flex: 1,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ 
                    backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.1),
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                  }}>
                    <LocalOffer />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Variations
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {product.variations?.length || 0}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ 
              flex: 1,
              borderRadius: '12px',
              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ 
                    backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.1),
                    color: '#fbbc04',
                  }}>
                    <ShoppingCart />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Batches
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {product.batches?.length || 0}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}