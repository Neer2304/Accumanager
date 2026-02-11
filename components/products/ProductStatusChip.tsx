import React from 'react';
import { Chip, ChipProps } from '@mui/material';

type ProductStatus = 'active' | 'inactive' | 'draft' | 'out_of_stock' | 'low_stock' | string;

interface ProductStatusChipProps extends Omit<ChipProps, 'label' | 'color'> {
  status: ProductStatus;
  showIcon?: boolean;
  darkMode?: boolean;
}

const ProductStatusChip: React.FC<ProductStatusChipProps> = ({
  status,
  showIcon = false,
  size = 'small',
  darkMode = false,
  ...props
}) => {
  const getStatusConfig = () => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('active') || statusLower === 'active') {
      return { 
        label: 'Active', 
        color: 'success' as const, 
        icon: '🟢',
        bgColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
        textColor: darkMode ? '#81c995' : '#34a853'
      };
    } else if (statusLower.includes('inactive') || statusLower === 'inactive') {
      return { 
        label: 'Inactive', 
        color: 'error' as const, 
        icon: '🔴',
        bgColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
        textColor: darkMode ? '#f28b82' : '#ea4335'
      };
    } else if (statusLower.includes('draft') || statusLower === 'draft') {
      return { 
        label: 'Draft', 
        color: 'default' as const, 
        icon: '📝',
        bgColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
        textColor: darkMode ? '#9aa0a6' : '#5f6368'
      };
    } else if (statusLower.includes('out_of_stock') || statusLower.includes('out of stock')) {
      return { 
        label: 'Out of Stock', 
        color: 'error' as const, 
        icon: '📦',
        bgColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
        textColor: darkMode ? '#f28b82' : '#ea4335'
      };
    } else if (statusLower.includes('low_stock') || statusLower.includes('low stock')) {
      return { 
        label: 'Low Stock', 
        color: 'warning' as const, 
        icon: '⚠️',
        bgColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
        textColor: darkMode ? '#fdd663' : '#fbbc04'
      };
    } else {
      // For categories or other statuses
      return { 
        label: status.charAt(0).toUpperCase() + status.slice(1), 
        color: 'default' as const, 
        icon: '🏷️',
        bgColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
        textColor: darkMode ? '#aecbfa' : '#1a73e8'
      };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={
        <span style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4,
          color: config.textColor,
        }}>
          {showIcon && config.icon}
          {config.label}
        </span>
      }
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

export default ProductStatusChip;