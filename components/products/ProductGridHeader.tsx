import React, { ReactNode } from 'react';
import { Box, Typography, Button, BoxProps } from '@mui/material';
import { Inventory, Add, Refresh } from '@mui/icons-material';

interface ProductGridHeaderProps extends BoxProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  onCreate?: () => void;
  action?: ReactNode;
  showCreateButton?: boolean;
  darkMode?: boolean;
}

const ProductGridHeader: React.FC<ProductGridHeaderProps> = ({
  title = 'Product Management',
  subtitle,
  onRefresh,
  onCreate,
  action,
  showCreateButton = true,
  darkMode = false,
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        ...sx,
      }}
      {...props}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          width: { xs: 48, sm: 56 },
          height: { xs: 48, sm: 56 },
          borderRadius: '16px',
          backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: darkMode ? '#8ab4f8' : '#1a73e8',
        }}>
          <Inventory sx={{ fontSize: { xs: 24, sm: 28 } }} />
        </Box>
        <Box>
          <Typography 
            variant="h5"
            sx={{ 
              fontWeight: 500,
              color: darkMode ? '#e8eaed' : '#202124',
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body1" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                mt: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {onRefresh && (
          <Button
            startIcon={<Refresh />}
            onClick={onRefresh}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: '8px',
              borderWidth: 2,
              borderColor: darkMode ? '#5f6368' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': { 
                borderWidth: 2,
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              },
            }}
          >
            Refresh
          </Button>
        )}
        
        {showCreateButton && onCreate && (
          <Button
            startIcon={<Add />}
            onClick={onCreate}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#1a73e8',
              '&:hover': {
                backgroundColor: '#1669c1',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(26, 115, 232, 0.2)',
              },
              borderRadius: '8px',
              fontWeight: 500,
            }}
          >
            Add Product
          </Button>
        )}
        
        {action}
      </Box>
    </Box>
  );
};

export default ProductGridHeader;