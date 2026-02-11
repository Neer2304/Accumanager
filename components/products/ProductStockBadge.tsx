import React from 'react';
import { Chip, ChipProps, Typography, Box } from '@mui/material';

interface ProductStockBadgeProps extends Omit<ChipProps, 'label'> {
  stock: number;
  lowStockThreshold?: number;
  showText?: boolean;
  darkMode?: boolean;
}

const ProductStockBadge: React.FC<ProductStockBadgeProps> = ({
  stock,
  lowStockThreshold = 10,
  showText = false,
  size = 'small',
  darkMode = false,
  ...props
}) => {
  const getStockConfig = () => {
    if (stock === 0) {
      return {
        color: 'error' as const,
        label: 'Out of Stock',
        bgColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
        textColor: darkMode ? '#f28b82' : '#ea4335',
      };
    } else if (stock <= lowStockThreshold) {
      return {
        color: 'warning' as const,
        label: `Low (${stock})`,
        bgColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
        textColor: darkMode ? '#fdd663' : '#fbbc04',
      };
    } else {
      return {
        color: 'success' as const,
        label: `In Stock (${stock})`,
        bgColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
        textColor: darkMode ? '#81c995' : '#34a853',
      };
    }
  };

  const config = getStockConfig();

  if (showText) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
          Stock:
        </Typography>
        <Chip
          label={config.label}
          sx={{
            backgroundColor: config.bgColor,
            color: config.textColor,
            border: 'none',
            '& .MuiChip-label': {
              color: config.textColor,
            },
          }}
          size={size}
          {...props}
        />
      </Box>
    );
  }

  return (
    <Chip
      label={config.label}
      sx={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: 'none',
        '& .MuiChip-label': {
          color: config.textColor,
        },
      }}
      size={size}
      {...props}
    />
  );
};

export default ProductStockBadge;