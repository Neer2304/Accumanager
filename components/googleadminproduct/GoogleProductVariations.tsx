// components/googleadminproduct/GoogleProductVariations.tsx
'use client'

import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  alpha,
} from '@mui/material'
import {
  LocalOffer,
} from '@mui/icons-material'
import { ProductVariationsProps } from './types'

export default function GoogleProductVariations({
  variations,
  darkMode,
  formatCurrency,
  getStockStatus,
}: ProductVariationsProps) {
  if (!variations || variations.length === 0) {
    return (
      <Card sx={{ 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <LocalOffer sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
          <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }} gutterBottom>
            No Variations
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            This product doesn't have any variations configured
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ 
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
    }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: darkMode ? '#e8eaed' : '#202124',
          }}>
            <LocalOffer /> Product Variations
          </Typography>
          <Chip 
            label={`${variations.length} variations`} 
            sx={{
              backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.1),
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              border: 'none',
              fontWeight: 500,
            }}
          />
        </Stack>
        
        <TableContainer component={Paper} sx={{ 
          borderRadius: '12px',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          overflowX: 'auto',
        }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 600,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  fontSize: '0.8rem',
                }}>
                  Variation
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 600,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  fontSize: '0.8rem',
                }}>
                  SKU
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 600,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  fontSize: '0.8rem',
                }}>
                  Price
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 600,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  fontSize: '0.8rem',
                }}>
                  Cost
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 600,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  fontSize: '0.8rem',
                }}>
                  Stock
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 600,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  fontSize: '0.8rem',
                }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {variations.map((variation, index) => {
                const stockStatus = getStockStatus(variation.stock || 0)
                
                return (
                  <TableRow 
                    key={index}
                    hover
                    sx={{ 
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      '&:hover': {
                        backgroundColor: darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.02),
                      }
                    }}
                  >
                    <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.1),
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                          fontSize: '0.875rem',
                        }}>
                          {variation.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                          {variation.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Chip 
                        label={variation.sku || 'N/A'} 
                        size="small" 
                        sx={{ 
                          fontFamily: 'monospace',
                          backgroundColor: darkMode ? alpha('#9aa0a6', 0.1) : alpha('#5f6368', 0.1),
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          border: 'none',
                          fontSize: '0.7rem',
                          height: 20,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body1" fontWeight="500" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                        {formatCurrency(variation.price || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {formatCurrency(variation.costPrice || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Chip 
                        label={variation.stock || 0} 
                        size="small"
                        sx={{ 
                          backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.1),
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                          border: 'none',
                          minWidth: 50,
                          fontSize: '0.7rem',
                          height: 20,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Chip 
                        label={stockStatus.label}
                        size="small"
                        sx={{ 
                          backgroundColor: alpha(stockStatus.color, 0.1),
                          color: stockStatus.color,
                          border: 'none',
                          fontSize: '0.7rem',
                          height: 20,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}