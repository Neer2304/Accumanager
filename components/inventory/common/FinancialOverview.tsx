import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { InventoryIcons } from '@/assets/icons/InventoryIcons';
import { INVENTORY_CONTENT } from '../InventoryContent';

interface FinancialOverviewProps {
  metrics: {
    totalStockValue: number;
    totalSellingValue: number;
    profitMargin: number;
    marginPercentage: number;
  };
  theme: any;
}

export const FinancialOverview = ({ metrics, theme }: FinancialOverviewProps) => {
  return (
    <Card sx={{ 
      mb: 4,
      borderRadius: 3,
      background: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.05)'
        : theme.palette.background.paper,
      boxShadow: theme.shadows[1],
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
          {INVENTORY_CONTENT.metrics.financialOverview}
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 3,
          mt: 2
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InventoryIcons.PriceChange color={theme.palette.primary.main} />
              <Typography variant="body2" color="text.secondary">
                {INVENTORY_CONTENT.metrics.inventoryValue}
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              ₹{metrics.totalStockValue.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {INVENTORY_CONTENT.metrics.basedOnCost}
            </Typography>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InventoryIcons.MonetizationOn color={theme.palette.success.main} />
              <Typography variant="body2" color="text.secondary">
                {INVENTORY_CONTENT.metrics.salesValue}
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              ₹{metrics.totalSellingValue.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {INVENTORY_CONTENT.metrics.basedOnSelling}
            </Typography>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InventoryIcons.BarChart color={theme.palette.warning.main} />
              <Typography variant="body2" color="text.secondary">
                {INVENTORY_CONTENT.metrics.profitMargin}
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {metrics.marginPercentage.toFixed(1)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ₹{metrics.profitMargin.toLocaleString()} {INVENTORY_CONTENT.metrics.potentialProfit}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};