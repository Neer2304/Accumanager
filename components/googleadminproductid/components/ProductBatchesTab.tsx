// components/googleadminproductid/components/ProductBatchesTab.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  Inventory
} from '@mui/icons-material';
import { Product, Batch } from './types';

interface ProductBatchesTabProps {
  product: Product;
  formatCurrency: (amount: number) => string;
}

export const ProductBatchesTab: React.FC<ProductBatchesTabProps> = ({
  product,
  formatCurrency
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  if (!product.batches || product.batches.length === 0) {
    return (
      <Card sx={{ 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Inventory sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
          <Typography variant="h6" color={darkMode ? '#e8eaed' : '#202124'} gutterBottom>
            No Batches
          </Typography>
          <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
            This product doesn't have any batches configured
          </Typography>
        </CardContent>
      </Card>
    );
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
            mb: { xs: 1, sm: 0 }
          }}>
            <Inventory /> Product Batches
          </Typography>
          <Chip 
            label={`${product.batches.length} batches`} 
            sx={{
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              border: 'none',
            }}
          />
        </Stack>
        
        <TableContainer component={Paper} sx={{ 
          borderRadius: '12px',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: darkMode ? '#202124' : '#f8f9fa' }}>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Batch No.
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Quantity
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Cost Price
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Selling Price
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  MFG Date
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  EXP Date
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Received
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {product.batches.map((batch: Batch, index: number) => {
                const isExpired = batch.expDate && new Date(batch.expDate) < new Date();
                
                return (
                  <TableRow 
                    key={index}
                    hover
                    sx={{ 
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      '&:hover': {
                        backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
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
                          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body1" fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>
                        {batch.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body1" color={darkMode ? '#e8eaed' : '#202124'}>
                        {formatCurrency(batch.costPrice || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body1" fontWeight="medium" color={darkMode ? '#8ab4f8' : '#1a73e8'}>
                        {formatCurrency(batch.sellingPrice || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                        {batch.mfgDate ? new Date(batch.mfgDate).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="body2" color={isExpired ? '#ea4335' : (darkMode ? '#e8eaed' : '#202124')}>
                        {batch.expDate ? new Date(batch.expDate).toLocaleDateString() : 'N/A'}
                        {isExpired && (
                          <Chip 
                            label="Expired" 
                            size="small" 
                            sx={{ 
                              ml: 1,
                              backgroundColor: 'rgba(234, 67, 53, 0.1)',
                              color: '#ea4335',
                              border: 'none',
                              fontSize: '0.65rem',
                              height: 20,
                            }}
                          />
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                      <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
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
  );
};