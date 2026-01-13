import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add, FilterList } from '@mui/icons-material';

interface CustomerHeaderProps {
  title: string;
  subscriptionPlan?: string;
  totalCustomers: number;
  activeCustomers: number;
  onAddClick: () => void;
  onFilterClick?: () => void;
  canAddCustomer: boolean;
  isSubscriptionActive: boolean;
  isMobile: boolean;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  title,
  subscriptionPlan,
  totalCustomers,
  activeCustomers,
  onAddClick,
  onFilterClick,
  canAddCustomer,
  isSubscriptionActive,
  isMobile,
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: { xs: 'flex-start', sm: 'center' }, 
      mb: 3,
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 2, sm: 3 },
    }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 1,
          flexWrap: 'wrap'
        }}>
          <Typography variant={isMobile ? "h5" : "h4"} component="h1" fontWeight="bold">
            {title}
          </Typography>
          {subscriptionPlan && (
            <Chip 
              label={`${subscriptionPlan.toUpperCase()}`} 
              color="primary"
              size="small"
              sx={{ 
                height: 24,
                fontSize: '0.7rem'
              }}
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Manage your customer database and contacts
        </Typography>
        
        {/* Mobile Quick Stats */}
        {isMobile && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1.5,
            mt: 1,
            flexWrap: 'wrap'
          }}>
            <Chip 
              icon={<FilterList fontSize="small" />}
              label={`${totalCustomers} Total`}
              size="small"
              variant="outlined"
            />
            <Chip 
              icon={<Add fontSize="small" />}
              label={`${activeCustomers} Active`}
              size="small"
              variant="outlined"
              color="success"
            />
          </Box>
        )}
      </Box>
      
      {/* Action Buttons */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        width: { xs: '100%', sm: 'auto' }
      }}>
        {isMobile && onFilterClick && (
          <IconButton
            onClick={onFilterClick}
            size="small"
            sx={{ 
              border: 1,
              borderColor: 'divider'
            }}
          >
            <FilterList />
          </IconButton>
        )}
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddClick}
          size={isMobile ? "medium" : "large"}
          disabled={!canAddCustomer || !isSubscriptionActive}
          fullWidth={isMobile}
          sx={{ 
            minHeight: isMobile ? 44 : 48,
            whiteSpace: 'nowrap',
            flex: { xs: 1, sm: 'none' }
          }}
        >
          {isMobile ? 'Add' : 'Add Customer'}
        </Button>
      </Box>
    </Box>
  );
};