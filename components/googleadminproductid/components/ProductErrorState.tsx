// components/googleadminproductid/components/ProductErrorState.tsx
import React from 'react';
import {
  Container,
  Alert,
  Button,
  useTheme
} from '@mui/material';

interface ProductErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ProductErrorState: React.FC<ProductErrorStateProps> = ({ error, onRetry }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Container maxWidth="xl">
      <Alert 
        severity="error" 
        sx={{ 
          mt: 3, 
          borderRadius: '16px',
          backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
          border: `1px solid ${darkMode ? '#ea4335' : '#ea4335'}`,
          color: darkMode ? '#ea4335' : '#d32f2f',
        }}
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={onRetry}
            sx={{ color: darkMode ? '#ea4335' : '#d32f2f' }}
          >
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    </Container>
  );
};