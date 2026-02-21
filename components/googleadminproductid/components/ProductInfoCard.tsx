// components/googleadminproductid/components/ProductInfoCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Avatar,
  Typography,
  Divider,
  Badge,
  Box,
  useTheme
} from '@mui/material';
import { Product } from './types';

interface ProductInfoCardProps {
  product: Product;
  totalStock: number;
  formatCurrency: (amount: number) => string;
  getStockStatus: (stock: number) => { color: string; label: string };
}

export const ProductInfoCard: React.FC<ProductInfoCardProps> = ({
  product,
  totalStock,
  formatCurrency,
  getStockStatus
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const stockStatus = getStockStatus(totalStock);

  return (
    <Card sx={{ 
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
    }}>
      <CardContent>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
            color: darkMode ? '#8ab4f8' : '#1a73e8',
            fontSize: '2rem',
          }}>
            {product.name?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
              {product.name}
            </Typography>
            <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'} sx={{ mt: 0.5 }}>
              {product.description || 'No description available'}
            </Typography>
          </Box>
          <Badge 
            badgeContent={product.isActive ? 'Active' : 'Inactive'} 
            sx={{ 
              '& .MuiBadge-badge': { 
                fontSize: '0.7rem', 
                padding: '0 8px',
                backgroundColor: product.isActive ? '#34a853' : '#ea4335',
                color: '#ffffff',
                position: 'static',
                transform: 'none',
              } 
            }}
          />
        </Stack>

        <Divider sx={{ my: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="space-around" sx={{ flexWrap: 'wrap' }}>
          <Box sx={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
            <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>Base Price</Typography>
            <Typography variant="h4" color={darkMode ? '#8ab4f8' : '#1a73e8'} fontWeight="bold">
              {formatCurrency(product.basePrice || 0)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
            <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>Cost Price</Typography>
            <Typography variant="h5" color={darkMode ? '#e8eaed' : '#202124'}>
              {formatCurrency(product.baseCostPrice || 0)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
            <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>Stock Status</Typography>
            <Typography variant="h5" color={stockStatus.color}>
              {totalStock} units
            </Typography>
            <Typography variant="caption" color={stockStatus.color}>
              {stockStatus.label}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};