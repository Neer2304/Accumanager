// components/googleadminproductid/components/ProductNotFound.tsx
import React from 'react';
import {
  Container,
  Alert,
  Button,
  useTheme
} from '@mui/material';

interface ProductNotFoundProps {
  onBack: () => void;
}

export const ProductNotFound: React.FC<ProductNotFoundProps> = ({ onBack }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Container maxWidth="xl">
      <Alert 
        severity="warning" 
        sx={{ 
          mt: 3, 
          borderRadius: '16px',
          backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
          border: `1px solid ${darkMode ? '#fbbc04' : '#fbbc04'}`,
          color: darkMode ? '#fbbc04' : '#ed6c02',
        }}
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={onBack}
            sx={{ color: darkMode ? '#fbbc04' : '#ed6c02' }}
          >
            Back to Products
          </Button>
        }
      >
        Product not found
      </Alert>
    </Container>
  );
};