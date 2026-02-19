// components/googleanalytics/components/AnalyticsEmptyState.tsx
import React from 'react';
import {
  Box,
  Typography,
  useTheme
} from '@mui/material';
import {
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AnalyticsEmptyStateProps {
  darkMode: boolean;
}

export const AnalyticsEmptyState: React.FC<AnalyticsEmptyStateProps> = ({ darkMode }) => {
  return (
    <Card sx={{ 
      textAlign: 'center', 
      py: 8,
      px: 3,
      mt: 4,
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
    }}>
      <AnalyticsIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
      >
        No Analytics Data Available
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 3,
          maxWidth: 500,
          mx: 'auto',
          color: darkMode ? '#9aa0a6' : '#5f6368',
        }}
      >
        Start adding products, customers, and invoices to see your business analytics
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          onClick={() => window.location.href = '/products/add'}
          sx={{ 
            backgroundColor: '#34a853',
            '&:hover': { backgroundColor: '#2d9248' }
          }}
        >
          Add Products
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => window.location.href = '/customers'}
          sx={{
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            color: darkMode ? '#e8eaed' : '#202124',
          }}
        >
          Manage Customers
        </Button>
      </Box>
    </Card>
  );
};