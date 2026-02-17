// components/googleadminproduct/GoogleProductBatches.tsx
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
  alpha,
} from '@mui/material'
import {
  Inventory,
} from '@mui/icons-material'
import { ProductBatchesProps } from './types'

export default function GoogleProductBatches({
  batches,
  darkMode,
  formatCurrency,
}: ProductBatchesProps) {
  if (!batches || batches.length === 0) {
    return (
      <Card sx={{ 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <Inventory sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
          <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }} gutterBottom>
            No Batches
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            This product doesn't have any batches configured
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
            <Inventory /> Product Batches
          </Typography>
          <Chip 
            label={`${batches.length} batches`} 
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
                  Batch No.
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 600,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  fontSize: '0.8rem',
                }}>
                  Quantity
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 600,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  fontSize: '0.8rem',
                }}>
                  Cost Price
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 600,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  fontSize: '0.8rem',
                }}>
                  Selling Price
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 600,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  fontSize: '0.8rem',
                }}>
                  MFG Date
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 600,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  fontSize: '0.8rem',
                }}>
                  EXP Date
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 600,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  fontSize: '0.8rem',
                }}>
                  Received
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {batches.map((batch, index) => {
                const isExpired = batch.expDate && new Date(batch.expDate) < new Date();
                
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
                      <Chip 
                        label={batch.batchNumber} 
                        size="small"
                        sx={{ 
                          fontFamily: 'monospace', 
                          fontWeight: 'bold',
                          backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.1),
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                          border: 'none',
                          fontSize: '0.7rem',
                          height: 20,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body1" fontWeight="500" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {batch.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {formatCurrency(batch.costPrice || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body1" fontWeight="500" sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                        {formatCurrency(batch.sellingPrice || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {batch.mfgDate ? new Date(batch.mfgDate).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body2" sx={{ 
                        color: isExpired ? '#ea4335' : (darkMode ? '#e8eaed' : '#202124'),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}>
                        {batch.expDate ? new Date(batch.expDate).toLocaleDateString() : 'N/A'}
                        {isExpired && (
                          <Chip 
                            label="Expired" 
                            size="small" 
                            sx={{ 
                              ml: 1,
                              backgroundColor: alpha('#ea4335', 0.1),
                              color: '#ea4335',
                              border: 'none',
                              fontSize: '0.6rem',
                              height: 16,
                              minWidth: 40,
                            }}
                          />
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {batch.receivedDate ? new Date(batch.receivedDate).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}