import React from 'react';
import { Typography, Box } from '@mui/material';
import { CurrencyRupee } from '@mui/icons-material';

interface ProductPriceDisplayProps {
  price: number;
  currency?: string;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  showCurrency?: boolean;
  discountPrice?: number;
}

const ProductPriceDisplay: React.FC<ProductPriceDisplayProps> = ({
  price,
  currency = '₹',
  size = 'medium',
  showIcon = false,
  showCurrency = true,
  discountPrice,
}) => {
  const getFontSize = () => {
    switch (size) {
      case 'small': return '0.875rem';
      case 'large': return '1.5rem';
      default: return '1rem';
    }
  };

  const getFontWeight = () => {
    return discountPrice ? 'normal' : 'bold';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {showIcon && <CurrencyRupee sx={{ fontSize: getFontSize() }} />}
      
      {discountPrice ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            sx={{
              fontSize: getFontSize(),
              fontWeight: getFontWeight(),
              color: 'error.main',
            }}
          >
            {showCurrency && currency}
            {discountPrice.toFixed(2)}
          </Typography>
          <Typography
            sx={{
              fontSize: getFontSize(),
              fontWeight: 'normal',
              color: 'text.secondary',
              textDecoration: 'line-through',
            }}
          >
            {showCurrency && currency}
            {price.toFixed(2)}
          </Typography>
        </Box>
      ) : (
        <Typography
          sx={{
            fontSize: getFontSize(),
            fontWeight: getFontWeight(),
          }}
        >
          {showCurrency && currency}
          {price.toFixed(2)}
        </Typography>
      )}
    </Box>
  );
};

export default ProductPriceDisplay;