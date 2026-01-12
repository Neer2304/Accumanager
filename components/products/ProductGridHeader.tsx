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
}

const ProductGridHeader: React.FC<ProductGridHeaderProps> = ({
  title = 'Product Management',
  subtitle,
  onRefresh,
  onCreate,
  action,
  showCreateButton = true,
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        ...sx,
      }}
      {...props}
    >
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold">
          <Inventory sx={{ mr: 2, verticalAlign: 'middle' }} />
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {onRefresh && (
          <Button
            startIcon={<Refresh />}
            onClick={onRefresh}
            variant="outlined"
          >
            Refresh
          </Button>
        )}
        
        {showCreateButton && onCreate && (
          <Button
            startIcon={<Add />}
            onClick={onCreate}
            variant="contained"
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