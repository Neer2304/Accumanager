// components/googleadminproductid/components/ProductVariationsTab.tsx
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
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  LocalOffer
} from '@mui/icons-material';
import { Product, Variation } from './types';

interface ProductVariationsTabProps {
  product: Product;
  formatCurrency: (amount: number) => string;
  getStockStatus: (stock: number) => { color: string; label: string };
}

export const ProductVariationsTab: React.FC<ProductVariationsTabProps> = ({
  product,
  formatCurrency,
  getStockStatus
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  if (!product.variations || product.variations.length === 0) {
    return (
      <Card sx={{ 
        borderRadius: '16px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <LocalOffer sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
          <Typography variant="h6" color={darkMode ? '#e8eaed' : '#202124'} gutterBottom>
            No Variations
          </Typography>
          <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
            This product doesn't have any variations configured
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
            <LocalOffer /> Product Variations
          </Typography>
          <Chip 
            label={`${product.variations.length} variations`} 
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
                  Variation
                </TableCell>
                <TableCell sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  SKU
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Price
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Cost
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Stock
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontWeight: 500,
                  borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {product.variations.map((variation: Variation, index: number) => (
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
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                        fontSize: '0.875rem',
                      }}>
                        {variation.name?.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
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
                        backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        border: 'none',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Typography variant="body1" fontWeight="medium" color={darkMode ? '#e8eaed' : '#202124'}>
                      {formatCurrency(variation.price || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                      {formatCurrency(variation.costPrice || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Chip 
                      label={variation.stock || 0} 
                      size="small"
                      sx={{ 
                        backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                        color: darkMode ? '#8ab4f8' : '#1a73e8',
                        border: 'none',
                        minWidth: 60,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
                    <Chip 
                      label={getStockStatus(variation.stock || 0).label}
                      size="small"
                      sx={{ 
                        backgroundColor: `${getStockStatus(variation.stock || 0).color}20`,
                        color: getStockStatus(variation.stock || 0).color,
                        border: 'none',
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};