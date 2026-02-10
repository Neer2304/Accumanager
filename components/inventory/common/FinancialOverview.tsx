// FinancialOverview.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
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
  const darkMode = theme.palette.mode === 'dark';
  
  return (
    <Card sx={{ 
      mb: 4,
      borderRadius: 3,
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
          color: darkMode ? '#e8eaed' : '#202124',
          fontSize: { xs: '1rem', sm: '1.25rem' },
        }}>
          {INVENTORY_CONTENT.metrics.financialOverview}
        </Typography>
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 2, sm: 3 },
          mt: 2,
          '& > *': {
            flex: '1 1 calc(100% - 8px)',
            minWidth: 0,
            '@media (min-width: 600px)': {
              flex: '1 1 calc(33.333% - 16px)'
            }
          }
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InventoryIcons.PriceChange color="#4285f4" />
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              }}>
                {INVENTORY_CONTENT.metrics.inventoryValue}
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" sx={{ 
              color: '#4285f4',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            }}>
              ₹{metrics.totalStockValue?.toLocaleString() || '0'}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368',
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              display: 'block',
              mt: 0.5,
            }}>
              {INVENTORY_CONTENT.metrics.basedOnCost}
            </Typography>
          </Box>
          
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InventoryIcons.MonetizationOn color="#34a853" />
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              }}>
                {INVENTORY_CONTENT.metrics.salesValue}
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" sx={{ 
              color: '#34a853',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            }}>
              ₹{metrics.totalSellingValue?.toLocaleString() || '0'}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368',
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              display: 'block',
              mt: 0.5,
            }}>
              {INVENTORY_CONTENT.metrics.basedOnSelling}
            </Typography>
          </Box>
          
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InventoryIcons.BarChart color="#fbbc04" />
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              }}>
                {INVENTORY_CONTENT.metrics.profitMargin}
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" sx={{ 
              color: '#fbbc04',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            }}>
              {metrics.marginPercentage?.toFixed(1) || '0.0'}%
            </Typography>
            <Typography variant="caption" sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368',
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              display: 'block',
              mt: 0.5,
            }}>
              ₹{metrics.profitMargin?.toLocaleString() || '0'} {INVENTORY_CONTENT.metrics.potentialProfit}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
