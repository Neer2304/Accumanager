import React from 'react';
import { Chip, ChipProps, Typography, Box } from '@mui/material';

interface ProductStockBadgeProps extends Omit<ChipProps, 'label'> {
  stock: number;
  lowStockThreshold?: number;
  showText?: boolean;
}

const ProductStockBadge: React.FC<ProductStockBadgeProps> = ({
  stock,
  lowStockThreshold = 10,
  showText = false,
  size = 'small',
  ...props
}) => {
  const getStockConfig = () => {
    if (stock === 0) {
      return {
        color: 'error' as const,
        label: 'Out of Stock',
        variant: 'filled' as const,
      };
    } else if (stock <= lowStockThreshold) {
      return {
        color: 'warning' as const,
        label: `Low (${stock})`,
        variant: 'filled' as const,
      };
    } else {
      return {
        color: 'success' as const,
        label: `In Stock (${stock})`,
        variant: 'outlined' as const,
      };
    }
  };

  const config = getStockConfig();

  if (showText) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Stock:
        </Typography>
        <Chip
          label={config.label}
          color={config.color}
          variant={config.variant}
          size={size}
          {...props}
        />
      </Box>
    );
  }

  return (
    <Chip
      label={config.label}
      color={config.color}
      variant={config.variant}
      size={size}
      {...props}
    />
  );
};

export default ProductStockBadge;