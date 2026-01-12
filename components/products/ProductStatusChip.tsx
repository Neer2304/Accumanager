import React from 'react';
import { Chip, ChipProps } from '@mui/material';

type ProductStatus = 'active' | 'inactive' | 'draft' | 'out_of_stock' | 'low_stock';

interface ProductStatusChipProps extends Omit<ChipProps, 'label' | 'color'> {
  status: ProductStatus;
  showIcon?: boolean;
}

const ProductStatusChip: React.FC<ProductStatusChipProps> = ({
  status,
  showIcon = false,
  size = 'small',
  ...props
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return { label: 'Active', color: 'success' as const, icon: '🟢' };
      case 'inactive':
        return { label: 'Inactive', color: 'error' as const, icon: '🔴' };
      case 'draft':
        return { label: 'Draft', color: 'default' as const, icon: '📝' };
      case 'out_of_stock':
        return { label: 'Out of Stock', color: 'error' as const, icon: '📦' };
      case 'low_stock':
        return { label: 'Low Stock', color: 'warning' as const, icon: '⚠️' };
      default:
        return { label: 'Unknown', color: 'default' as const, icon: '❓' };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {showIcon && config.icon}
          {config.label}
        </span>
      }
      color={config.color}
      size={size}
      variant="outlined"
      {...props}
    />
  );
};

export default ProductStatusChip;