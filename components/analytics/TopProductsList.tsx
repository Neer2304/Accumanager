// components/analytics/TopProductsList.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import { TrophyIcon } from '@/assets/icons/AnalyticsIcons';

interface TopProductsListProps {
  products: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  loading?: boolean;
  isMobile?: boolean;
}

const TopProductsList: React.FC<TopProductsListProps> = ({ 
  products, 
  loading = false,
  isMobile = false 
}) => {
  if (loading) {
    return (
      <Card sx={{ flex: 1 }}>
        <CardContent sx={{ p: isMobile ? 1 : 2 }}>
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            fontWeight="bold" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}
          >
            <TrophyIcon />
            Top Products
          </Typography>
          <Typography 
            color="text.secondary" 
            align="center" 
            sx={{ 
              py: isMobile ? 2 : 4,
              fontSize: isMobile ? '0.75rem' : '0.875rem'
            }}
          >
            Loading top products...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card sx={{ flex: 1 }}>
        <CardContent sx={{ p: isMobile ? 1 : 2 }}>
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            fontWeight="bold" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}
          >
            <TrophyIcon />
            Top Products
          </Typography>
          <Typography 
            color="text.secondary" 
            align="center" 
            sx={{ 
              py: isMobile ? 2 : 4,
              fontSize: isMobile ? '0.75rem' : '0.875rem'
            }}
          >
            No sales data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent sx={{ p: isMobile ? 1 : 2 }}>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          fontWeight="bold" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}
        >
          <TrophyIcon />
          Top Products
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1 : 2 }}>
          {products.map((product, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: isMobile ? 1 : 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: index === 0 ? alpha('#1976d2', 0.05) : 'transparent'
              }}
            >
              <Box sx={{ maxWidth: isMobile ? '60%' : '70%' }}>
                <Typography 
                  variant="body2" 
                  fontWeight="medium"
                  sx={{ 
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {product.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: isMobile ? '0.65rem' : '0.75rem' }}
                >
                  {product.sales} units sold
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                fontWeight="bold" 
                color="primary.main"
                sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
              >
                ₹{isMobile && product.revenue > 9999 ? `${(product.revenue/1000).toFixed(0)}k` : product.revenue.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopProductsList;