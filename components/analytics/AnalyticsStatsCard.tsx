// components/analytics/AnalyticsStatsCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
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
  isMobile?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtext, 
  type, 
  loading = false,
  isMobile = false 
}) => {
  // Get the appropriate icon based on type
  const getIcon = () => {
    const iconProps = {
      width: isMobile ? 20 : 24,
      height: isMobile ? 20 : 24
    };
    
    switch (type) {
      case 'revenue':
        return <RevenueIcon/>;
      case 'sales':
        return <SalesIcon/>;
      case 'customers':
        return <CustomersIcon/>;
      case 'products':
        return <ProductsIcon/>;
      default:
        return null;
    }
  };

  // Get color based on type
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
        height: isMobile ? '90px' : '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: isMobile ? 1 : 2
      }}>
        <Typography 
          color="text.secondary"
          sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
        >
          Loading...
        </Typography>
      </Card>
    );
  }

  // Format value for display
  const formatValue = () => {
    if (typeof value === 'number') {
      if (title.includes('Revenue')) {
        // For revenue, show ₹ symbol and format number
        if (isMobile && value >= 1000000) {
          return `₹${(value / 1000000).toFixed(1)}M`;
        } else if (isMobile && value >= 1000) {
          return `₹${(value / 1000).toFixed(0)}K`;
        }
        return `₹${value.toLocaleString()}`;
      }
      // For other numbers, just format with commas
      return value.toLocaleString();
    }
    return value;
  };

  // Calculate responsive font sizes
  const getTitleFontSize = () => {
    if (isMobile) return '0.8rem';
    return '0.9rem'; // Slightly larger on desktop
  };

  const getValueFontSize = () => {
    if (isMobile) return '1.2rem';
    return '1.8rem'; // Much larger on desktop
  };

  const getSubtextFontSize = () => {
    if (isMobile) return '0.7rem';
    return '0.8rem';
  };

  return (
    <Card sx={{ 
      flex: 1, 
      minWidth: { xs: '100%', sm: '200px' },
      p: isMobile ? 1 : 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <CardContent sx={{ 
        p: isMobile ? '8px !important' : '16px !important',
        '&:last-child': { 
          pb: isMobile ? '8px !important' : '16px !important' 
        }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: isMobile ? 1 : 1.5
        }}>
          <Box sx={{ 
            mr: isMobile ? 0.75 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getColor()
          }}>
            {getIcon()}
          </Box>
          <Typography 
            variant="subtitle2"
            color="text.secondary"
            sx={{ 
              fontSize: getTitleFontSize(),
              fontWeight: 600,
              lineHeight: 1.2
            }}
          >
            {title}
          </Typography>
        </Box>
        
        <Typography 
          variant="h4"
          fontWeight="bold" 
          sx={{ 
            color: getColor(),
            fontSize: getValueFontSize(),
            lineHeight: 1.2,
            mb: isMobile ? 0.5 : 0.75,
            wordBreak: 'break-word'
          }}
        >
          {formatValue()}
        </Typography>
        
        <Typography 
          variant="caption"
          color="text.secondary"
          sx={{ 
            fontSize: getSubtextFontSize(),
            display: 'block',
            lineHeight: 1.3
          }}
        >
          {subtext}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatsCard;