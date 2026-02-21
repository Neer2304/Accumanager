// components/googleadminproductid/components/ProductHeader.tsx
import React from 'react';
import {
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Button,
  useTheme,
  Box
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  Edit
} from '@mui/icons-material';

interface ProductHeaderProps {
  onBack: () => void;
  onRefresh: () => void;
  onEdit: () => void;
  loading?: boolean;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  onBack,
  onRefresh,
  onEdit,
  loading = false
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      justifyContent="space-between" 
      alignItems={{ xs: 'flex-start', sm: 'center' }} 
      spacing={2} 
      sx={{ mb: 4 }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Tooltip title="Back to Products">
          <IconButton 
            onClick={onBack}
            sx={{ 
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              '&:hover': {
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
              }
            }}
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h4" fontWeight="bold" color={darkMode ? '#e8eaed' : '#202124'}>
            Product Details
          </Typography>
          <Typography variant="body2" color={darkMode ? '#9aa0a6' : '#5f6368'}>
            Manage and view detailed information about this product
          </Typography>
        </Box>
      </Stack>
      
      <Stack direction="row" spacing={2}>
        <Tooltip title="Refresh">
          <IconButton 
            onClick={onRefresh}
            disabled={loading}
            sx={{ 
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              '&:hover': {
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
              }
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
        
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={onEdit}
          disabled={loading}
          sx={{
            backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
            color: darkMode ? '#202124' : '#ffffff',
            borderRadius: '24px',
            px: 3,
            py: 1,
            '&:hover': {
              backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
            }
          }}
        >
          Edit Product
        </Button>
      </Stack>
    </Stack>
  );
};