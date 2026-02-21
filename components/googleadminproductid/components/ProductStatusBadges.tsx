// components/googleadminproductid/components/ProductStatusBadges.tsx
import React from 'react';
import {
  Stack,
  Chip,
  useTheme
} from '@mui/material';
import {
  Numbers,
  Store,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { Product } from './types';

interface ProductStatusBadgesProps {
  product: Product;
}

export const ProductStatusBadges: React.FC<ProductStatusBadgesProps> = ({ product }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
      <Chip 
        icon={<Numbers />}
        label={`ID: ${product._id}`}
        sx={{
          backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
          color: darkMode ? '#9aa0a6' : '#5f6368',
          fontFamily: 'monospace',
          border: 'none',
        }}
      />
      <Chip 
        icon={<Store />}
        label={`Category: ${product.category}`}
        sx={{
          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
          color: darkMode ? '#8ab4f8' : '#1a73e8',
          border: 'none',
        }}
      />
      {product.isActive ? (
        <Chip 
          icon={<CheckCircle />}
          label="Active"
          sx={{
            backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
            color: darkMode ? '#34a853' : '#34a853',
            border: 'none',
          }}
        />
      ) : (
        <Chip 
          icon={<Cancel />}
          label="Inactive"
          sx={{
            backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
            color: darkMode ? '#ea4335' : '#ea4335',
            border: 'none',
          }}
        />
      )}
      {product.isReturnable && (
        <Chip 
          label="Returnable"
          sx={{
            backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
            color: darkMode ? '#34a853' : '#34a853',
            border: 'none',
          }}
        />
      )}
    </Stack>
  );
};