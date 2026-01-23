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
}

const TopProductsList: React.FC<TopProductsListProps> = ({ products, loading = false }) => {
  if (loading) {
    return (
      <Card sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrophyIcon />
            Top Products
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            Loading top products...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrophyIcon />
            Top Products
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No sales data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrophyIcon />
          Top Products
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {products.map((product, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: index === 0 ? alpha('#1976d2', 0.05) : 'transparent'
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {product.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {product.sales} units sold
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight="bold" color="primary.main">
                ₹{product.revenue.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopProductsList;