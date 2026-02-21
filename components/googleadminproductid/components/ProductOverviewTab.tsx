// components/googleadminproductid/components/ProductOverviewTab.tsx
import React from 'react';
import {
  Stack,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Inventory,
  LocalOffer,
  ShoppingCart
} from '@mui/icons-material';
import { Product } from './types';

interface ProductOverviewTabProps {
  product: Product;
  totalStock: number;
  formatCurrency: (amount: number) => string;
  getStockStatus: (stock: number) => { color: string; label: string };
}

export const ProductOverviewTab: React.FC<ProductOverviewTabProps> = ({
  product,
  totalStock,
  formatCurrency,
  getStockStatus
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const stockStatus = getStockStatus(totalStock);

  return (
    <Stack spacing={3}>
      {/* Stock Summary */}
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
          }}>
            <Inventory /> Inventory Summary
          </Typography>
          
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>Total Stock</Typography>
                <Typography variant="body1" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
                  {totalStock} units
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(totalStock * 2, 100)} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: stockStatus.color,
                    borderRadius: 4,
                  }
                }}
              />
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Avatar sx={{ 
                  backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                  margin: '0 auto 8px' 
                }}>
                  <LocalOffer />
                </Avatar>
                <Typography variant="h5" color={darkMode ? '#e8eaed' : '#202124'}>
                  {product.variations?.length || 0}
                </Typography>
                <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                  Variations
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Avatar sx={{ 
                  backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                  color: darkMode ? '#fbbc04' : '#fbbc04',
                  margin: '0 auto 8px' 
                }}>
                  <ShoppingCart />
                </Avatar>
                <Typography variant="h5" color={darkMode ? '#e8eaed' : '#202124'}>
                  {product.batches?.length || 0}
                </Typography>
                <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                  Batches
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Avatar sx={{ 
                  backgroundColor: product.isReturnable 
                    ? (darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)')
                    : (darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)'),
                  color: product.isReturnable 
                    ? (darkMode ? '#34a853' : '#34a853')
                    : (darkMode ? '#ea4335' : '#ea4335'),
                  margin: '0 auto 8px' 
                }}>
                  {product.isReturnable ? '✓' : '✗'}
                </Avatar>
                <Typography variant="h5" color={darkMode ? '#e8eaed' : '#202124'}>
                  {product.isReturnable ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                  Returnable
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Additional Info Card - You can add more overview sections here */}
      {(product.createdAt || product.updatedAt) && (
        <Card sx={{ 
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Timeline
            </Typography>
            <Stack spacing={1}>
              {product.createdAt && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>Created</Typography>
                  <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </Typography>
                </Stack>
              )}
              {product.updatedAt && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>Last Updated</Typography>
                  <Typography variant="body2" color={darkMode ? '#e8eaed' : '#202124'}>
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};