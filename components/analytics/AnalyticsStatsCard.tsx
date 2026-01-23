// components/analytics/AnalyticsStatsCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import {
  RevenueIcon,
  SalesIcon,
  CustomersIcon,
  ProductsIcon
} from '@/assets/icons/AnalyticsIcons';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext: string;
  type: 'revenue' | 'sales' | 'customers' | 'products';
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtext, 
  type, 
  loading = false 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'revenue':
        return <RevenueIcon />;
      case 'sales':
        return <SalesIcon />;
      case 'customers':
        return <CustomersIcon />;
      case 'products':
        return <ProductsIcon />;
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'revenue':
        return '#1976d2';
      case 'sales':
        return '#9c27b0';
      case 'customers':
        return '#2e7d32';
      case 'products':
        return '#ed6c02';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <Card sx={{ 
        flex: 1, 
        minWidth: { xs: '100%', sm: '200px' },
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography color="text.secondary">Loading...</Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            mr: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {getIcon()}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          sx={{ color: getColor() }}
        >
          {typeof value === 'number' && title.includes('Revenue') 
            ? `₹${value.toLocaleString()}` 
            : value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {subtext}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatsCard;