// components/googleadminproduct/GoogleProductGST.tsx
'use client'

import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Paper,
  Avatar,
  Box,
  Divider,
  Alert,
  alpha,
} from '@mui/material'
import {
  Receipt,
} from '@mui/icons-material'
import { ProductGSTProps } from './types'

export default function GoogleProductGST({
  gstDetails,
  darkMode,
  formatCurrency,
}: ProductGSTProps) {
  if (!gstDetails) {
    return (
      <Card sx={{ 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <CardContent>
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: '12px',
              backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.05),
              border: `1px solid ${darkMode ? alpha('#8ab4f8', 0.2) : alpha('#1a73e8', 0.1)}`,
              color: darkMode ? '#8ab4f8' : '#1a73e8',
            }}
          >
            No GST details configured for this product. Add GST details in the edit page.
          </Alert>
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
        <Typography variant="h6" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: darkMode ? '#e8eaed' : '#202124',
          mb: 3,
        }}>
          <Receipt /> GST & Tax Details
        </Typography>
        
        <Stack spacing={3}>
          {/* GST Summary */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center">
              <Avatar sx={{ 
                width: 60, 
                height: 60, 
                backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.1),
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              }}>
                <Receipt fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>GST Type</Typography>
                <Typography variant="h6" textTransform="uppercase" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {gstDetails.type?.replace('_', ' + ')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>HSN Code</Typography>
                <Typography variant="h6" fontFamily="monospace" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  {gstDetails.hsnCode}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Tax Rates */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
            {gstDetails.cgstRate > 0 && (
              <Card sx={{ 
                flex: 1, 
                minWidth: 150,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} gutterBottom>
                    CGST
                  </Typography>
                  <Typography variant="h4" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} fontWeight="bold">
                    {gstDetails.cgstRate}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Central Goods & Services Tax
                  </Typography>
                </CardContent>
              </Card>
            )}
            
            {gstDetails.sgstRate > 0 && (
              <Card sx={{ 
                flex: 1, 
                minWidth: 150,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} gutterBottom>
                    SGST
                  </Typography>
                  <Typography variant="h4" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} fontWeight="bold">
                    {gstDetails.sgstRate}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    State Goods & Services Tax
                  </Typography>
                </CardContent>
              </Card>
            )}
            
            {gstDetails.igstRate > 0 && (
              <Card sx={{ 
                flex: 1, 
                minWidth: 150,
                borderRadius: '12px',
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} gutterBottom>
                    IGST
                  </Typography>
                  <Typography variant="h4" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} fontWeight="bold">
                    {gstDetails.igstRate}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Integrated Goods & Services Tax
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Stack>

          {/* Tax Calculation Example */}
          <Card sx={{ 
            borderRadius: '12px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ 
                color: darkMode ? '#e8eaed' : '#202124',
                fontWeight: 500,
              }}>
                Tax Calculation Example (for ₹1,000)
              </Typography>
              
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>Base Price</Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>₹1,000.00</Typography>
                </Stack>
                
                {gstDetails.cgstRate > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      CGST ({gstDetails.cgstRate}%)
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      ₹{(1000 * gstDetails.cgstRate / 100).toFixed(2)}
                    </Typography>
                  </Stack>
                )}
                
                {gstDetails.sgstRate > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      SGST ({gstDetails.sgstRate}%)
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      ₹{(1000 * gstDetails.sgstRate / 100).toFixed(2)}
                    </Typography>
                  </Stack>
                )}
                
                {gstDetails.igstRate > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      IGST ({gstDetails.igstRate}%)
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      ₹{(1000 * gstDetails.igstRate / 100).toFixed(2)}
                    </Typography>
                  </Stack>
                )}
                
                <Divider sx={{ my: 1, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    Total Price
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                    ₹{(
                      1000 + 
                      (1000 * gstDetails.cgstRate / 100) + 
                      (1000 * gstDetails.sgstRate / 100) + 
                      (1000 * gstDetails.igstRate / 100)
                    ).toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </CardContent>
    </Card>
  )
}