import React from 'react';
import { Alert, Box, Typography, Button } from '@mui/material';
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
        }}
        icon={<InventoryIcons.Warning />}
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
        }}
        icon={<InventoryIcons.Error />}
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
        }}
        icon={<InventoryIcons.CheckCircle />}
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