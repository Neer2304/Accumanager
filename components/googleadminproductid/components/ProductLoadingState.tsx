// components/googleadminproductid/components/ProductLoadingState.tsx
import React from 'react';
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  useTheme
} from '@mui/material';

export const ProductLoadingState: React.FC = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        flexDirection: 'column',
        gap: 3
      }}>
        <CircularProgress size={64} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
        <Typography variant="h6" color={darkMode ? '#e8eaed' : '#202124'}>
          Loading product details...
        </Typography>
      </Box>
    </Container>
  );
};