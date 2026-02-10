// StockAlerts.tsx
import React from 'react';
import { Alert, Box, Typography, Button, alpha } from '@mui/material';
import { InventoryIcons } from '@/assets/icons/InventoryIcons';
import { INVENTORY_CONTENT } from '../InventoryContent';

interface StockAlertsProps {
  lowStock: number;
  outOfStock: number;
  productsCount: number;
  onViewLowStock: () => void;
  onViewOutOfStock: () => void;
}

export const StockAlerts = ({ 
  lowStock, 
  outOfStock, 
  productsCount,
  onViewLowStock,
  onViewOutOfStock 
}: StockAlertsProps) => {
  if (lowStock > 0) {
    return (
      <Alert 
        severity="warning" 
        sx={{ 
          mb: 2, 
          borderRadius: 2,
          backgroundColor: alpha('#fbbc04', 0.08),
          border: `1px solid ${alpha('#fbbc04', 0.3)}`,
          color: '#fbbc04',
        }}
        icon={<InventoryIcons.Warning sx={{ color: '#fbbc04' }} />}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {INVENTORY_CONTENT.alerts.lowStockTitle}
            </Typography>
            <Typography variant="body2">
              {lowStock} {INVENTORY_CONTENT.alerts.lowStockMessage}
            </Typography>
          </Box>
          <Button
            variant="text"
            size="small"
            onClick={onViewLowStock}
            sx={{ color: '#fbbc04' }}
          >
            {INVENTORY_CONTENT.buttons.viewDetails}
          </Button>
        </Box>
      </Alert>
    );
  }
  
  if (outOfStock > 0) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          borderRadius: 2,
          backgroundColor: alpha('#ea4335', 0.08),
          border: `1px solid ${alpha('#ea4335', 0.3)}`,
          color: '#ea4335',
        }}
        icon={<InventoryIcons.Error sx={{ color: '#ea4335' }} />}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {INVENTORY_CONTENT.alerts.outOfStockTitle}
            </Typography>
            <Typography variant="body2">
              {outOfStock} {INVENTORY_CONTENT.alerts.outOfStockMessage}
            </Typography>
          </Box>
          <Button
            variant="text"
            size="small"
            onClick={onViewOutOfStock}
            sx={{ color: '#ea4335' }}
          >
            {INVENTORY_CONTENT.buttons.viewDetails}
          </Button>
        </Box>
      </Alert>
    );
  }
  
  if (productsCount > 0) {
    return (
      <Alert 
        severity="success" 
        sx={{ 
          borderRadius: 2,
          backgroundColor: alpha('#34a853', 0.08),
          border: `1px solid ${alpha('#34a853', 0.3)}`,
          color: '#34a853',
        }}
        icon={<InventoryIcons.CheckCircle sx={{ color: '#34a853' }} />}
      >
        <Typography variant="subtitle2" fontWeight="bold">
          {INVENTORY_CONTENT.alerts.allOptimalTitle}
        </Typography>
        <Typography variant="body2">
          {INVENTORY_CONTENT.alerts.allOptimalMessage}
        </Typography>
      </Alert>
    );
  }
  
  return null;
};
