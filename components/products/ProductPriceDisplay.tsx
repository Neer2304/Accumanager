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
  darkMode?: boolean;
}

const ProductPriceDisplay: React.FC<ProductPriceDisplayProps> = ({
  price,
  currency = '₹',
  size = 'medium',
  showIcon = false,
  showCurrency = true,
  discountPrice,
  darkMode = false,
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
              color: darkMode ? '#34a853' : '#34a853',
            }}
          >
            {showCurrency && currency}
            {discountPrice.toFixed(2)}
          </Typography>
          <Typography
            sx={{
              fontSize: getFontSize(),
              fontWeight: 'normal',
              color: darkMode ? '#9aa0a6' : '#5f6368',
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
            color: darkMode ? '#e8eaed' : '#202124',
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