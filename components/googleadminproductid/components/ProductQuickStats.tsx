// components/googleadminproductid/components/ProductQuickStats.tsx
import React from 'react';
import {
  Stack,
  Card,
  CardContent,
  Avatar,
  Typography,
  useTheme,
  Box
} from '@mui/material';
import {
  Category,
  Business,
  Label,
  LocalOffer,
  ShoppingCart,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { Product } from './types';

interface ProductQuickStatsProps {
  product: Product;
}

export const ProductQuickStats: React.FC<ProductQuickStatsProps> = ({ product }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const stats = [
    {
      icon: <Category />,
      label: 'Category',
      value: product.category,
      subValue: product.subCategory,
      color: darkMode ? '#8ab4f8' : '#1a73e8',
    },
    {
      icon: <Business />,
      label: 'Brand',
      value: product.brand || 'No Brand',
      color: darkMode ? '#8ab4f8' : '#1a73e8',
    },
    {
      icon: <Label />,
      label: 'SKU',
      value: product.sku || 'N/A',
      color: darkMode ? '#8ab4f8' : '#1a73e8',
      monospace: true,
    },
    {
      icon: <LocalOffer />,
      label: 'Variations',
      value: product.variations?.length || 0,
      color: '#fbbc04',
    },
    {
      icon: <ShoppingCart />,
      label: 'Batches',
      value: product.batches?.length || 0,
      color: '#34a853',
    },
    {
      icon: product.isReturnable ? <CheckCircle /> : <Cancel />,
      label: 'Returnable',
      value: product.isReturnable ? 'Yes' : 'No',
      color: product.isReturnable ? '#34a853' : '#ea4335',
    },
  ];

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
      {stats.map((stat, index) => (
        <Card key={index} sx={{ 
          flex: 1, 
          minWidth: 200,
          borderRadius: '16px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ 
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                color: stat.color,
              }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>{stat.label}</Typography>
                <Typography 
                  variant="body1" 
                  fontWeight="medium" 
                  color={darkMode ? '#e8eaed' : '#202124'}
                  sx={stat.monospace ? { fontFamily: 'monospace' } : {}}
                >
                  {stat.value}
                </Typography>
                {stat.subValue && (
                  <Typography variant="caption" color={darkMode ? '#9aa0a6' : '#5f6368'}>
                    {stat.subValue}
                  </Typography>
                )}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};